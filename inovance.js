/* Inovance SV670-INT, official Korean catalog pp.7, 13-14, 36-37.
   Explicit pair whitelist; no extrapolation for unsupported models. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const drives = [
    ['S1R6',200,['05B30CB','10B30CB','20B30CB'],['H1','H4']],
    ['S2R8',400,['40B30CB'],['H1','H4']],
    ['S5R5',750,['55B30CB','75B30CB'],['H1','H4']],
    ['S7R6',1000,['10C30CB','85B15CB'],['H1','H2','H3','H4']],
    ['S012',1500,['15C30CB','13C15CB'],['H2','H3']],
    ['S018',2000,['20C30CB','18C15CB'],['H2','H3']],
    ['S022',3000,['25C30CB','30C30CB','29C15CB'],['H2','H3']],
    ['S027',5000,['40C30CB','50C30CB','44C15CB'],['H2','H3']],
    ['T3R5',1000,['10C30CD','85B15CD'],['H2','H3']],
    ['T5R4',1500,['15C30CD','13C15CD'],['H2','H3']],
    ['T8R4',2500,['20C30CD','25C30CD','18C15CD'],['H2','H3']],
    ['T012',3000,['30C30CD','29C15CD'],['H2','H3']],
    ['T017',4400,['40C30CD','44C15CD'],['H2','H3']],
    ['T021',5500,['50C30CD','55C15CD'],['H2','H3']],
    ['T026',7500,['75C15CD'],['H3']]
  ];
  // Exact allowed family + base model, matching catalog pairing table.
  const combos = {
    S1R6:['H1:05B30CB','H1:10B30CB','H1:20B30CB','H4:05B30CB','H4:10B30CB','H4:20B30CB'],
    S2R8:['H1:40B30CB','H4:40B30CB'],
    S5R5:['H1:55B30CB','H1:75B30CB','H4:55B30CB','H4:75B30CB'],
    S7R6:['H1:10C30CB','H2:10C30CB','H3:85B15CB','H4:10C30CB'],
    S012:['H2:15C30CB','H3:13C15CB'],
    S018:['H2:20C30CB','H3:18C15CB'],
    S022:['H2:25C30CB','H2:30C30CB','H3:29C15CB'],
    S027:['H2:40C30CB','H2:50C30CB','H3:44C15CB'],
    T3R5:['H2:10C30CD','H3:85B15CD'],
    T5R4:['H2:15C30CD','H3:13C15CD'],
    T8R4:['H2:20C30CD','H2:25C30CD','H3:18C15CD'],
    T012:['H2:30C30CD','H3:29C15CD'],
    T017:['H2:40C30CD','H3:44C15CD'],
    T021:['H2:50C30CD','H3:55C15CD'],
    T026:['H3:75C15CD']
  };
  const kw = base => Number(base.slice(0,2)) * (base[2]==='C'?100:10)/1000;
  const motorNames = [...new Set(Object.values(combos).flat())];
  function getDriveCode(){return $('ivDrive').value.match(/^SV670[PN]([ST](?:\d{3}|\dR\d))I(?:-FS)?-INT$/)?.[1];}
  function populateDrives(){
    const previous=$('ivDrive').value;
    $('ivDrive').innerHTML=drives.map(d=>`<option value="SV670${$('ivSeries').value}${d[0]}I-FS-INT">SV670${$('ivSeries').value}${d[0]}I-FS-INT</option>`).join('');
    if([...$('ivDrive').options].some(o=>o.value===previous)) $('ivDrive').value=previous;
    else $('ivDrive').value=`SV670${$('ivSeries').value}S018I-FS-INT`;
    populateMotors();
  }
  function populateMotors(){
    const family=$('ivFamily').value;
    const previous=$('ivMotor').value;
    const options=motorNames.filter(s=>s.startsWith(family+':')).map(s=>{
      const base=s.split(':')[1];
      // 0: no oil seal/no brake; 1: oil seal/no brake; 2: brake; 4: brake + oil seal
      return [0,1,2,4].map(opt=>`MS1${family}-${base}-A33${opt}R`);
    }).flat();
    $('ivMotor').innerHTML=options.map(s=>`<option value="${s}">${s}</option>`).join('');
    $('ivMotor').value=options.includes(previous)?previous:(options.find(x=>x==='MS1H3-18C15CB-A331R')||options[0]||'');
    calculate();
  }
  function calculate(){
    const drive=$('ivDrive').value, model=$('ivMotor').value, code=getDriveCode();
    const match=model.match(/^MS1(H[1-4])-(\d{2}[BC]\d{2}[BC][BD])-A33([0124])R(?:-INT)?$/);
    const fail=(msg)=>{
      $('ivStatus').innerHTML=`<span class="bad">${msg}</span>`;
      ['ivPower','ivEncoder'].forEach(id=>{$(id).textContent='선정 불가';$(id).className='pn bad';});
      $('ivPowerMeta').textContent='';$('ivEncoderMeta').textContent='';
      $('ivPair').textContent=`${drive} / ${model}`;
      $('ivSpec').textContent='-';$('ivBasis').textContent='SV670-INT 카탈로그 조합표 확인 필요';
    };
    if(!match || !code) return fail('모델명 형식을 확인하십시오.');
    const [,family,base,option]=match, power=kw(base), brake=['2','4'].includes(option);
    if(!(combos[code]||[]).includes(`${family}:${base}`)) return fail('공식 조합표에 없는 드라이브·모터 조합입니다.');
    if($('ivFlex').value==='flex') return fail('가동형 케이블은 첨부 카탈로그에 품번이 없어 선정하지 않습니다.');
    let group;
    if(['H1','H4'].includes(family)) {
      // H1/H4 front/rear cable exits differ; default front only requires explicit verification.
      return fail('H1/H4는 전방/후방 출선형 확인이 필요합니다. H2/H3 우선 지원.');
    }
    if(family==='H2') group=power<=3?'111':power<=5?'011':null;
    else if(family==='H3') group=power<=1.8?'111':power===2.9?'112':power>=4.4?'022':null;
    if(!group) return fail('해당 모터 용량의 파워 케이블 선정표가 없습니다.');
    const L=Number($('ivLength').value).toFixed(1);
    const p=`S6-L-${brake?'B':'M'}${group}-${L}-INT`;
    const e=`S6-L-P121-${L}-INT`;
    $('ivStatus').innerHTML='<span class="ok">공식 조합표 일치 · 케이블 선정 완료</span>';
    $('ivPower').textContent=p;$('ivPower').className='pn ok';
    $('ivEncoder').textContent=e;$('ivEncoder').className='pn ok';
    $('ivPowerMeta').textContent=`${brake?'브레이크 있음':'브레이크 없음'} · 비가동형 · ${L}m · 카탈로그 36~37페이지`;
    $('ivEncoderMeta').textContent=`A3 23비트 멀티턴 엔코더 · ${$('ivEncoderMode').value==='incremental'?'배터리 미사용 증분식 운전':'배터리 사용 절대치 운전'} · 카탈로그 37페이지`;
    $('ivPair').textContent=`${drive} / ${model}`;
    $('ivSpec').textContent=`MS1${family} · ${power}kW · ${base.endsWith('B')?'200V':'400V'} · ${brake?'브레이크 있음':'브레이크 없음'} · ${['1','4'].includes(option)?'오일실 있음':'오일실 없음'}`;
    $('ivBasis').textContent='SV670-INT 공식 카탈로그: 7p 모델명 규칙, 13~14p 드라이브/모터 조합, 36~37p 파워/엔코더 케이블';
  }
  $('brand').addEventListener('change',()=>{
    const iv=$('brand').value==='inovance';
    $('deltaPanel').style.display=iv?'none':'block';
    $('inovancePanel').style.display=iv?'block':'none';
    if(iv)calculate();
  });
  $('ivSeries').addEventListener('change',populateDrives);
  $('ivFamily').addEventListener('change',populateMotors);
  ['ivDrive','ivMotor','ivLength','ivFlex','ivEncoderMode'].forEach(id=>$(id).addEventListener('change',calculate));
  [['ivCopyPower','ivPower'],['ivCopyEncoder','ivEncoder']].forEach(([button,target])=>{
    $(button).addEventListener('click',()=>{
      const v=$(target).textContent;
      if(v.startsWith('S6-L-')) navigator.clipboard?.writeText(v);
    });
  });
  populateDrives();
})();
