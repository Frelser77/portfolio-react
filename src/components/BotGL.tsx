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
uniform float uBob;   // altezza (respiro / salto)
uniform float uWalk;  // 0..1
uniform float uPhase; // fase del passo
uniform float uWave;  // 0..1 zampa alzata + coda veloce
uniform float uBlink; // 0..1

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float sdRB(vec3 p, vec3 b, float r){ vec3 q=abs(p)-b; return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0)-r; }
float sdCap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0); return length(pa-ba*h)-r; }
float sdTorusXY(vec3 p, vec2 t){ vec2 q=vec2(length(p.xy)-t.x,p.z); return length(q)-t.y; }
float smin(float a,float b,float k){ float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0); return mix(b,a,h)-k*h*(1.0-h); }
vec2 un(vec2 a, vec2 b){ return a.x<b.x ? a : b; }

// zampa: l'anca ruota avanti e indietro, il piedino è crema
vec2 leg(vec3 q, vec3 hip, float sw){
  vec3 a=q-hip;
  a.yz=rot(sw)*a.yz;
  float d=sdCap(a,vec3(0.0),vec3(0.0,-0.27,0.0),0.072);
  float f=sdRB(a-vec3(0.0,-0.335,0.03),vec3(0.03,0.018,0.06),0.04);
  return un(vec2(d,0.0),vec2(f,7.0));
}

vec2 map(vec3 p){
  vec3 q=p; q.y-=uBob; q.xz=rot(uBody)*q.xz;
  float wob=sin(uPhase*2.0)*0.018*uWalk;
  vec3 b=q; b.y-=wob;
  // corpo lungo da salsiccia
  float torso=sdCap(b,vec3(0.0,0.0,-0.40),vec3(0.0,0.02,0.28),0.205);
  float chest=length((b-vec3(0.0,-0.015,0.30))*vec3(1.0,1.0,0.92))-0.245;
  float rump=length(b-vec3(0.0,0.0,-0.44))-0.195;
  vec2 r=vec2(smin(smin(torso,chest,0.16),rump,0.1),1.0);
  // dorso luminoso
  r=un(r,vec2(sdCap(b,vec3(0.0,0.205,-0.38),vec3(0.0,0.225,0.26),0.011),5.0));
  // zampe: andatura in diagonale; la anteriore destra può salutare
  float s1=uWalk*sin(uPhase)*0.8;
  float s2=uWalk*sin(uPhase+3.14159)*0.8;
  r=un(r,leg(b,vec3(-0.12,-0.12,0.31),s2));
  r=un(r,leg(b,vec3(0.12,-0.12,0.31),mix(s1,-1.15+sin(uT*9.0)*0.3,uWave)));
  r=un(r,leg(b,vec3(-0.12,-0.12,-0.40),s1));
  r=un(r,leg(b,vec3(0.12,-0.12,-0.40),s2));
  // collo e testa
  r=un(r,vec2(sdCap(b,vec3(0.0,0.07,0.30),vec3(0.0,0.2,0.5),0.125),0.0));
  r=un(r,vec2(sdTorusXY(b-vec3(0.0,0.14,0.42),vec2(0.132,0.015)),5.0));
  r=un(r,vec2(length(b-vec3(0.0,0.0,0.45))-0.032,6.0));
  vec3 hp=b-vec3(0.0,0.17,0.48);
  hp.xz=rot(uHead.x)*hp.xz;
  hp.yz=rot(uHead.y)*hp.yz;
  vec3 h=hp-vec3(0.0,0.07,0.1);
  float skull=length(h*vec3(1.0,1.04,0.95))-0.185;
  float snout=sdCap(h,vec3(0.0,-0.05,0.08),vec3(0.0,-0.075,0.34),0.082);
  vec2 head=vec2(smin(skull,snout,0.09),0.0);
  head=un(head,vec2(sdCap(h,vec3(0.0,-0.07,0.2),vec3(0.0,-0.075,0.34),0.085),8.0));
  head=un(head,vec2(length(h-vec3(0.0,-0.045,0.435))-0.055,2.0));
  float sy=mix(1.0,0.08,uBlink);
  vec3 e1=h-vec3(-0.085,0.06,0.15); e1.y/=sy;
  vec3 e2=h-vec3(0.085,0.06,0.15); e2.y/=sy;
  head=un(head,vec2(length(e1)-0.032,3.0));
  head=un(head,vec2(length(e2)-0.032,3.0));
  // orecchie lunghe e morbide
  float flap=sin(uPhase*2.0)*0.22*uWalk+sin(uT*1.7)*0.04+uWave*0.15;
  vec3 e=vec3(abs(h.x),h.y,h.z)-vec3(0.15,0.08,-0.03);
  e.xy=rot(-0.22-flap)*e.xy;
  e.z*=1.0; head=un(head,vec2(sdCap(vec3(e.x*0.8,e.y,e.z),vec3(0.0),vec3(0.03,-0.28,-0.03),0.06)*0.85,4.0));
  r=un(r,head);
  // coda che scodinzola, con la lucina in punta
  float wag=sin(uT*(5.5+uWalk*5.0+uWave*8.0))*(0.07+0.13*uWave+0.05*uWalk);
  vec3 t=b-vec3(0.0,0.04,-0.54);
  vec3 m1=vec3(wag*0.5,0.12,-0.2);
  vec3 m2=vec3(wag,0.34,-0.28);
  r=un(r,vec2(smin(sdCap(t,vec3(0.0),m1,0.045),sdCap(t,m1,m2,0.034),0.05),0.0));
  r=un(r,vec2(length(t-m2)-0.05,6.0));
  return r;
}

vec3 nrm(vec3 p){
  vec2 e=vec2(1.0,-1.0)*0.0016;
  return normalize(e.xyy*map(p+e.xyy).x+e.yyx*map(p+e.yyx).x+e.yxy*map(p+e.yxy).x+e.xxx*map(p+e.xxx).x);
}
vec3 env(vec3 r){
  float y=r.y*0.5+0.5;
  vec3 sky=mix(vec3(0.12,0.08,0.26),vec3(0.55,0.58,0.95),y);
  float key=pow(max(dot(r,normalize(vec3(-0.4,0.7,0.6))),0.0),22.0);
  float rim=pow(max(dot(r,normalize(vec3(0.75,0.25,-0.5))),0.0),8.0);
  return sky+vec3(1.0,0.97,0.9)*key*2.4+vec3(0.55,0.5,1.0)*rim*1.4;
}
float ao(vec3 p, vec3 n){
  float o=0.0, s=1.0;
  for(int i=1;i<=4;i++){ float h=0.035*float(i); o+=(h-map(p+n*h).x)*s; s*=0.7; }
  return clamp(1.0-2.4*o,0.0,1.0);
}
float shadow(vec3 p, vec3 l){
  float res=1.0, t=0.04;
  for(int i=0;i<16;i++){ float h=map(p+l*t).x; res=min(res,9.0*h/t); t+=clamp(h,0.03,0.2); if(res<0.02||t>2.0) break; }
  return clamp(res,0.0,1.0);
}

void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uRes)/uRes.y*2.0;
  vec3 ro=vec3(0.0,0.5,5.0);
  vec3 rd=normalize(vec3(uv*0.145,-1.0));
  rd.yz=rot(0.1)*rd.yz;
  vec3 oc=ro-vec3(0.0,0.0,0.0);
  float b=dot(oc,rd), c=dot(oc,oc)-1.5*1.5, disc=b*b-c;
  if(disc<0.0){ gl_FragColor=vec4(0.0); return; }
  float t=-b-sqrt(disc), tmax=-b+sqrt(disc);
  float md=1e9, tm=t; bool hit=false;
  for(int i=0;i<64;i++){
    vec3 p=ro+rd*t; float h=map(p).x;
    float ang=h/t; if(ang<md){ md=ang; tm=t; }
    if(h<0.0006*t){ hit=true; tm=t; break; }
    t+=h*0.92;
    if(t>tmax) break;
  }
  float pa=0.29/uRes.y;
  float alpha=hit?1.0:clamp(1.0-md/(pa*1.3),0.0,1.0);
  if(alpha<0.01){ gl_FragColor=vec4(0.0); return; }
  vec3 p=ro+rd*tm;
  vec2 m=map(p);
  vec3 n=nrm(p);
  vec3 v=-rd;
  vec3 key=normalize(vec3(-0.45,0.8,0.7));
  float dif=max(dot(n,key),0.0);
  float sh=shadow(p+n*0.01,key);
  float occ=ao(p,n);
  float fr=pow(1.0-max(dot(n,v),0.0),3.0);
  vec3 refl=reflect(rd,n);
  vec3 q=p; q.y-=uBob; q.xz=rot(uBody)*q.xz;
  vec3 col;
  float id=m.y;
  if(id<1.5){ // guscio ceramico color nocciola
    vec3 alb=vec3(0.40,0.15,0.07);
    col=alb*(env(n)*0.42*occ+dif*sh*vec3(1.0,0.94,0.88)*0.95);
    col+=env(refl)*(0.1+0.5*fr)*occ;
    col+=pow(max(dot(refl,key),0.0),60.0)*sh*0.9;
    if(id>0.5){ // anelli di luce che scorrono lungo il corpo
      float g=abs(fract(q.z*5.0)-0.5);
      float ln=smoothstep(0.455,0.49,g)*smoothstep(-0.12,0.08,q.y+0.1);
      col+=vec3(0.1,0.6,1.0)*ln*(0.5+0.5*sin(uT*2.4-q.z*7.0));
    }
  } else if(id<2.5){ // naso: vetro nero lucido
    col=vec3(0.02,0.025,0.06)+env(refl)*(0.3+0.6*fr)*occ;
    col+=pow(max(dot(refl,key),0.0),90.0)*1.6*sh;
  } else if(id<3.5){ // occhi: luce
    col=vec3(0.15,0.75,1.0)*1.05;
  } else if(id<4.5){ // orecchie viola
    vec3 alb=vec3(0.46,0.30,0.92);
    col=alb*(env(n)*0.4*occ+dif*sh*0.85)+env(refl)*(0.1+0.5*fr)*occ+pow(max(dot(refl,key),0.0),40.0)*sh*0.6;
  } else if(id<5.5){ // collare e dorso
    col=mix(vec3(0.45,0.95,1.2),vec3(0.8,0.55,1.3),0.5+0.5*sin(uT*2.0+q.z*4.0))*1.7;
  } else if(id<6.5){ // lucina della coda e medaglietta
    col=mix(vec3(0.3,1.1,0.7),vec3(1.1,0.9,0.4),0.5+0.5*sin(uT*3.0))*1.9;
  } else if(id<7.5){ // piedini crema
    vec3 alb=vec3(0.97,0.90,0.80);
    col=alb*(env(n)*0.38*occ+dif*sh*0.9)+env(refl)*(0.08+0.4*fr)*occ+pow(max(dot(refl,key),0.0),40.0)*sh*0.5;
  } else { // muso color sabbia
    vec3 alb=vec3(0.93,0.66,0.45);
    col=alb*(env(n)*0.4*occ+dif*sh*0.9)+env(refl)*(0.08+0.4*fr)*occ+pow(max(dot(refl,key),0.0),50.0)*sh*0.6;
  }
  col+=vec3(0.45,0.5,1.0)*fr*0.35*step(id,2.5);
  col=1.0-exp(-col*1.25);
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
		const U = { res: u("uRes"), t: u("uT"), head: u("uHead"), body: u("uBody"), bob: u("uBob"), walk: u("uWalk"), phase: u("uPhase"), wave: u("uWave"), blink: u("uBlink") };

		const calm = prefersReducedMotion();
		const small = window.innerWidth < 720;
		const s = { hx: 0, hy: 0, body: -0.85, walk: 0, wave: 0, phase: 0, nextBlink: 2, blinkT: -1 };

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
			s.hx += (-clamp(P.ly, -1, 1) * 0.4 - s.hx) * k;
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
			const hop = spin >= 0 && spin < 0.6 ? Math.sin((spin / 0.6) * Math.PI) * 0.22 : 0;
			const bob = (calm ? 0 : Math.sin(tt * 2.1) * 0.012) + Math.abs(Math.sin(s.phase)) * 0.035 * s.walk + hop;

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
