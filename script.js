import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const preloader=document.querySelector('.preloader');
window.addEventListener('load',()=>setTimeout(()=>preloader.classList.add('hide'),850));

// Custom cursor
const dot=document.querySelector('.cursor-dot'), ring=document.querySelector('.cursor-ring');
let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
function cursorLoop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(cursorLoop)}cursorLoop();
document.querySelectorAll('a,button,.magnetic-card,.expertise-item,.system-node').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('hover'));el.addEventListener('mouseleave',()=>ring.classList.remove('hover'))});

// Smooth magnetic links
if(matchMedia('(pointer:fine)').matches){document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.12,y=(e.clientY-r.top-r.height/2)*.12;el.style.transform=`translate(${x}px,${y}px)`});el.addEventListener('mouseleave',()=>el.style.transform='')})}

// Hero 3D construction wireframe
const holder=document.getElementById('hero-canvas');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,100);camera.position.set(5.8,3.4,8.5);camera.lookAt(1.1,1.5,0);
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);holder.appendChild(renderer.domElement);
const group=new THREE.Group();group.position.set(2.2,.1,0);scene.add(group);
const mat=new THREE.MeshBasicMaterial({color:0x6f6f6f,wireframe:true,transparent:true,opacity:.42});
const glowMat=new THREE.MeshBasicMaterial({color:0xff651f,wireframe:true,transparent:true,opacity:.32});
for(let i=0;i<6;i++){const w=1.8-(i*.13),d=1.35-(i*.08),h=.72;const geo=new THREE.BoxGeometry(w,h,d);const m=new THREE.Mesh(geo, i===2?glowMat:mat);m.position.y=i*.72;group.add(m);}
// columns
const colMat=new THREE.MeshBasicMaterial({color:0x777777,transparent:true,opacity:.5});
for(let x=-.8;x<=.8;x+=.8){for(let z=-.55;z<=.55;z+=1.1){const g=new THREE.BoxGeometry(.035,4.2,.035);const m=new THREE.Mesh(g,colMat);m.position.set(x,1.8,z);group.add(m)}}
// orange structural lines
for(let z of [-.65,.65]){const g=new THREE.BoxGeometry(2.3,.025,.025);const m=new THREE.Mesh(g,glowMat);m.position.set(0,2.25,z);group.add(m)}
const particleGeo=new THREE.BufferGeometry();const count=180;const arr=new Float32Array(count*3);for(let i=0;i<count;i++){arr[i*3]=(Math.random()-.5)*5;arr[i*3+1]=Math.random()*5;arr[i*3+2]=(Math.random()-.5)*3}particleGeo.setAttribute('position',new THREE.BufferAttribute(arr,3));const particles=new THREE.Points(particleGeo,new THREE.PointsMaterial({color:0xff651f,size:.018,transparent:true,opacity:.55}));group.add(particles);
let targetX=0,targetY=0;addEventListener('pointermove',e=>{targetX=(e.clientX/innerWidth-.5)*.45;targetY=(e.clientY/innerHeight-.5)*.25});
function animate(){requestAnimationFrame(animate);group.rotation.y+=(.08+targetX-group.rotation.y)*.012;group.rotation.x+=(targetY-group.rotation.x)*.012;group.position.y=.05+Math.sin(performance.now()*.00035)*.025;particles.rotation.y+=.0005;renderer.render(scene,camera)}animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

// Counters
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('[data-count]').forEach(el=>{if(el.dataset.done)return;el.dataset.done=1;const end=+el.dataset.count;let start=0;const step=()=>{start+=Math.max(1,Math.ceil(end/28));if(start>=end)start=end;el.textContent=end>=100?start+'+':start+'+';if(start<end)requestAnimationFrame(step)};step()})}})},{threshold:.4});observer.observe(document.querySelector('.stats-strip'));

// Active navigation
const sections=[...document.querySelectorAll('main section[id]')];const nav=[...document.querySelectorAll('.sidebar nav a')];const navObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){nav.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-40% 0px -50%'});sections.forEach(s=>navObs.observe(s));

// Scroll reveal
const revealObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.12});document.querySelectorAll('.section-head,.about-layout,.timeline-item,.project-card,.transform-title,.system-node,.expertise-item,.edu-card,.contact-inner').forEach(el=>{el.classList.add('reveal');revealObs.observe(el)});

// ------------------------------------------------------------
// Language switcher (EN / RU / KZ)
// ------------------------------------------------------------
const translations = {
  en: {
    'nav.home':'HOME','nav.about':'ABOUT','nav.experience':'EXPERIENCE','nav.projects':'PROJECTS','nav.transformation':'TRANSFORMATION','nav.education':'EDUCATION','nav.contact':'CONTACT','cv':'DOWNLOAD CV',
    'hero.eyebrow':'OPERATIONS. TECHNOLOGY. SCALE.','hero.desc':'Operations executive with <strong>15+ years</strong> of experience in construction, digital transformation and large-scale project delivery.','hero.cta':'DISCOVER MY WORK','hero.scroll':'SCROLL DOWN','hero.tag1':'STRUCTURE','hero.tag2':'OPERATIONS','hero.tag3':'INNOVATION',
    'stats.years':'YEARS EXPERIENCE','stats.projects':'MAJOR PROJECTS','stats.people':'PROFESSIONALS LED','stats.countries':'COUNTRIES',
    'about.kicker':'ABOUT ME','about.micro':'EXECUTIVE PROFILE','about.title':'DRIVING OPERATIONS.<br><span>DELIVERING RESULTS.</span>',
    'timeline.kicker':'CAREER TIMELINE','timeline.title':'15+ YEARS.<br><span>ONE OPERATING SYSTEM.</span>','timeline.note':'CAREER / 2012 — PRESENT',
    'projects.kicker':'SELECTED PROJECTS','projects.title':'BUILT AT<br><span>REAL SCALE.</span>','projects.note':'PROJECT INDEX / 09',
    'project.capital':'Residential development · Project leadership','project.atyrau':'Designed and constructed in 6 months.','project.balkhash':'Client: Samsung Engineering.','project.matrag':'Project for Tengizchevroil.','project.saudi':'Country director · international operations.','project.gpz':'Gas processing plant · 1 billion m³ annual capacity · Atyrau Region','project.pgu':'Combined-cycle power plant · 1,000 MW · Turkestan Region','project.assm':'Innovation and creativity center · 14,000 m² · 1,350 visitors/day · Almaty','project.polyclinic':'New-format clinic · 500 visits/shift · 12,700 m² · Shugyla, Almaty',
    'trans.kicker':'DIGITAL TRANSFORMATION','trans.title':'FROM COMPLEXITY<br><span>TO CONTROL.</span>','trans.desc':'Improving operational efficiency across companies through diagnostics, optimization, business-process reengineering and transformation.<br>Automation and adoption of new technologies.<br>Project management: schedule, budget and quality.<br>KPI implementation for companies and projects: P&amp;L, cash flow, production schedules, operational accounting and other management tools.<br>Lean Technology – Kaizen',
    'dash.kicker':'OPERATIONS CONTROL','dash.title':'EXECUTIVE<br><span>DASHBOARD.</span>','dash.live':'LIVE SYSTEM',
    'expertise.kicker':'EXPERTISE','education.kicker':'EDUCATION','education.title':'GLOBAL<br><span>OPERATING MINDSET.</span>','education.languages':'LANGUAGES',
    'contact.kicker':'CONTACT','contact.title':"LET'S BUILD<br><span>WHAT'S NEXT.</span>",'contact.desc':'Strategic leadership. Operational excellence. Digital transformation.','contact.open':'OPEN TO HIGH-IMPACT PROJECTS'
  },
  ru: {
    'nav.home':'ГЛАВНАЯ','nav.about':'О СЕБЕ','nav.experience':'ОПЫТ','nav.projects':'ПРОЕКТЫ','nav.transformation':'ТРАНСФОРМАЦИЯ','nav.education':'ОБРАЗОВАНИЕ','nav.contact':'КОНТАКТЫ','cv':'СКАЧАТЬ CV',
    'hero.eyebrow':'ОПЕРАЦИИ. ТЕХНОЛОГИИ. МАСШТАБ.','hero.desc':'Операционный руководитель с <strong>15+ годами</strong> опыта в строительстве, цифровой трансформации и реализации крупных проектов.','hero.cta':'СМОТРЕТЬ ПРОЕКТЫ','hero.scroll':'ЛИСТАТЬ ВНИЗ','hero.tag1':'СТРУКТУРА','hero.tag2':'ОПЕРАЦИИ','hero.tag3':'ИННОВАЦИИ',
    'stats.years':'ЛЕТ ОПЫТА','stats.projects':'КРУПНЫХ ПРОЕКТОВ','stats.people':'СПЕЦИАЛИСТОВ В КОМАНДАХ','stats.countries':'СТРАН',
    'about.kicker':'ОБО МНЕ','about.micro':'ПРОФИЛЬ РУКОВОДИТЕЛЯ','about.title':'УПРАВЛЯЮ ОПЕРАЦИЯМИ.<br><span>ДАЮ РЕЗУЛЬТАТ.</span>',
    'timeline.kicker':'КАРЬЕРНЫЙ ПУТЬ','timeline.title':'15+ ЛЕТ.<br><span>ЕДИНАЯ СИСТЕМА УПРАВЛЕНИЯ.</span>','timeline.note':'КАРЬЕРА / 2012 — НАСТОЯЩЕЕ ВРЕМЯ',
    'projects.kicker':'РЕАЛИЗОВАННЫЕ ПРОЕКТЫ.','projects.title':'РЕАЛИЗОВАННЫЕ<br><span>ПРОЕКТЫ.</span>','projects.note':'ИНДЕКС ПРОЕКТОВ / 09',
    'project.capital':'Жилая застройка · Руководство проектом','project.atyrau':'Спроектирован и построен за 6 месяцев.','project.balkhash':'Заказчик: Samsung Engineering.','project.matrag':'Проект для Тенгизшевройл.','project.saudi':'Руководитель направления · международные операции.','project.gpz':'Газоперерабатывающий завод · 1 млрд м³ в год · Атырауская область','project.pgu':'Парогазовая электростанция · 1 000 МВт · Туркестанская область','project.assm':'Центр инновационного творчества · 14 000 м² · 1 350 посетителей в день · Алматы','project.polyclinic':'Поликлиника нового формата · 500 посещений в смену · 12 700 м² · Шугыла, Алматы',
    'trans.kicker':'ЦИФРОВАЯ ТРАНСФОРМАЦИЯ','trans.title':'ОТ СЛОЖНОСТИ<br><span>К КОНТРОЛЮ.</span>','trans.desc':'Повышение операционной эффективности компаний<br>Диагностика, оптимизация, реинжиниринг и трансформация бизнес-процессов<br>Автоматизация и применение новых технологий.<br>Управление проектами: (Сроки, бюджет, качество)<br>Внедрение KPI Компании и проектов (БДР - Бюджет доходов и расходов, БДДС - Бюджет Движение Денежных Средств, ГПР – График Производства Работ, Оперативный учет и другие инструменты для управлении компаний)<br>Lean Technology – Kaizen',
    'dash.kicker':'ОПЕРАЦИОННЫЙ КОНТРОЛЬ','dash.title':'EXECUTIVE<br><span>DASHBOARD.</span>','dash.live':'СИСТЕМА ONLINE',
    'expertise.kicker':'ЭКСПЕРТИЗА','education.kicker':'ОБРАЗОВАНИЕ','education.title':'ГЛОБАЛЬНОЕ<br><span>УПРАВЛЕНЧЕСКОЕ МЫШЛЕНИЕ.</span>','education.languages':'ЯЗЫКИ',
    'contact.kicker':'КОНТАКТЫ','contact.title':'ИЗ ХАОСА<br><span>В СИСТЕМУ.</span>','contact.desc':'Стратегическое лидерство. Операционное превосходство. Цифровая трансформация.','contact.open':'ОТКРЫТ КРУПНЫМ ПРОЕКТАМ'
  },
  kz: {
    'nav.home':'БАСТЫ БЕТ','nav.about':'МЕН ТУРАЛЫ','nav.experience':'ТӘЖІРИБЕ','nav.projects':'ЖОБАЛАР','nav.transformation':'ТРАНСФОРМАЦИЯ','nav.education':'БІЛІМ','nav.contact':'БАЙЛАНЫС','cv':'CV ЖҮКТЕУ',
    'hero.eyebrow':'ОПЕРАЦИЯЛАР. ТЕХНОЛОГИЯ. АУҚЫМ.','hero.desc':'Құрылыс, цифрлық трансформация және ірі жобаларды іске асыру саласында <strong>15+ жыл</strong> тәжірибесі бар операциялық басшы.','hero.cta':'ЖОБАЛАРДЫ КӨРУ','hero.scroll':'ТӨМЕН ЖЫЛЖЫТУ','hero.tag1':'ҚҰРЫЛЫМ','hero.tag2':'ОПЕРАЦИЯЛАР','hero.tag3':'ИННОВАЦИЯ',
    'stats.years':'ЖЫЛ ТӘЖІРИБЕ','stats.projects':'ІРІ ЖОБА','stats.people':'БАСҚАРЫЛҒАН МАМАН','stats.countries':'ЕЛ',
    'about.kicker':'МЕН ТУРАЛЫ','about.micro':'БАСҚАРУШЫ ПРОФИЛІ','about.title':'ОПЕРАЦИЯЛАРДЫ БАСҚАРАМЫН.<br><span>НӘТИЖЕГЕ ЖЕТКІЗЕМІН.</span>',
    'timeline.kicker':'МАНСАП ЖОЛЫ','timeline.title':'15+ ЖЫЛ.<br><span>БІРТҰТАС БАСҚАРУ ЖҮЙЕСІ.</span>','timeline.note':'МАНСАП / 2012 — ҚАЗІРГІ УАҚЫТ',
    'projects.kicker':'ТАҢДАЛҒАН ЖОБАЛАР','projects.title':'НАҒЫЗ<br><span>АУҚЫМДА ЖАСАЛҒАН.</span>','projects.note':'ЖОБАЛАР ИНДЕКСІ / 09',
    'project.capital':'Тұрғын үй құрылысы · Жоба басшылығы','project.atyrau':'6 айда жобаланып, салынды.','project.balkhash':'Тапсырыс беруші: Samsung Engineering.','project.matrag':'Tengizchevroil жобасы.','project.saudi':'Ел директоры · халықаралық операциялар.','project.gpz':'Газ өңдеу зауыты · жылына 1 млрд м³ · Атырау облысы','project.pgu':'Бу-газ электр станциясы · 1 000 МВт · Түркістан облысы','project.assm':'Инновация және шығармашылық орталығы · 14 000 м² · күніне 1 350 келуші · Алматы','project.polyclinic':'Жаңа форматтағы емхана · ауысымына 500 келуші · 12 700 м² · Шұғыла, Алматы',
    'trans.kicker':'ЦИФРЛЫҚ ТРАНСФОРМАЦИЯ','trans.title':'КҮРДЕЛІЛІКТЕН<br><span>БАСҚАРУҒА.</span>','trans.desc':'Процестерді қайта құру, цифрландыру, автоматтандыру және өлшенетін операциялық тиімділік арқылы құрылыс жүйелерін жетілдіру.',
    'dash.kicker':'ОПЕРАЦИЯЛЫҚ БАҚЫЛАУ','dash.title':'БАСҚАРУШЫ<br><span>ДАШБОРДЫ.</span>','dash.live':'LIVE ЖҮЙЕ',
    'expertise.kicker':'САРАПТАМА','education.kicker':'БІЛІМ','education.title':'ЖАҺАНДЫҚ<br><span>БАСҚАРУ ОЙЛАУЫ.</span>','education.languages':'ТІЛДЕР',
    'contact.kicker':'БАЙЛАНЫС','contact.title':'КЕЛЕСІН<br><span>БІРГЕ ҚҰРАЙЫҚ.</span>','contact.desc':'Стратегиялық көшбасшылық. Операциялық тиімділік. Цифрлық трансформация.','contact.open':'ІРІ ЖОБАЛАРҒА АШЫҚ'
  }
};

const setKey=(key)=>{
  const value=translations[currentLang][key];
  if(value==null)return;
  document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el=>el.textContent=value);
  document.querySelectorAll(`[data-i18n-html="${key}"]`).forEach(el=>el.innerHTML=value);
};
let currentLang=localStorage.getItem('askhat-lang') || 'en';
const applyLanguage=(lang)=>{
  currentLang=translations[lang]?lang:'en';
  localStorage.setItem('askhat-lang',currentLang);
  document.documentElement.lang=currentLang;
  Object.keys(translations[currentLang]).forEach(setKey);
  document.querySelectorAll('.langs [data-lang]').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===currentLang));
  refreshDynamicLanguage();
};
document.querySelectorAll('.langs [data-lang]').forEach(btn=>btn.addEventListener('click',()=>applyLanguage(btn.dataset.lang)));
applyLanguage(currentLang);

// Add translation hooks for sections whose markup is intentionally concise.
const hooks={
  '.transform .section-kicker':'trans.kicker','.transform-title h2':'trans.title','.transform-title p':'trans.desc',
  '.dashboard .section-kicker':'dash.kicker','.dashboard .section-head h2':'dash.title','.dashboard .head-note':'dash.live',
  '.expertise .section-kicker':'expertise.kicker','.education .section-kicker':'education.kicker','.education .section-head h2':'education.title','.languages span':'education.languages',
  '.contact .section-kicker':'contact.kicker','.contact-inner h2':'contact.title','.contact-inner>p':'contact.desc','.contact-row span:nth-child(2)':'contact.open'
};
Object.entries(hooks).forEach(([selector,key])=>{
  const el=document.querySelector(selector); if(el){ el.dataset.i18nHtml=key; }
});
applyLanguage(currentLang);

// Mobile navigation / full-screen menu
const menuBtn=document.querySelector('.menu-btn');
const sidebar=document.querySelector('.sidebar');
const setMenu=(open)=>{
  if(!menuBtn||!sidebar)return;
  sidebar.classList.toggle('mobile-open',open);
  menuBtn.classList.toggle('is-open',open);
  menuBtn.setAttribute('aria-expanded',String(open));
  document.body.classList.toggle('menu-open',open);
};
if(menuBtn){
  menuBtn.addEventListener('click',()=>setMenu(!sidebar?.classList.contains('mobile-open')));
  document.querySelectorAll('.sidebar nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
}

// Extended page copy translations
Object.assign(translations.en, {
  'about.p1':'I help organizations build efficient operations, implement digital solutions and deliver complex projects on time and within budget.',
  'about.p2':'My approach combines strategic thinking, lean principles and advanced technologies to create sustainable value across construction and infrastructure.',
  'timeline.1':'Operational management · project performance · process optimization · Lean Technology','timeline.2':'Monitoring and management of national projects.','timeline.3':'Procurement, logistics, project management, BBS and digitalization.','timeline.4':'Business-process reengineering and digitalization across construction.','timeline.5':'International leadership and market operations.','timeline.6':'Atyrau pedestrian bridge — designed and constructed in 6 months.','timeline.7':'MaTraG project for Tengizchevroil.','timeline.8':'Intelligent Transport Systems (ITS).',
  'trans.node1':'PLANNING','trans.node2':'COST CONTROL','trans.node3':'PROCUREMENT','trans.node4':'CONTRACTS','trans.node5':'ANALYTICS','trans.node6':'AUTOMATION',
  'trans.note':'Automated the construction process chain: planning, cost accounting, plan-vs-fact, materials, write-offs, norms, e-contracts and online bidding.',
  'dash.label':'OPERATIONS CONTROL / 2026','dash.big':'SYSTEM<br><span>PERFORMANCE</span>','dash.m1':'PROJECT DELIVERY','dash.m2':'PROCESS EFFICIENCY','dash.m3':'DIGITALIZATION','dash.m4':'OPERATING DISCIPLINE',
  'expert.1':'OPERATIONS','expert.2':'STRATEGY','expert.3':'CONSTRUCTION','expert.4':'DIGITALIZATION','expert.5':'LEAN / KAIZEN','expert.6':'PROCESS OPTIMIZATION','expert.7':'TRANSFORMATION OF THE COMPANY FROM A TRADITIONAL MODEL TO A SYSTEMIC ONE',
  'edu.1':'Strategic Management / Ownership Program<br>Moscow','edu.2':'Lean Technology / Lean Production<br>Japan','edu.3':'Civil Engineering / Construction<br>South Korea','edu.4':'Roads / Airports / Metro Construction<br>Almaty','edu.5':'Certified International Project Manager<br>American Academy of Project Management',
  'project.gpz':'Gas processing plant · 1 billion m³ annual capacity · Atyrau Region','project.pgu':'Combined-cycle power plant · 1,000 MW · Turkestan Region',
  'footer.1':'OPERATIONS / TECHNOLOGY / SCALE','footer.2':'BUILT WITH PRECISION'
});
Object.assign(translations.ru, {
  'about.p1':'Помогаю организациям выстраивать эффективные операции, внедрять цифровые решения и реализовывать сложные проекты в срок и в рамках бюджета.',
  'about.p2':'Сочетаю стратегическое мышление, принципы Lean и современные технологии, чтобы создавать устойчивую ценность в строительстве и инфраструктуре.',
  'timeline.1':'Операционное управление · эффективность проектов · оптимизация процессов · Lean Technology','timeline.2':'Мониторинг и управление национальными проектами.','timeline.3':'Закупки, логистика, управление проектами, BBS и цифровизация.','timeline.4':'Реинжиниринг бизнес-процессов и цифровизация строительства.','timeline.5':'Международное руководство и управление рынком.','timeline.6':'Пешеходный мост «Атырау» — спроектирован и построен за 6 месяцев.','timeline.7':'Проект MaTraG для Тенгизшевройл.','timeline.8':'Интеллектуальные транспортные системы (ITS).',
  'trans.node1':'ПЛАНИРОВАНИЕ','trans.node2':'КОНТРОЛЬ ЗАТРАТ','trans.node3':'ЗАКУПКИ','trans.node4':'КОНТРАКТЫ','trans.node5':'АНАЛИТИКА','trans.node6':'АВТОМАТИЗАЦИЯ',
  'trans.note':'Автоматизирована цепочка строительных процессов: планирование, учет себестоимости, план-факт анализ, материалы, списания, нормы, электронные договоры и онлайн-торги.',
  'dash.label':'ОПЕРАЦИОННЫЙ КОНТРОЛЬ / 2026','dash.big':'ЭФФЕКТИВНОСТЬ<br><span>СИСТЕМЫ</span>','dash.m1':'ВЫПОЛНЕНИЕ ПРОЕКТОВ','dash.m2':'ЭФФЕКТИВНОСТЬ ПРОЦЕССОВ','dash.m3':'ЦИФРОВИЗАЦИЯ','dash.m4':'ОПЕРАЦИОННАЯ ДИСЦИПЛИНА',
  'expert.1':'ОПЕРАЦИИ','expert.2':'СТРАТЕГИЯ','expert.3':'СТРОИТЕЛЬСТВО','expert.4':'ЦИФРОВИЗАЦИЯ','expert.5':'LEAN / KAIZEN','expert.6':'ОПТИМИЗАЦИЯ ПРОЦЕССОВ','expert.7':'ТРАНСФОРМАЦИЯ КОМПАНИИ ИЗ ТРАДИЦИОННОЙ МОДЕЛИ В СИСТЕМНУЮ',
  'edu.1':'Стратегическое управление / Ownership Program<br>Москва','edu.2':'Lean Technology / Бережливое производство<br>Япония','edu.3':'Гражданское строительство<br>Южная Корея','edu.4':'Строительство дорог / аэродромов / метро<br>Алматы','edu.5':'Certified International Project Manager<br>American Academy of Project Management',
  'project.gpz':'Газоперерабатывающий завод · 1 млрд м³ в год · Атырауская область','project.pgu':'Парогазовая электростанция · 1 000 МВт · Туркестанская область',
  'footer.1':'ОПЕРАЦИИ / ТЕХНОЛОГИИ / МАСШТАБ','footer.2':'СОЗДАНО С ТОЧНОСТЬЮ'
});
Object.assign(translations.kz, {
  'about.p1':'Ұйымдарға тиімді операциялық жүйе құруға, цифрлық шешімдерді енгізуге және күрделі жобаларды мерзімінде әрі бюджет шегінде орындауға көмектесемін.',
  'about.p2':'Стратегиялық ойлау, Lean қағидаттары және заманауи технологияларды біріктіріп, құрылыс пен инфрақұрылымда тұрақты құндылық қалыптастырамын.',
  'timeline.1':'Операциялық басқару · жоба тиімділігі · процестерді оңтайландыру · Lean Technology','timeline.2':'Ұлттық жобаларды мониторингтеу және басқару.','timeline.3':'Сатып алу, логистика, жобаларды басқару, BBS және цифрландыру.','timeline.4':'Құрылыс саласындағы бизнес-процестерді қайта құру және цифрландыру.','timeline.5':'Халықаралық басқару және нарықтық операциялар.','timeline.6':'«Атырау» жаяу жүргіншілер көпірі — 6 айда жобаланып, салынды.','timeline.7':'Tengizchevroil үшін MaTraG жобасы.','timeline.8':'Интеллектуалды көлік жүйелері (ITS).',
  'trans.node1':'ЖОСПАРЛАУ','trans.node2':'ШЫҒЫНДАРДЫ БАҚЫЛАУ','trans.node3':'САТЫП АЛУ','trans.node4':'КЕЛІСІМШАРТТАР','trans.node5':'АНАЛИТИКА','trans.node6':'АВТОМАТТАНДЫРУ',
  'trans.note':'Құрылыс процестерінің тізбегі автоматтандырылды: жоспарлау, өзіндік құн есебі, жоспар-факт талдауы, материалдар, есептен шығару, нормалар, электрондық келісімдер және онлайн сауда.',
  'dash.label':'ОПЕРАЦИЯЛЫҚ БАҚЫЛАУ / 2026','dash.big':'ЖҮЙЕ<br><span>ТИІМДІЛІГІ</span>','dash.m1':'ЖОБАНЫ ОРЫНДАУ','dash.m2':'ПРОЦЕСС ТИІМДІЛІГІ','dash.m3':'ЦИФРЛАНДЫРУ','dash.m4':'ОПЕРАЦИЯЛЫҚ ТӘРТІП',
  'expert.1':'ОПЕРАЦИЯЛАР','expert.2':'СТРАТЕГИЯ','expert.3':'ҚҰРЫЛЫС','expert.4':'ЦИФРЛАНДЫРУ','expert.5':'LEAN / KAIZEN','expert.6':'ПРОЦЕСТЕРДІ ОҢТАЙЛАНДЫРУ','expert.7':'КОМПАНИЯНЫ ДӘСТҮРЛІ МОДЕЛЬДЕН ЖҮЙЕЛІК МОДЕЛЬГЕ ТРАНСФОРМАЦИЯЛАУ',
  'edu.1':'Стратегиялық басқару / Ownership Program<br>Мәскеу','edu.2':'Lean Technology / Үнемді өндіріс<br>Жапония','edu.3':'Азаматтық құрылыс<br>Оңтүстік Корея','edu.4':'Жолдар / әуежайлар / метро құрылысы<br>Алматы','edu.5':'Certified International Project Manager<br>American Academy of Project Management',
  'project.gpz':'Газ өңдеу зауыты · жылына 1 млрд м³ · Атырау облысы','project.pgu':'Бу-газ электр станциясы · 1 000 МВт · Түркістан облысы',
  'footer.1':'ОПЕРАЦИЯЛАР / ТЕХНОЛОГИЯ / АУҚЫМ','footer.2':'ДӘЛДІКПЕН ЖАСАЛҒАН'
});
function refreshDynamicLanguage(){
  const t=translations[currentLang]||translations.en;
  const set=(selector,key,html=false)=>{document.querySelectorAll(selector).forEach(el=>{if(t[key]!=null){if(html)el.innerHTML=t[key];else el.textContent=t[key]}})};
  const details=['timeline.1','timeline.2','timeline.3','timeline.4','timeline.5','timeline.6','timeline.7','timeline.8'];
  document.querySelectorAll('.timeline-item .time-detail').forEach((el,i)=>{if(t[details[i]])el.textContent=t[details[i]]});
  const nodes=['trans.node1','trans.node2','trans.node3','trans.node4','trans.node5','trans.node6'];
  document.querySelectorAll('.system-node strong').forEach((el,i)=>{if(t[nodes[i]])el.textContent=t[nodes[i]]});
  const metrics=['dash.m1','dash.m2','dash.m3','dash.m4'];
  document.querySelectorAll('.metric small').forEach((el,i)=>{if(t[metrics[i]])el.textContent=t[metrics[i]]});
  const experts=['expert.1','expert.2','expert.3','expert.4','expert.5','expert.6','expert.7'];
  document.querySelectorAll('.expertise-item h3').forEach((el,i)=>{if(t[experts[i]])el.textContent=t[experts[i]]});
  const edu=['edu.1','edu.2','edu.3','edu.4','edu.5'];
  document.querySelectorAll('.edu-card small').forEach((el,i)=>{if(t[edu[i]])el.innerHTML=t[edu[i]]});
  set('.about-copy p:nth-of-type(1)','about.p1'); set('.about-copy p:nth-of-type(2)','about.p2');
  set('.transformation-note strong','trans.note');
  set('footer span:nth-child(2)','footer.1'); set('footer span:nth-child(3)','footer.2');
}

const extendedHooks={
  '.about-copy p:nth-of-type(1)':'about.p1','.about-copy p:nth-of-type(2)':'about.p2',
  '.timeline-item:nth-of-type(1) .time-detail':'timeline.1','.timeline-item:nth-of-type(2) .time-detail':'timeline.2','.timeline-item:nth-of-type(3) .time-detail':'timeline.3','.timeline-item:nth-of-type(4) .time-detail':'timeline.4','.timeline-item:nth-of-type(5) .time-detail':'timeline.5','.timeline-item:nth-of-type(6) .time-detail':'timeline.6','.timeline-item:nth-of-type(7) .time-detail':'timeline.7','.timeline-item:nth-of-type(8) .time-detail':'timeline.8',
  '.node1 strong':'trans.node1','.node2 strong':'trans.node2','.node3 strong':'trans.node3','.node4 strong':'trans.node4','.node5 strong':'trans.node5','.node6 strong':'trans.node6','.transformation-note strong':'trans.note',
  '.dash-label':'dash.label','.dash-big':'dash.big','.metric:nth-of-type(2) small':'dash.m1','.metric:nth-of-type(3) small':'dash.m2','.metric:nth-of-type(4) small':'dash.m3','.metric:nth-of-type(5) small':'dash.m4',
  '.expertise-item:nth-child(1) h3':'expert.1','.expertise-item:nth-child(2) h3':'expert.2','.expertise-item:nth-child(3) h3':'expert.3','.expertise-item:nth-child(4) h3':'expert.4','.expertise-item:nth-child(5) h3':'expert.5','.expertise-item:nth-child(6) h3':'expert.6','.expertise-item:nth-child(7) h3':'expert.7',
  '.edu-card:nth-child(1) small':'edu.1','.edu-card:nth-child(2) small':'edu.2','.edu-card:nth-child(3) small':'edu.3','.edu-card:nth-child(4) small':'edu.4','.edu-card:nth-child(5) small':'edu.5',
  'footer span:nth-child(2)':'footer.1','footer span:nth-child(3)':'footer.2'
};
Object.entries(extendedHooks).forEach(([selector,key])=>{const el=document.querySelector(selector);if(el)el.dataset.i18nHtml=key;});
applyLanguage(currentLang);


// Light / dark theme
const themeBtn=document.querySelector('.theme-btn');
const savedTheme=localStorage.getItem('askhat-theme') || 'dark';
function applyTheme(theme){const light=theme==='light';document.documentElement.classList.toggle('light',light);localStorage.setItem('askhat-theme',light?'light':'dark');if(themeBtn)themeBtn.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');}
applyTheme(savedTheme);
if(themeBtn)themeBtn.addEventListener('click',()=>applyTheme(document.documentElement.classList.contains('light')?'dark':'light'));

// Education: hover on desktop, tap / keyboard on mobile
document.querySelectorAll('.edu-card').forEach(card=>{
  const toggle=()=>{const open=!card.classList.contains('is-open');document.querySelectorAll('.edu-card.is-open').forEach(o=>{if(o!==card){o.classList.remove('is-open');const m=o.querySelector('.edu-more');if(m)m.setAttribute('aria-hidden','true')}});card.classList.toggle('is-open',open);const more=card.querySelector('.edu-more');if(more)more.setAttribute('aria-hidden',String(!open));};
  card.addEventListener('click',e=>{if(window.matchMedia('(max-width:720px)').matches){e.preventDefault();toggle();}});
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
});


// Certificate viewer: PDFs can be dropped into assets/certificates/ later without changing the UI.
const certModal=document.querySelector('#certificate-modal');
const certFrame=certModal?.querySelector('iframe');
const certLoading=certModal?.querySelector('.certificate-loading');
const closeCert=()=>{
  if(!certModal)return;
  certModal.classList.remove('is-open');
  certModal.setAttribute('aria-hidden','true');
  if(certFrame) certFrame.src='about:blank';
};
const openCert=(card)=>{
  if(!certModal||!certFrame)return;
  const src=card.dataset.certificate;
  if(!src){ return; }
  certLoading.textContent='OPENING CERTIFICATE';
  certLoading.style.display='grid';
  certModal.classList.add('is-open');
  certModal.setAttribute('aria-hidden','false');
  certFrame.src=src;
  certFrame.onload=()=>{certLoading.style.display='none';};
  certFrame.onerror=()=>{certLoading.textContent='CERTIFICATE FILE WILL BE ADDED HERE';};
};
document.querySelectorAll('.certificate-btn').forEach(btn=>btn.addEventListener('click',(e)=>{e.stopPropagation();openCert(btn.closest('.edu-card'));}));
document.querySelector('.certificate-close')?.addEventListener('click',closeCert);
document.querySelector('.certificate-backdrop')?.addEventListener('click',closeCert);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCert();});


// Project details modal
const projectModal=document.querySelector('#project-modal');
const projectTitle=document.querySelector('#project-dialog-title');
const projectKicker=document.querySelector('#project-dialog-kicker');
const projectSubtitle=document.querySelector('#project-dialog-subtitle');
const projectBody=document.querySelector('#project-dialog-body');
const projectClose=()=>{
  if(!projectModal)return;
  projectModal.classList.remove('is-open');
  projectModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
};
const projectDetails={
  capital:{
    type:'CONSTRUCTION / ENGINEERING',
    ru:{title:'CAPITAL PARK',subtitle:'Сократили срок строительства в 2 раза и увеличили рентабельность проекта на 8 п.п.',html:`
      <div class="project-result-grid"><div class="project-result"><strong>24 → 12</strong><span>месяцев · срок строительства</span></div><div class="project-result"><strong>11% → 19%</strong><span>рентабельность проекта</span></div><div class="project-result"><strong>59 дБ</strong><span>показатель шумоизоляции при нормативе 52 дБ</span></div></div>
      <h3>Что сделали</h3><p>Провели комплексную оптимизацию проекта и бизнес-процессов:</p><ul><li>внедрили циклограмму строительства;</li><li>разработали детальное планирование;</li><li>организовали параллельное выполнение различных видов работ;</li><li>внедрили новые строительные технологии;</li><li>вынос газоблока;</li><li>стандартизировали оконные проёмы в зависимости от класса жилья;</li><li>разработали дизайн-код дворового пространства;</li><li>оптимизировали и автоматизировали бизнес-процессы проекта и корпоративного центра;</li><li>оптимизировали накладные и административные расходы;</li><li>провели комплексную ревизию проекта.</li></ul>
      <h3>Технологическое решение — Acoustic Pro</h3><p>Командой была разработана технология шумоизоляции Acoustic Pro. В результате удалось достичь показателя 59 дБ при нормативном значении 52 дБ. Технология получила дальнейшее применение в проектах BI Group.</p>
      <h3>Отдельный результат — BBS</h3><p>После успешной реализации проекта была разработана система управления BBS (BI Business System) — методология системного управления компанией, которая применяется в BI Group по настоящее время.</p>`},
    en:{title:'CAPITAL PARK',subtitle:'Construction time reduced by 2× and project profitability increased by 8 p.p.',html:`
      <div class="project-result-grid"><div class="project-result"><strong>24 → 12</strong><span>months · construction time</span></div><div class="project-result"><strong>11% → 19%</strong><span>project profitability</span></div><div class="project-result"><strong>59 dB</strong><span>sound insulation vs. 52 dB standard</span></div></div>
      <h3>What was done</h3><p>A comprehensive optimization of the project and business processes was carried out:</p><ul><li>implemented a construction cycle schedule;</li><li>introduced detailed planning;</li><li>organized parallel execution of different work packages;</li><li>introduced new construction technologies;</li><li> handling/transport of aerated concrete blocks;</li><li>standardized window openings according to housing class;</li><li>developed a courtyard design code;</li><li>optimized and automated project and corporate-center business processes;</li><li>optimized overhead and administrative costs;</li><li>conducted a comprehensive project review.</li></ul>
      <h3>Technology solution — Acoustic Pro</h3><p>The team developed the Acoustic Pro sound-insulation technology. It achieved 59 dB against a standard of 52 dB. The technology was subsequently applied in BI Group projects.</p>
      <h3>Additional result — BBS</h3><p>After the successful project, the BBS (BI Business System) management system was developed — a systematic management methodology that continues to be used at BI Group.</p>`},
    kz:{title:'CAPITAL PARK',subtitle:'Құрылыс мерзімі 2 есе қысқартылып, жобаның рентабельділігі 8 п.п. артты.',html:`
      <div class="project-result-grid"><div class="project-result"><strong>24 → 12</strong><span>ай · құрылыс мерзімі</span></div><div class="project-result"><strong>11% → 19%</strong><span>жоба рентабельділігі</span></div><div class="project-result"><strong>59 дБ</strong><span>шу оқшаулау көрсеткіші, норма 52 дБ</span></div></div>
      <h3>Не жасалды</h3><p>Жоба мен бизнес-процестерге кешенді оңтайландыру жүргізілді:</p><ul><li>құрылыс циклограммасы енгізілді;</li><li>егжей-тегжейлі жоспарлау әзірленді;</li><li>жұмыстардың бірнеше түрін қатар орындау ұйымдастырылды;</li><li>жаңа құрылыс технологиялары енгізілді;</li><li>газоблокты шығару;</li><li>терезе ойықтары тұрғын үй класына қарай стандартталды;</li><li>аула кеңістігінің дизайн-коды әзірленді;</li><li>жоба және корпоративтік орталық бизнес-процестері автоматтандырылды;</li><li>әкімшілік және үстеме шығындар оңтайландырылды;</li><li>жобаға толық ревизия жүргізілді.</li></ul>
      <h3>Технологиялық шешім — Acoustic Pro</h3><p>Команда Acoustic Pro дыбыс оқшаулау технологиясын әзірледі. Нәтижесінде 52 дБ норма кезінде 59 дБ көрсеткішіне қол жеткізілді.</p>
      <h3>Қосымша нәтиже — BBS</h3><p>Жоба аяқталғаннан кейін BI Group-та қолданылатын жүйелік басқару әдістемесі — BBS (BI Business System) әзірленді.</p>`}
  },
  atyrau:{
    type:'INFRASTRUCTURE',
    ru:{title:'ПЕШЕХОДНЫЙ МОСТ, АТЫРАУ',subtitle:'Проектирование и строительство за 6 месяцев',html:`<p>Проект был реализован в течение 6 месяцев.</p><p>Изначально проект имел отрицательную экономику. За счёт применения новых технологий и оптимизации решений удалось вывести проект на положительный финансовый результат.</p><h3>Ключевой результат</h3><p>Проект из убыточного был переведён в положительную экономику.</p>`},
    en:{title:'ATYRAU PEDESTRIAN BRIDGE',subtitle:'Design and construction completed in 6 months',html:`<p>The project was delivered within 6 months.</p><p>The project initially had negative economics. By applying new technologies and optimizing solutions, it was brought to a positive financial result.</p><h3>Key result</h3><p>A loss-making project was transformed into a financially positive project.</p>`},
    kz:{title:'АТЫРАУ ЖАЯУ ЖҮРГІНШІЛЕР КӨПІРІ',subtitle:'Жобалау және құрылыс — 6 ай',html:`<p>Жоба 6 ай ішінде іске асырылды.</p><p>Бастапқыда жобаның экономикасы теріс болды. Жаңа технологиялар мен оңтайландырылған шешімдерді қолдану арқылы жоба оң қаржылық нәтижеге шығарылды.</p><h3>Негізгі нәтиже</h3><p>Шығынды жоба оң экономикаға ауыстырылды.</p>`}
  },
  balkhash:{
    type:'ENERGY',
    ru:{title:'БАЛХАШСКАЯ ТЭЦ',subtitle:'Международный заказчик. Международные стандарты. Результат выше плана.',html:`<p>Первый проект BI Group с международным заказчиком — Samsung Engineering.</p><p>Проект реализовывался с учётом требований американских стандартов строительства и техники безопасности.</p><div class="project-result-grid"><div class="project-result"><strong>21%</strong><span>фактическая рентабельность</span></div><div class="project-result"><strong>14%</strong><span>плановая рентабельность</span></div><div class="project-result"><strong>+7 п.п.</strong><span>к плановой рентабельности</span></div></div><h3>Результат</h3><p>Фактическая рентабельность проекта составила 21% при плановой 14%.</p>`},
    en:{title:'BALKHASH TPP',subtitle:'International client. International standards. Result above plan.',html:`<p>The first BI Group project with an international client — Samsung Engineering.</p><p>The project was delivered in accordance with American construction and safety standards.</p><div class="project-result-grid"><div class="project-result"><strong>21%</strong><span>actual profitability</span></div><div class="project-result"><strong>14%</strong><span>planned profitability</span></div><div class="project-result"><strong>+7 p.p.</strong><span>above planned profitability</span></div></div><h3>Result</h3><p>Actual project profitability reached 21% versus a planned 14%.</p>`},
    kz:{title:'БАЛҚАШ ЖЭО',subtitle:'Халықаралық тапсырыс беруші. Халықаралық стандарттар. Жоспардан жоғары нәтиже.',html:`<p>BI Group-тың халықаралық тапсырыс беруші — Samsung Engineering-пен алғашқы жобасы.</p><p>Жоба американдық құрылыс және қауіпсіздік стандарттарының талаптарын ескере отырып іске асырылды.</p><div class="project-result-grid"><div class="project-result"><strong>21%</strong><span>нақты рентабельділік</span></div><div class="project-result"><strong>14%</strong><span>жоспарланған рентабельділік</span></div><div class="project-result"><strong>+7 п.п.</strong><span>жоспардан жоғары</span></div></div><h3>Нәтиже</h3><p>Жобаның нақты рентабельділігі 21% болып, жоспардағы 14%-дан жоғары болды.</p>`}
  },
  matrag:{
    type:'INDUSTRIAL',
    ru:{title:'МАТРАГ',subtitle:'Проект на месторождениях Тенгиз',html:`<p>Заказчик — Tengizchevroil (TCO).</p><p>Проект реализовывался с повышенными требованиями к качеству планирования, строительству и технике безопасности.</p><div class="project-result-grid"><div class="project-result"><strong>24%</strong><span>фактическая рентабельность</span></div><div class="project-result"><strong>19%</strong><span>плановая рентабельность</span></div><div class="project-result"><strong>+5 п.п.</strong><span>к плановой рентабельности</span></div></div><h3>Результат</h3><p>Фактическая рентабельность проекта составила 24% при плановой 19%.</p>`},
    en:{title:'MaTraG',subtitle:'Project at the Tengiz oil fields',html:`<p>Client — Tengizchevroil (TCO).</p><p>The project was delivered under increased requirements for planning quality, construction and safety.</p><div class="project-result-grid"><div class="project-result"><strong>24%</strong><span>actual profitability</span></div><div class="project-result"><strong>19%</strong><span>planned profitability</span></div><div class="project-result"><strong>+5 p.p.</strong><span>above planned profitability</span></div></div><h3>Result</h3><p>Actual project profitability reached 24% versus a planned 19%.</p>`},
    kz:{title:'MaTraG',subtitle:'Теңіз кен орнындағы жоба',html:`<p>Тапсырыс беруші — Tengizchevroil (TCO).</p><p>Жоба жоспарлау сапасына, құрылысқа және қауіпсіздікке қойылатын жоғары талаптармен іске асырылды.</p><div class="project-result-grid"><div class="project-result"><strong>24%</strong><span>нақты рентабельділік</span></div><div class="project-result"><strong>19%</strong><span>жоспарланған рентабельділік</span></div><div class="project-result"><strong>+5 п.п.</strong><span>жоспардан жоғары</span></div></div><h3>Нәтиже</h3><p>Жобаның нақты рентабельділігі 24%, жоспарланғаны 19% болды.</p>`}
  },
  saudi:{
    type:'GLOBAL OPERATIONS',
  
    ru:{
      title:'САУДОВСКАЯ АРАВИЯ',
      subtitle:'Руководитель направления · международные операции',
      html:`
        <p>Международный опыт управления и развития операций в Саудовской Аравии.</p>
        <ul>
          <li>Регистрация и открытие компаний</li>
          <li>Получение лицензий</li>
          <li>Анализ рынка</li>
          <li>Формирование проектной команды и команды филиала</li>
        </ul>
      `
    },
  
    en:{
      title:'SAUDI ARABIA',
      subtitle:'Country director · international operations',
      html:`
        <p>International experience in managing and developing operations in Saudi Arabia.</p>
        <ul>
          <li>Company registration and establishment</li>
          <li>Obtaining licenses</li>
          <li>Market analysis</li>
          <li>Formation of the project team and branch team</li>
        </ul>
      `
    },
  
    kz:{
      title:'САУД АРАБИЯСЫ',
      subtitle:'Бағыт жетекшісі · халықаралық операциялар',
      html:`
        <p>Сауд Арабиясында операцияларды басқару және дамыту бойынша халықаралық тәжірибе.</p>
        <ul>
          <li>Компанияларды тіркеу және ашу</li>
          <li>Лицензиялар алу</li>
          <li>Нарықты талдау</li>
          <li>Жоба командасы мен филиал командасын қалыптастыру</li>
        </ul>
      `
    }
  },
  gpz:{
    type:'ENERGY / GAS PROCESSING',
    ru:{title:'АТЫРАУСКИЙ ГПЗ',subtitle:'Полная ревизия проекта и систематизация управления',html:`<h3>В рамках проекта</h3><ul><li>выполнен полный расчёт сметной документации;</li><li>проведена ревизия проекта и исправлены выявленные ошибки;</li><li>внедрены KPI проекта;</li><li>сформирован БДДС — бюджет движения денежных средств;</li><li>сформирован БДР — бюджет доходов и расходов;</li><li>внедрена маржинальная ведомость;</li><li>организован оперативный учёт;</li><li>разработан детальный график производства работ на базе Primavera.</li></ul><h3>Результат</h3><p>Проект был пересчитан и после корректировок повторно прошёл государственную экспертизу.</p>`},
    en:{title:'ATYRAU GAS PROCESSING PLANT',subtitle:'Full project review and systematic management',html:`<h3>Scope of work</h3><ul><li>completed a full estimate calculation;</li><li>reviewed the project and corrected identified errors;</li><li>implemented project KPIs;</li><li>prepared the cash-flow budget;</li><li>prepared the income and expenditure budget;</li><li>introduced a margin statement;</li><li>organized operational accounting;</li><li>developed a detailed production schedule based on Primavera.</li></ul><h3>Result</h3><p>The project was recalculated and, after corrections, successfully passed state examination again.</p>`},
    kz:{title:'АТЫРАУ ГАЗ ӨҢДЕУ ЗАУЫТЫ',subtitle:'Жобаны толық ревизиялау және басқаруды жүйелеу',html:`<h3>Жоба аясында</h3><ul><li>сметалық құжаттаманың толық есебі жасалды;</li><li>жобаға ревизия жүргізіліп, қателер түзетілді;</li><li>жоба KPI-лары енгізілді;</li><li>ақша қозғалысы бюджеті қалыптастырылды;</li><li>кірістер мен шығыстар бюджеті қалыптастырылды;</li><li>маржиналдық ведомость енгізілді;</li><li>операциялық есеп ұйымдастырылды;</li><li>Primavera негізінде өндіріс жұмыстарының егжей-тегжейлі кестесі әзірленді.</li></ul><h3>Нәтиже</h3><p>Жоба қайта есептеліп, түзетулерден кейін мемлекеттік сараптамадан қайта өтті.</p>`}
  },
  pgu:{
    type:'ENERGY / POWER GENERATION',
    ru:{title:'ТУРКЕСТАН ПГУ',subtitle:'Сметная оптимизация и системное управление проектом',html:`<h3>В рамках проекта</h3><ul><li>выполнен полный расчёт сметной документации;</li><li>проведена ревизия и исправление ошибок проекта;</li><li>внедрены KPI проекта;</li><li>сформированы БДДС и БДР;</li><li>внедрена маржинальная ведомость;</li><li>организован оперативный учёт;</li><li>разработан детальный график производства работ по каждому разделу.</li></ul>`},
    en:{title:'TURKESTAN CCGT',subtitle:'Estimate optimization and systematic project management',html:`<h3>Scope of work</h3><ul><li>completed a full estimate calculation;</li><li>reviewed and corrected project errors;</li><li>implemented project KPIs;</li><li>prepared cash-flow and income/expenditure budgets;</li><li>introduced a margin statement;</li><li>organized operational accounting;</li><li>developed a detailed production schedule for each section.</li></ul>`},
    kz:{title:'ТҮРКІСТАН ПМГ',subtitle:'Сметаны оңтайландыру және жобаны жүйелі басқару',html:`<h3>Жоба аясында</h3><ul><li>сметалық құжаттаманың толық есебі жасалды;</li><li>жобаға ревизия жүргізіліп, қателер түзетілді;</li><li>жоба KPI-лары енгізілді;</li><li>ақша қозғалысы және кіріс-шығыс бюджеттері қалыптастырылды;</li><li>маржиналдық ведомость енгізілді;</li><li>операциялық есеп ұйымдастырылды;</li><li>әр бөлім бойынша өндіріс жұмыстарының егжей-тегжейлі кестесі әзірленді.</li></ul>`}
  },
  assm:{
    type:'EDUCATION / SOCIAL INFRASTRUCTURE',
    ru:{title:'ЦЕНТР ТВОРЧЕСТВА «ЖАС КАНАТ»',subtitle:'Управление финансами, сроками и качеством проекта',html:`<h3>В рамках проекта</h3><ul><li>выполнен полный расчёт сметной документации;</li><li>проведена ревизия и исправление ошибок проекта;</li><li>внедрены KPI проекта;</li><li>сформированы БДДС и БДР;</li><li>внедрена маржинальная ведомость;</li><li>организован оперативный учёт;</li><li>разработан детальный график производства работ по каждому разделу;</li><li>внедрены стандарты контроля качества объекта.</li></ul>`},
    en:{title:'ZHAS KANAT CREATIVE CENTER',subtitle:'Managing project finances, timelines and quality',html:`<h3>Scope of work</h3><ul><li>completed a full estimate calculation;</li><li>reviewed and corrected project errors;</li><li>implemented project KPIs;</li><li>prepared cash-flow and income/expenditure budgets;</li><li>introduced a margin statement;</li><li>organized operational accounting;</li><li>developed a detailed production schedule for each section;</li><li>introduced quality-control standards for the facility.</li></ul>`},
    kz:{title:'«ЖАС ҚАНАТ» ШЫҒАРМАШЫЛЫҚ ОРТАЛЫҒЫ',subtitle:'Жобаның қаржысын, мерзімін және сапасын басқару',html:`<h3>Жоба аясында</h3><ul><li>сметалық құжаттаманың толық есебі жасалды;</li><li>жобаға ревизия жүргізіліп, қателер түзетілді;</li><li>жоба KPI-лары енгізілді;</li><li>ақша қозғалысы және кіріс-шығыс бюджеттері қалыптастырылды;</li><li>маржиналдық ведомость енгізілді;</li><li>операциялық есеп ұйымдастырылды;</li><li>әр бөлім бойынша өндіріс жұмыстарының егжей-тегжейлі кестесі әзірленді;</li><li>нысан сапасын бақылау стандарттары енгізілді.</li></ul>`}
  },
  poly:{
    type:'HEALTHCARE / SOCIAL INFRASTRUCTURE',
    ru:{title:'ПОЛИКЛИНИКА «ШУГЫЛА»',subtitle:'Систематизация управления и контроль эффективности проекта',html:`<h3>В рамках проекта</h3><ul><li>выполнен полный расчёт сметной документации;</li><li>проведена ревизия и исправление ошибок проекта;</li><li>внедрены KPI проекта;</li><li>сформированы БДДС и БДР;</li><li>внедрена маржинальная ведомость;</li><li>организован оперативный учёт;</li><li>разработан детальный график производства работ по каждому разделу;</li><li>внедрены стандарты контроля качества объекта.</li></ul>`},
    en:{title:'SHUGYLA POLYCLINIC',subtitle:'Systematic management and project efficiency control',html:`<h3>Scope of work</h3><ul><li>completed a full estimate calculation;</li><li>reviewed and corrected project errors;</li><li>implemented project KPIs;</li><li>prepared cash-flow and income/expenditure budgets;</li><li>introduced a margin statement;</li><li>organized operational accounting;</li><li>developed a detailed production schedule for each section;</li><li>introduced quality-control standards for the facility.</li></ul>`},
    kz:{title:'«ШҰҒЫЛА» ПОЛИКЛИНИКАСЫ',subtitle:'Басқаруды жүйелеу және жоба тиімділігін бақылау',html:`<h3>Жоба аясында</h3><ul><li>сметалық құжаттаманың толық есебі жасалды;</li><li>жобаға ревизия жүргізіліп, қателер түзетілді;</li><li>жоба KPI-лары енгізілді;</li><li>ақша қозғалысы және кіріс-шығыс бюджеттері қалыптастырылды;</li><li>маржиналдық ведомость енгізілді;</li><li>операциялық есеп ұйымдастырылды;</li><li>әр бөлім бойынша өндіріс жұмыстарының егжей-тегжейлі кестесі әзірленді;</li><li>нысан сапасын бақылау стандарттары енгізілді.</li></ul>`}
  }
};
// Localized project details
const projectKeys=['capital','atyrau','balkhash','matrag','saudi','gpz','pgu','assm','poly'];
let openProjectIndex=-1;

function renderProjectDetails(index){
  const key=projectKeys[index];
  const d=projectDetails[key];
  if(!d || !projectModal)return;
  const lang=d[currentLang] ? currentLang : 'en';
  const content=d[lang] || d.en;
  projectKicker.textContent=`${String(index+1).padStart(2,'0')} / 09 · ${d.type}`;
  projectTitle.textContent=content.title;
  projectSubtitle.textContent=content.subtitle;
  projectBody.innerHTML=content.html;
}

document.querySelectorAll('.project-open').forEach((card,i)=>{
  card.setAttribute('role','button'); card.setAttribute('tabindex','0');
  const open=()=>{
    if(!projectModal)return;
    openProjectIndex=i;
    renderProjectDetails(i);
    projectModal.classList.add('is-open');
    projectModal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  };
  card.addEventListener('click',e=>{if(e.target.closest('a'))e.preventDefault();open();});
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
});
projectModal?.querySelector('.project-modal-close')?.addEventListener('click',projectClose);
projectModal?.querySelector('.project-modal-backdrop')?.addEventListener('click',projectClose);
document.addEventListener('keydown',e=>{if(e.key==='Escape')projectClose();});

// Re-render the open project immediately after switching language.
const previousRefreshDynamicLanguage = refreshDynamicLanguage;
refreshDynamicLanguage = function(){
  previousRefreshDynamicLanguage();
  if(openProjectIndex>=0 && projectModal?.classList.contains('is-open')) renderProjectDetails(openProjectIndex);
};

// Localized labels for the new sections
Object.assign(translations.en, {
  'projects.introTitle':'Practice, proven by results',
  'projects.intro1':'We help construction companies improve project efficiency, shorten construction timelines, optimize costs and build systematic management.',
  'projects.intro2':'Our experience includes residential and commercial construction, industrial facilities and projects with international clients.',
});
Object.assign(translations.ru, {
  'projects.introTitle':'Практика, подтверждённая результатами',
  'projects.intro1':'Мы помогаем строительным компаниям повышать эффективность проектов, сокращать сроки строительства, оптимизировать затраты и выстраивать системное управление.',
  'projects.intro2':'Наш опыт включает жилое и коммерческое строительство, промышленные объекты и проекты с международными заказчиками.',
});
Object.assign(translations.kz, {
  'projects.introTitle':'Нәтижелермен расталған тәжірибе',
  'projects.intro1':'Біз құрылыс компанияларына жобалардың тиімділігін арттыруға, құрылыс мерзімдерін қысқартуға, шығындарды оңтайландыруға және жүйелі басқаруды қалыптастыруға көмектесеміз.',
  'projects.intro2':'Тәжірибеміз тұрғын үй және коммерциялық құрылыс, өнеркәсіптік нысандар және халықаралық тапсырыс берушілері бар жобаларды қамтиды.',
});
// Re-apply language so the labels above are available immediately.
if(typeof applyLanguage==='function') applyLanguage(currentLang);
Object.assign(translations.en, {
  'projects.approachKicker':'OUR APPROACH','projects.approachTitle':'From analysis to measurable results','projects.approachText':'We see a construction project as one system where timelines, budget, profitability, quality, technology and management are connected.','projects.approachTask':'Our task is not simply to identify problems, but to find solutions that deliver a concrete economic and operational result:','projects.approach1':'Shorten timelines.','projects.approach2':'Optimize costs.','projects.approach3':'Increase profitability.','projects.approach4':'Build a management system.','projects.approach5':'Control quality.','projects.approachFinal':'From chaos — to system.<br>From project — to result.'
});
Object.assign(translations.ru, {
  'projects.approachKicker':'НАШ ПОДХОД','projects.approachTitle':'От анализа — к измеримому результату','projects.approachText':'Мы рассматриваем строительный проект как единую систему, в которой связаны сроки, бюджет, рентабельность, качество, технологии и управление.','projects.approachTask':'Наша задача — не просто выявить проблемы, а найти решения, которые дают конкретный экономический и операционный результат:','projects.approach1':'Сокращаем сроки.','projects.approach2':'Оптимизируем затраты.','projects.approach3':'Повышаем рентабельность.','projects.approach4':'Выстраиваем систему управления.','projects.approach5':'Контролируем качество.','projects.approachFinal':'Из хаоса — в систему.<br>Из проекта — в результат.'
});
Object.assign(translations.kz, {
  'projects.approachKicker':'БІЗДІҢ ТӘСІЛІМІЗ','projects.approachTitle':'Талдаудан — өлшенетін нәтижеге','projects.approachText':'Біз құрылыс жобасын мерзімдер, бюджет, рентабельділік, сапа, технология және басқару өзара байланысқан біртұтас жүйе ретінде қарастырамыз.','projects.approachTask':'Мақсатымыз — мәселені анықтап қана қоймай, нақты экономикалық және операциялық нәтиже беретін шешімдерді табу:','projects.approach1':'Мерзімдерді қысқартамыз.','projects.approach2':'Шығындарды оңтайландырамыз.','projects.approach3':'Рентабельділікті арттырамыз.','projects.approach4':'Басқару жүйесін құрамыз.','projects.approach5':'Сапаны бақылаймыз.','projects.approachFinal':'Хаостан — жүйеге.<br>Жобадан — нәтижеге.'
});
if(typeof applyLanguage==='function') applyLanguage(currentLang);
