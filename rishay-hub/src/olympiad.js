/* =========================================================
   Maths Olympiad — Sub-Junior Level 2 (Grades 3–5)
   Logical thinking, number and figure patterns, whole numbers, fractions and decimals,
   guess-the-number, time, basic geometry, measurement, data handling.
   Each gen(level) returns a typed question; toMCQ() turns numeric ones into 4-option MCQs
   (using likely mistakes, "traps", as the wrong options) for the Individual round.
   ========================================================= */
const WEEK = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const ord = n => { const s=n%100; if(s>=11&&s<=13) return n+"th"; return n+({1:"st",2:"nd",3:"rd"}[n%10]||"th"); };
const sumDigits = n => String(n).split("").reduce((a,b)=>a+Number(b),0);
const svgFig = (w,h,inner) => `<div class="figwrap"><svg class="fig" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Pattern figure">${inner}</svg></div>`;
const LN = (x1,y1,x2,y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const TX = (x,y,t) => `<text x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
function perms(a){ if(a.length<=1) return [a]; return a.flatMap((x,i)=>perms([...a.slice(0,i),...a.slice(i+1)]).map(p=>[x,...p])); }
function fmtTime12(mins){ mins=((mins%1440)+1440)%1440; const h=Math.floor(mins/60), m=mins%60, h12=h%12||12; return `${h12}:${String(m).padStart(2,"0")} ${h<12?"am":"pm"}`; }
function fmtDur(m){ const h=Math.floor(m/60), r=m%60; return `${h} h ${r} min`; }

function toMCQ(q){
  if(q.type!=="num") return q;
  const a=q.ans, isInt=Number.isInteger(a), out=[];
  const ok = x => Number.isFinite(x) && x!==a && (a<0 || x>=0) && (!isInt || Number.isInteger(x)) && !out.includes(x);
  (q.traps||[]).forEach(x=>{ x=round6(x); if(out.length<3 && ok(x)) out.push(x); });
  const step = Math.max(1, Math.round(Math.abs(a)*0.1));
  [a+step, a-step, a+1, a-1, a+2*step, a*2, a+10, a-10].forEach(x=>{ x=round6(x); if(out.length<3 && ok(x)) out.push(x); });
  const f = x => q.pre ? `${q.unit}${fmt(x)}` : q.unit ? `${fmt(x)} ${q.unit}` : fmt(x);
  return {...mcq(q.prompt, [a,...out].map(f), 0, q.ex)};
}

const OLY = [
 {id:"m.o.logic", strand:"Olympiad problem solving", name:"Logical thinking", desc:"Heads and legs, ages, handshakes, positions, gaps", gen(l){
   const t = pick(l===1 ? ["legs","row","trees"] : l===2 ? ["legs","age","hands","log"] : ["pages","frog","age2","hands","legs"]);
   if(t==="legs"){ const c=ri(l===1?3:8,l===1?12:30), h=ri(l===1?4:10,l===1?15:40), H=c+h, G=4*c+2*h, cows=Math.random()<.5;
     return Q("num",`A farm has only hens and cows. Together they have <b>${H} heads</b> and <b>${G} legs</b>. How many <b>${cows?"cows":"hens"}</b> are there?`, cows?c:h, cows?c:h,
       `Imagine all ${H} animals were hens: that gives ${2*H} legs. The ${G} − ${2*H} = ${G-2*H} extra legs belong to cows, 2 extra each, so there are ${G-2*H} ÷ 2 = <b>${c} cows</b> and ${H} − ${c} = <b>${h} hens</b>.`, {traps:[cows?h:c, G-2*H, Math.round(G/4)]}); }
   if(t==="row"){ const p=ri(5,25), q=ri(5,25); return Q("num",`In a row of children, Rishay is <b>${ord(p)} from the left</b> and <b>${ord(q)} from the right</b>. How many children are in the row?`, p+q-1, p+q-1, `Adding ${p} + ${q} counts Rishay twice, so subtract 1: <b>${p+q-1}</b>.`, {traps:[p+q, p+q-2, p+q+1]}); }
   if(t==="trees"){ const n=ri(6,25), d=pick([2,3,4,5,6,8,10]); return Q("num",`<b>${n} trees</b> are planted in a straight line, <b>${d} m</b> apart. How far is the first tree from the last?`, (n-1)*d, `${(n-1)*d} m`, `${n} trees have only ${n-1} gaps between them: ${n-1} × ${d} = <b>${(n-1)*d} m</b>.`, {unit:"m", traps:[n*d,(n+1)*d,(n-2)*d]}); }
   if(t==="log"){ const k=ri(4,12), m=ri(2,9); return Q("num",`It takes <b>${m} minutes</b> to make one cut through a log. How long will it take to cut the log into <b>${k} pieces</b>?`, (k-1)*m, `${(k-1)*m} minutes`, `${k} pieces need only ${k-1} cuts: ${k-1} × ${m} = <b>${(k-1)*m} minutes</b>.`, {unit:"minutes", traps:[k*m,(k+1)*m,(k-2)*m]}); }
   if(t==="age"){ const s=ri(5,12), k=pick([3,4,5]), f=k*s, y=f-2*s; return Q("num",`Rishay is <b>${s}</b> years old. His father is <b>${k} times</b> as old. In how many years will his father be exactly <b>twice</b> Rishay’s age?`, y, `${y} years`, `Father is ${f}. The age gap, ${f} − ${s} = ${f-s} years, never changes. Father is twice Rishay’s age when Rishay is ${f-s}, which is ${f-s} − ${s} = <b>${y} years</b> from now. Check: ${s+y} × 2 = ${f+y}.`, {unit:"years", traps:[s, f-s, y+s]}); }
   if(t==="age2"){ const b=ri(6,20), d=ri(2,9), a=b+d, S=a+b; return Q("num",`The ages of two sisters add up to <b>${S}</b>. The elder is <b>${d} years</b> older than the younger. How old is the elder sister?`, a, `${a} years`, `Take away the difference: ${S} − ${d} = ${S-d}. That is twice the younger sister’s age, so she is ${b}, and the elder is ${b} + ${d} = <b>${a}</b>.`, {unit:"years", traps:[b, Math.round(S/2), S-d]}); }
   if(t==="hands"){ const n=ri(l===2?5:10, l===2?10:25), ans=n*(n-1)/2; return Q("num",`At a party, <b>${n} friends</b> each shake hands with every other friend exactly once. How many handshakes are there?`, ans, ans, `Each of the ${n} people shakes ${n-1} hands: ${n} × ${n-1} = ${n*(n-1)}. That counts every handshake twice (once for each person), so divide by 2: <b>${ans}</b>.`, {traps:[n*(n-1), n*n, ans+n]}); }
   if(t==="pages"){ const N=ri(110,350), ans=9+180+3*(N-99); return Q("num",`How many digits are needed to number the pages of a book from <b>1 to ${N}</b>?`, ans, ans, `Pages 1–9: 9 digits. Pages 10–99: 90 pages × 2 = 180 digits. Pages 100–${N}: ${N-99} pages × 3 = ${3*(N-99)} digits. Total: 9 + 180 + ${3*(N-99)} = <b>${ans}</b>.`, {traps:[3*N, ans-9, ans+3]}); }
   let D,u,s; do{ u=ri(3,6); s=ri(1,u-1); D=ri(10,30); }while(D<=u); const days=Math.ceil((D-u)/(u-s))+1;
   return Q("num",`A frog is at the bottom of a well <b>${D} m</b> deep. Each day it climbs up <b>${u} m</b>, but each night it slips back <b>${s} m</b>. On which day does it climb out?`, days, `Day ${days}`, `Each day-and-night the frog gains ${u} − ${s} = ${u-s} m. On its last day it climbs out before it can slip back, so it only needs to reach ${D} − ${u} = ${D-u} m by the start of a day. That takes ${Math.ceil((D-u)/(u-s))} full day(s), and it escapes on <b>day ${days}</b>.`, {traps:[Math.ceil(D/(u-s)), days+1, days-1]});
 }},
 {id:"m.o.numpat", strand:"Olympiad problem solving", name:"Number patterns", desc:"Growing gaps, alternating rules, Fibonacci, squares and cubes", gen(l){
   const t = pick(l===1 ? ["alt","down"] : l===2 ? ["quad","muladd","squares","alt"] : ["fib","inter","quad","cubes","missing"]);
   let terms, next, rule;
   if(t==="down"){ const a=ri(150,500), d=ri(7,19); terms=[0,1,2,3,4].map(i=>a-i*d); next=a-5*d; rule=`subtract ${d} each time`; }
   if(t==="alt"){ const a=ri(5,30), p=ri(6,14), q=ri(2,p-2); terms=[a]; for(let i=1;i<6;i++) terms.push(terms[i-1]+(i%2?p:-q)); next=terms[5]+p; rule=`add ${p}, then subtract ${q}, and repeat`; }
   if(t==="quad"||t==="missing"){ const s=ri(1,20), d0=ri(1,5), k=ri(1,3); terms=[s]; for(let i=1;i<6;i++) terms.push(terms[i-1]+d0+(i-1)*k); next=terms[5]+d0+5*k; rule=`the gaps grow by ${k} each time: +${[0,1,2,3,4,5].map(i=>d0+i*k).join(", +")}`; }
   if(t==="muladd"){ const m=pick([2,3]), c=pick([1,2,-1]), s=ri(c<0?2:1,5); terms=[s]; for(let i=1;i<5;i++) terms.push(terms[i-1]*m+c); next=terms[4]*m+c; rule=`multiply by ${m}, then ${c>0?"add":"subtract"} ${Math.abs(c)}`; }
   if(t==="squares"){ const a=ri(2,8), c=pick([0,1,-1,2,3]); terms=[0,1,2,3,4].map(i=>(a+i)**2+c); next=(a+5)**2+c; rule=`square numbers ${a}², ${a+1}², ${a+2}², …${c?` ${c>0?"plus":"minus"} ${Math.abs(c)}`:""}`; }
   if(t==="cubes"){ const c=pick([0,1,-1]); terms=[1,2,3,4,5].map(n=>n**3+c); next=6**3+c; rule=`cube numbers 1³, 2³, 3³, …${c?` ${c>0?"plus":"minus"} 1`:""}`; }
   if(t==="fib"){ const a=ri(1,6), b=ri(2,9); terms=[a,b]; while(terms.length<7) terms.push(terms[terms.length-1]+terms[terms.length-2]); next=terms[6]+terms[5]; rule=`each term is the sum of the two before it`; }
   if(t==="inter"){ const a=ri(1,10), p=ri(2,6), b=ri(40,70), q=ri(3,8); terms=[]; for(let i=0;i<7;i++) terms.push(i%2===0 ? a+(i/2)*p : b-((i-1)/2)*q); next=b-3*q; rule=`two patterns are woven together: the 1st, 3rd, 5th… terms go up by ${p}; the 2nd, 4th, 6th… go down by ${q}`; }
   const last=terms[terms.length-1], prev=terms[terms.length-2], naive=last+(last-prev);
   if(t==="missing"){ const k=3, ans=terms[k], shown=terms.map((x,i)=>i===k?"?":x);
     return Q("num",`Find the missing number: <span class="bignum">${shown.join(", ")}</span>`, ans, ans, `Look at the gaps: ${rule}. So the missing term is <b>${ans}</b>.`, {traps:[Math.round((terms[k-1]+terms[k+1])/2), ans+1, ans-1, terms[k-1]+(terms[k-1]-terms[k-2])]}); }
   return Q("num",`What comes next? <span class="bignum">${terms.join(", ")}, …</span>`, next, next, `Rule: ${rule}. So the next term is <b>${next}</b>.`, {traps:[naive, next+1, next-1, last+(terms[1]-terms[0])]});
 }},
 {id:"m.o.figpat", strand:"Olympiad problem solving", name:"Figure patterns", desc:"Matchstick shapes, dot patterns and growing grids", gen(l){
   const t = pick(l===1 ? ["sq","tri"] : l===2 ? ["sq","tri","dots"] : ["rev","grid","dots","sq"]);
   const g = (fig, i, x) => `<g transform="translate(${x},6)">${fig(i)}</g>${TX(x+fig.w(i)/2, fig===gridFig?84:70, "Pattern "+i)}`;
   const sqFig = Object.assign(n => { let s=""; for(let i=0;i<=n;i++) s+=LN(i*18,20,i*18,38); for(let i=0;i<n;i++) s+=LN(i*18,20,i*18+18,20)+LN(i*18,38,i*18+18,38); return s; }, {w:n=>n*18});
   const triFig = Object.assign(n => { let s=""; const H=31, B=46, W=20; for(let k=0;k<=n;k++){ const j=Math.floor(k/2); s += k%2===0 ? LN(j*W,B,j*W+W/2,B-H+15) : LN(j*W+W/2,B-H+15,(j+1)*W,B); } for(let i=0;i<n;i++){ const j=Math.floor(i/2); s += i%2===0 ? LN(j*W,B,j*W+W,B) : LN(j*W+W/2,B-H+15,j*W+W/2+W,B-H+15); } return s; }, {w:n=>Math.ceil((n+1)/2)*20});
   const dotFig = Object.assign(n => { let s=""; for(let r=0;r<n;r++) for(let c=0;c<=r;c++) s+=`<circle cx="${(n-1-r)*5+c*10+4}" cy="${r*10+14}" r="3"/>`; return s; }, {w:n=>n*10});
   const gridFig = Object.assign(n => { let s=""; const c=16, g=2; for(let i=0;i<=n;i++) for(let j=0;j<n;j++){ s+=LN(j*c+g,8+i*c,(j+1)*c-g,8+i*c)+LN(i*c,8+j*c+g,i*c,8+(j+1)*c-g); } return s; }, {w:n=>n*16});
   const row = fig => { let x=10, s=""; [1,2,3].forEach(i=>{ s+=g(fig,i,x); x+=fig.w(i)+34; }); return svgFig(x, fig===gridFig?90:78, s); };
   if(t==="sq"){ const n = l===1?ri(6,12):ri(15,50), a=3*n+1; return Q("num",`${row(sqFig)}Matchsticks are used to make a row of squares. How many matchsticks are needed for a row of <b>${n} squares</b>?`, a, a, `The first square needs 4 sticks; each new square shares a side, so it adds only 3. For ${n} squares: 4 + 3 × ${n-1} = <b>${a}</b> (the rule is 3 × squares + 1).`, {traps:[4*n, 3*n, 3*n+4]}); }
   if(t==="tri"){ const n = l===1?ri(6,12):ri(15,40), a=2*n+1; return Q("num",`${row(triFig)}Matchsticks make a strip of triangles. How many matchsticks are needed for <b>${n} triangles</b>?`, a, a, `The first triangle needs 3 sticks; each new triangle shares a side, so it adds 2. For ${n} triangles: 3 + 2 × ${n-1} = <b>${a}</b> (the rule is 2 × triangles + 1).`, {traps:[3*n, 2*n, 2*n+2]}); }
   if(t==="dots"){ const n = l===2?ri(6,12):ri(15,25), a=n*(n+1)/2; return Q("num",`${row(dotFig)}Each pattern adds a new row of dots. How many dots are in <b>pattern ${n}</b>?`, a, a, `Pattern ${n} has rows of 1, 2, 3, … ${n} dots. 1 + 2 + … + ${n} = ${n} × ${n+1} ÷ 2 = <b>${a}</b>.`, {traps:[n*n, n*(n-1)/2, n*(n+1)]}); }
   if(t==="grid"){ const n=ri(4,8), a=2*n*(n+1); return Q("num",`${row(gridFig)}Matchsticks are used to make square grids: 1 × 1, 2 × 2, 3 × 3 and so on. How many matchsticks are needed for a <b>${n} × ${n}</b> grid?`, a, a, `A ${n} × ${n} grid has ${n+1} horizontal lines and ${n+1} vertical lines, each made of ${n} sticks: 2 × ${n+1} × ${n} = <b>${a}</b>.`, {traps:[4*n*n, (n+1)*(n+1), 2*n*n]}); }
   const n=ri(20,60), T=3*n+1; return Q("num",`${row(sqFig)}Rishay has exactly <b>${T} matchsticks</b>. He uses all of them to make one row of squares like this. How many squares does he make?`, n, n, `n squares need 3n + 1 sticks. So 3n + 1 = ${T}, 3n = ${T-1}, n = ${T-1} ÷ 3 = <b>${n}</b>.`, {traps:[Math.floor(T/4), Math.floor(T/3)+1, n-1]});
 }},
 {id:"m.o.whole", strand:"Olympiad problem solving", name:"Whole-number puzzles", desc:"Missing digits, digit cards, counting multiples, remainders", gen(l){
   const t = pick(l===1 ? ["madd","digits4","sum"] : l===2 ? ["mmul","even5","count","sum"] : ["incl","rem","odd","digits5"]);
   if(t==="madd"){ const a=ri(100,899), b=ri(100,999-a), s=a+b, pos=ri(0,2), d=String(a)[pos], shown=String(a).split("").map((x,i)=>i===pos?"□":x).join("");
     return Q("num",`What digit goes in the box? <span class="bignum">${shown} + ${b} = ${s}</span>`, +d, d, `${s} − ${b} = ${a}, so the missing digit is <b>${d}</b>.`, {traps:[(+d+1)%10, (+d+9)%10, s%10]}); }
   if(t==="mmul"){ const a=ri(12,99), m=ri(3,9), p=a*m, pos=ri(0,1), d=String(a)[pos], shown=String(a).split("").map((x,i)=>i===pos?"□":x).join("");
     return Q("num",`What digit goes in the box? <span class="bignum">${shown} × ${m} = ${p}</span>`, +d, d, `${p} ÷ ${m} = ${a}, so the missing digit is <b>${d}</b>.`, {traps:[(+d+1)%10, (+d+9)%10, (+d+2)%10]}); }
   if(t==="sum"){ const n=ri(l===1?10:30, l===1?30:100), a=n*(n+1)/2; return Q("num",`What is <span class="bignum">1 + 2 + 3 + … + ${n}</span>?`, a, a, `Pair the numbers from the outside in: 1 + ${n}, 2 + ${n-1}, … each pair makes ${n+1}. There are ${n} ÷ 2 pairs, so the total is ${n} × ${n+1} ÷ 2 = <b>${a}</b>.`, {traps:[n*n, n*(n+1), n*(n-1)/2]}); }
   if(t==="odd"){ const n=ri(10,40), L=2*n-1; return Q("num",`What is <span class="bignum">1 + 3 + 5 + … + ${L}</span>?`, n*n, n*n, `Adding odd numbers from 1 always gives a square: 1 = 1², 1 + 3 = 2², 1 + 3 + 5 = 3²… There are ${n} odd numbers up to ${L}, so the sum is ${n}² = <b>${n*n}</b>.`, {traps:[L*L, n*(n+1), (L+1)*L/2]}); }
   if(t==="count"){ const k=pick([3,4,6,7,8,9]), A=ri(20,80), B=ri(200,600), ans=Math.floor(B/k)-Math.floor((A-1)/k); return Q("num",`How many numbers from <b>${A} to ${B}</b> (including both) are multiples of <b>${k}</b>?`, ans, ans, `Multiples of ${k} up to ${B}: ${Math.floor(B/k)}. Multiples of ${k} below ${A}: ${Math.floor((A-1)/k)}. So ${Math.floor(B/k)} − ${Math.floor((A-1)/k)} = <b>${ans}</b>.`, {traps:[Math.floor((B-A)/k), ans+1, ans-1]}); }
   if(t==="incl"){ const [a,b]=pick([[2,3],[3,5],[2,5],[4,6],[3,4],[5,7],[4,10]]), N=ri(100,500), L=lcm(a,b), ans=Math.floor(N/a)+Math.floor(N/b)-Math.floor(N/L);
     return Q("num",`How many numbers from <b>1 to ${N}</b> are divisible by <b>${a} or ${b}</b> (or both)?`, ans, ans, `Divisible by ${a}: ${Math.floor(N/a)}. Divisible by ${b}: ${Math.floor(N/b)}. Numbers divisible by both (multiples of ${L}) were counted twice: ${Math.floor(N/L)}. So ${Math.floor(N/a)} + ${Math.floor(N/b)} − ${Math.floor(N/L)} = <b>${ans}</b>.`, {traps:[Math.floor(N/a)+Math.floor(N/b), ans-Math.floor(N/L), Math.floor(N/L)]}); }
   if(t==="rem"){ const ds=pick([[2,3,4],[3,4,5],[2,3,5],[4,5,6],[2,3,4,5,6]]), r=ri(1,Math.min(...ds)-1), L=ds.reduce(lcm), ans=L+r;
     return Q("num",`What is the smallest number <b>greater than 10</b> that leaves a remainder of <b>${r}</b> when divided by each of ${ds.join(", ")}?`, ans, ans, `A number that leaves remainder ${r} is ${r} more than a common multiple. The lowest common multiple of ${ds.join(", ")} is ${L}, so the answer is ${L} + ${r} = <b>${ans}</b>.`, {traps:[L, L-r, ds.reduce((a,b)=>a*b)+r]}); }
   const four = t==="digits4", n=four?4:5; let ds; do{ ds=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,n); }while((four && ds.includes(0)) || (t==="even5" && (!ds.some(d=>d%2===0) || ds.every(d=>d%2===0))));
   const nums = perms(ds).filter(p=>p[0]!==0).map(p=>Number(p.join("")));
   if(t==="even5"){ const ev=nums.filter(x=>x%2===0), mx=Math.max(...ev); return Q("num",`Using each of the digits <b>${ds.join(", ")}</b> exactly once, what is the <b>largest even</b> 5-digit number you can make?`, mx, mx, `Put the largest digits first, but the last digit must be even. Choose the smallest even digit for the ones place and arrange the rest from largest to smallest: <b>${mx}</b>.`, {traps:[Math.max(...nums), Math.max(...nums.filter(x=>x%2===1)), ev.sort((a,b)=>b-a)[1]]}); }
   const mx=Math.max(...nums), mn=Math.min(...nums);
   return Q("num",`Using each of the digits <b>${ds.join(", ")}</b> exactly once, find the <b>difference</b> between the largest and the smallest ${n}-digit numbers you can make.`, mx-mn, mx-mn, `Largest: ${mx}. Smallest: ${mn}${ds.includes(0)?" (0 cannot go first)":""}. Difference: ${mx} − ${mn} = <b>${mx-mn}</b>.`, {traps:[mx-Number([...ds].sort((a,b)=>a-b).join("")), mx+mn, mx-mn+9]});
 }},
 {id:"m.o.fracdec", strand:"Olympiad problem solving", name:"Fractions and decimals challenge", desc:"Spending problems, fraction of a number, comparing, decimals", gen(l){
   const t = pick(l===1 ? ["spend1","howmany","compare"] : l===2 ? ["spend2","fracof","decmul","howmany"] : ["tank","unitsum","spend2","dec2frac","compare"]);
   if(t==="spend1"){ const p=pick([3,4,5,6,8]), A=p*ri(10,60), left=A*(p-1)/p; return Q("num",`Rishay had <b>₹${A}</b>. He spent ${frac(1,p)} of it on a book. How much money does he have left?`, left, `₹${left}`, `${frac(1,p)} of ₹${A} = ₹${A/p}. Left: ₹${A} − ₹${A/p} = <b>₹${left}</b>.`, {unit:"₹", pre:true, traps:[A/p, A-p, left-A/p]}); }
   if(t==="spend2"){ const p=pick([2,3,4,5]), q=pick([2,3,4,5]), A=p*q*ri(5,30), r1=A-A/p, left=r1-r1/q;
     return Q("num",`Meera had <b>₹${A}</b>. She spent ${frac(1,p)} of it on a gift, and then ${frac(1,q)} of <b>what was left</b> on snacks. How much money does she have now?`, left, `₹${left}`, `Gift: ${frac(1,p)} of ₹${A} = ₹${A/p}, leaving ₹${r1}. Snacks: ${frac(1,q)} of ₹${r1} = ₹${r1/q}. Now she has ₹${r1} − ₹${r1/q} = <b>₹${left}</b>.`, {unit:"₹", pre:true, traps:[A-A/p-A/q, r1, A/q]}); }
   if(t==="fracof"){ let a,b,c,d; do{ b=pick([3,4,5,6,8]); a=ri(1,b-1); d=pick([3,4,5,6,8]); c=ri(1,d-1); }while(gcd(a,b)!==1||gcd(c,d)!==1||(a===c&&b===d)); const N=lcm(b,d)*ri(2,8), X=N*a/b, ans=N*c/d;
     return Q("num",`${frac(a,b)} of a number is <b>${X}</b>. What is ${frac(c,d)} of the same number?`, ans, ans, `If ${frac(a,b)} is ${X}, then ${frac(1,b)} is ${X} ÷ ${a} = ${X/a}, and the whole number is ${X/a} × ${b} = ${N}. ${frac(c,d)} of ${N} = <b>${ans}</b>.`, {traps:[N, X*c/d, Math.round(X*d/c)]}); }
   if(t==="howmany"){ const k=pick([0.25,0.5,0.2,0.05,0.1]), T=ri(2,9), ans=Math.round(T/k); return Q("num",`How many <b>${k}</b>s are there in <b>${T}</b>?`, ans, ans, `${k} = ${frac(...simp(Math.round(k*100),100))}, so there are ${Math.round(1/k)} of them in 1. In ${T}: ${T} × ${Math.round(1/k)} = <b>${ans}</b>.`, {traps:[round6(T*k), ans/10, ans*10]}); }
   if(t==="decmul"){ const a=ri(2,9), b=ri(2,9), ans=round6(a*b/100); return Q("num",`<span class="bignum">0.${a} × 0.${b}</span> = ?`, ans, String(ans), `${a} × ${b} = ${a*b}. Each number has 1 decimal place, so the answer has 2: <b>${ans}</b>.`, {traps:[round6(a*b/10), round6((a+b)/10), round6(a*b/1000)]}); }
   if(t==="tank"){ const d=pick([4,5,8,10]); let a,b; do{ a=ri(1,d-2); b=ri(a+1,d-1); }while(gcd(a,d)!==1||gcd(b,d)!==1); const k=ri(5,30), X=(b-a)*k, cap=d*k;
     return Q("num",`A water tank is ${frac(a,d)} full. After <b>${X} litres</b> are added, it is ${frac(b,d)} full. How many litres does the full tank hold?`, cap, `${cap} litres`, `The ${X} litres filled ${frac(b,d)} − ${frac(a,d)} = ${frac(b-a,d)} of the tank. So ${frac(1,d)} is ${X} ÷ ${b-a} = ${k} litres, and the whole tank is ${k} × ${d} = <b>${cap} litres</b>.`, {unit:"litres", traps:[X*d, X+cap/d, k*b]}); }
   if(t==="compare"){ let fs; do{ fs=Array.from({length:4},()=>{ const d=ri(3,12); return [ri(Math.ceil(d*0.35),Math.floor(d*0.85)),d]; }); }while(new Set(fs.map(f=>f[0]/f[1])).size<4 || fs.some(f=>f[0]<1||f[0]>=f[1]));
     const big=Math.random()<.5, vals=fs.map(f=>f[0]/f[1]), k=vals.indexOf(big?Math.max(...vals):Math.min(...vals));
     return mcq(`Which fraction is the <b>${big?"largest":"smallest"}</b>?`, fs.map(f=>frac(f[0],f[1])), k, `As decimals: ${fs.map(f=>`${f[0]}/${f[1]} ≈ ${(f[0]/f[1]).toFixed(3)}`).join(", ")}. So the ${big?"largest":"smallest"} is <b>${fs[k][0]}/${fs[k][1]}</b>.`); }
   if(t==="unitsum"){ const set=pick([[[1,2],[1,4],[1,8]],[[1,2],[1,4],[1,8],[1,16]],[[1,2],[1,3],[1,6]],[[1,3],[1,6],[1,9]],[[1,2],[1,5],[1,10]]]);
     const L=set.reduce((a,f)=>lcm(a,f[1]),1), N=set.reduce((a,f)=>a+L/f[1],0), [n,d]=simp(N,L), txt=(x,y)=>y===1?String(x):frac(x,y);
     const wrong1=simp(set.length, set.reduce((a,f)=>a+f[1],0)), opts=[txt(n,d), txt(...wrong1), txt(...simp(N+1,L)), txt(...simp(Math.max(1,N-1),L))];
     return mcq(`<span class="bignum">${set.map(f=>`${f[0]}/${f[1]}`).join(" + ")}</span> = ?`, [...new Set(opts)].length===4?opts:[txt(n,d),txt(...wrong1),txt(n+1,d+1),txt(n,d*2)], 0, `Use the common denominator ${L}: ${set.map(f=>`${L/f[1]}/${L}`).join(" + ")} = ${N}/${L}${(n!==N)?` = ${n}/${d}`:""}. (Adding tops and bottoms, ${wrong1[0]}/${wrong1[1]}, is a common mistake.)`); }
   const D=pick([[0.125,1,8],[0.375,3,8],[0.6,3,5],[0.75,3,4],[0.04,1,25],[0.35,7,20],[0.625,5,8],[0.45,9,20]]); const others=shuffle([[1,8],[3,8],[3,5],[3,4],[1,25],[7,20],[5,8],[9,20],[2,5],[1,4]].filter(f=>f[0]/f[1]!==D[0])).slice(0,3);
   return mcq(`Which fraction is equal to <b>${D[0]}</b>?`, [frac(D[1],D[2]), ...others.map(f=>frac(f[0],f[1]))], 0, `${D[0]} = ${Math.round(D[0]*1000)}/1000, which simplifies to <b>${D[1]}/${D[2]}</b>.`);
 }},
 {id:"m.o.guess", strand:"Olympiad problem solving", name:"Guess the number", desc:"Use clues about digits, multiples and primes", gen(l){
   const lo=l===3?100:10, hi=l===3?999:99, dg=n=>String(n).split("").map(Number);
   for(let tries=0; tries<200; tries++){
     const target=ri(lo,hi), d=dg(target);
     const props=[];
     props.push(target%2===0 ? {t:"I am an even number.", f:n=>n%2===0} : {t:"I am an odd number.", f:n=>n%2===1});
     [3,4,5,6,7,9].forEach(k=>{ if(target%k===0) props.push({t:`I am a multiple of ${k}.`, f:n=>n%k===0}); });
     if(l>1 && isPrime(target)) props.push({t:"I am a prime number.", f:isPrime});
     if(l>1 && Number.isInteger(Math.sqrt(target))) props.push({t:"I am a perfect square.", f:n=>Number.isInteger(Math.sqrt(n))});
     const s=sumDigits(target); props.push({t:`My digits add up to ${s}.`, f:n=>sumDigits(n)===s});
     if(l===3){ const p=d.reduce((a,b)=>a*b,1); if(p) props.push({t:`The product of my digits is ${p}.`, f:n=>dg(n).reduce((a,b)=>a*b,1)===p}); }
     const a=d[d.length-2], b=d[d.length-1];
     if(a!==b) props.push(a>b ? {t:"My tens digit is greater than my ones digit.", f:n=>dg(n)[dg(n).length-2]>dg(n)[dg(n).length-1]} : {t:"My ones digit is greater than my tens digit.", f:n=>dg(n)[dg(n).length-1]>dg(n)[dg(n).length-2]});
     const w=l===3?200:30, rl=Math.max(lo,target-ri(3,w-3)), rh=Math.min(hi,rl+w); props.push({t:`I am between ${rl} and ${rh}.`, f:n=>n>rl&&n<rh});
     const order=shuffle(props); let chosen=[], cand=Array.from({length:hi-lo+1},(_,i)=>lo+i);
     for(const p of order){ const nc=cand.filter(p.f); if(nc.length<cand.length){ chosen.push(p); cand=nc; } if(cand.length===1) break; }
     if(cand.length!==1 || chosen.length<2 || chosen.length>5) continue;
     const near=[]; chosen.forEach((p,i)=>{ const others=chosen.filter((_,j)=>j!==i); Array.from({length:hi-lo+1},(_,k)=>lo+k).filter(n=>n!==target && others.every(o=>o.f(n))).slice(0,6).forEach(n=>{ if(!near.some(x=>x.n===n)) near.push({n, broke:p.t}); }); });
     if(near.length<3) continue;
     const ds=shuffle(near).slice(0,3);
     return mcq(`Guess my number!<ul class="clues">${chosen.map(p=>`<li>${p.t}</li>`).join("")}</ul>`, [String(target), ...ds.map(x=>String(x.n))], 0,
       `Only <b>${target}</b> fits every clue. ${ds.map(x=>`${x.n} breaks the clue “${x.broke}”`).join("; ")}.`);
   }
   return Q("num","Guess my number! <ul class=\"clues\"><li>I am a 2-digit number.</li><li>I am a multiple of 9.</li><li>My digits are the same.</li></ul>",99,"99","The 2-digit multiples of 9 with equal digits: only 99.",{traps:[88,90,81]});
 }},
 {id:"m.o.time", strand:"Olympiad problem solving", name:"Time and calendar puzzles", desc:"Days ahead, real calendars, fast clocks, clock-hand angles", gen(l){
   const t = pick(l===1 ? ["dayafter","overnight"] : l===2 ? ["dayafter","gain","overnight"] : ["dates","angle","between","gain"]);
   if(t==="dayafter"){ const i=ri(0,6), N=l===1?ri(10,60):ri(100,500), j=(i+N)%7; const opts=[j,(j+1)%7,(j+6)%7,(j+3)%7].map(x=>WEEK[x]);
     return mcq(`Today is <b>${WEEK[i]}</b>. What day of the week will it be <b>${N} days</b> from today?`, opts, 0, `Every 7 days the weekday repeats. ${N} ÷ 7 = ${Math.floor(N/7)} weeks remainder <b>${N%7}</b>. Count ${N%7} day${N%7===1?"":"s"} on from ${WEEK[i]}: <b>${WEEK[j]}</b>.`); }
   if(t==="overnight"){ const s=ri(20*12,23*12+11)*5, e=ri(4*12,8*12+11)*5, dur=1440-s+e, wrong=Math.abs(e-s);
     const dopts=[dur]; [wrong, dur+60, dur-60, dur+30, dur-30, dur+120].forEach(x=>{ if(dopts.length<4 && x>0 && !dopts.includes(x)) dopts.push(x); });
     return mcq(`A bus leaves Bengaluru at <b>${fmtTime12(s)}</b> and reaches Goa at <b>${fmtTime12(e)}</b> the next morning. How long is the journey?`, dopts.map(fmtDur), 0, `From ${fmtTime12(s)} to midnight is ${fmtDur(1440-s)}. From midnight to ${fmtTime12(e)} is ${fmtDur(e)}. Total: <b>${fmtDur(dur)}</b>.`); }
   if(t==="gain"){ const g=ri(2,5), h1=ri(6,10), k=ri(5,9), act=(h1+k)*60, shown=act+g*k;
     return mcq(`A clock gains <b>${g} minutes every hour</b>. It is set to the correct time at <b>${fmtTime12(h1*60)}</b>. What time will it show when the correct time is <b>${fmtTime12(act)}</b>?`, [fmtTime12(shown), fmtTime12(act+g), fmtTime12(act-g*k), fmtTime12(act+g*(k+1))], 0, `${k} hours pass, and the clock gains ${g} minutes each hour: ${k} × ${g} = ${g*k} minutes fast. ${fmtTime12(act)} + ${g*k} min = <b>${fmtTime12(shown)}</b>.`); }
   if(t==="angle"){ const h=ri(1,11), m=pick([0,30,20,40,10,50]); let a=Math.abs(30*h-5.5*m); a=Math.min(a,360-a);
     return Q("num",`What is the <b>smaller angle</b> between the hour hand and the minute hand of a clock at <b>${h}:${String(m).padStart(2,"0")}</b>?`, a, `${a}°`, `The minute hand is at ${6*m}° (6° per minute). The hour hand moves 30° per hour <i>and</i> 0.5° per minute: ${30*h} + ${m*0.5} = ${30*h+m*0.5}°. The difference is ${Math.abs(30*h+0.5*m-6*m)}°${Math.abs(30*h+0.5*m-6*m)>180?`, and the smaller angle is 360 − that = ${a}°`:""}. Answer: <b>${a}°</b>.`, {unit:"°", traps:[Math.min(Math.abs(30*h-6*m),360-Math.abs(30*h-6*m)), 360-a, a+15]}); }
   const y=ri(2026,2030);
   const randDate=()=>{ const m=ri(0,11), dd=ri(1,new Date(y,m+1,0).getDate()); return new Date(y,m,dd); };
   let A=randDate(), B=randDate(); if(A>B) [A,B]=[B,A]; if(+A===+B) B=new Date(y,A.getMonth(),A.getDate()+40);
   const days=Math.round((B-A)/864e5), dstr=x=>`${x.getDate()} ${MONTHS[x.getMonth()]} ${x.getFullYear()}`;
   if(t==="between") return Q("num",`How many days are there from <b>${dstr(A)}</b> to <b>${dstr(B)}</b>, counting <b>both</b> days?`, days+1, days+1, `Count the days left in each month, then add. From ${dstr(A)} to ${dstr(B)} is ${days} days later; counting both the first and last day adds 1: <b>${days+1}</b>.`, {traps:[days, days+2, days-1]});
   const j=B.getDay(), opts=[j,(j+1)%7,(j+6)%7,(j+2)%7].map(x=>WEEK[x]);
   return mcq(`<b>${dstr(A)}</b> is a <b>${WEEK[A.getDay()]}</b>. What day of the week is <b>${dstr(B)}</b>?`, opts, 0, `${dstr(B)} is ${days} days after ${dstr(A)}. ${days} ÷ 7 = ${Math.floor(days/7)} weeks remainder ${days%7}, so move ${days%7} day${days%7===1?"":"s"} on from ${WEEK[A.getDay()]}: <b>${WEEK[j]}</b>.`);
 }},
 {id:"m.o.geom", strand:"Olympiad problem solving", name:"Basic geometry puzzles", desc:"Counting shapes, perimeters, diagonals, painted cubes", gen(l){
   const t = pick(l===1 ? ["perim","rects"] : l===2 ? ["squares","rects","perim","ratio"] : ["squares","diag","cube","maxarea","ratio"]);
   if(t==="perim"){ const k=ri(3,9), s=ri(2,9), P=s*(2*k+2); return Q("num",`<b>${k} identical squares</b>, each with sides of <b>${s} cm</b>, are placed side by side in a row to make one long rectangle. What is the perimeter of the rectangle?`, P, `${P} cm`, `The rectangle is ${k*s} cm long and ${s} cm wide. Perimeter = 2 × (${k*s} + ${s}) = <b>${P} cm</b>.`, {unit:"cm", traps:[4*s*k, 2*k*s, P+2*s]}); }
   if(t==="rects"){ const n=ri(3,7), a=n*(n+1)/2; let s=""; for(let i=0;i<=n;i++) s+=LN(10+i*30,10,10+i*30,40); s+=LN(10,10,10+n*30,10)+LN(10,40,10+n*30,40);
     return Q("num",`${svgFig(20+n*30,50,s)}How many rectangles of any size are there in this strip of <b>${n}</b> boxes? (A square counts as a rectangle.)`, a, a, `Rectangles 1 box long: ${n}; 2 boxes long: ${n-1}; … ${n} boxes long: 1. Total: ${Array.from({length:n},(_,i)=>n-i).join(" + ")} = <b>${a}</b>.`, {traps:[n, a-1, n*2]}); }
   if(t==="squares"){ const n=l===2?3:pick([4,5]); let a=0; for(let k=1;k<=n;k++) a+=k*k; let s=""; const c=Math.floor(90/n); for(let i=0;i<=n;i++) s+=LN(10,10+i*c,10+n*c,10+i*c)+LN(10+i*c,10,10+i*c,10+n*c);
     return Q("num",`${svgFig(20+n*c,20+n*c,s)}How many squares of <b>any size</b> are there in this ${n} × ${n} grid?`, a, a, `1 × 1 squares: ${n*n}. ${Array.from({length:n-1},(_,i)=>`${i+2} × ${i+2} squares: ${(n-i-1)**2}`).join(". ")}. Total: <b>${a}</b>.`, {traps:[n*n, a-1, n*n+1]}); }
   if(t==="diag"){ const n=ri(5,12), names={5:"pentagon",6:"hexagon",7:"heptagon",8:"octagon",9:"nonagon",10:"decagon",11:"11-sided polygon",12:"dodecagon"}, a=n*(n-3)/2;
     return Q("num",`How many <b>diagonals</b> does a ${names[n]} (${n} sides) have?`, a, a, `From each corner you can draw a diagonal to every corner except itself and its 2 neighbours: ${n-3} diagonals. ${n} × ${n-3} counts every diagonal twice, so ${n} × ${n-3} ÷ 2 = <b>${a}</b>.`, {traps:[n*(n-3), n*(n-1)/2, n]}); }
   if(t==="cube"){ const n=ri(3,5), k=pick([0,1,2,3]), v=[(n-2)**3, 6*(n-2)**2, 12*(n-2), 8][k], lab=["no","exactly 1","exactly 2","exactly 3"][k];
     return Q("num",`A large cube is painted red on all its faces and then cut into <b>${n*n*n} small cubes</b> (${n} × ${n} × ${n}). How many small cubes have <b>${lab} painted face${k===1?"":"s"}</b>?`, v, v, `3 faces: the 8 corners. 2 faces: along the 12 edges, ${n-2} on each = ${12*(n-2)}. 1 face: the middle of each of the 6 faces, ${(n-2)}² each = ${6*(n-2)**2}. No faces: the hidden inside cube, ${n-2}³ = ${(n-2)**3}. So the answer is <b>${v}</b>.`, {traps:[(n-2)**3, 6*(n-2)**2, 12*(n-2), 8, n*n].filter(x=>x!==v)}); }
   if(t==="maxarea"){ const P=ri(10,30)*2, h=P/2, a=Math.floor(h/2)*Math.ceil(h/2); return Q("num",`A rectangle has whole-number sides and a perimeter of <b>${P} cm</b>. What is the <b>largest</b> area it can have?`, a, `${a} cm²`, `Length + width = ${P} ÷ 2 = ${h}. The area is largest when the sides are as close as possible: ${Math.floor(h/2)} × ${Math.ceil(h/2)} = <b>${a} cm²</b>.`, {unit:"cm²", traps:[(h-1), h*h, Math.floor(h/2)*Math.ceil(h/2)-Math.floor(h/2)+1]}); }
   const R=pick([[1,2,3],[2,3,4],[1,1,2],[2,3,5],[1,4,5],[3,4,5],[2,2,5],[1,2,6],[4,5,6],[2,7,9]]), S=R[0]+R[1]+R[2], u=180/S, big=R[2]*u;
   return Q("num",`The three angles of a triangle are in the ratio <b>${R.join(" : ")}</b>. What is the <b>largest</b> angle?`, big, `${big}°`, `There are ${R.join(" + ")} = ${S} equal parts, and the angles add up to 180°, so one part is 180 ÷ ${S} = ${u}°. The largest angle is ${R[2]} × ${u} = <b>${big}°</b>.`, {unit:"°", traps:[R[2]*10, 180-big, R[0]*u]});
 }},
 {id:"m.o.measure", strand:"Olympiad problem solving", name:"Measurement challenge", desc:"Balances, containers, rates and speed", gen(l){
   const t = pick(l===1 ? ["glasses","ribbon"] : l===2 ? ["balance","box","speed","glasses"] : ["tank","balance2","rate","box","speed"]);
   if(t==="glasses"){ const g=pick([150,200,250,300]), L=pick([1.5,2,2.5,3,3.5,4,4.5,5]), n=Math.floor(L*1000/g), r=L*1000-n*g;
     return Q("num",`How many <b>${g} mL</b> glasses can be completely filled from a <b>${L} litre</b> bottle of juice?`, n, n, `${L} L = ${L*1000} mL. ${L*1000} ÷ ${g} = ${n}${r?` remainder ${r} mL, which is not enough for another glass`:""}. Answer: <b>${n}</b>.`, {traps:[n+1, Math.round(L*1000/g/10), n-1]}); }
   if(t==="ribbon"){ const m=ri(3,9), p=pick([30,35,40,45,60,70]), n=Math.floor(m*100/p), left=m*100-n*p;
     return Q("num",`A ribbon is <b>${m} m</b> long. Rishay cuts it into pieces <b>${p} cm</b> long. How many full pieces does he get?`, n, n, `${m} m = ${m*100} cm. ${m*100} ÷ ${p} = ${n} remainder ${left}, so he gets <b>${n}</b> full pieces${left?` with ${left} cm left over`:""}.`, {traps:[n+1, n-1, left||n+2]}); }
   if(t==="balance"){ const a=pick([2,3,4,5]), b=pick([2,3,4,5].filter(x=>x!==a)), P=a*ri(10,40), apple=b*P/a, k=pick([2,3,4,6,8].filter(x=>x!==a)), ans=k*apple;
     return Q("num",`<b>${a} apples</b> weigh the same as <b>${b} pears</b>. One pear weighs <b>${P} g</b>. How much do <b>${k} apples</b> weigh?`, ans, `${ans} g`, `${b} pears weigh ${b} × ${P} = ${b*P} g, so ${a} apples weigh ${b*P} g and one apple weighs ${b*P} ÷ ${a} = ${apple} g. ${k} apples: ${k} × ${apple} = <b>${ans} g</b>.`, {unit:"g", traps:[k*P, k*a*P/b, b*P]}); }
   if(t==="balance2"){ const k=ri(30,45), B=3*k, mango=4*k, melon=10*k;
     return Q("num",`<b>2 melons</b> weigh the same as <b>5 mangoes</b>. <b>3 mangoes</b> weigh the same as <b>4 bananas</b>. One banana weighs <b>${B} g</b>. How much does <b>one melon</b> weigh?`, melon, `${melon} g`, `4 bananas = ${4*B} g = 3 mangoes, so 1 mango = ${4*B} ÷ 3 = ${mango} g. 5 mangoes = ${5*mango} g = 2 melons, so 1 melon = ${5*mango} ÷ 2 = <b>${melon} g</b>.`, {unit:"g", traps:[5*mango, mango, Math.round(B*5/2)]}); }
   if(t==="box"){ const n=ri(6,15), w=ri(4,12)*50, bx=ri(4,12)*50, tot=n*w+bx;
     return Q("num",`A box holding <b>${n} identical books</b> weighs <b>${fmt(tot/1000)} kg</b>. The empty box weighs <b>${bx} g</b>. How much does <b>one book</b> weigh, in grams?`, w, `${w} g`, `${fmt(tot/1000)} kg = ${tot} g. Books alone: ${tot} − ${bx} = ${n*w} g. One book: ${n*w} ÷ ${n} = <b>${w} g</b>.`, {unit:"g", traps:[Math.round(tot/n), w+bx/n, tot-bx]}); }
   if(t==="speed"){ const s=ri(3,6)*4, h=ri(1,3), m=pick([15,30,45]), d=s*h+s*m/60;
     return Q("num",`A cyclist rides at a steady <b>${s} km per hour</b>. How far does she travel in <b>${h} hour${h>1?"s":""} ${m} minutes</b>?`, d, `${d} km`, `In ${h} hour${h>1?"s":""}: ${s} × ${h} = ${s*h} km. ${m} minutes is ${frac(m/15,4)} of an hour: ${frac(m/15,4)} × ${s} = ${s*m/60} km. Total: <b>${d} km</b>.`, {unit:"km", traps:[s*(h+m/100), s*h+m, s*h]}); }
   if(t==="tank"){ const a=ri(6,15), b=ri(1,a-2), tm=ri(8,30), C=(a-b)*tm;
     return Q("num",`An empty tank holds <b>${C} litres</b>. A tap fills it at <b>${a} litres per minute</b>, but a leak lets out <b>${b} litres per minute</b>. How many minutes does it take to fill the tank?`, tm, `${tm} minutes`, `Each minute the tank gains ${a} − ${b} = ${a-b} litres. ${C} ÷ ${a-b} = <b>${tm} minutes</b>.`, {unit:"minutes", traps:[Math.round(C/a), Math.round(C/(a+b)), tm+b]}); }
   const r=ri(10,18), L0=ri(2,6), D0=L0*r, n=ri(8,30), D=r*n;
   return Q("num",`A car uses <b>${L0} litres</b> of petrol to travel <b>${D0} km</b>. How many litres will it need for <b>${D} km</b>?`, n, `${n} litres`, `Find the distance for 1 litre: ${D0} ÷ ${L0} = ${r} km. Then ${D} ÷ ${r} = <b>${n} litres</b>.`, {unit:"litres", traps:[Math.round(D/L0), Math.round(D/D0*r), n+L0]});
 }},
 {id:"m.o.data", strand:"Olympiad problem solving", name:"Data handling challenge", desc:"Tables, pictographs, averages and frequency tables", gen(l){
   const t = pick(l===1 ? ["table","picto"] : l===2 ? ["picto","avgadd","table"] : ["avgremove","freq","avgadd"]);
   const names = shuffle(["Rishay","Meera","Kabir","Aanya","Dev","Zoya","Arjun"]).slice(0,5);
   if(t==="table"){ const v=names.map(()=>ri(5,45)); let i,j; do{ i=ri(0,4); j=ri(0,4); }while(v[i]<=v[j]); const tb=`<table class="mini"><tr><th>Child</th>${names.map(n=>`<td>${n}</td>`).join("")}</tr><tr><th>Marbles</th>${v.map(x=>`<td>${x}</td>`).join("")}</tr></table>`;
     if(Math.random()<.5) return Q("num",`${tb}How many more marbles does <b>${names[i]}</b> have than <b>${names[j]}</b>?`, v[i]-v[j], v[i]-v[j], `${v[i]} − ${v[j]} = <b>${v[i]-v[j]}</b>.`, {traps:[v[i]+v[j], v[i]-v[j]+1, Math.abs(v[(i+1)%5]-v[j])]});
     const tot=v.reduce((a,b)=>a+b,0); return Q("num",`${tb}How many marbles do the five children have <b>altogether</b>?`, tot, tot, `${v.join(" + ")} = <b>${tot}</b>.`, {traps:[tot+10, tot-10, Math.round(tot/5)]}); }
   if(t==="picto"){ const k=pick([2,4,10]), days=["Monday","Tuesday","Wednesday","Thursday","Friday"], halves=days.map(()=>ri(2,11)), counts=halves.map(h=>h*k/2), ico=half=>`<svg class="pico" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">${half?'<path d="M8 1 A7 7 0 0 0 8 15 Z"/><circle cx="8" cy="8" r="6.5" class="ring"/>':'<circle cx="8" cy="8" r="7"/>'}</svg>`, sym=h=>ico(false).repeat(Math.floor(h/2))+(h%2?ico(true):"")+`<span class="sl">${h/2} symbols</span>`;
     let i,j; do{ i=ri(0,4); j=ri(0,4); }while(counts[i]<=counts[j]);
     const tb=`<table class="mini"><tr><th colspan="2">Children who borrowed library books &nbsp; (${ico(false)} = ${k} children, ${ico(true)} = ${k/2})</th></tr>${days.map((d,x)=>`<tr><td>${d}</td><td class="pic">${sym(halves[x])}</td></tr>`).join("")}</table>`;
     return Q("num",`${tb}How many <b>more</b> children borrowed books on <b>${days[i]}</b> than on <b>${days[j]}</b>?`, counts[i]-counts[j], counts[i]-counts[j], `${days[i]}: ${halves[i]/2} symbols × ${k} = ${counts[i]}. ${days[j]}: ${halves[j]/2} symbols × ${k} = ${counts[j]}. Difference: <b>${counts[i]-counts[j]}</b>.`, {traps:[(halves[i]-halves[j])/2, counts[i], counts[i]-counts[j]+k/2]}); }
   if(t==="avgadd"){ const n=ri(4,9), A=ri(60,80), A2=A+ri(1,4), M=A2*(n+1)-n*A;
     return Q("num",`The average mark of <b>${n} students</b> in a test is <b>${A}</b>. A new student who scored <b>${M}</b> joins the group. What is the new average?`, A2, A2, `Total for ${n} students: ${n} × ${A} = ${n*A}. Add ${M}: ${n*A+M}. New average: ${n*A+M} ÷ ${n+1} = <b>${A2}</b>.`, {traps:[Math.round((A+M)/2), A+1, A2+1]}); }
   if(t==="avgremove"){ const A=ri(20,50); let B; do{ B=A+ri(-6,6); }while(B===A); const R=5*A-4*B;
     return Q("num",`The average of <b>5 numbers</b> is <b>${A}</b>. When one number is removed, the average of the remaining 4 is <b>${B}</b>. Which number was removed?`, R, R, `Total of 5: 5 × ${A} = ${5*A}. Total of 4: 4 × ${B} = ${4*B}. Removed: ${5*A} − ${4*B} = <b>${R}</b>.`, {traps:[Math.abs(A-B), A+B, 5*A-B]}); }
   let f; do{ f=[ri(1,8),ri(2,9),ri(2,9),ri(1,7),ri(1,5)]; }while(f.reduce((a,b)=>a+b,0)%2===0);
   const sizes=[1,2,3,4,5], N=f.reduce((a,b)=>a+b,0), mid=(N+1)/2; let c=0, med=0; for(let i=0;i<5;i++){ c+=f[i]; if(c>=mid){ med=sizes[i]; break; } }
   const tb=`<table class="mini"><tr><th>Shoe size</th>${sizes.map(s=>`<td>${s}</td>`).join("")}</tr><tr><th>Children</th>${f.map(x=>`<td>${x}</td>`).join("")}</tr></table>`;
   return Q("num",`${tb}This table shows the shoe sizes of ${N} children. What is the <b>median</b> shoe size?`, med, med, `There are ${N} children, so the median is the ${ord(mid)} child when they are put in order. Running totals: ${f.map((x,i)=>`size ${i+1}: ${f.slice(0,i+1).reduce((a,b)=>a+b,0)}`).join(", ")}. The ${ord(mid)} child wears size <b>${med}</b>.`, {traps:[sizes[f.indexOf(Math.max(...f))], 3, med===5?4:med+1]});
 }}
];
