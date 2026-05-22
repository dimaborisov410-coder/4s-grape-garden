function printPDF(){
  const details=document.querySelectorAll('details');
  const wasOpen=Array.from(details).map(d=>d.open);
  details.forEach(d=>d.open=true);
  window.print();
  setTimeout(()=>details.forEach((d,i)=>d.open=wasOpen[i]),500);
}
function showPage(id,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('visible'));
  document.getElementById('page-'+id).classList.add('visible');
  const mw=document.querySelector('.main-wrap');if(mw)mw.scrollTop=0;
  document.querySelectorAll('.nav-item,.bot-tab').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  document.querySelectorAll('.bot-tab').forEach(b=>{
    if(b.getAttribute('onclick')&&b.getAttribute('onclick').includes("'"+id+"'"))b.classList.add('active');
  });
}
function toggleTask(cb){
  const item=cb.closest('.task-item');
  const txt=item.querySelector('.task-text');
  if(cb.checked){item.classList.add('done');txt.classList.add('done-txt');item.classList.remove('warn','danger');}
  else{item.classList.remove('done');txt.classList.remove('done-txt');}
}
/* ── Расчёт слепой трубки ── */
function initTubeCalc(){
  const tbl=document.querySelector('#page-blocks .t');
  if(!tbl)return;
  // добавить заголовки
  const hrow=tbl.querySelector('thead tr');
  hrow.insertAdjacentHTML('beforeend','<th>Стартов<br><small style="font-weight:400;color:rgba(255,255,255,.42)">шт.</small></th><th>Трубки Ø16<br><small style="font-weight:400;color:rgba(255,255,255,.42)">м</small></th>');
  // добавить ячейки в каждую строку данных
  const rows=tbl.querySelectorAll('tbody tr:not(.t-total)');
  rows.forEach((row,i)=>{
    const n=i+1;
    row.insertAdjacentHTML('beforeend',
      `<td class="num"><input type="number" class="starter-input" id="st-${n}" min="0" placeholder="—" oninput="calcTube(${n})"></td>`+
      `<td class="num" id="tube-${n}" style="color:#1565c0;font-weight:700">—</td>`
    );
  });
  // добавить итоговые ячейки
  const tot=tbl.querySelector('tbody .t-total');
  tot.insertAdjacentHTML('beforeend',
    '<td class="num"><b id="tube-tot-st">—</b></td><td class="num" style="color:#1565c0"><b id="tube-tot-m">—</b></td>'
  );
  loadTubeData();
}
function calcTube(n){
  const inp=document.getElementById('st-'+n);
  const v=parseInt(inp.value)||0;
  const cell=document.getElementById('tube-'+n);
  cell.textContent=v?(v*1.5).toFixed(1)+' м':'—';
  if(v) localStorage.setItem('grape_st_'+n,v);
  else localStorage.removeItem('grape_st_'+n);
  updateTubeTotals();
}
function updateTubeTotals(){
  let totSt=0,totM=0,filled=0;
  for(let i=1;i<=24;i++){
    const v=parseInt((document.getElementById('st-'+i)||{}).value)||0;
    totSt+=v; totM+=v*1.5; if(v>0)filled++;
  }
  const fmtM=n=>n>=1000?(n/1000).toFixed(2)+' км':n.toFixed(0)+' м';
  document.getElementById('tube-tot-st').textContent=totSt||'—';
  document.getElementById('tube-tot-m').textContent=totM?fmtM(totM):'—';
  document.getElementById('tsc-filled').textContent=filled+'/24';
  document.getElementById('tsc-filled').style.color=filled===24?'#2e7d32':filled>0?'#e65100':'#888';
  document.getElementById('tsc-starters').textContent=totSt||'—';
  document.getElementById('tsc-meters').textContent=totM?fmtM(totM):'—';
}
function loadTubeData(){
  const preset={1:69,2:96,3:109};
  const rows=document.querySelectorAll('#page-blocks .t tbody tr:not(.t-total)');
  rows.forEach((row,i)=>{
    const n=i+1;
    const saved=localStorage.getItem('grape_st_'+n);
    const el=document.getElementById('st-'+n);
    if(!el)return;
    if(saved!==null){el.value=saved;}
    else if(preset[n]){el.value=preset[n];}
    else{const def=parseInt(row.cells[3].textContent.trim())||0;el.value=def||'';}
    calcTube(n);
  });
}
document.addEventListener('DOMContentLoaded',initTubeCalc);
document.addEventListener('DOMContentLoaded',function(){
  var el=document.getElementById('ops-date');
  if(el)el.textContent=new Date().toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'});
});
/* ── Карта поля ── */
const _SHC={1:'#1b5e20',2:'#1565c0',3:'#00695c',4:'#4527a0',5:'#e65100',6:'#f57f17',7:'#c62828',8:'#ad1457',9:'#558b2f',10:'#00838f',11:'#6a1b9a'};
const _SHN={1:'Смена 1',2:'Смена 2',3:'Смена 3',4:'Смена 4',5:'Смена 5',6:'Смена 6',7:'Смена 7',8:'Смена 8',9:'Смена 9',10:'Смена 10',11:'Смена 11'};
const _VCC={'v-sauv':'#1565c0','v-chard':'#2e7d32','v-merl':'#bf360c','v-cabsauv':'#b71c1c','v-pinb':'#4527a0','v-pinn':'#880e4f','v-malb':'#4e342e','v-cabfr':'#f57f17','v-mix':'#004d40'};
const _VCN={'v-sauv':'Совиньон б.','v-chard':'Шардоне','v-merl':'Мерло','v-cabsauv':'Каб. Сов.','v-pinb':'Пино б.','v-pinn':'Пино ч.','v-malb':'Мальбек','v-cabfr':'Каб. Фран','v-mix':'Пино Менье'};
const _VA={'v-sauv':'Саув','v-chard':'Шард','v-merl':'Мерло','v-cabsauv':'КС','v-pinb':'ПБ','v-pinn':'ПЧ','v-malb':'Малб','v-cabfr':'КФ','v-mix':'Микс'};
const _PRV={1:'34→25',2:'27→25',3:'32→25',4:'46→26',5:'45→25',6:'48→25',7:'47→26',8:'45→25',9:'46→26',10:'46→25',11:'46→25',12:'49→25',13:'48→25',14:'45→25',15:'45→25',16:'44→25',17:'44→25',18:'47→25',19:'37→25',20:'39→25',21:'35→25',22:'37→25',23:'32→25',24:'35→25'};
const _BD=[
  {n:1, r:0,c:2,area:1.70,flow:55, lat:69, sh:3, v:'Совиньон белый',    vc:'v-sauv'},
  {n:2, r:0,c:1,area:2.37,flow:77, lat:96, sh:2, v:'Совиньон белый',    vc:'v-sauv'},
  {n:3, r:0,c:0,area:2.70,flow:88, lat:109,sh:1, v:'Совиньон белый',    vc:'v-sauv'},
  {n:4, r:7,c:2,area:2.04,flow:67, lat:69, sh:11,v:'Пино белый',        vc:'v-pinb'},
  {n:5, r:7,c:1,area:2.85,flow:93, lat:96, sh:9, v:'Пино чёрный',       vc:'v-pinn'},
  {n:6, r:7,c:0,area:3.24,flow:105,lat:109,sh:8, v:'Мерло',             vc:'v-merl'},
  {n:7, r:6,c:0,area:3.24,flow:105,lat:109,sh:8, v:'Мерло',             vc:'v-merl'},
  {n:8, r:6,c:1,area:2.85,flow:93, lat:96, sh:9, v:'Пино Менье/Кокур', vc:'v-mix'},
  {n:9, r:6,c:2,area:2.04,flow:67, lat:69, sh:10,v:'Шардоне',           vc:'v-chard'},
  {n:10,r:5,c:2,area:1.36,flow:44, lat:69, sh:7, v:'Шардоне',           vc:'v-chard'},
  {n:11,r:5,c:1,area:1.90,flow:62, lat:96, sh:6, v:'Шардоне',           vc:'v-chard'},
  {n:12,r:5,c:0,area:2.16,flow:70, lat:109,sh:6, v:'Пино белый',        vc:'v-pinb'},
  {n:13,r:4,c:0,area:2.16,flow:70, lat:109,sh:5, v:'Пино чёрный',       vc:'v-pinn'},
  {n:14,r:4,c:2,area:1.36,flow:44, lat:69, sh:5, v:'Мерло',             vc:'v-merl'},
  {n:15,r:4,c:1,area:1.90,flow:62, lat:96, sh:5, v:'Каберне Совиньон',  vc:'v-cabsauv'},
  {n:16,r:3,c:2,area:1.36,flow:44, lat:69, sh:4, v:'Каберне Совиньон',  vc:'v-cabsauv'},
  {n:17,r:3,c:1,area:1.90,flow:62, lat:96, sh:4, v:'Шардоне',           vc:'v-chard'},
  {n:18,r:3,c:0,area:2.16,flow:70, lat:109,sh:4, v:'Шардоне',           vc:'v-chard'},
  {n:19,r:2,c:0,area:2.62,flow:85, lat:109,sh:1, v:'Шардоне',           vc:'v-chard'},
  {n:20,r:2,c:2,area:1.65,flow:54, lat:69, sh:3, v:'Пино белый',        vc:'v-pinb'},
  {n:21,r:2,c:1,area:2.30,flow:75, lat:96, sh:2, v:'Пино чёрный',       vc:'v-pinn'},
  {n:22,r:1,c:2,area:1.70,flow:55, lat:69, sh:3, v:'Мальбек',           vc:'v-malb'},
  {n:23,r:1,c:1,area:2.37,flow:77, lat:96, sh:2, v:'Мальбек',           vc:'v-malb'},
  {n:24,r:1,c:0,area:2.70,flow:88, lat:109,sh:1, v:'Каберне Фран',      vc:'v-cabfr'},
];
function _mapHL(){
  const hl=['pipes','valves','drip'].some(l=>{
    const b=document.querySelector('.map-lbtn[onclick*="\''+l+'\'"]');
    return b&&b.classList.contains('active');
  });
  document.querySelectorAll('#map-svg-wrap .blk').forEach(g=>{
    const k=Array.from(g.children);
    if(k[0]) k[0].style.opacity=hl?'0.28':'0.9';   // фон блока
    if(k[1]) k[1].style.opacity=hl?'0.38':'1';      // полоска сорта
    k.slice(6).forEach(el=>el.style.opacity=hl?'0.32':'1'); // текст + шильдики
  });
}
function toggleMapLayer(id,btn){
  btn.classList.toggle('active');
  const show=btn.classList.contains('active');
  document.querySelectorAll('[data-layer="'+id+'"]').forEach(el=>{el.style.display=show?'':'none';});
  _mapHL();
}
function initMap(){
  const CX=[40,344,613],CW=[302,267,192];
  const RY=[40,152,264,373,463,553,643,777],RH=[110,110,107,88,88,88,132,132];
  const F='font-family="Segoe UI,Tahoma,sans-serif"';
  const SUB1X=343; // субколлектор между col0 и col1
  const MH=5;     // высота горизонтального коллектора px
  let s='<svg viewBox="0 0 855 970" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:0 auto">';
  s+='<style>.blk>rect{transition:opacity .2s}</style>';
  s+='<rect width="855" height="970" fill="#dde8dd"/>';
  s+='<rect x="28" y="28" width="799" height="914" fill="none" stroke="#4a7c4a" stroke-width="1.5" rx="2"/>';
  // column labels
  ['272 м · 109 рядов','240 м · 96 рядов','173 м · 69 рядов'].forEach((lbl,i)=>{
    s+=`<text x="${CX[i]+CW[i]/2}" y="20" text-anchor="middle" font-size="10" fill="#555" font-weight="600" ${F}>${lbl}</text>`;
  });

  // ── СЛОЙ: ТРУБЫ (main distribution network, behind blocks) ──
  s+='<g data-layer="pipes">';
  s+='<line x1="31" y1="40" x2="31" y2="920" stroke="#1565c0" stroke-width="5" opacity=".85"/>'; // left PE110·831m
  s+='<line x1="824" y1="40" x2="824" y2="920" stroke="#1565c0" stroke-width="5" opacity=".85"/>'; // right PE110·834m
  s+='<line x1="40" y1="932" x2="815" y2="932" stroke="#1565c0" stroke-width="5" opacity=".85"/>'; // bottom PE110·710m
  // sub-main for col1 (gap between col0 and col1)
  s+=`<line x1="${SUB1X}" y1="40" x2="${SUB1X}" y2="932" stroke="#1565c0" stroke-width="2.5" stroke-dasharray="7,4" opacity=".6"/>`;
  s+=`<text x="${SUB1X-9}" y="115" text-anchor="middle" font-size="7" fill="#1565c0" font-weight="700" transform="rotate(-90,${SUB1X-9},115)" ${F}>ПЭ 110</text>`;
  // горизонтальные ответвления от магистралей к коллектору каждого блока
  _BD.forEach(b=>{
    const x=CX[b.c],y=RY[b.r],w=CW[b.c],h=RH[b.r];
    const mY=y+h-MH/2; // центр горизонтального коллектора по Y
    if(b.c===0){
      s+=`<line x1="31" y1="${mY}" x2="${x}" y2="${mY}" stroke="#1565c0" stroke-width="2.2" opacity=".75"/>`;
      s+=`<polygon points="36,${mY-3} 36,${mY+3} 40,${mY}" fill="#1565c0" opacity=".9"/>`;
    } else if(b.c===2){
      s+=`<line x1="${x+w}" y1="${mY}" x2="824" y2="${mY}" stroke="#1565c0" stroke-width="2.2" opacity=".75"/>`;
      s+=`<polygon points="${x+w},${mY} ${x+w+3},${mY-3} ${x+w+3},${mY+3}" fill="#1565c0" opacity=".9"/>`;
    } else if(b.c===1){
      s+=`<line x1="${SUB1X}" y1="${mY}" x2="${x}" y2="${mY}" stroke="#1565c0" stroke-width="2.2" opacity=".75"/>`;
      s+=`<polygon points="${SUB1X},${mY-3} ${SUB1X},${mY+3} ${x},${mY}" fill="#1565c0" opacity=".9"/>`;
    }
  });
  s+='</g>';

  // НС-2 box + pipe labels (always visible)
  s+='<rect x="388" y="916" width="78" height="24" rx="5" fill="#1565c0"/>';
  s+=`<text x="427" y="932" text-anchor="middle" font-size="12" fill="#fff" font-weight="800" ${F}>НС-2</text>`;
  s+=`<text x="16" y="480" text-anchor="middle" font-size="8" fill="#1565c0" font-weight="700" transform="rotate(-90,16,480)" ${F}>ПЭ 110 · 831 м</text>`;
  s+=`<text x="840" y="480" text-anchor="middle" font-size="8" fill="#1565c0" font-weight="700" transform="rotate(-90,840,480)" ${F}>ПЭ 110 · 834 м</text>`;
  s+=`<text x="427" y="950" text-anchor="middle" font-size="9" fill="#1565c0" font-weight="600" ${F}>▶ ПЭ 110 · 710 м · Vmax 3,2 м/с → НС-2</text>`;
  // north arrow
  s+='<polygon points="832,38 836,52 832,48 828,52" fill="#888"/>';
  s+='<line x1="832" y1="38" x2="832" y2="58" stroke="#888" stroke-width="1.5"/>';
  s+=`<text x="832" y="67" text-anchor="middle" font-size="9" fill="#888" font-weight="700" ${F}>С</text>`;

  // ── БЛОКИ ──
  _BD.forEach(b=>{
    const x=CX[b.c],y=RY[b.r],w=CW[b.c],h=RH[b.r];
    const cx=x+w/2,cy=y+h/2;
    const fc=_SHC[b.sh],vc=_VCC[b.vc]||'#888';
    const abbr=_VA[b.vc]||'?';
    const tube=(b.lat*1.5).toFixed(0);
    const big=h>=100;
    const ny=big?cy-14:cy-12;
    const lft=(b.c!==2); // вход коллектора слева col0,col1; справа col2
    // Ряды ВЕРТИКАЛЬНЫЕ: от y+5 (под полоской сорта) до y+h-MH (до коллектора)
    const rowY1=y+5;
    const rowY2=y+h-MH;

    s+=`<g class="blk" onclick="showBlockPopup(${b.n})">`;
    s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fc}" rx="2" opacity=".9"/>`;
    s+=`<rect x="${x}" y="${y}" width="${w}" height="5" fill="${vc}" rx="2"/>`;

    // ── СЛОЙ: РЯДЫ — вертикальные линии латералей Ø16мм ──
    const maxR=w>260?15:w>180?11:8;
    const nR=Math.min(b.lat,maxR);
    const rSpX=w/(nR+1);
    s+='<g data-layer="rows">';
    for(let i=1;i<=nR;i++){
      const rx=x+i*rSpX;
      s+=`<line x1="${rx}" y1="${rowY1}" x2="${rx}" y2="${rowY2}" stroke="rgba(255,255,255,0.42)" stroke-width="0.9"/>`;
      // седло 140×3/4" у коллектора (нижняя точка ряда)
      s+=`<circle cx="${rx}" cy="${rowY2}" r="1.8" fill="rgba(255,210,55,.9)" stroke="rgba(255,255,255,.4)" stroke-width=".4"/>`;
    }
    s+='</g>';

    // ── СЛОЙ: КАПЛЯ — пунктирная линия (METZER 2 л/ч шаг 0.5м) ──
    s+='<g data-layer="drip" style="display:none">';
    for(let i=1;i<=nR;i++){
      const rx=x+i*rSpX;
      s+=`<line x1="${rx}" y1="${rowY1}" x2="${rx}" y2="${rowY2}" stroke="rgba(255,215,0,.92)" stroke-width="1.4" stroke-dasharray="2,5"/>`;
    }
    s+='</g>';

    // ── СЛОЙ: ТРУБЫ — горизонтальный коллектор Ø50 внизу блока ──
    s+='<g data-layer="pipes">';
    s+=`<rect x="${x}" y="${y+h-MH}" width="${w}" height="${MH}" fill="#1565c0" rx="1" opacity=".9"/>`;
    s+=`<text x="${cx}" y="${y+h-1}" text-anchor="middle" font-size="5" fill="rgba(255,255,255,.55)" ${F}>Ø50</text>`;
    s+='</g>';

    // ── СЛОЙ: КЛАПАНЫ — К + PRV встроены в коллектор ──
    const vCY=y+h-MH/2;
    const vX=lft?x+5:x+w-5;   // клапан у входа
    const pX=lft?x+12:x+w-12; // PRV рядом
    s+='<g data-layer="valves">';
    s+=`<circle cx="${vX}" cy="${vCY}" r="3.2" fill="#ffb300" stroke="rgba(255,255,255,.85)" stroke-width=".6"/>`;
    s+=`<text x="${vX}" y="${vCY+1.2}" text-anchor="middle" font-size="3.5" fill="#fff" font-weight="900" font-family="Segoe UI,sans-serif">К</text>`;
    s+=`<circle cx="${pX}" cy="${vCY}" r="3.2" fill="#e53935" stroke="rgba(255,255,255,.85)" stroke-width=".6"/>`;
    s+=`<text x="${pX}" y="${vCY+1.2}" text-anchor="middle" font-size="2.8" fill="#fff" font-weight="700" font-family="Segoe UI,sans-serif">PRV</text>`;
    s+='</g>';

    // текстовые метки блока
    s+=`<text x="${cx}" y="${ny}" text-anchor="middle" fill="#fff" font-size="${big?24:18}" font-weight="900" ${F}>${b.n}</text>`;
    s+=`<text x="${cx}" y="${ny+14}" text-anchor="middle" fill="rgba(255,255,255,.9)" font-size="${big?12:10}" font-weight="700" ${F}>${abbr}</text>`;
    s+=`<text x="${cx}" y="${ny+26}" text-anchor="middle" fill="rgba(255,255,255,.75)" font-size="9" ${F}>${b.area}га · ${b.lat}р · ${tube}м</text>`;
    // шильдик смены — в противоположном углу от клапана
    if(h>=80){
      const sbX=lft?x+w-36:x+4;
      s+=`<rect x="${sbX}" y="${y+h-MH-17}" width="32" height="15" rx="7" fill="rgba(0,0,0,.3)"/>`;
      s+=`<text x="${sbX+16}" y="${y+h-MH-5}" text-anchor="middle" fill="#fff" font-size="9" font-weight="700" ${F}>С${b.sh}</text>`;
    }
    // метка диаметра клапана (2" или 3") над символом К
    {
      const vX2=lft?x+5:x+w-5;
      const vLbl=b.c===2?'2"':'3"';
      const vClr=b.c===2?'#42a5f5':'#ce93d8';
      s+=`<text x="${vX2}" y="${y+h-MH-5}" text-anchor="middle" font-size="5.5" fill="${vClr}" font-weight="800" ${F}>${vLbl}</text>`;
    }
    s+='</g>';
  });

  s+='</svg>';
  document.getElementById('map-svg-wrap').innerHTML=s;
  // легенды
  const usedSh=[...new Set(_BD.map(b=>b.sh))].sort((a,b)=>a-b);
  document.getElementById('map-leg-shifts').innerHTML=usedSh.map(sh=>`<div class="map-leg-item"><div class="map-leg-dot" style="background:${_SHC[sh]}"></div>${_SHN[sh]}</div>`).join('');
  const usedVc=[...new Map(_BD.map(b=>[b.vc,b])).values()];
  document.getElementById('map-leg-varieties').innerHTML=usedVc.map(b=>`<div class="map-leg-item"><div class="map-leg-dot" style="background:${_VCC[b.vc]}"></div>${_VCN[b.vc]}</div>`).join('');
  setTimeout(_mapHL,0);
}
function showBlockPopup(n){
  const b=_BD.find(x=>x.n===n); if(!b)return;
  const tube=(b.lat*1.5).toFixed(0);
  const prv=_PRV[n]||'—';
  const valve=b.c===2?'ПИОНЕР™ 2" (≤40 м³/ч)':'ПИОНЕР™ 3" (≤100 м³/ч)';
  const valveColor=b.c===2?'#1565c0':'#6a1b9a';
  const rowLen=(b.area*10000/(b.lat*2.5)).toFixed(0);
  document.getElementById('map-popup-content').innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
      <div style="width:48px;height:48px;border-radius:10px;background:${_SHC[b.sh]};display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:900;flex-shrink:0">${n}</div>
      <div>
        <div style="font-size:17px;font-weight:800;color:#111">Блок ${n} · ${b.area} га</div>
        <div style="font-size:12px;color:#555;margin-top:2px">${b.v} · ${_SHN[b.sh]}</div>
      </div>
    </div>
    <div style="background:#fff3e0;border:1.5px solid #ff6f00;border-radius:8px;padding:10px 12px;margin-bottom:10px">
      <div style="font-size:11px;font-weight:800;color:#bf360c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">🔧 Монтажные данные</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:13px;color:#222">
        <div><span style="color:#555;font-size:11px">Рядов (латераль Ø16)</span><div style="font-weight:800">${b.lat} шт.</div></div>
        <div><span style="color:#555;font-size:11px">Длина ряда ≈</span><div style="font-weight:800">${rowLen} м</div></div>
        <div><span style="color:#555;font-size:11px">Слепая трубка (1,5 м/ряд)</span><div style="font-weight:800">${tube} м</div></div>
        <div><span style="color:#555;font-size:11px">Стартков / Сёдел</span><div style="font-weight:800">${b.lat} шт.</div></div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
      <div style="background:#e8f5e9;border-radius:8px;padding:9px 10px">
        <div style="font-size:10px;color:#2e7d32;font-weight:700;text-transform:uppercase">Клапан</div>
        <div style="font-size:13px;font-weight:800;color:${valveColor};margin-top:3px">${valve}</div>
      </div>
      <div style="background:#fce4ec;border-radius:8px;padding:9px 10px">
        <div style="font-size:10px;color:#880e4f;font-weight:700;text-transform:uppercase">PRV вх → вых</div>
        <div style="font-size:13px;font-weight:800;color:#880e4f;margin-top:3px">${prv} м</div>
      </div>
      <div style="background:#e3f2fd;border-radius:8px;padding:9px 10px">
        <div style="font-size:10px;color:#1565c0;font-weight:700;text-transform:uppercase">Расход</div>
        <div style="font-size:13px;font-weight:800;color:#1565c0;margin-top:3px">${b.flow} м³/ч</div>
      </div>
      <div style="background:#f3e5f5;border-radius:8px;padding:9px 10px">
        <div style="font-size:10px;color:#6a1b9a;font-weight:700;text-transform:uppercase">Смена полива</div>
        <div style="font-size:13px;font-weight:800;color:#6a1b9a;margin-top:3px">${_SHN[b.sh]}</div>
      </div>
    </div>
    <div style="font-size:12px;color:#555;border-top:1px solid #eee;padding-top:8px">
      <div style="display:flex;justify-content:space-between;padding:3px 0"><span>PRV-регулятор давления</span><b style="color:#222">1 шт.</b></div>
      <div style="display:flex;justify-content:space-between;padding:3px 0"><span>Заглушки восьмёрка Ø16</span><b style="color:#222">${b.lat} шт.</b></div>
    </div>`;
  document.getElementById('map-overlay').classList.add('show');
  document.getElementById('map-popup').classList.add('show');
}
function closeMapPopup(){
  document.getElementById('map-overlay').classList.remove('show');
  document.getElementById('map-popup').classList.remove('show');
}
document.addEventListener('DOMContentLoaded',initMap);

// ── QA SYSTEM ───────────────────────────────────────────────────────────────
const QA_DATA=[
  {id:'q1',pri:'green',status:'resolved',page:'Финансы',ask:'Закрыто 16.05.2026',
   title:'Сумма договора уточнена ✅',
   desc:'Договор №ГС-12-05 п.4.1: приблизительная стоимость 38 393 848,42 ₽ В Т.Ч. НДС 22% (= 6 923 480,86 ₽). Наценка на материалы не применяется. Ранее ошибочно указывалось 46 811 588 ₽ — цифра была неверной.',
   q:'Вопрос закрыт: договор предусматривает 38 393 848,42 ₽ (с НДС). Итоговая сумма уточняется по факту работ.'},
  {id:'q2',pri:'green',status:'resolved',page:'Оборудование',ask:'Ваня / СУЛАНЖ · Шпилев',
   title:'Стартконнекторы: подтверждено 2 300 шт. ✅',
   desc:'Заявка от Шпилёва (14.05.2026): стартконнекторов — 2 300 шт. Спецификация и монтажный список обновлены.',
   q:'Вопрос закрыт. Подтверждено заявкой Шпилёва от 14.05.2026 — 2 300 шт.'},
  {id:'q3',pri:'green',status:'resolved',page:'Оборудование',ask:'Ваня / СУЛАНЖ · Шпилев',
   title:'Слепая трубка: подтверждено 3 470 м ✅',
   desc:'Заявка от Шпилёва (14.05.2026): слепая трубка — 3 470 м. Спецификация обновлена.',
   q:'Вопрос закрыт. Подтверждено заявкой Шпилёва от 14.05.2026 — 3 470 м.'},
  {id:'q4',pri:'orange',page:'Блоки · Смена 1',ask:'Источник данных по блокам',
   title:'Площадь Смены 1: в графике 7,02 га, по блокам сумма 8,02 га',
   desc:'Блок 3 = 2,70 + Блок 19 = 2,62 + Блок 24 = 2,70 = 8,02 га. В графике смен указано 7,02 га.',
   q:'Какое значение верное — 7,02 или 8,02 га? Возможно, опечатка?'},
  {id:'q5',pri:'orange',page:'Блоки · Смена 2',ask:'Источник данных по блокам',
   title:'Площадь Смены 2: в графике 6,64 га, по блокам сумма 7,04 га',
   desc:'Блок 2 = 2,37 + Блок 21 = 2,30 + Блок 23 = 2,37 = 7,04 га. В графике смен указано 6,64 га.',
   q:'Какое значение верное — 6,64 или 7,04 га?'},
  {id:'q6',pri:'green',status:'resolved',page:'Оборудование · НС-2',ask:'Решено 15.05.2026',
   title:'НС-2: насосы Masdaf ✅ (решено 15.05.2026)',
   desc:'Решение принято: насосы НС-2 — Masdaf E-NMM 50-200 (шкаф ЧРП, 395 400+292 522=687 922 ₽) + NMM 65-250 (шкаф плавного пуска, 818 000+467 977=1 285 977 ₽). Поставщик: КвадроГрупп 8(918)943-36-74.',
   q:'Вопрос закрыт. Насосы Masdaf — решение принято 15.05.2026.'},
  {id:'q7',pri:'green',status:'resolved',page:'Блоки · KPI',ask:'Закрыто',
   title:'KPI: 260 м³/ч — округление принято ✅',
   desc:'Смена 1 (блоки 3+19+24): 88 + 85 + 88 = 261 м³/ч. Округление до 260 м³/ч принято намеренно.',
   q:'Вопрос закрыт. Округление до 260 м³/ч — норма.'},
  {id:'q8',pri:'green',status:'resolved',page:'Финансы · Реквизиты',ask:'Закрыто',
   title:'Реквизиты: добавлен блок для ЦБ-253 ✅',
   desc:'Добавлена отдельная карточка реквизитов для счёта ЦБ-253 (фильтры Aytok, 276 999,37 ₽) рядом с ЦБ-242. Получатель тот же — ООО "Системы Ирригации", назначение платежа разное.',
   q:'Вопрос закрыт. Реквизиты для ЦБ-253 добавлены на вкладку Финансы.'},
  {id:'q9',pri:'green',status:'resolved',page:'Насаждения · Квартал I',ask:'Закрыто',
   title:'Квартал I: итог и сумма совпадают — вопрос снят ✅',
   desc:'Сумма клеток 1–8: 2,2345+2,2072+2,2073+1,6862+1,8998+2,5342+3,1337+3,1338 = 19,0367 га. Итог в таблице: 19,0367 га — совпадает. Ошибка была в первоначальном подсчёте аудита.',
   q:'Вопрос закрыт — расчёт верный.'},
  {id:'q10',pri:'green',status:'resolved',page:'Документы / Финансы',ask:'Закрыто',
   title:'Номер договора подтверждён: №ГС-12-05 ✅',
   desc:'В договоре монтажа ООО «Гарден Сити» от 12.05.2026 везде указано «№___».',
   q:'Официальный номер договора: №ГС-12-05 от 12.05.2026. Обновлено в дашборде.'},
  {id:'q11',pri:'blue',page:'Блоки / Насаждения · Клетка 8',ask:'Магарач · Леновских М.А.',
   title:'Клетка 8: сорт не определён',
   desc:'Написано: «Пино Менье / Кокур / Ркацители / Глера». В блоках — «Пино Менье/Кокур» (без Глера и Ркацители).',
   q:'Какой сорт (или сорта) посажен в клетке 8? Какой подвой?'},
  {id:'q12',pri:'blue',page:'Блоки · Калькулятор',ask:'Ваня / СУЛАНЖ',
   title:'Калькулятор стартеров: блоки 4–24 не заполнены',
   desc:'В калькуляторе слепой трубки заполнены только блоки 1–3. Итоговый метраж неполный.',
   q:'Предоставить количество рядов (= стартеров) для блоков 4–24. Формула: метраж = рядов × 1,5 м.'},
  {id:'q13',pri:'blue',page:'Документы',ask:'Ваня / СУЛАНЖ',
   title:'Договор с ООО СУЛАНЖ не загружен',
   desc:'В реестре документов договор на монтаж с СУЛАНЖ отмечен как «Не загружен».',
   q:'Когда будет готов договор? Прислать скан/PDF для архива.'},
  {id:'q14',pri:'green',status:'resolved',page:'ТЗ · Оборудование',ask:'Решено 15.05.2026',
   title:'Капельница METZER 2 л/ч ✅ — принято по последней смете',
   desc:'Принято: расход капельницы 2 л/ч (METZER) согласно последнему сметному расчёту. ТЗ содержало устаревшие данные (1,6 л/ч). Смета является приоритетным документом.',
   q:'Вопрос закрыт. Капельница METZER 2 л/ч — подтверждено сметой 15.05.2026.'},
  {id:'q15',pri:'orange',page:'Задачи · Монтаж · Персонал',ask:'Шпилёв · СУЛАНЖ · Леха',
   title:'Нехватка персонала: нужно 60 чел. к 30.06.2026',
   desc:'По данным из рабочего чата (~20.05.2026): для монтажа к 30.06 нужно 30 чел. (капля) + 9 (магистраль) + 12 (латераль) + 9 (стройка) = 60 человек + 5 ед. техники. Сейчас на объекте 15 человек (4 монтажника СУЛАНЖ + 11 ГС). Дефицит ~45 человек.',
   q:'Как решается вопрос привлечения рабочей силы? Планируется ли продление рабочего дня за почасовую доплату?'},
  {id:'q16',pri:'orange',page:'Договор · Сроки',ask:'Шпилёв · АО Янтарный',
   title:'Сдвиг сроков: нужно перенести на месяц или не разделять оплаты',
   desc:'Из переписки Шпилёва: «Сроки нужно сдвигать на месяц, либо не разделять оплаты». Текущая дата сдачи: 25.08.2026. При сдвиге на месяц — 25.09.2026. Изменение потребует доп. соглашения к договору №ГС-12-05.',
   q:'Согласовано ли изменение сроков с АО «Янтарный»? Если да — нужно подписать доп. соглашение и обновить дату сдачи в дашборде.'},
];

function qaCardHtml(q){
  const status=localStorage.getItem('qa_status_'+q.id)||(q.status||'open');
  const ans=localStorage.getItem('qa_ans_'+q.id)||'';
  const done=status==='resolved';
  return `<div class="qa-card${done?' qa-resolved':''}" id="qa-card-${q.id}" data-status="${status}">
  <div class="qa-head">
    <div class="qa-dot ${q.pri}"></div>
    <span class="qa-page-tag">${q.page}</span>
    <span class="qa-ask-tag">кому: ${q.ask}</span>
    <span class="qa-status ${done?'resolved':'open'}">${done?'✅ Отвечено':'⬜ Открыт'}</span>
  </div>
  <div class="qa-body-wrap">
    <div class="qa-title">${q.title}</div>
    <div class="qa-desc">${q.desc}</div>
    <div class="qa-q">❓ ${q.q}</div>
    ${done&&ans?`<div class="qa-ans-label">Ответ:</div><div class="qa-ans-saved">${ans}</div>`:''}
    ${!done?`<div class="qa-ans-label">Записать ответ:</div>
    <textarea class="qa-textarea" id="qa-ta-${q.id}" placeholder="Введите ответ здесь…">${ans}</textarea>
    <div class="qa-actions">
      <button class="qa-save-btn" onclick="saveQaAnswer('${q.id}')">💾 Сохранить</button>
      <button class="qa-resolve-btn" onclick="resolveQa('${q.id}')">✅ Отмечено как отвечено</button>
    </div>`:`<div class="qa-actions"><button class="qa-reopen-btn" onclick="reopenQa('${q.id}')">↩ Переоткрыть</button></div>`}
  </div>
</div>`;
}

function initQa(){
  const list=document.getElementById('qa-list');
  if(list)list.innerHTML=QA_DATA.map(qaCardHtml).join('');
  updateQaKpi();
}

function saveQaAnswer(id){
  const ta=document.getElementById('qa-ta-'+id);
  if(!ta)return;
  const v=ta.value.trim();
  if(v)localStorage.setItem('qa_ans_'+id,v);
  else localStorage.removeItem('qa_ans_'+id);
  const btn=ta.closest('.qa-card').querySelector('.qa-save-btn');
  if(btn){const orig=btn.textContent;btn.textContent='✔ Сохранено';setTimeout(()=>btn.textContent=orig,1500);}
}

function resolveQa(id){
  const ta=document.getElementById('qa-ta-'+id);
  if(ta&&ta.value.trim())localStorage.setItem('qa_ans_'+id,ta.value.trim());
  localStorage.setItem('qa_status_'+id,'resolved');
  const card=document.getElementById('qa-card-'+id);
  const q=QA_DATA.find(x=>x.id===id);
  if(card&&q)card.outerHTML=qaCardHtml(q);
  updateQaKpi();
  const active=document.querySelector('.qf-btn.active');
  if(active)filterQa(active.getAttribute('data-filter')||'all',null);
}

function reopenQa(id){
  localStorage.setItem('qa_status_'+id,'open');
  const card=document.getElementById('qa-card-'+id);
  const q=QA_DATA.find(x=>x.id===id);
  if(card&&q)card.outerHTML=qaCardHtml(q);
  updateQaKpi();
}

function updateQaKpi(){
  const total=QA_DATA.length;
  const done=QA_DATA.filter(q=>(localStorage.getItem('qa_status_'+q.id)||(q.status||'open'))==='resolved').length;
  const open=total-done;
  const el=id=>document.getElementById(id);
  if(el('qa-cnt-open'))el('qa-cnt-open').textContent=open;
  if(el('qa-cnt-done'))el('qa-cnt-done').textContent=done;
  if(el('qa-cnt-all'))el('qa-cnt-all').textContent=total;
  const badge=el('qa-badge');
  if(badge){badge.textContent=open;badge.style.display=open?'':'none';}
}

function filterQa(type,btn){
  if(btn){document.querySelectorAll('.qf-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}
  document.querySelectorAll('.qa-card').forEach(card=>{
    const st=card.getAttribute('data-status');
    const hide=(type==='open'&&st==='resolved')||(type==='resolved'&&st==='open');
    card.classList.toggle('qa-hidden',hide);
  });
}

document.addEventListener('DOMContentLoaded',initQa);

// ── ROLE SWITCHER ─────────────────────────────────────────────────────────────
function setRole(role,btn){
  document.querySelectorAll('.role-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  else{const b=document.querySelector(`.role-btn[data-role="${role}"]`);if(b)b.classList.add('active');}

  document.querySelectorAll('[data-roles]').forEach(el=>{
    el.style.display=el.getAttribute('data-roles').split(' ').includes(role)?'':'none';
  });

  // Если текущая страница скрылась — переключить на первую видимую
  const activeNav=document.querySelector('.nav-item.active');
  if(activeNav&&activeNav.style.display==='none'){
    const visible=[...document.querySelectorAll('.nav-item[data-roles]')]
      .find(el=>el.getAttribute('data-roles').split(' ').includes(role));
    if(visible)visible.click();
  }

  localStorage.setItem('active_role',role);
}

document.addEventListener('DOMContentLoaded',()=>{
  const saved=localStorage.getItem('active_role')||'all';
  setRole(saved,null);
});
// ── END QA SYSTEM ────────────────────────────────────────────────────────────

// ── СЧЁТЧИК ДНЕЙ МОНТАЖА ─────────────────────────────────────────────────────
(function() {
  const CONTRACT_DAYS = 100;
  const START = new Date('2026-05-18T00:00:00'); // дата первого платежа
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.floor((today - START) / 86400000);
  const passed = Math.max(0, diff);
  const left   = Math.max(0, CONTRACT_DAYS - passed);
  const elP = document.getElementById('build-days-passed');
  const elL = document.getElementById('build-days-left');
  if (elP) elP.textContent = passed;
  if (elL) elL.textContent = left;
})();
// ── БРИГАДА ──────────────────────────────────────────────────────────────────
const CREW_DEFAULT = [
  { name: 'Костров Павел',       role: 'Монтажник', rate: 0, days: 0 },
  { name: 'Моисеенко Александр', role: 'Монтажник', rate: 0, days: 0 },
  { name: 'Божко Денис',         role: 'Монтажник', rate: 0, days: 0 },
  { name: 'Высидалко Максим',    role: 'Монтажник', rate: 0, days: 0 },
];
let crewData = JSON.parse(localStorage.getItem('crew_4s') || 'null') ?? JSON.parse(JSON.stringify(CREW_DEFAULT));

function crewRender() {
  const tbody = document.getElementById('crew-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  let totalDays = 0, totalSalary = 0;

  if (crewData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:rgba(255,255,255,.3);padding:24px;font-size:12px">Рабочих пока нет — добавьте через форму выше</td></tr>';
  } else {
    crewData.forEach((w, i) => {
      const days = w.days || 0;
      const salary = days * (w.rate || 0);
      totalDays += days;
      totalSalary += salary;
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td style="color:var(--text-dim);text-align:center">' + (i+1) + '</td>' +
        '<td><b>' + w.name + '</b></td>' +
        '<td style="color:var(--text-dim)">' + (w.role||'—') + '</td>' +
        '<td style="text-align:right"><input type="number" min="0" value="' + (w.rate||0) + '" style="width:80px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:5px;padding:4px 6px;color:#fff;font-size:12px;outline:none;text-align:right" onchange="crewSetRate(' + i + ',+this.value)"></td>' +
        '<td style="text-align:center"><input type="number" min="0" max="200" value="' + days + '" style="width:64px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:5px;padding:4px 6px;color:#fff;font-size:12px;outline:none;text-align:center" onchange="crewSetDays(' + i + ',+this.value)"></td>' +
        '<td style="text-align:right;font-weight:700;color:' + (salary > 0 ? '#81c784' : 'rgba(255,255,255,.38)') + '">' + salary.toLocaleString('ru') + ' ₽</td>' +
        '<td style="text-align:center"><button onclick="crewRemove(' + i + ')" style="background:none;border:none;cursor:pointer;color:rgba(255,255,255,.3);font-size:16px;line-height:1;padding:2px 6px" title="Удалить">×</button></td>';
      tbody.appendChild(tr);
    });
  }

  const fmt = n => n.toLocaleString('ru');
  document.getElementById('crew-count').textContent  = crewData.length;
  document.getElementById('crew-days').textContent   = totalDays;
  document.getElementById('crew-salary').textContent = fmt(totalSalary);
  document.getElementById('crew-avg').textContent    = crewData.length
    ? fmt(Math.round(crewData.reduce((s,w)=>s+(w.rate||0),0)/crewData.length))
    : '—';
  document.getElementById('crew-foot-days').textContent   = totalDays;
  document.getElementById('crew-foot-salary').textContent = fmt(totalSalary) + ' ₽';
}

function crewAdd() {
  const name = document.getElementById('crew-inp-name').value.trim();
  const role = document.getElementById('crew-inp-role').value.trim() || 'Монтажник';
  const rate = parseInt(document.getElementById('crew-inp-rate').value) || 0;
  if (!name) { document.getElementById('crew-inp-name').focus(); return; }
  crewData.push({ name, role, rate, days: 0 });
  localStorage.setItem('crew_4s', JSON.stringify(crewData));
  document.getElementById('crew-inp-name').value = '';
  document.getElementById('crew-inp-role').value = '';
  document.getElementById('crew-inp-rate').value = '';
  document.getElementById('crew-inp-name').focus();
  crewRender();
}

function crewSetDays(i, val) {
  crewData[i].days = Math.max(0, val || 0);
  localStorage.setItem('crew_4s', JSON.stringify(crewData));
  crewRender();
}

function crewSetRate(i, val) {
  crewData[i].rate = Math.max(0, val || 0);
  localStorage.setItem('crew_4s', JSON.stringify(crewData));
  crewRender();
}

function exportCrewXLS() {
  if (!crewData.length) { alert('Список бригады пуст'); return; }
  const date = new Date().toLocaleDateString('ru').replace(/\./g, '-');
  let html = '<html><head><meta charset="UTF-8"></head><body><table border="1" style="border-collapse:collapse;font-family:Arial;font-size:12px">';
  html += '<tr style="background:#1b5e20;color:#fff"><th>#</th><th>ФИО</th><th>Должность</th><th>Ставка, ₽/день</th><th>Дней</th><th>Итого, ₽</th></tr>';
  let totalDays = 0, totalSalary = 0;
  crewData.forEach((w, i) => {
    const days = w.days || 0;
    const salary = days * (w.rate || 0);
    totalDays += days; totalSalary += salary;
    html += '<tr><td style="text-align:center">' + (i+1) + '</td><td><b>' + w.name + '</b></td><td>' + (w.role||'—') + '</td>' +
      '<td style="text-align:right">' + (w.rate||0) + '</td>' +
      '<td style="text-align:center">' + days + '</td>' +
      '<td style="text-align:right">' + salary + '</td></tr>';
  });
  html += '<tr style="background:#f5f5f5;font-weight:bold"><td colspan="4" style="text-align:right">ИТОГО:</td>' +
    '<td style="text-align:center">' + totalDays + '</td>' +
    '<td style="text-align:right">' + totalSalary + '</td></tr>';
  html += '</table></body></html>';
  const blob = new Blob(['﻿' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '4S_Бригада_' + date + '.xls';
  a.click();
  URL.revokeObjectURL(a.href);
}

function crewRemove(i) {
  if (!confirm('Удалить «' + crewData[i].name + '»?')) return;
  crewData.splice(i, 1);
  localStorage.setItem('crew_4s', JSON.stringify(crewData));
  crewRender();
}

function crewClear() {
  if (!confirm('Очистить весь список? Данные о днях и ставках будут удалены.')) return;
  crewData = JSON.parse(JSON.stringify(CREW_DEFAULT));
  localStorage.removeItem('crew_4s');
  crewRender();
}

document.addEventListener('DOMContentLoaded', crewRender);
// ── END БРИГАДА ───────────────────────────────────────────────────────────────
