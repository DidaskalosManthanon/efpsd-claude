// ─── UTILS ────────────────────────────────────────────
const $  = id => document.getElementById(id);
const fx = n  => { if(Math.abs(n)<1e-9) return '0'; return Math.round(n*10000)/10000+''; };
const fxf= n  => { const r=Math.round(n*1000)/1000; return r<0?''+r:'+'+r; };
const fmtCoef = (val, varName, first=false) => {
  if(Math.abs(val)<1e-9) return '';
  const abs=Math.abs(val);
  const sign=val<0?' − ':first?'':' + ';
  if(varName===''){ return sign+(first&&val<0?'-':'')+abs; }
  if(abs===1) return sign+(first&&val<0?'-':'')+varName;
  return sign+(first&&val<0?'-':'')+abs+varName;
};

// ─── CANVAS: papier millimétré style ──────────────────
function bgCvs(ctx,W,H){
  ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(180,140,80,.1)'; ctx.lineWidth=.6;
  for(let x=0;x<W;x+=12){ ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke(); }
  for(let y=0;y<H;y+=12){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke(); }
  ctx.strokeStyle='rgba(180,140,80,.22)'; ctx.lineWidth=.9;
  for(let x=0;x<W;x+=60){ ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke(); }
  for(let y=0;y<H;y+=60){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke(); }
}

// ─── 02 — FORME CANONIQUE ─────────────────────────────
function updateCanon(){
  let a=+$('ca').value, b=+$('cb').value, c=+$('cc').value;
  $('ca-v').textContent=a; $('cb-v').textContent=b<0?'−'+Math.abs(b):b; $('cc-v').textContent=c<0?'−'+Math.abs(c):c;
  if(Math.abs(a)<1e-9){ $('canon-res').innerHTML=`<div class="res brick">a ≠ 0 requis pour un polynôme du 2ⁿᵈ degré.</div>`; return; }
  const alpha=-b/(2*a), beta=c-b*b/(4*a);
  const Delta=b*b-4*a*c;
  const fAlpha=a*alpha*alpha+b*alpha+c;
  $('canon-res').innerHTML=`
    <div class="res">f(x) = ${a === 1 ?'': a === -1 ?'−':''+a}x^2 ${fmtCoef(b,'x')} ${fmtCoef(c,'')}</div>
    <div class="res ocre">Forme canonique : f(x) = ${a}(x ${fxf(-alpha)})² ${fmtCoef(beta,'')}</div>
    <div class="res slate">Sommet S(${fx(alpha)} ; ${fx(beta)}) — ${a>0?'minimum':'maximum'} de f : ${fx(beta)}</div>
    <div class="res">Axe de symétrie : x = ${fx(alpha)}</div>
  `;
  window.MathJax && MathJax.typesetPromise();
}
['ca','cb','cc'].forEach(id=>$(id).addEventListener('input',updateCanon));
updateCanon();

// ─── 03 — DISCRIMINANT ────────────────────────────────
function updateDiscr(){
  let a=+$('da').value, b=+$('db').value, c=+$('dc').value;
  $('da-v').textContent=a; $('db-v').textContent=b<0?'−'+Math.abs(b):b; $('dc-v').textContent=c<0?'−'+Math.abs(c):c;
  if(Math.abs(a)<1e-9){ $('discr-res').innerHTML=`<div class="res brick">a ≠ 0 requis.</div>`; return; }
  const D=b*b-4*a*c;
  let html=`<div class="res">Δ = b²−4ac = ${b}²−4×${a}×${c} = ${b*b} − ${4*a*c} = <strong>${fx(D)}</strong></div>`;
  if(D>0){
    const x1=(-b-Math.sqrt(D))/(2*a), x2=(-b+Math.sqrt(D))/(2*a);
    html+=`<div class="res" style="border-left-color:var(--moss)">Δ > 0 → Deux racines distinctes :<br>x₁ = (${-b}−√${fx(D)})/${2*a} ≈ <strong>${fx(x1)}</strong><br>x₂ = (${-b}+√${fx(D)})/${2*a} ≈ <strong>${fx(x2)}</strong></div>`;
    html+=`<div class="res">Forme factorisée : f(x) = ${a}(x − ${fx(x1)})(x − ${fx(x2)})</div>`;
  } else if(Math.abs(D)<1e-9){
    const x0=-b/(2*a);
    html+=`<div class="res ocre">Δ = 0 → Racine double : x₀ = <strong>${fx(x0)}</strong></div>`;
    html+=`<div class="res">Forme factorisée : f(x) = ${a}(x − ${fx(x0)})²</div>`;
  } else {
    html+=`<div class="res moss">Δ < 0 → Pas de racine réelle. f(x) a le signe de a = ${a} pour tout x.</div>`;
  }
  $('discr-res').innerHTML=html;
  window.MathJax && MathJax.typesetPromise();
}
['da','db','dc'].forEach(id=>$(id).addEventListener('input',updateDiscr));
updateDiscr();

// ─── 04 — SIGNE ───────────────────────────────────────
function updateSign(){
  let a=+$('sa').value, b=+$('sb').value, c=+$('sc').value;
  $('sa-v').textContent=a; $('sb-v').textContent=b<0?'−'+Math.abs(b):b; $('sc-v').textContent=c<0?'−'+Math.abs(c):c;
  if(Math.abs(a)<1e-9){ $('sign-res').innerHTML=`<div class="res brick">a ≠ 0 requis.</div>`; return; }
  const D=b*b-4*a*c;
  let html='';
  if(D>0){
    const x1=(-b-Math.sqrt(D))/(2*a), x2=(-b+Math.sqrt(D))/(2*a);
    const r1=Math.min(x1,x2), r2=Math.max(x1,x2);
    const sA=a>0?'+':'-', sB=a>0?'-':'+';
    html=`<table class="sign-table">
      <thead><tr><th>x</th><th>−∞</th><th></th><th>${fx(r1)}</th><th></th><th>${fx(r2)}</th><th></th><th>+∞</th></tr></thead>
      <tbody>
        <tr><td>f(x)</td>
          <td class="${a>0?'pos':'neg'}">${a>0?'+':'−'}</td><td></td>
          <td class="zer root-col">0</td>
          <td class="${a>0?'neg':'pos'}">${a>0?'−':'+'}</td>
          <td class="zer root-col">0</td>
          <td class="${a>0?'pos':'neg'}">${a>0?'+':'−'}</td><td></td>
        </tr>
      </tbody>
    </table>`;
    html+=`<div class="res">f(x) > 0 pour x ∈ ]−∞ ; ${fx(r1)}[ ∪ ]${fx(r2)} ; +∞[ &nbsp;(signe de a = ${a>0?'+':''+''+a})</div>
    <div class="res brick">f(x) < 0 pour x ∈ ]${fx(r1)} ; ${fx(r2)}[ &nbsp;(signe opposé à a)</div>`;
  } else if(Math.abs(D)<1e-9){
    const x0=-b/(2*a);
    html=`<table class="sign-table">
      <thead><tr><th>x</th><th>−∞</th><th></th><th>${fx(x0)}</th><th></th><th>+∞</th></tr></thead>
      <tbody>
        <tr><td>f(x)</td>
          <td class="${a>0?'pos':'neg'}">${a>0?'+':'−'}</td><td></td>
          <td class="zer root-col">0</td>
          <td class="${a>0?'pos':'neg'}">${a>0?'+':'−'}</td><td></td>
        </tr>
      </tbody>
    </table>`;
    html+=`<div class="res ocre">Racine double en x₀ = ${fx(x0)} — f(x) ≥ 0 pour tout x (signe de a = ${a>0?'+':''+''+a}) sauf en x₀.</div>`;
  } else {
    html=`<table class="sign-table">
      <thead><tr><th>x</th><th>−∞</th><th></th><th>+∞</th></tr></thead>
      <tbody><tr><td>f(x)</td><td class="${a>0?'pos':'neg'}">${a>0?'+':'−'}</td><td></td><td class="${a>0?'pos':'neg'}">${a>0?'+':'−'}</td></tr></tbody>
    </table>`;
    html+=`<div class="res moss">Δ < 0 : pas de racine réelle, f(x) a le signe de a (${a>0?'positif':'négatif'}) sur ℝ entier.</div>`;
  }
  $('sign-res').innerHTML=html;
}
['sa','sb','sc'].forEach(id=>$(id).addEventListener('input',updateSign));
updateSign();

// ─── 05 — SOMME & PRODUIT ─────────────────────────────
function updateSP(){
  const s=+$('sp-s').value, p=+$('sp-p').value;
  $('sp-s-v').textContent=s; $('sp-p-v').textContent=p;
  const D=s*s-4*p;
  let html=`<div class="res">On cherche x₁,x₂ tels que x₁+x₂ = ${s} et x₁·x₂ = ${p}</div>`;
  html+=`<div class="res slate">x² − (${s})x + (${p}) = 0 &nbsp;→&nbsp; Δ = ${s}²−4×${p} = ${s*s}−${4*p} = <strong>${fx(D)}</strong></div>`;
  if(D>0){
    const x1=(s-Math.sqrt(D))/2, x2=(s+Math.sqrt(D))/2;
    html+=`<div class="res">x₁ = <strong>${fx(x1)}</strong> &nbsp;·&nbsp; x₂ = <strong>${fx(x2)}</strong></div>`;
    html+=`<div class="res ocre">Vérif : somme = ${fx(x1+x2)} = ${s} ✓ &nbsp;·&nbsp; produit = ${fx(x1*x2)} ≈ ${p} ✓</div>`;
  } else if(Math.abs(D)<1e-9){
    html+=`<div class="res ocre">Racine double : x₁ = x₂ = <strong>${fx(s/2)}</strong></div>`;
  } else {
    html+=`<div class="res brick">Δ < 0 : il n'existe pas de tels nombres réels.</div>`;
  }
  $('sp-res').innerHTML=html;
}
['sp-s','sp-p'].forEach(id=>$(id).addEventListener('input',updateSP));
updateSP();

// ─── 06 — PARABOLE ────────────────────────────────────
let showCanon=false;
function toggleForm(){
  showCanon=!showCanon;
  $('form-btn').textContent=showCanon?'Masquer forme canonique':'Afficher forme canonique';
  drawPara();
}
function drawPara(){
  let a=+$('pa').value, b=+$('pb').value, c=+$('pc').value;
  $('pa-v').textContent=a; $('pb-v').textContent=b<0?'−'+Math.abs(b):b; $('pc-v').textContent=c<0?'−'+Math.abs(c):c;

  const cv=$('c-para'), ctx=cv.getContext('2d');
  const W=cv.width, H=cv.height;
  bgCvs(ctx,W,H);

  if(Math.abs(a)<1e-9){
    ctx.fillStyle='#b5452a'; ctx.font='14px "Source Code Pro"';
    ctx.fillText('a ≠ 0 requis',W/2-50,H/2); return;
  }

  const ox=W/2, oy=H/2, sc=40;
  // axes
  ctx.strokeStyle='rgba(44,36,22,.25)'; ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,oy);ctx.lineTo(W,oy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(ox,0);ctx.lineTo(ox,H);ctx.stroke();
  // tick marks + labels
  ctx.fillStyle='rgba(44,36,22,.4)'; ctx.font='10px "Source Code Pro"';
  for(let i=-8;i<=8;i++){
    if(i===0) continue;
    ctx.fillText(i, ox+i*sc-4, oy+14);
    ctx.fillText(-i, ox-4, oy-i*sc+3);
  }
  ctx.fillText('x',W-14,oy-6); ctx.fillText('y',ox+6,12);

  const f=x=>a*x*x+b*x+c;
  const xMin=(0-ox)/sc, xMax=(W-ox)/sc;

  // parabola
  ctx.strokeStyle='#b5452a'; ctx.lineWidth=2.5;
  ctx.beginPath();
  let first=true;
  for(let px=0;px<W;px++){
    const xr=(px-ox)/sc, yr=f(xr);
    const py=oy-yr*sc;
    if(py<-100||py>H+100){first=true;continue;}
    if(first){ctx.moveTo(px,py);first=false;}else ctx.lineTo(px,py);
  }
  ctx.stroke();

  // roots
  const D=b*b-4*a*c;
  if(D>0){
    const r1=(-b-Math.sqrt(D))/(2*a), r2=(-b+Math.sqrt(D))/(2*a);
    [r1,r2].forEach(r=>{
      ctx.fillStyle='#c8891a'; ctx.beginPath(); ctx.arc(ox+r*sc,oy,5,0,2*Math.PI); ctx.fill();
      ctx.fillStyle='#2c2416'; ctx.font='bold 11px "Source Code Pro"';
      ctx.fillText(Math.round(r*100)/100, ox+r*sc-14, oy+20);
    });
  } else if(Math.abs(D)<1e-9){
    const x0=-b/(2*a);
    ctx.fillStyle='#c8891a'; ctx.beginPath(); ctx.arc(ox+x0*sc,oy,5,0,2*Math.PI); ctx.fill();
  }

  // vertex
  const alpha=-b/(2*a), beta=f(alpha);
  const vx=ox+alpha*sc, vy=oy-beta*sc;
  ctx.fillStyle='#3d5a6e'; ctx.beginPath(); ctx.arc(vx,vy,6,0,2*Math.PI); ctx.fill();
  ctx.fillStyle='#3d5a6e'; ctx.font='bold 11px "Source Code Pro"';
  ctx.fillText(`S(${Math.round(alpha*100)/100} ; ${Math.round(beta*100)/100})`, vx+9, vy-8);

  // axis of symmetry (dashed)
  ctx.strokeStyle='rgba(61,90,110,.4)'; ctx.lineWidth=1; ctx.setLineDash([5,4]);
  ctx.beginPath();ctx.moveTo(vx,0);ctx.lineTo(vx,H);ctx.stroke();
  ctx.setLineDash([]);

  // canonical form label
  if(showCanon){
    const label=`f(x) = ${a}(x ${Math.round(-alpha*100)/100>=0?'− '+Math.abs(Math.round(alpha*100)/100):'+ '+Math.abs(Math.round(alpha*100)/100)})² ${Math.round(beta*100)/100>=0?'+ '+Math.round(beta*100)/100:'− '+Math.abs(Math.round(beta*100)/100)}`;
    ctx.fillStyle='rgba(61,90,110,.9)';
    ctx.fillRect(8,8,Math.min(400,label.length*7.2+16),24);
    ctx.fillStyle='white'; ctx.font='12px "Source Code Pro"';
    ctx.fillText(label,16,24);
  }

  // info panel
  let info=`<div class="res">f(x) = ${a}x² ${fmtCoef(b,'x')} ${fmtCoef(c,'')}</div>`;
  info+=`<div class="res slate">Sommet S(${fx(alpha)} ; ${fx(beta)}) — ${a>0?'Minimum':'Maximum'} : ${fx(beta)}</div>`;
  if(D>0){
    const r1=(-b-Math.sqrt(D))/(2*a), r2=(-b+Math.sqrt(D))/(2*a);
    info+=`<div class="res ocre">Δ = ${fx(D)} > 0 — Racines : x₁ ≈ ${fx(r1)}, x₂ ≈ ${fx(r2)}</div>`;
  } else if(Math.abs(D)<1e-9){
    info+=`<div class="res ocre">Δ = 0 — Racine double x₀ = ${fx(alpha)}</div>`;
  } else {
    info+=`<div class="res moss">Δ = ${fx(D)} < 0 — Pas de racine réelle</div>`;
  }
  $('para-info').innerHTML=info;
}
['pa','pb','pc'].forEach(id=>$(id).addEventListener('input',drawPara));
drawPara();

// ─── 08 — POLYNÔME DEGRÉ 3 ────────────────────────────
function updateP3(){
  const a3=+$('p3a').value,a2=+$('p3b').value,a1=+$('p3c').value,a0=+$('p3d').value;
  $('p3a-v').textContent=a3; $('p3b-v').textContent=a2<0?'−'+Math.abs(a2):a2;
  $('p3c-v').textContent=a1<0?'−'+Math.abs(a1):a1; $('p3d-v').textContent=a0<0?'−'+Math.abs(a0):a0;
  if(Math.abs(a3)<1e-9){$('p3-res').innerHTML=`<div class="res brick">a₃ ≠ 0 requis.</div>`; return;}
  const P=r=>a3*r*r*r+a2*r*r+a1*r+a0;
  // search integer roots in [-10,10]
  const roots=[];
  for(let r=-10;r<=10;r++){ if(Math.abs(P(r))<1e-6) roots.push(r); }
  let html=`<div class="res">P(x) = ${a3}x³ ${fmtCoef(a2,'x²')} ${fmtCoef(a1,'x')} ${fmtCoef(a0,'')}</div>`;
  if(roots.length===0){
    html+=`<div class="res ocre">Aucune racine entière dans [−10 ; 10] détectée. Essayez d'autres coefficients.</div>`;
  } else {
    const r=roots[0];
    // divide P by (x-r) : P(x)=(x-r)(b2 x² + b1 x + b0)
    const b2=a3, b1=a2+a3*r, b0=a1+b1*r;
    const check=b0*r+b1*r*r+b2*r*r*r; // should be -a0 ... we verify via P(x) = (x-r)(b2x²+b1x+b0)
    html+=`<div class="res">Racine entière trouvée : r = <strong>${r}</strong> &nbsp;(P(${r}) = ${fx(P(r))} ≈ 0)</div>`;
    html+=`<div class="res ocre">P(x) = (x − ${r})(${b2}x² ${fmtCoef(b1,'x')} ${fmtCoef(b0,'')})</div>`;
    // solve quadratic factor
    const D=b1*b1-4*b2*b0;
    html+=`<div class="res slate">Δ du facteur quadratique = ${fx(D)}</div>`;
    if(D>0){
      const r1=(-b1-Math.sqrt(D))/(2*b2), r2=(-b1+Math.sqrt(D))/(2*b2);
      html+=`<div class="res">3 racines réelles : x = ${r}, x₁ ≈ ${fx(r1)}, x₂ ≈ ${fx(r2)}</div>`;
    } else if(Math.abs(D)<1e-9){
      const r0=-b1/(2*b2);
      html+=`<div class="res">2 racines : x = ${r} (simple), x₀ ≈ ${fx(r0)} (double)</div>`;
    } else {
      html+=`<div class="res moss">1 seule racine réelle : x = ${r}. Le facteur quadratique n'a pas de racine réelle.</div>`;
    }
  }
  $('p3-res').innerHTML=html;
}
['p3a','p3b','p3c','p3d'].forEach(id=>$(id).addEventListener('input',updateP3));
updateP3();

// ─── QCM ──────────────────────────────────────────────
const QCM=[
  { q:"Quel est le discriminant de \\(2x^2 - 5x + 3\\) ?",
    opts:["\\(1\\)","\\(49\\)","\\(−1\\)","\\(25\\)"], ans:0,
    expl:"Δ = b²−4ac = (−5)²−4×2×3 = 25−24 = 1." },
  { q:"Quelles sont les racines de \\(x^2 - 5x + 6 = 0\\) ?",
    opts:["2 et 3","−2 et −3","1 et 6","−1 et 6"], ans:0,
    expl:"Δ = 25−24 = 1. x₁=(5−1)/2=2, x₂=(5+1)/2=3. On peut aussi remarquer 2+3=5 et 2×3=6." },
  { q:"La forme canonique de \\(x^2 - 6x + 5\\) est :",
    opts:["\\((x-3)^2-4\\)","\\((x-5)^2+3\\)","\\((x+3)^2-4\\)","\\((x-3)^2+4\\)"], ans:0,
    expl:"α=−(−6)/(2×1)=3, β=5−36/4=5−9=−4. Forme : (x−3)²−4." },
  { q:"La parabole \\(f(x) = -3x^2+12x-5\\) a son sommet en :",
    opts:["x=2","x=−2","x=4","x=1"], ans:0,
    expl:"α=−b/(2a)=−12/(2×−3)=−12/(−6)=2." },
  { q:"\\(f(x) = (x-1)(x+3)\\). Sur quel intervalle f est-elle négative ?",
    opts:["\\(]-\\infty;-3[\\cup]1;+\\infty[\\)","\\(]-3;1[\\)","\\(]-\\infty;1[\\)","\\(]−3;+\\infty[\\)"], ans:1,
    expl:"Racines : 1 et −3. a=1>0, donc f<0 entre les racines : ]−3 ; 1[." },
  { q:"Deux nombres ont pour somme 7 et produit 12. Lesquels ?",
    opts:["3 et 4","2 et 6","1 et 12","5 et 2"], ans:0,
    expl:"x²−7x+12=0. Δ=49−48=1. x₁=(7−1)/2=3, x₂=(7+1)/2=4. Vérif: 3+4=7✓, 3×4=12✓" },
  { q:"Si \\(\\Delta < 0\\) et \\(a > 0\\), alors pour tout \\(x \\in \\mathbb{R}\\) :",
    opts:["\\(f(x) > 0\\)","\\(f(x) < 0\\)","\\(f(x) = 0\\)","\\(f(x)\\) s'annule une fois"], ans:0,
    expl:"Δ<0 → pas de racine réelle. a>0 → parabole vers le haut entièrement au-dessus de l'axe x. Donc f(x)>0 partout." },
  { q:"La somme des racines de \\(3x^2 + 9x - 2 = 0\\) est :",
    opts:["−3","3","−9","9"], ans:0,
    expl:"Somme = −b/a = −9/3 = −3." },
  { q:"Factoriser \\(4x^2 - 9\\) :",
    opts:["\\((2x-3)(2x+3)\\)","\\((4x-9)(x+1)\\)","\\((2x-3)^2\\)","\\((x-3)(x+3)\\)"], ans:0,
    expl:"4x²−9 = (2x)²−3². Identité remarquable a²−b²=(a−b)(a+b) avec a=2x, b=3." },
  { q:"La forme factorisée de \\(f(x) = 2x^2 - 8\\) est :",
    opts:["\\(2(x-2)(x+2)\\)","\\((x-4)(x+4)\\)","\\(2(x-4)\\)","\\((2x-8)\\)"], ans:0,
    expl:"2x²−8=2(x²−4)=2(x−2)(x+2). Δ=0+4×2×8=64, racines ±2." },
];

let qSt={qs:[],cur:0,score:0,answered:0,did:false};
let tSec=0,tRun=true;
let tIv=null;

function qShuffle(){
  qSt={qs:[...QCM].sort(()=>Math.random()-.5),cur:0,score:0,answered:0,did:false};
  tSec=0; tDisplay();
  clearInterval(tIv);
  tRun=true; $('t-btn').textContent='⏸ Pause';
  tIv=setInterval(()=>{if(tRun){tSec++;tDisplay();}},1000);
  qRender();
}
function qRender(){
  const body=$('qcm-body');
  if(qSt.cur>=qSt.qs.length){
    body.innerHTML=`<p class="q-text" style="text-align:center;padding:20px">🎉 Terminé ! Score final : <strong>${qSt.score} / ${qSt.qs.length}</strong></p>`;
    clearInterval(tIv); return;
  }
  const q=qSt.qs[qSt.cur]; qSt.did=false;
  $('q-score').textContent=`Score : ${qSt.score} / ${qSt.answered}`;
  body.innerHTML=`
    <div class="q-num">Question ${qSt.cur+1} / ${qSt.qs.length}</div>
    <p class="q-text">${q.q}</p>
    <div class="opts">${q.opts.map((o,i)=>`<button class="opt" id="opt${i}" onclick="qAnswer(${i})">${o}</button>`).join('')}</div>
    <div class="feedback" id="qfb"></div>
  `;
  window.MathJax && MathJax.typesetPromise();
}
function qAnswer(i){
  if(qSt.did) return; qSt.did=true; qSt.answered++;
  const q=qSt.qs[qSt.cur], ok=i===q.ans;
  if(ok) qSt.score++;
  $('opt'+q.ans).classList.add('correct');
  if(!ok) $('opt'+i).classList.add('wrong');
  document.querySelectorAll('.opt').forEach(b=>b.classList.add('locked'));
  $('qfb').textContent=(ok?'✓ Correct ! ':'✗ Incorrect. ')+q.expl;
  $('q-score').textContent=`Score : ${qSt.score} / ${qSt.answered}`;
  window.MathJax && MathJax.typesetPromise();
}
function qNext(){ qSt.cur++; qRender(); }
function tDisplay(){
  const m=String(Math.floor(tSec/60)).padStart(2,'0'), s=String(tSec%60).padStart(2,'0');
  $('qcm-timer').textContent=`${m}:${s}`;
}
function tPause(){ tRun=!tRun; $('t-btn').textContent=tRun?'⏸ Pause':'▶ Go'; }
function tReset(){ tSec=0; tDisplay(); }
function tShowToggle(){ $('qcm-timer').classList.toggle('hidden',!$('t-show').checked); }
qShuffle();

// ─── FADE IN ──────────────────────────────────────────
const obs=new IntersectionObserver(e=>e.forEach(el=>{if(el.isIntersecting) el.target.classList.add('visible');}),{threshold:.08});
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));