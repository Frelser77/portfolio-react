import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../prefs";

/** Quello che la guida racconta al robot: dove guardare, se cammina, se saluta, se fa la piroetta. */
export interface Pose {
	lx: number; // sguardo orizzontale -1..1
	ly: number; // sguardo verticale -1..1
	walking: boolean;
	dir: number; // direzione di marcia: 1 destra, -1 sinistra
	waving: boolean;
	spinAt: number; // istante (ms) dell'ultima piroetta
}

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

/**
 * Il robot è disegnato interamente da uno shader: ogni forma è una funzione di distanza (SDF) con raccordi morbidi,
 * illuminata con riflessi, bordo luminoso, occlusione ambientale e ombre. Niente modelli, niente librerie.
 */
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform vec2 uHead;   // yaw, pitch della testa
uniform float uBody;  // yaw del corpo
uniform float uBob;   // altezza (galleggiamento / salto)
uniform float uWalk;  // 0..1
uniform float uPhase; // fase del passo
uniform float uWave;  // 0..1
uniform float uBlink; // 0..1

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float sdRB(vec3 p, vec3 b, float r){ vec3 q=abs(p)-b; return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0)-r; }
float sdCap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0); return length(pa-ba*h)-r; }
float sdTorusXY(vec3 p, vec2 t){ vec2 q=vec2(length(p.xy)-t.x,p.z); return length(q)-t.y; }
float smin(float a,float b,float k){ float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0); return mix(b,a,h)-k*h*(1.0-h); }
vec2 un(vec2 a, vec2 b){ return a.x<b.x ? a : b; }

vec2 arm(vec3 q, vec3 sh, float sx, float rz){
  vec3 a=q-sh;
  a.xy=rot(rz)*a.xy;
  a.yz=rot(sx)*a.yz;
  float d=sdCap(a,vec3(0.0),vec3(0.0,-0.34,0.0),0.075);
  float h=length(a-vec3(0.0,-0.43,0.0))-0.098;
  return vec2(smin(d,h,0.05),4.0);
}
vec2 leg(vec3 q, vec3 hip, float s){
  vec3 a=q-hip;
  a.yz=rot(s)*a.yz;
  float d=sdCap(a,vec3(0.0),vec3(0.0,-0.30,0.0),0.088);
  float f=sdRB(a-vec3(0.0,-0.365,0.075),vec3(0.05,0.03,0.095),0.052);
  return un(vec2(d,1.0),vec2(f,7.0));
}

vec2 map(vec3 p){
  vec3 q=p; q.y-=uBob; q.xz=rot(uBody)*q.xz;
  // busto
  vec2 r=vec2(sdRB(q,vec3(0.16,0.2,0.10),0.2),1.0);
  r=un(r,vec2(sdTorusXY(q-vec3(0.0,0.04,0.295),vec2(0.105,0.011)),5.0));
  r=un(r,vec2(length(q-vec3(0.0,0.04,0.30))-0.034,5.0));
  // collo
  r=un(r,vec2(sdCap(q,vec3(0.0,0.36,0.0),vec3(0.0,0.52,0.0),0.075),4.0));
  // testa (ruota attorno al collo)
  vec3 hp=q-vec3(0.0,0.5,0.0);
  hp.xz=rot(uHead.x)*hp.xz;
  hp.yz=rot(uHead.y)*hp.yz;
  hp-=vec3(0.0,0.3,0.0);
  vec2 head=vec2(sdRB(hp,vec3(0.26,0.14,0.14),0.2),1.0);
  head=un(head,vec2(sdRB(hp-vec3(0.0,0.0,0.245),vec3(0.2,0.085,0.02),0.1),2.0));
  float sy=mix(1.0,0.08,uBlink);
  vec3 e1=hp-vec3(-0.135,0.06,0.352); e1.y/=sy;
  vec3 e2=hp-vec3(0.135,0.06,0.352); e2.y/=sy;
  head=un(head,vec2(sdCap(e1,vec3(0.0,-0.022,0.0),vec3(0.0,0.022,0.0),0.036),3.0));
  head=un(head,vec2(sdCap(e2,vec3(0.0,-0.022,0.0),vec3(0.0,0.022,0.0),0.036),3.0));
  vec3 mp=hp-vec3(0.0,0.005,0.358);
  head=un(head,vec2(max(sdTorusXY(mp,vec2(0.082,0.011)),mp.y),3.0));
  vec3 ep=vec3(abs(hp.x)-0.5,hp.y,hp.z);
  head=un(head,vec2(sdRB(ep,vec3(0.012,0.055,0.055),0.05),4.0));
  head=un(head,vec2(sdCap(hp,vec3(0.0,0.3,0.0),vec3(0.0,0.45,0.0),0.017),1.0));
  head=un(head,vec2(length(hp-vec3(0.0,0.5,0.0))-0.058,6.0));
  r=un(r,head);
  // braccia: la destra (schermo) può salutare
  float sw=uWalk*sin(uPhase)*0.85;
  float wv=sin(uT*11.0)*0.28;
  r=un(r,arm(q,vec3(-0.40,0.15,0.0),-sw,0.14));
  r=un(r,arm(q,vec3(0.40,0.15,0.0),sw,mix(-0.14,-2.55+wv,uWave)));
  // gambe
  r=un(r,leg(q,vec3(-0.17,-0.32,0.0),uWalk*sin(uPhase+3.14159)*0.7));
  r=un(r,leg(q,vec3(0.17,-0.32,0.0),uWalk*sin(uPhase)*0.7));
  return r;
}

vec3 nrm(vec3 p){
  vec2 e=vec2(1.0,-1.0)*0.0016;
  return normalize(e.xyy*map(p+e.xyy).x+e.yyx*map(p+e.yyx).x+e.yxy*map(p+e.yxy).x+e.xxx*map(p+e.xxx).x);
}
vec3 env(vec3 r){
  float y=r.y*0.5+0.5;
  vec3 sky=mix(vec3(0.10,0.08,0.24),vec3(0.52,0.60,0.95),y);
  float key=pow(max(dot(r,normalize(vec3(-0.4,0.7,0.6))),0.0),22.0);
  float rim=pow(max(dot(r,normalize(vec3(0.75,0.25,-0.5))),0.0),8.0);
  return sky+vec3(1.0,0.97,0.9)*key*2.4+vec3(0.45,0.55,1.0)*rim*1.3;
}
float ao(vec3 p, vec3 n){
  float o=0.0, s=1.0;
  for(int i=1;i<=4;i++){ float h=0.035*float(i); o+=(h-map(p+n*h).x)*s; s*=0.7; }
  return clamp(1.0-2.4*o,0.0,1.0);
}
float shadow(vec3 p, vec3 l){
  float res=1.0, t=0.04;
  for(int i=0;i<18;i++){ float h=map(p+l*t).x; res=min(res,9.0*h/t); t+=clamp(h,0.03,0.2); if(res<0.02||t>2.0) break; }
  return clamp(res,0.0,1.0);
}

void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uRes)/uRes.y*2.0;
  vec3 ro=vec3(0.0,0.3,5.0);
  vec3 rd=normalize(vec3(uv*0.245,-1.0));
  vec3 oc=ro-vec3(0.0,0.3,0.0);
  float b=dot(oc,rd), c=dot(oc,oc)-1.9*1.9, disc=b*b-c;
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
  float pa=0.49/uRes.y;
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
  vec3 col;
  float id=m.y;
  if(id<1.5){ // guscio ceramico
    vec3 alb=vec3(0.92,0.94,1.0);
    col=alb*(env(n)*0.34*occ+dif*sh*vec3(1.0,0.96,0.9)*0.85);
    col+=env(refl)*(0.12+0.55*fr)*occ;
    col+=pow(max(dot(refl,key),0.0),60.0)*sh*0.9;
  } else if(id<2.5){ // visiera: vetro nero lucido
    col=vec3(0.015,0.025,0.075)+env(refl)*(0.25+0.6*fr)*occ;
    col+=pow(max(dot(refl,key),0.0),90.0)*1.6*sh;
  } else if(id<3.5){ // occhi e bocca: luce
    col=vec3(0.55,1.1,1.35)*1.8;
  } else if(id<4.5){ // accenti viola
    vec3 alb=vec3(0.50,0.36,0.95);
    col=alb*(env(n)*0.32*occ+dif*sh*0.8)+env(refl)*(0.1+0.5*fr)*occ+pow(max(dot(refl,key),0.0),40.0)*sh*0.6;
  } else if(id<5.5){ // petto
    col=mix(vec3(0.45,0.95,1.2),vec3(0.8,0.55,1.3),0.5+0.5*sin(uT*2.0))*1.7;
  } else if(id<6.5){ // lampadina antenna
    col=mix(vec3(0.3,1.1,0.7),vec3(1.1,0.9,0.4),0.5+0.5*sin(uT*3.0))*1.9;
  } else { // scarpe blu
    vec3 alb=vec3(0.30,0.42,1.0);
    col=alb*(env(n)*0.32*occ+dif*sh*0.85)+env(refl)*(0.1+0.5*fr)*occ+pow(max(dot(refl,key),0.0),40.0)*sh*0.6;
  }
  col+=vec3(0.35,0.5,1.0)*fr*0.35*step(id,2.5);
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
		const s = { hx: 0, hy: 0, body: -0.3, walk: 0, wave: 0, phase: 0, nextBlink: 2, blinkT: -1 };

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
			const bodyT = (P.walking ? P.dir * 1.15 : -0.32 + P.lx * 0.22) + spinAdd;
			s.body += (bodyT - s.body) * (spinAdd ? 1 : 1 - Math.exp(-d * 7));
			s.walk += ((P.walking ? 1 : 0) - s.walk) * (1 - Math.exp(-d * 8));
			s.wave += ((P.waving ? 1 : 0) - s.wave) * (1 - Math.exp(-d * 10));
			s.phase += d * 9 * s.walk;
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
			const bob = (calm ? 0 : Math.sin(tt * 2.1) * 0.025) + Math.abs(Math.sin(s.phase)) * 0.05 * s.walk + hop;

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
