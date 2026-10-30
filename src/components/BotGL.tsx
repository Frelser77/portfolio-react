import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../prefs";

/** Quello che la guida racconta al bassotto: dove guardare, se cammina, se saluta, se fa la piroetta. */
export interface Pose {
	lx: number; // sguardo orizzontale -1..1
	ly: number; // sguardo verticale -1..1
	walking: boolean;
	dir: number; // direzione di marcia: 1 destra, -1 sinistra
	face: number; // lato verso cui guarda da fermo: 1 destra, -1 sinistra
	waving: boolean;
	spinAt: number; // istante (ms) dell'ultima piroetta
	hopAt: number; // istante (ms) dell'ultimo saltello
	mood?: "neutral" | "happy" | "curious" | "angry" | "sleepy";
}

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

/**
 * Il bassotto digitale è disegnato interamente da uno shader: ogni forma è una funzione di distanza (SDF) con raccordi morbidi,
 * illuminata con riflessi, bordo luminoso, occlusione ambientale e ombre. Niente modelli, niente librerie.
 */
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform vec2 uHead;   // yaw, pitch della testa
uniform float uBody;  // yaw del corpo
uniform float uBob;   // respiro / salto
uniform float uWalk;  // 0..1
uniform float uPhase; // fase del passo
uniform float uWave;  // 0..1 zampa alzata + coda veloce
uniform float uBlink; // 0..1
uniform vec4 uMood;   // felice, curioso, arrabbiato, assonnato (0..1)

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float sdRB(vec3 p, vec3 b, float r){ vec3 q=abs(p)-b; return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0)-r; }
float sdCap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0); return length(pa-ba*h)-r; }
// capsula che si assottiglia da r1 a r2
float sdCone(vec3 p, vec3 a, vec3 b, float r1, float r2){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0); return length(pa-ba*h)-mix(r1,r2,h); }
float sdEll(vec3 p, vec3 r){ float k0=length(p/r); float k1=length(p/(r*r)); return k0*(k0-1.0)/k1; }
float sdTorusXY(vec3 p, vec2 t){ vec2 q=vec2(length(p.xy)-t.x,p.z); return length(q)-t.y; }
float smin(float a,float b,float k){ float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0); return mix(b,a,h)-k*h*(1.0-h); }
vec2 un(vec2 a, vec2 b){ return a.x<b.x ? a : b; }

float hash(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vnoise(vec3 x){
  vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}

// zampa anteriore: dritta, con grande piede
vec2 fleg(vec3 q, vec3 hip, float sw){
  vec3 a=q-hip;
  a.yz=rot(sw)*a.yz;
  float d=sdCone(a,vec3(0.0),vec3(0.0,-0.24,0.0),0.068,0.047);
  float f=sdEll(a-vec3(0.0,-0.285,0.04),vec3(0.052,0.036,0.09));
  return un(vec2(d,0.0),vec2(f,7.0));
}
// zampa posteriore: coscia piena e stinco sottile
vec2 hleg(vec3 q, vec3 hip, float sw){
  vec3 a=q-hip;
  a.yz=rot(sw)*a.yz;
  float th=sdEll(a-vec3(0.0,-0.06,0.0),vec3(0.088,0.15,0.13));
  float lo=sdCone(a,vec3(0.0,-0.12,-0.01),vec3(0.0,-0.24,0.0),0.054,0.043);
  float f=sdEll(a-vec3(0.0,-0.285,0.04),vec3(0.052,0.036,0.09));
  return un(vec2(smin(th,lo,0.08),0.0),vec2(f,7.0));
}

vec2 map(vec3 p){
  vec3 q=p; q.y-=uBob-0.16; q.xz=rot(uBody)*q.xz;
  float wob=sin(uPhase*2.0)*0.015*uWalk;
  vec3 b=q; b.y-=wob;
  // corpo: petto profondo, vita sottile e rialzata, anca tonda
  float chest=sdEll(b-vec3(0.0,0.0,0.37),vec3(0.2,0.235,0.27));
  float waist=sdCone(b,vec3(0.0,0.035,0.28),vec3(0.0,0.03,-0.36),0.16,0.17);
  float rump=sdEll(b-vec3(0.0,0.01,-0.52),vec3(0.19,0.2,0.23));
  vec2 r=vec2(smin(smin(chest,waist,0.14),rump,0.12),1.0);
  // zampe: andatura in diagonale; l'anteriore destra può salutare
  float s1=uWalk*sin(uPhase)*0.8;
  float s2=uWalk*sin(uPhase+3.14159)*0.8;
  r=un(r,fleg(b,vec3(-0.105,-0.11,0.38),s2));
  r=un(r,fleg(b,vec3(0.105,-0.11,0.38),mix(s1,-1.15+sin(uT*9.0)*0.3,uWave)));
  r=un(r,hleg(b,vec3(-0.12,-0.1,-0.52),s1));
  r=un(r,hleg(b,vec3(0.12,-0.1,-0.52),s2));
  // collo
  r.x=smin(r.x,sdCone(b,vec3(0.0,0.06,0.4),vec3(0.0,0.2,0.6),0.14,0.1),0.1);
  // collare luminoso con medaglietta
  r=un(r,vec2(length(b-vec3(0.0,0.005,0.535))-0.026,6.0));
  // testa
  vec3 hp=b-vec3(0.0,0.17,0.56);
  hp.xz=rot(uHead.x)*hp.xz;
  hp.yz=rot(uHead.y)*hp.yz;
  vec3 h=hp-vec3(0.0,0.07,0.09);
  float skull=sdEll(h,vec3(0.145,0.15,0.17));
  float snout=sdCone(h,vec3(0.0,-0.035,0.1),vec3(0.0,-0.06,0.37),0.082,0.052);
  float jaw=sdCone(h,vec3(0.0,-0.085,0.1),vec3(0.0,-0.095,0.31),0.05,0.04);
  vec2 head=vec2(smin(smin(skull,snout,0.1),jaw,0.04),0.0);
  head=un(head,vec2(smin(sdCone(h,vec3(0.0,-0.05,0.2),vec3(0.0,-0.06,0.37),0.075,0.052),sdEll(h-vec3(0.0,-0.088,0.25),vec3(0.05,0.03,0.12)),0.03),8.0));
  head=un(head,vec2(sdEll(h-vec3(0.0,-0.042,0.425),vec3(0.05,0.04,0.034)),2.0)); // tartufo
  // occhi scuri e lucidi, con palpebra
  float sy=mix(1.0,0.1,uBlink);
  sy=min(sy,mix(1.0,0.38,uMood.x));
  sy=min(sy,mix(1.0,0.62,uMood.z));
  sy=min(sy,mix(1.0,0.07,uMood.w));
  sy=max(sy,0.0);
  vec3 e1=h-vec3(-0.07,0.045,0.12); e1.y/=sy;
  vec3 e2=h-vec3(0.07,0.045,0.12); e2.y/=sy;
  head=un(head,vec2(length(e1)-0.03,3.0));
  head=un(head,vec2(length(e2)-0.03,3.0));
  // arcata sopracciliare
  vec3 bw=vec3(abs(h.x)-0.07,h.y-0.085,h.z-0.12);
  bw.y+=uMood.z*(-0.8*bw.x+0.03)-uMood.y*0.02;
  head.x=smin(head.x,sdEll(bw,vec3(0.04,0.018+0.012*uMood.z,0.04)),0.03);
  // orecchie lunghe, lisce, che cadono lungo la testa
  float flap=sin(uPhase*2.0)*0.2*uWalk+sin(uT*1.7)*0.03+uWave*0.12-uMood.y*0.4+uMood.z*0.32+uMood.w*0.1;
  vec3 e=vec3(abs(h.x),h.y,h.z)-vec3(0.135,0.07,-0.01);
  e.xy=rot(-0.12-flap)*e.xy;
  e.yz=rot(0.12)*e.yz;
  float ear=sdEll(e-vec3(0.02,-0.11,0.0),vec3(0.022,0.125,0.075));
  head.x=smin(head.x,ear,0.03);
  r=un(r,head);
  // coda sottile che scodinzola
  float wag=sin(uT*(5.0+uWalk*5.0+uWave*8.0+uMood.x*9.0))*(0.06+0.12*uWave+0.04*uWalk+0.14*uMood.x+0.05*uMood.y)*(1.0-0.85*uMood.z-0.7*uMood.w);
  vec3 t=b-vec3(0.0,0.03,-0.7);
  vec3 m1=vec3(wag*0.5,0.04,-0.2);
  vec3 m2=vec3(wag,0.13,-0.42);
  r=un(r,vec2(smin(sdCone(t,vec3(0.0),m1,0.05,0.034),sdCone(t,m1,m2,0.034,0.016),0.04),0.0));
  return r;
}

vec3 nrm(vec3 p){
  vec2 e=vec2(1.0,-1.0)*0.0016;
  return normalize(e.xyy*map(p+e.xyy).x+e.yyx*map(p+e.yyx).x+e.yxy*map(p+e.yxy).x+e.xxx*map(p+e.xxx).x);
}
vec3 env(vec3 r){
  float y=r.y*0.5+0.5;
  vec3 sky=mix(vec3(0.16,0.12,0.30),vec3(0.60,0.62,0.95),y);
  float key=pow(max(dot(r,normalize(vec3(-0.4,0.7,0.6))),0.0),18.0);
  float rim=pow(max(dot(r,normalize(vec3(0.75,0.25,-0.5))),0.0),8.0);
  return sky+vec3(1.0,0.95,0.88)*key*1.6+vec3(0.5,0.6,1.0)*rim*1.2;
}
float ao(vec3 p, vec3 n){
  float o=0.0, s=1.0;
  for(int i=1;i<=4;i++){ float h=0.04*float(i); o+=(h-map(p+n*h).x)*s; s*=0.7; }
  return clamp(1.0-2.2*o,0.0,1.0);
}
float shadow(vec3 p, vec3 l){
  float res=1.0, t=0.04;
  for(int i=0;i<16;i++){ float h=map(p+l*t).x; res=min(res,8.0*h/t); t+=clamp(h,0.03,0.2); if(res<0.02||t>2.0) break; }
  return clamp(res,0.0,1.0);
}

void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uRes)/uRes.y*2.0;
  vec3 ro=vec3(0.0,0.5,5.0);
  vec3 rd=normalize(vec3(uv*0.16,-1.0));
  rd.yz=rot(0.1)*rd.yz;
  float b=dot(ro,rd), c=dot(ro,ro)-1.5*1.5, disc=b*b-c;
  if(disc<0.0){ gl_FragColor=vec4(0.0); return; }
  float t=-b-sqrt(disc), tmax=-b+sqrt(disc);
  float md=1e9, tm=t; bool hit=false;
  for(int i=0;i<64;i++){
    vec3 p=ro+rd*t; float h=map(p).x;
    float ang=h/t; if(ang<md){ md=ang; tm=t; }
    if(h<0.0006*t){ hit=true; tm=t; break; }
    t+=h*0.9;
    if(t>tmax) break;
  }
  float pa=0.32/uRes.y;
  float alpha=hit?1.0:clamp(1.0-md/(pa*1.3),0.0,1.0);
  if(alpha<0.01){ gl_FragColor=vec4(0.0); return; }
  vec3 p=ro+rd*tm;
  vec2 m=map(p);
  vec3 n=nrm(p);
  vec3 v=-rd;
  vec3 key=normalize(vec3(-0.45,0.8,0.7));
  float ndl=dot(n,key);
  float dif=max(ndl*0.75+0.25,0.0);       // luce morbida avvolgente, come il pelo
  float sh=shadow(p+n*0.01,key);
  float occ=ao(p,n);
  float fr=pow(1.0-max(dot(n,v),0.0),3.0);
  vec3 refl=reflect(rd,n);
  vec3 q=p; q.y-=uBob-0.16; q.xz=rot(uBody)*q.xz;
  vec3 col;
  float id=m.y;
  float fur=0.88+0.24*vnoise(q*vec3(46.0,46.0,16.0));
  float fur2=0.9+0.2*vnoise(q*vec3(110.0,110.0,38.0));
  if(id<1.5){ // mantello rosso fulvo, più scuro sul dorso, sfumato sul petto
    vec3 red=vec3(0.34,0.095,0.03);
    vec3 dark=vec3(0.18,0.05,0.02);
    vec3 tan=vec3(0.55,0.27,0.11);
    vec3 alb=mix(red,dark,smoothstep(0.0,0.9,n.y)*0.8);
    float chestTan=smoothstep(0.05,-0.12,q.y)*smoothstep(0.0,0.26,q.z)*smoothstep(0.17,0.04,abs(q.x));
    alb=mix(alb,tan,clamp(chestTan,0.0,1.0)*0.85);
    alb*=fur*fur2;
    col=alb*(env(n)*0.42*occ+dif*sh*vec3(1.0,0.93,0.85)*1.0);
    col+=vec3(0.9,0.6,0.45)*pow(max(dot(refl,key),0.0),14.0)*sh*0.12*fur; // riflesso largo e morbido
    col+=vec3(0.5,0.6,1.0)*fr*0.22*occ;
  } else if(id<2.5){ // tartufo nero lucido
    col=vec3(0.015,0.015,0.02)+env(refl)*(0.04+0.22*fr)*occ;
    col+=pow(max(dot(refl,key),0.0),70.0)*1.4*sh;
  } else if(id<3.5){ // occhi scuri con un punto di luce
    col=vec3(0.05,0.025,0.015)+env(refl)*(0.25+0.4*fr);
    col+=pow(max(dot(refl,key),0.0),120.0)*3.0;
  } else if(id<4.5){
    col=vec3(0.3,0.1,0.04);
  } else if(id<5.5){ // collare: striscia di luce
    col=mix(vec3(0.3,0.85,1.1),vec3(0.75,0.5,1.2),0.5+0.5*sin(uT*2.0+q.z*5.0))*1.35;
  } else if(id<6.5){ // medaglietta
    col=mix(vec3(0.5,1.0,0.8),vec3(1.1,0.9,0.5),0.5+0.5*sin(uT*3.0))*1.5;
  } else if(id<7.5){ // zampe e piedi: pelo più chiaro
    vec3 alb=vec3(0.46,0.22,0.1)*fur*fur2;
    col=alb*(env(n)*0.4*occ+dif*sh*0.95)+vec3(0.5,0.6,1.0)*fr*0.18*occ;
  } else { // muso
    vec3 alb=vec3(0.42,0.19,0.08)*(0.9+0.2*vnoise(q*80.0));
    col=alb*(env(n)*0.4*occ+dif*sh*0.95)+vec3(0.9,0.6,0.45)*pow(max(dot(refl,key),0.0),20.0)*sh*0.1+vec3(0.5,0.6,1.0)*fr*0.2*occ;
  }
  col=1.0-exp(-col*1.35);
  col=pow(col,vec3(0.4545));
  gl_FragColor=vec4(col*alpha,alpha);
}
`;

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

/** Disegna il robot. Se WebGL non c'è, chiama `onFail` e il chiamante mostra la versione di riserva. */
export default function BotGL({ pose, onFail }: { pose: React.MutableRefObject<Pose>; onFail: () => void }) {
	const canvas = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const cv = canvas.current;
		if (!cv) return;
		const gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" });
		if (!gl) {
			onFail();
			return;
		}
		const compile = (type: number, src: string) => {
			const s = gl.createShader(type)!;
			gl.shaderSource(s, src);
			gl.compileShader(s);
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
				console.warn(gl.getShaderInfoLog(s));
				return null;
			}
			return s;
		};
		const vs = compile(gl.VERTEX_SHADER, VERT);
		const fs = compile(gl.FRAGMENT_SHADER, FRAG);
		if (!vs || !fs) {
			onFail();
			return;
		}
		const prog = gl.createProgram()!;
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.linkProgram(prog);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
			onFail();
			return;
		}
		gl.useProgram(prog);
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const loc = gl.getAttribLocation(prog, "a");
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
		const u = (n: string) => gl.getUniformLocation(prog, n);
		const U = { res: u("uRes"), t: u("uT"), head: u("uHead"), body: u("uBody"), bob: u("uBob"), walk: u("uWalk"), phase: u("uPhase"), wave: u("uWave"), blink: u("uBlink"), mood: u("uMood") };

		const calm = prefersReducedMotion();
		const small = window.innerWidth < 720;
		const s = { hx: 0, hy: 0, body: -0.85, walk: 0, wave: 0, phase: 0, nextBlink: 2, blinkT: -1, m: [0, 0, 0, 0], ty: 0 };

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
			const w = Math.max(2, Math.round(cv.clientWidth * dpr));
			const h = Math.max(2, Math.round(cv.clientHeight * dpr));
			if (cv.width !== w || cv.height !== h) {
				cv.width = w;
				cv.height = h;
			}
			gl.viewport(0, 0, w, h);
		};
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(cv);

		let raf = 0;
		let last = performance.now();
		let acc = 0;
		const frame = (now: number) => {
			raf = requestAnimationFrame(frame);
			if (document.hidden) {
				last = now;
				return;
			}
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			// su telefono e con "meno movimento" si disegna meno spesso
			acc += dt;
			const step = calm ? 0.25 : small ? 1 / 30 : 0;
			if (acc < step) return;
			const d = Math.max(acc, 1 / 120);
			acc = 0;

			const P = pose.current;
			const k = 1 - Math.exp(-d * 9);
			s.hy += (-clamp(P.lx, -1, 1) * 0.8 - s.hy) * k;
			s.hx += (-clamp(P.ly, -1, 1) * 0.4 + s.m[1] * -0.12 + s.m[3] * 0.32 - s.m[0] * 0.1 - s.hx) * k;
			const spin = (now - P.spinAt) / 900;
			const spinAdd = spin >= 0 && spin < 1 ? (1 - Math.pow(1 - spin, 3)) * Math.PI * 2 : 0;
			const bodyT = (P.walking ? -P.dir * 1.4 : -P.face * 0.85 - P.lx * 0.15) + spinAdd;
			s.body += (bodyT - s.body) * (spinAdd ? 1 : 1 - Math.exp(-d * 7));
			s.walk += ((P.walking ? 1 : 0) - s.walk) * (1 - Math.exp(-d * 8));
			s.wave += ((P.waving ? 1 : 0) - s.wave) * (1 - Math.exp(-d * 10));
			s.phase += d * 11 * s.walk;
			const tt = now / 1000;
			s.nextBlink -= d;
			if (s.nextBlink <= 0) {
				s.blinkT = 0;
				s.nextBlink = 2.2 + Math.random() * 3;
			}
			let blink = 0;
			if (s.blinkT >= 0) {
				s.blinkT += d;
				blink = Math.sin(clamp(s.blinkT / 0.18, 0, 1) * Math.PI);
				if (s.blinkT > 0.18) s.blinkT = -1;
			}
			const hp = (now - P.hopAt) / 520;
			const hop = (spin >= 0 && spin < 0.6 ? Math.sin((spin / 0.6) * Math.PI) * 0.22 : 0) + (hp >= 0 && hp < 1 ? Math.sin(hp * Math.PI) * 0.12 : 0);
			const bob = (calm ? 0 : Math.sin(tt * (2.1 - s.m[3] * 1.3)) * (0.012 + s.m[0] * 0.012) - s.m[3] * 0.025) + Math.abs(Math.sin(s.phase)) * 0.035 * s.walk + hop;

			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.uniform2f(U.res, cv.width, cv.height);
			gl.uniform1f(U.t, calm ? 0 : tt);
			gl.uniform2f(U.head, s.hy, s.hx);
			gl.uniform1f(U.body, s.body);
			gl.uniform1f(U.bob, bob);
			gl.uniform1f(U.walk, s.walk);
			gl.uniform1f(U.phase, s.phase);
			gl.uniform1f(U.wave, s.wave);
			const want = P.mood ?? "neutral";
			const mk = 1 - Math.exp(-d * (want === "angry" ? 10 : 5));
			(["happy", "curious", "angry", "sleepy"] as const).forEach((n, i) => (s.m[i] += ((want === n ? 1 : 0) - s.m[i]) * mk));
			gl.uniform4f(U.mood, s.m[0], s.m[1], s.m[2], s.m[3]);
			gl.uniform1f(U.blink, blink);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		};
		raf = requestAnimationFrame(frame);

		const lost = (e: Event) => {
			e.preventDefault();
			onFail();
		};
		cv.addEventListener("webglcontextlost", lost);
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			cv.removeEventListener("webglcontextlost", lost);
			gl.getExtension("WEBGL_lose_context")?.loseContext();
		};
	}, [pose, onFail]);

	return <canvas ref={canvas} className="glbot" aria-hidden="true" />;
}
