import React, { useState, useRef, useEffect } from "react";

/* ============================================================
   ЦИФРОЛОГИЯ — добрый ассистент по числам
   Профиль · Психоматрица · Число дня · Прогноз · Пара ·
   Работа · Лайфхаки · Таро · Чат · Кабинет · Подписка
   ============================================================ */

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap');
    *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
    @keyframes floatUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes blob{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(12px,-14px) scale(1.07)}}
    @keyframes pop{0%{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}
    .reveal{animation:floatUp .5s ease both}
    .scrollbox::-webkit-scrollbar{width:6px}.scrollbox::-webkit-scrollbar-thumb{background:#e0d8f2;border-radius:3px}
  `}</style>
);

// ---------- ПАЛИТРА (тёплая, дружелюбная) ----------
const C = {
  ink:"#3b3556", inkSoft:"#827aa0", violet:"#7c5cff", violetD:"#6a48f5",
  coral:"#ff8a5b", mint:"#23b692", card:"#ffffff", soft:"#f6f2ff",
  line:"#ece6f7", good:"#23b692",
};
const grad = `linear-gradient(135deg,${C.violet},${C.coral})`;

// ---------- ДАННЫЕ ----------
const ZODIAC = [
  { n:"Овен",s:"♈",from:[3,21],to:[4,19],el:"Огонь" },{ n:"Телец",s:"♉",from:[4,20],to:[5,20],el:"Земля" },
  { n:"Близнецы",s:"♊",from:[5,21],to:[6,20],el:"Воздух" },{ n:"Рак",s:"♋",from:[6,21],to:[7,22],el:"Вода" },
  { n:"Лев",s:"♌",from:[7,23],to:[8,22],el:"Огонь" },{ n:"Дева",s:"♍",from:[8,23],to:[9,22],el:"Земля" },
  { n:"Весы",s:"♎",from:[9,23],to:[10,22],el:"Воздух" },{ n:"Скорпион",s:"♏",from:[10,23],to:[11,21],el:"Вода" },
  { n:"Стрелец",s:"♐",from:[11,22],to:[12,21],el:"Огонь" },{ n:"Козерог",s:"♑",from:[12,22],to:[1,19],el:"Земля" },
  { n:"Водолей",s:"♒",from:[1,20],to:[2,18],el:"Воздух" },{ n:"Рыбы",s:"♓",from:[2,19],to:[3,20],el:"Вода" },
];
const CHINESE = ["Крыса","Бык","Тигр","Кролик","Дракон","Змея","Лошадь","Коза","Обезьяна","Петух","Собака","Свинья"];
const LIFE_PATH = {
  1:"Лидер. Независимость, инициатива, воля. Твой путь — быть первым и вести за собой.",
  2:"Дипломат. Чуткость, партнёрство, интуиция. Сила — в союзах и умении слышать.",
  3:"Творец. Самовыражение, общение, лёгкость и радость. Важно не распыляться.",
  4:"Строитель. Порядок, дисциплина, надёжность. Ты создаёшь прочный фундамент.",
  5:"Искатель. Свобода, перемены, опыт. Жизнь раскрывается через движение.",
  6:"Хранитель. Любовь, забота, гармония. Дом, близкие и красота — твоя опора.",
  7:"Мудрец. Анализ, глубина, поиск смысла. Тебе нужны тишина и развитие.",
  8:"Созидатель масштаба. Цели, ресурсы, результат. Учишься балансу дела и сердца.",
  9:"Гуманист. Доброта, широта души, помощь людям. Завершаешь циклы красиво.",
  11:"Вдохновитель. Сильная интуиция и идеи. Ты — проводник света для других.",
  22:"Мастер-строитель. Большие мечты, воплощённые в реальность.",
  33:"Учитель сердца. Любовь, поддержка и исцеление людей.",
};
const SOUL = {
  1:"Душа лидера. В глубине хочет быть первой, ценит свободу и признание.",
  2:"Душа миротворца. Жаждет любви, тепла, гармонии и близких отношений.",
  3:"Душа творца. Хочет радости, самовыражения, общения и ярких эмоций.",
  4:"Душа созидателя. Ищет стабильность, порядок и надёжную опору.",
  5:"Душа свободы. Жаждет новизны, движения, приключений и впечатлений.",
  6:"Душа любви. Хочет заботиться, создавать дом и дарить тепло другим.",
  7:"Душа мудреца. Стремится к знанию, глубине, тишине и пониманию себя.",
  8:"Душа достижений. Хочет реализации, силы и достойных результатов.",
  9:"Душа гуманиста. Жаждет отдавать, помогать и делать мир добрее.",
};
const SYU_CONS = {
  1:"Лидер. Мыслишь самостоятельно, любишь быть первым. Свет: воля, смелость, ответственность. Рост: не подавлять других, слышать их.",
  2:"Дипломат. Тонко чувствуешь людей, ищешь гармонию. Свет: чуткость, поддержка, мир. Рост: не растворяться в других, беречь себя.",
  3:"Творец. Ум быстрый, любишь общение и идеи. Свет: радость, лёгкость, вдохновение. Рост: доводить начатое до конца.",
  4:"Практик. Мыслишь системно, ценишь порядок. Свет: надёжность, стойкость. Рост: гибкость и доверие к жизни.",
  5:"Свободный. Любишь перемены, движение, опыт. Свет: живость, адаптивность. Рост: устойчивость и завершённость.",
  6:"Заботливый. Мыслишь через любовь и долг. Свет: тепло, ответственность за близких. Рост: не забывать про себя.",
  7:"Мыслитель. Анализируешь, ищешь смысл. Свет: глубина, интуиция, мудрость. Рост: доверять и делиться с людьми.",
  8:"Управленец. Мыслишь целями и результатом. Свет: сила, организованность. Рост: мягкость и щедрость к людям.",
  9:"Гуманист. Мыслишь широко — о людях и мире. Свет: доброта, мудрость, широта. Рост: заземляться и доводить дела.",
};
const SYU_MIS = {
  1:"Лидерство — брать ответственность, вести за собой, создавать новое.",
  2:"Мир и поддержка — соединять людей, помогать, быть надёжной опорой.",
  3:"Творчество — вдохновлять, нести радость и самовыражение в мир.",
  4:"Созидание — строить прочное, наводить порядок, служить делом.",
  5:"Свобода и опыт — жить ярко и учить других гибкости и смелости.",
  6:"Любовь и забота — создавать гармонию, дом, красоту, служить сердцем.",
  7:"Мудрость — познавать, исследовать и делиться знанием с людьми.",
  8:"Реализация — достигать, управлять ресурсами, помогать процветать.",
  9:"Служение — отдавать, помогать людям и завершать циклы с добром.",
};
const PERSONAL_YEAR = {
  1:"Год новых начинаний. Время сеять — что посадишь, то будет расти 9 лет.",
  2:"Год партнёрства и терпения. Больше слушай, меньше торопись — всё сложится.",
  3:"Год творчества и общения. Расширяй круг, заявляй о себе, пробуй новое.",
  4:"Год опоры и труда. Дисциплина сейчас превратится в стабильность завтра.",
  5:"Год перемен и свободы. Открываются новые горизонты — будь гибким.",
  6:"Год тепла и дома. Семья, любовь и забота выходят на первый план.",
  7:"Год внутреннего роста. Учёба, отдых, переосмысление — наполняй себя.",
  8:"Год силы и достижений. Хорошее время для целей, карьеры, результатов.",
  9:"Год завершения. Мягко отпусти лишнее — освобождай место для нового.",
};
const YEAR_THEME = {1:"Старт",2:"Союзы",3:"Творчество",4:"Опора",5:"Перемены",6:"Дом и любовь",7:"Рост внутри",8:"Сила и деньги",9:"Завершение"};
const YEAR_FOCUS = {
  1:"начинать новое, проявлять инициативу, не бояться быть первым.",
  2:"развивать отношения и партнёрства, быть терпеливым.",
  3:"общаться, творить, заводить знакомства, заявлять о себе.",
  4:"наводить порядок, работать системно, строить базу.",
  5:"пробовать новое, путешествовать, быть гибким к переменам.",
  6:"вкладываться в семью, дом, любовь и заботу.",
  7:"учиться, отдыхать, восстанавливать силы, познавать себя.",
  8:"двигать карьеру и финансы, брать ответственность.",
  9:"завершать дела, отпускать лишнее, помогать другим.",
};
const DAY = {
  1:"День начинаний. Сделай первый шаг — инициатива сегодня в плюс.",
  2:"День тепла и союзов. Договаривайся, поддержи близких.",
  3:"День общения и идей. Встречи, творчество, лёгкость.",
  4:"День дел и порядка. Спокойно разбери задачи — будет приятно.",
  5:"День перемен. Возможны приятные сюрпризы — лови момент.",
  6:"День заботы и уюта. Уделите время дому и любимым.",
  7:"День тишины и мыслей. Хорош для учёбы и отдыха.",
  8:"День результата. Удачен для важных дел и финансов.",
  9:"День завершений. Доведи начатое и порадуй кого-то добром.",
};
// Сюцай: число сознания (день) и миссия (вся дата)
const SYUCAI_MIND = {
  1:"Ум лидера: ясность цели, воля, умение начинать и вести за собой.",
  2:"Ум дипломата: чуткость, баланс, умение договариваться и поддерживать.",
  3:"Ум творца: яркость, общительность, лёгкость идей и самовыражения.",
  4:"Ум аналитика: глубина, интуиция, поиск истины и справедливости.",
  5:"Ум свободы: гибкость, любознательность, смелость пробовать новое.",
  6:"Ум заботы: ответственность, гармония, любовь к людям и красоте.",
  7:"Ум мудреца: вдумчивость, духовность, тяга к знанию и смыслу.",
  8:"Ум стратега: воля к результату, чувство ресурса, умение управлять.",
  9:"Ум гуманиста: широта взгляда, мудрость, стремление отдавать.",
};
const SYUCAI_MISSION = {
  1:"Миссия первопроходца: вести, начинать новое, быть примером самостоятельности.",
  2:"Миссия миротворца: соединять людей, создавать согласие и поддержку.",
  3:"Миссия вдохновителя: дарить радость, творить, нести лёгкость и слово.",
  4:"Миссия наставника: видеть истину, честно вести и обучать других.",
  5:"Миссия исследователя: приносить перемены, свободу и новый опыт.",
  6:"Миссия хранителя: создавать тепло, заботу, гармонию и красоту.",
  7:"Миссия мудреца: искать и передавать знание, углублять понимание.",
  8:"Миссия созидателя: строить, управлять и приумножать во благо.",
  9:"Миссия служения: помогать миру, объединять и завершать циклы добром.",
};
const CAREER = {
  1:"Лидер и первопроходец — своё дело, управление, запуск проектов.",
  2:"Дипломат и партнёр — команда, переговоры, посредничество, HR.",
  3:"Творец и коммуникатор — медиа, продажи, искусство, блогинг.",
  4:"Системщик — инженерия, финансы, аналитика, надёжные ремёсла.",
  5:"Человек перемен — маркетинг, продажи, путешествия, всё живое.",
  6:"Заботливый профи — медицина, обучение, сервис, красота, дизайн.",
  7:"Эксперт — наука, IT, исследования, консалтинг, психология.",
  8:"Управленец — бизнес, финансы, масштаб; ты умеешь добиваться.",
  9:"Гуманист — помощь людям, искусство, наставничество, НКО.",
  11:"Вдохновитель — психология, коучинг, духовные практики, сцена.",
  22:"Строитель систем — большие проекты, архитектура дела.",
  33:"Учитель — наставничество, забота, поддержка и обучение людей.",
};
const MATRIX_CELLS = {
  1:{name:"Характер, воля",levels:{0:"Характер мягкий, растёт через опыт.",1:"Мягкий, уступчивый, добрый.",2:"Спокойный, готов к компромиссу.",3:"Золотая середина — гибкость со стержнем.",4:"Сильная воля и лидерские задатки."}},
  2:{name:"Энергия",levels:{0:"Энергию приятно набирать извне — от людей и природы.",1:"Бережёт силы, выбирает важное.",2:"Энергии хватает на себя и близких.",3:"Высокая, тёплая энергетика.",4:"Мощная энергетика, заряжает других."}},
  3:{name:"Интерес, познание",levels:{0:"Тяга к творчеству и людям.",1:"Интерес к наукам переменчив.",2:"Способности к порядку и анализу.",3:"Яркий аналитический ум."}},
  4:{name:"Здоровье",levels:{0:"Здоровью — бережное внимание.",1:"Среднее, зависит от привычек.",2:"Крепкое здоровье.",3:"Отличная выносливость."}},
  5:{name:"Логика, интуиция",levels:{0:"Сильна интуиция — учись доверять и расчёту.",1:"Логика крепнет с опытом.",2:"Хорошо развитая логика.",3:"Логика и интуиция в связке.",4:"Сильная интуиция и чутьё."}},
  6:{name:"Труд, мастерство",levels:{0:"Труду нужен смысл и вдохновение.",1:"Работает по необходимости.",2:"Любит и умеет делать руками.",3:"Прирождённый мастер."}},
  7:{name:"Удача, талант",levels:{0:"Удачу создаёшь сам — талант через дело.",1:"Способности есть, развивай.",2:"Заметный талант и везение.",3:"Яркий дар и лёгкость судьбы."}},
  8:{name:"Доброта, забота",levels:{0:"Доброта раскрывается с годами.",1:"Заботлив в важном.",2:"Добрый, обязательный, тёплый.",3:"Большое, щедрое сердце."}},
  9:{name:"Память, ум",levels:{0:"Память приятно тренировать.",1:"Помнит то, что важно.",2:"Хорошая память и смекалка.",3:"Острый ум, лёгкая обучаемость."}},
};
const LINES = [
  {n:"Самооценка",cells:[1,2,3]},{n:"Семейность",cells:[4,5,6]},{n:"Стабильность",cells:[7,8,9]},
  {n:"Целеустремлённость",cells:[1,4,7]},{n:"Привязанность к семье",cells:[2,5,8]},{n:"Талант",cells:[3,6,9]},
  {n:"Духовность",cells:[1,5,9]},{n:"Темперамент",cells:[3,5,7]},
];
const TAROT = [
  ["Шут","Начало, спонтанность, чистый потенциал, лёгкий шаг в новое."],
  ["Маг","Воля, мастерство, ресурсы под рукой — время действовать."],
  ["Жрица","Интуиция, тихое знание, доверие себе."],
  ["Императрица","Изобилие, забота, расцвет и красота."],
  ["Император","Структура, опора, уверенность."],
  ["Иерофант","Наставничество, традиция, ценности."],
  ["Влюблённые","Союз, гармония, важный выбор сердца."],
  ["Колесница","Движение вперёд, фокус, победа воли."],
  ["Сила","Мягкая мощь, тепло, внутренняя стойкость."],
  ["Отшельник","Поиск ответов внутри, мудрость, покой."],
  ["Колесо Фортуны","Добрые перемены, удачный поворот."],
  ["Справедливость","Баланс, честность, ясные решения."],
  ["Повешенный","Пауза, новый взгляд, принятие."],
  ["Смерть","Обновление, завершение старого ради нового."],
  ["Умеренность","Гармония, мера, золотая середина."],
  ["Дьявол","Привычки и соблазны — мягко освобождайся."],
  ["Башня","Перемены ради света, очищение."],
  ["Звезда","Надежда, вдохновение, исцеление."],
  ["Луна","Интуиция, мечты, чуткость к скрытому."],
  ["Солнце","Радость, успех, тепло и ясность."],
  ["Суд","Пробуждение, новый зов, переоценка."],
  ["Мир","Завершение цикла, целостность, гармония."],
];

// ---------- РАСЧЁТЫ ----------
const reduce = (n, keepMaster = true) => {
  while (n > 9 && !(keepMaster && [11,22,33].includes(n)))
    n = String(n).split("").reduce((a,d)=>a+ +d,0);
  return n;
};
const lifePath = (d,m,y) => reduce(`${d}${m}${y}`.split("").reduce((a,c)=>a+ +c,0));
const personalYear = (d,m,year) => reduce(reduce(d,false)+reduce(m,false)+reduce(year,false), false);
const personalDay = (bd,bm,ty,tm,td) => {
  const py = reduce(reduce(bd,false)+reduce(bm,false)+reduce(ty,false), false);
  const pm = reduce(py + reduce(tm,false), false);
  return reduce(pm + reduce(td,false), false);
};
function buildMatrix(d,m,y){
  const sumD=(n)=>String(Math.abs(n)).split("").reduce((a,b)=>a+ +b,0);
  const dd=`${d}${m}${y}`.split("").map(Number);
  const A1=dd.reduce((a,b)=>a+b,0),A2=sumD(A1),A3=A1-2*(+String(d)[0]),A4=sumD(A3);
  const all=[...dd,...String(A1).split(""),...String(A2).split(""),...String(Math.abs(A3)).split(""),...String(A4).split("")].map(Number);
  const counts={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0}; all.forEach(n=>{if(n>=1&&n<=9)counts[n]++});
  return { counts, work:[A1,A2,A3,A4] };
}
const sunSign = (d,m) => ZODIAC.find(z=>(m===z.from[0]&&d>=z.from[1])||(m===z.to[0]&&d<=z.to[1]))||ZODIAC[9];
const chineseSign = (y) => CHINESE[((y-4)%12+12)%12];
const shuffle = (a) => [...a].sort(()=>Math.random()-0.5);

// ---------- ХРАНИЛИЩЕ ----------
async function saveData(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }
async function loadData(k){ try{ const s=localStorage.getItem(k); return s?JSON.parse(s):null; }catch(e){ return null; } }
const KEY_ACC="cifro:account", KEY_HIST="cifro:history", KEY_PRO="cifro:premium";

// связь с сервером (база данных / статус оплаты)
function clientId(){ let id=localStorage.getItem("cifro:id"); if(!id){ id="u"+Date.now().toString(36)+Math.random().toString(36).slice(2,7); localStorage.setItem("cifro:id",id);} return id; }
async function apiRegister(name,dob){ try{ await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:clientId(),name,dob})}); }catch(e){} }
async function apiStatus(){ try{ const r=await fetch("/api/status?id="+clientId()); const d=await r.json(); return !!d.paid; }catch(e){ return false; } }
async function apiConfig(){ try{ const r=await fetch("/api/config"); return await r.json(); }catch(e){ return {}; } }

// ---------- ИИ ----------
const SAFE = `Пиши тепло, по-доброму и с поддержкой, простым языком, на «ты». Давай глубокий, но понятный разбор и практические подсказки. Только позитивный, обнадёживающий настрой: никаких пугающих, фаталистичных или негативных предсказаний, никаких тем болезней с плохим исходом, смерти, вреда себе. Подчёркивай свободу выбора — это подсказки для размышления, а не приговор. Если человек делится тяжёлыми чувствами — мягко поддержи и по-доброму предложи опереться на близких или специалиста, без каких-либо инструкций.`;
async function ask(messages, system){
  try{
    const res = await fetch("/api/oracle",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ system, messages, max_tokens:1000 }),
    });
    const data = await res.json();
    if(!data || !data.content) return "Связь сейчас прервалась 🙏 Попробуй ещё разок через минутку.";
    return data.content.map(c=>c.type==="text"?c.text:"").join("\n").trim();
  }catch(e){ return "Связь сейчас прервалась 🙏 Попробуй ещё разок через минутку."; }
}

// ---------- UI ПРИМИТИВЫ ----------
const Blobs = () => (
  <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
    <div style={{ position:"absolute", top:-60, right:-40, width:240, height:240, borderRadius:"50%",
      background:"radial-gradient(circle,rgba(124,92,255,.18),transparent 70%)", animation:"blob 9s ease-in-out infinite" }} />
    <div style={{ position:"absolute", bottom:40, left:-50, width:220, height:220, borderRadius:"50%",
      background:"radial-gradient(circle,rgba(255,138,91,.18),transparent 70%)", animation:"blob 11s ease-in-out infinite" }} />
  </div>
);
const Card = ({ children, style }) => (
  <div className="reveal" style={{ background:C.card, border:`1px solid ${C.line}`, borderRadius:22,
    padding:20, boxShadow:"0 8px 30px rgba(90,70,160,.08)", ...style }}>{children}</div>
);
const h3 = { fontFamily:"'Quicksand',sans-serif", color:C.ink, fontSize:18, margin:"0 0 6px", fontWeight:700 };
const pp = { fontSize:16.5, lineHeight:1.6, color:C.ink, margin:0, fontFamily:"'Nunito',sans-serif" };
const bigBtn = { width:"100%", padding:"14px", borderRadius:16, border:"none", cursor:"pointer",
  background:grad, color:"#fff", fontFamily:"'Quicksand',sans-serif", fontSize:15.5, fontWeight:700, letterSpacing:.3 };
const ghostBtn = { ...bigBtn, background:"transparent", border:`2px solid ${C.line}`, color:C.violetD };
const chip = { flex:1, padding:"10px", borderRadius:14, cursor:"pointer", border:`2px solid ${C.line}`,
  background:C.soft, color:C.violetD, fontFamily:"'Quicksand',sans-serif", fontSize:13.5, fontWeight:700 };

// ============================================================
//  ПРИЛОЖЕНИЕ
// ============================================================
export default function App(){
  const [stage,setStage]=useState("intro");
  const [tab,setTab]=useState("profile");
  const [form,setForm]=useState({ name:"", day:"", month:"", year:"" });
  const [saveOn,setSaveOn]=useState(true);
  const [profile,setProfile]=useState(null);
  const [account,setAccount]=useState(null);
  const [history,setHistory]=useState([]);
  const [premium,setPremium]=useState(false);
  const [paywall,setPaywall]=useState(false);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{ (async()=>{
    const a=await loadData(KEY_ACC), h=await loadData(KEY_HIST), pr=await loadData(KEY_PRO);
    if(a)setAccount(a); if(h)setHistory(h); if(pr)setPremium(true);
    if(await apiStatus()){ setPremium(true); await saveData(KEY_PRO,true); }
    setLoaded(true);
  })(); },[]);

  const build=(name,d,m,y)=>{
    const sun=sunSign(d,m), lp=lifePath(d,m,y), now=new Date().getFullYear();
    return { name,d,m,y,sun,lp, soul:reduce(d,false), chinese:chineseSign(y), personalYearNow:personalYear(d,m,now),
      forecast:Array.from({length:9},(_,i)=>({ year:now+i, num:personalYear(d,m,now+i) })) };
  };
  const start=async()=>{
    const d=+form.day,m=+form.month,y=+form.year;
    if(!form.name||d<1||d>31||m<1||m>12||y<1900||y>2025) return;
    setProfile(build(form.name,d,m,y));
    if(saveOn){ const a={name:form.name,d,m,y}; setAccount(a); await saveData(KEY_ACC,a); }
    apiRegister(form.name, `${d}.${m}.${y}`);
    setStage("result"); setTab("profile");
  };
  const enterSaved=()=>{ setProfile(build(account.name,account.d,account.m,account.y)); setStage("result"); setTab("profile"); };
  const addHistory=async(item)=>{ const e={ id:Date.now(), ts:new Date().toLocaleString("ru-RU"), ...item };
    const next=[e,...history]; setHistory(next); await saveData(KEY_HIST,next); };
  const delHistory=async(id)=>{ const next=history.filter(h=>h.id!==id); setHistory(next); await saveData(KEY_HIST,next); };
  const unlock=async()=>{ setPremium(true); await saveData(KEY_PRO,true); setPaywall(false); };

  if(typeof window!=="undefined" && window.location.hash==="#admin") return <AdminPanel/>;

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(180deg,#fdf4ef,#f1ecfb)`,
      fontFamily:"'Nunito',sans-serif", position:"relative", color:C.ink }}>
      <Fonts/><Blobs/>
      <div style={{ position:"relative", zIndex:1, maxWidth:560, margin:"0 auto", padding:"22px 16px 56px" }}>
        {stage==="intro"
          ? <Intro {...{form,setForm,start,saveOn,setSaveOn,account,enterSaved,loaded}}/>
          : <Result {...{profile,tab,setTab,history,addHistory,delHistory,saveOn,premium,
              openPaywall:()=>setPaywall(true), reset:()=>setStage("intro")}}/>}
        <Disclaimer/>
      </div>
      {paywall && <Paywall onClose={()=>setPaywall(false)} onUnlock={unlock}/>}
    </div>
  );
}

// ---------- ВВОД / ВХОД ----------
function Intro({ form,setForm,start,saveOn,setSaveOn,account,enterSaved,loaded }){
  const inp=(k,ph,max)=>(
    <input value={form[k]} placeholder={ph} inputMode={k==="name"?"text":"numeric"} maxLength={max}
      onChange={e=>setForm({...form,[k]:e.target.value.replace(k==="name"?"":/\D/g,"")})}
      style={{ flex:1, minWidth:0, padding:"13px 14px", borderRadius:14, fontSize:16.5,
        background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none" }}/>
  );
  return (
    <div>
      <div className="reveal" style={{ textAlign:"center", margin:"18px 0 22px" }}>
        <div style={{ fontSize:46 }}>✨🔢</div>
        <h1 style={{ fontFamily:"'Quicksand',sans-serif", fontSize:32, margin:"6px 0 2px", fontWeight:700,
          background:grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Цифрология</h1>
        <p style={{ color:C.inkSoft, fontSize:18, margin:0 }}>тёплый разбор тебя по дате рождения</p>
      </div>
      {loaded && account && (
        <Card style={{ marginBottom:14, textAlign:"center" }}>
          <p style={{ margin:"0 0 12px", fontSize:19 }}>С возвращением, <b style={{color:C.violetD}}>{account.name}</b> 👋</p>
          <button onClick={enterSaved} style={bigBtn}>Открыть мой профиль</button>
        </Card>
      )}
      <Card>
        <p style={{ ...pp, color:C.inkSoft, margin:"0 0 14px" }}>
          {account ? "Или сделай новый разбор:" : "Привет! Введи имя и дату рождения — и я расскажу о тебе много доброго и полезного 🌿"}
        </p>
        {inp("name","Имя",24)}
        <div style={{ display:"flex", gap:8, marginTop:10 }}>{inp("day","ДД",2)}{inp("month","ММ",2)}{inp("year","ГГГГ",4)}</div>
        <label style={{ display:"flex", alignItems:"center", gap:10, marginTop:16, cursor:"pointer", color:C.inkSoft, fontSize:16 }}>
          <span onClick={()=>setSaveOn(!saveOn)} style={{ width:24, height:24, borderRadius:8, flex:"none",
            border:`2px solid ${C.violet}`, display:"flex", alignItems:"center", justifyContent:"center",
            background:saveOn?grad:"transparent", color:"#fff", fontWeight:800 }}>{saveOn?"✓":""}</span>
          <span onClick={()=>setSaveOn(!saveOn)}>Сохранять мои разборы (личный кабинет)</span>
        </label>
        <button onClick={start} style={{ ...bigBtn, marginTop:18 }}>Узнать о себе ✨</button>
      </Card>
    </div>
  );
}

// ---------- РЕЗУЛЬТАТ ----------
function Result({ profile,tab,setTab,history,addHistory,delHistory,saveOn,premium,openPaywall,reset }){
  const tabs=[["profile","✨ Профиль"],["natal","🪔 Натал"],["syu","☯️ Сюцай"],["matrix","🔢 Матрица"],["day","☀️ День"],["forecast","🗓️ Прогноз"],
    ["love","💞 Пара"],["career","💼 Работа"],["life","💡 Лайфхаки"],["tarot","🃏 Таро"],["chat","💬 Чат"],["history","📁 Кабинет"]];
  const common={ p:profile, save:saveOn?addHistory:null, premium, openPaywall };
  return (
    <div>
      <div className="reveal" style={{ textAlign:"center", marginBottom:14 }}>
        <span onClick={reset} style={{ color:C.inkSoft, fontSize:15, cursor:"pointer", float:"left" }}>← выход</span>
        {!premium && <span onClick={openPaywall} style={{ float:"right", fontSize:13, fontWeight:700, color:"#fff",
          background:grad, padding:"4px 12px", borderRadius:20, cursor:"pointer" }}>★ Премиум</span>}
        {premium && <span style={{ float:"right", fontSize:13, fontWeight:700, color:C.mint }}>★ Премиум активен</span>}
        <h2 style={{ fontFamily:"'Quicksand',sans-serif", fontSize:24, margin:0, fontWeight:700 }}>{profile.name}</h2>
        <p style={{ color:C.inkSoft, margin:"2px 0 0", fontSize:15 }}>{profile.d}.{profile.m}.{profile.y}</p>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
        {tabs.map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{ flex:"1 0 auto", padding:"9px 13px", borderRadius:14,
            cursor:"pointer", fontFamily:"'Quicksand',sans-serif", fontSize:13.5, fontWeight:700, whiteSpace:"nowrap",
            border:`2px solid ${tab===k?C.violet:C.line}`, background:tab===k?C.violet:C.card,
            color:tab===k?"#fff":C.inkSoft }}>{l}</button>
        ))}
      </div>
      {tab==="profile" && <ProfileTab {...common}/>}
      {tab==="natal"   && <NatalTab   {...common}/>}
      {tab==="syu"     && <SyucaiTab  {...common}/>}
      {tab==="matrix"  && <MatrixTab  {...common}/>}
      {tab==="day"     && <DayTab     {...common}/>}
      {tab==="forecast"&& <ForecastTab{...common}/>}
      {tab==="love"    && <CompatibilityTab {...common}/>}
      {tab==="career"  && <CareerTab  {...common}/>}
      {tab==="life"    && <LifehacksTab {...common}/>}
      {tab==="tarot"   && <TarotTab   {...common}/>}
      {tab==="chat"    && <ChatTab    {...common}/>}
      {tab==="history" && <HistoryTab history={history} del={delHistory} saveOn={saveOn}/>}
    </div>
  );
}

const Stat=({big,label,sub})=>(
  <div style={{ textAlign:"center", flex:1 }}>
    <div style={{ fontSize:32, color:C.violetD, fontFamily:"'Quicksand',sans-serif", fontWeight:700 }}>{big}</div>
    <div style={{ fontSize:12.5, color:C.inkSoft, textTransform:"uppercase", letterSpacing:.5 }}>{label}</div>
    {sub && <div style={{ fontSize:15, marginTop:2 }}>{sub}</div>}
  </div>
);

function ProfileTab({ p,save,premium,openPaywall }){
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card style={{ display:"flex", gap:8 }}>
        <Stat big={p.sun.s} label="Знак" sub={p.sun.n}/><Stat big={p.soul} label="Душа"/><Stat big={p.lp} label="Путь"/><Stat big={p.personalYearNow} label="Год"/>
      </Card>
      <Card>
        <h3 style={h3}>☉ {p.sun.n} · стихия {p.sun.el}</h3>
        <p style={pp}>Солнце в знаке {p.sun.n} задаёт твою тёплую природу и то, как ты светишь миру.</p>
        <h3 style={{ ...h3, marginTop:14 }}>🔢 Число жизненного пути — {p.lp}</h3>
        <p style={pp}>{LIFE_PATH[p.lp]}</p>
        <h3 style={{ ...h3, marginTop:14 }}>💗 Число души — {p.soul}</h3>
        <p style={pp}>{SOUL[p.soul]}</p>
        <h3 style={{ ...h3, marginTop:14 }}>🐉 Год по восточному календарю — {p.chinese}</h3>
        <p style={pp}>Год {p.chinese} добавляет тебе свои славные черты.</p>
      </Card>
      <AISection {...{premium,openPaywall,save}} p={p} histType="Портрет личности" title="Глубокий портрет личности" cta="Раскрыть подробный портрет"
        prompt={`Сделай глубокий, тёплый и структурный портрет: ${p.name}, знак ${p.sun.n} (${p.sun.el}), число пути ${p.lp}, число души ${p.soul}, восточный знак ${p.chinese}. Раскрой: 1) сильные стороны и таланты, 2) как мыслит и чувствует, 3) что важно для души и в отношениях, 4) зоны роста по-доброму, 5) тёплое напутствие. 5-6 абзацев.`}/>
    </div>
  );
}

// ---------- НАТАЛЬНАЯ КАРТА ----------
function NatalTab({ p,save,premium,openPaywall }){
  const [time,setTime]=useState("");
  const [place,setPlace]=useState("");
  const sys=`Ты — мудрый наставник «Цифрологии»: опытный ведический астролог (джйотиш) и нумеролог. Говоришь спокойно, тепло и глубоко, как тибетский монах — с мягкостью, ясностью и заботой. Объясняй понятия ведической астрологии (лагна-асцендент, Луна и ум, ключевые планеты, дхарма-предназначение, кармические уроки) бережно и простым языком, без пугающих слов. ${SAFE}`;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <h3 style={h3}>🪔 Натальная карта</h3>
        <p style={{ ...pp, color:C.inkSoft, margin:"4px 0 12px" }}>Укажи время и город рождения, если знаешь — так точнее лягут асцендент и Луна. Это необязательно.</p>
        <div style={{ display:"flex", gap:8 }}>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)}
            style={{ flex:1, padding:"12px 14px", borderRadius:14, fontSize:16.5, background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none", colorScheme:"light" }}/>
          <input value={place} onChange={e=>setPlace(e.target.value)} placeholder="Город рождения"
            style={{ flex:2, minWidth:0, padding:"12px 14px", borderRadius:14, fontSize:16.5, background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none" }}/>
        </div>
      </Card>
      <AISection key={`${time}|${place}`} {...{premium,openPaywall,save}} p={p} sys={sys}
        histType="Натальная карта" title="Детальный разбор натальной карты" cta="Раскрыть натальную карту"
        prompt={`Сделай детальный, тёплый разбор по натальной карте и нумерологии как ведический астролог и нумеролог. Человек: ${p.name}, дата рождения ${p.d}.${p.m}.${p.y}${time?`, время рождения ${time}`:", время рождения неизвестно"}${place?`, место рождения ${place}`:""}. Данные: солнечный знак ${p.sun.n} (стихия ${p.sun.el}), число пути ${p.lp}, число души ${p.soul}, восточный знак ${p.chinese}. Раскрой по разделам: 1) Личность и асцендент-лагна — как человек проявляется в мире; 2) Луна и эмоциональный мир; 3) Предназначение и кармические задачи (дхарма); 4) Любовь, дело и здоровье; 5) Сильные стороны по стихии и числам. Затем — прогноз по годам на ближайшие 5 лет (по 1-2 предложения на год). В конце — мягкое благословение-напутствие. Доступно, без жаргона, только в позитивном ключе.`}/>
      <Card style={{ background:C.soft }}>
        <p style={{ ...pp, fontSize:14, color:C.inkSoft, margin:0 }}>
          🔮 Для максимально точной карты (дома, точные положения планет) в рабочей версии подключаются астрологические эфемериды/API по времени и месту рождения. Здесь разбор формирует ИИ-наставник по доступным данным.
        </p>
      </Card>
    </div>
  );
}

// ---------- СЮЦАЙ ----------
function SyucaiTab({ p,save,premium,openPaywall }){
  const cons=p.soul;
  const mission=reduce(`${p.d}${p.m}${p.y}`.split("").reduce((a,c)=>a+ +c,0), false);
  const sys=`Ты — тёплый наставник практики Сюцай (числовая психология по дате рождения, основанная Жанатом Кожамжаровым). Главное в Сюцай: нет фатальности — у каждой энергии есть светлая и теневая сторона, и её можно осознанно развивать. Говори бережно, глубоко и с поддержкой, помогай человеку идти к «эго, ищущему счастья». ${SAFE}`;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card style={{ background:C.soft }}>
        <h3 style={h3}>☯️ Что такое Сюцай</h3>
        <p style={{ ...pp, color:C.inkSoft, margin:0 }}>Практика самопознания по дате рождения. В отличие от обычной нумерологии — без фатальности: каждая энергия имеет светлую и теневую сторону, и её можно развивать. Три опоры: число сознания, число миссии и матрица.</p>
      </Card>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ ...h3, margin:0 }}>🧠 Число сознания</h3>
          <span style={{ fontSize:26, fontFamily:"'Quicksand',sans-serif", fontWeight:700, color:C.violetD }}>{cons}</span>
        </div>
        <p style={{ ...pp, color:C.inkSoft, margin:"2px 0 8px", fontSize:14.5 }}>Вектор эго — как ты думаешь и действуешь (по дню рождения).</p>
        <p style={pp}>{SYU_CONS[cons]}</p>
      </Card>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ ...h3, margin:0 }}>🎯 Число миссии</h3>
          <span style={{ fontSize:26, fontFamily:"'Quicksand',sans-serif", fontWeight:700, color:C.violetD }}>{mission}</span>
        </div>
        <p style={{ ...pp, color:C.inkSoft, margin:"2px 0 8px", fontSize:14.5 }}>Предназначение — раскрывается в полной мере к 33 годам (по всей дате).</p>
        <p style={pp}>{SYU_MIS[mission]}</p>
      </Card>
      <Card>
        <h3 style={h3}>🌱 Три состояния эго</h3>
        <p style={pp}><b>Страдающее эго</b> — живёшь импульсами «хочу / не хочу». <b>Эго безразличия</b> — устал, не действуешь. <b>Эго, ищущее счастья</b> — растёшь через осознанность и знание. Путь Сюцай — про третье.</p>
        <p style={{ ...pp, color:C.inkSoft, fontSize:14.5, marginTop:8 }}>Полную матрицу энергий смотри во вкладке «🔢 Матрица».</p>
      </Card>
      <AISection {...{premium,openPaywall,save}} p={p} sys={sys}
        histType="Сюцай" title="Разбор по Сюцай и прогноз" cta="Раскрыть разбор Сюцай"
        prompt={`Сделай тёплый разбор по практике Сюцай для ${p.name} (дата ${p.d}.${p.m}.${p.y}). Число сознания ${cons}, число миссии ${mission}. Раскрой: 1) как работает энергия числа сознания — светлая и теневая стороны, как развивать светлую; 2) число миссии — предназначение и как к нему идти (учитывая раскрытие к 33 годам); 3) как перейти от «страдающего эго» к «эго, ищущему счастья» — конкретные шаги; 4) добрый прогноз на ближайшие годы. Без фатальности и страха, только поддержка и рост. 5-6 абзацев.`}/>
    </div>
  );
}

function MatrixTab({ p,save,premium,openPaywall }){
  const { counts:c, work } = buildMatrix(p.d,p.m,p.y);
  const order=[1,4,7,2,5,8,3,6,9];
  const cs=(n)=>c[n]?String(n).repeat(c[n]):"—";
  const interp=(n)=>{ const lv=MATRIX_CELLS[n].levels; return lv[Math.min(c[n],4)]||lv[3]||lv[2]; };
  const ls=(cells)=>cells.reduce((a,n)=>a+c[n],0);
  const str=(v)=>v===0?"пусто":v<=2?"средняя":v<=4?"сильная":"очень сильная";
  const promptCounts=[1,2,3,4,5,6,7,8,9].map(n=>`${n}×${c[n]}`).join(", ");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <h3 style={{ ...h3, textAlign:"center" }}>Квадрат Пифагора</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:6 }}>
          {order.map(n=>(
            <div key={n} style={{ borderRadius:16, padding:"12px 6px", textAlign:"center", minHeight:80,
              border:`2px solid ${c[n]?C.violet:C.line}`, background:c[n]?C.soft:"#fff" }}>
              <div style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, fontSize:c[n]>3?20:24,
                color:c[n]?C.violetD:C.inkSoft, wordBreak:"break-all" }}>{cs(n)}</div>
              <div style={{ fontSize:12, color:C.inkSoft, marginTop:4, lineHeight:1.2 }}>{MATRIX_CELLS[n].name}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", color:C.inkSoft, fontSize:14, marginTop:10 }}>Рабочие числа: {work.join(" · ")}</div>
      </Card>
      <Card>
        <h3 style={h3}>Что значат ячейки</h3>
        {[1,2,3,4,5,6,7,8,9].map(n=>(
          <div key={n} style={{ padding:"8px 0", borderBottom:`1px solid ${C.line}` }}>
            <span style={{ color:C.violetD, fontWeight:700 }}>{cs(n)} · {MATRIX_CELLS[n].name}</span>
            <p style={{ ...pp, fontSize:15.5, margin:"2px 0 0" }}>{interp(n)}</p>
          </div>
        ))}
      </Card>
      <Card>
        <h3 style={h3}>Линии судьбы</h3>
        {LINES.map(l=>{ const v=ls(l.cells); return (
          <div key={l.n} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${C.line}` }}>
            <span style={{ fontSize:16 }}>{l.n} <span style={{ color:C.inkSoft, fontSize:13.5 }}>({l.cells.join("-")})</span></span>
            <span style={{ color:"#fff", fontSize:13, background:v>=3?C.mint:C.violet, padding:"2px 10px", borderRadius:20 }}>{v} · {str(v)}</span>
          </div>
        );})}
      </Card>
      <AISection {...{premium,openPaywall,save}} p={p} histType="Психоматрица" title="Разбор психоматрицы и прогноз" cta="Раскрыть психоматрицу"
        prompt={`Тёплый разбор психоматрицы (квадрат Пифагора) для ${p.name}. Ячейки (цифра×кол-во): ${promptCounts}. Объясни простыми словами сильные стороны и зоны роста по ячейкам и линиям (самооценка, семья, стабильность, талант, духовность). Затем добрый прогноз: на что опереться, к чему идёшь, как раскрыть потенциал. 5-6 абзацев.`}/>
    </div>
  );
}

function DayTab({ p,save,premium,openPaywall }){
  const iso=(dt)=>dt.toISOString().slice(0,10);
  const tmr=new Date(); tmr.setDate(tmr.getDate()+1);
  const [d,setD]=useState(iso(tmr));
  const [ty,tm,td]=d.split("-").map(Number);
  const pd=personalDay(p.d,p.m,ty,tm,td);
  const human=new Date(ty,tm-1,td).toLocaleDateString("ru-RU",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const q=(o)=>{ const x=new Date(); x.setDate(x.getDate()+o); setD(iso(x)); };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <h3 style={h3}>На какую дату заглянуть?</h3>
        <div style={{ display:"flex", gap:8, margin:"10px 0" }}>
          <button onClick={()=>q(0)} style={chip}>Сегодня</button><button onClick={()=>q(1)} style={chip}>Завтра</button><button onClick={()=>q(7)} style={chip}>+ неделя</button>
        </div>
        <input type="date" value={d} onChange={e=>setD(e.target.value)} style={{ width:"100%", padding:"12px 14px",
          borderRadius:14, fontSize:16.5, background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none", colorScheme:"light" }}/>
      </Card>
      <Card style={{ textAlign:"center" }}>
        <div style={{ color:C.inkSoft, fontSize:15.5, textTransform:"capitalize" }}>{human}</div>
        <div style={{ fontSize:46, color:C.violetD, fontFamily:"'Quicksand',sans-serif", fontWeight:700, margin:"4px 0" }}>{pd}</div>
        <div style={{ color:C.inkSoft, fontSize:12.5, textTransform:"uppercase", marginBottom:8 }}>число дня</div>
        <p style={{ ...pp, margin:0 }}>{DAY[pd]}</p>
      </Card>
      <AISection key={d} {...{premium,openPaywall,save}} p={p} histType="Прогноз на день" title="Подробный добрый прогноз на день" cta="Раскрыть, что ждёт"
        prompt={`Тёплый прогноз на день ${human} для ${p.name} (знак ${p.sun.n}, число пути ${p.lp}). Число дня — ${pd} (${DAY[pd]}). Опиши: настроение дня, что приятно и удачно сделать, как провести время с пользой и радостью, мягкий совет и приятную мысль на день. 3-4 коротких абзаца.`}/>
    </div>
  );
}

function ForecastTab({ p,save,premium,openPaywall }){
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card style={{ background:C.soft }}>
        <h3 style={h3}>🗓️ Твой 9-летний цикл</h3>
        <p style={{ ...pp, color:C.inkSoft, margin:0 }}>Каждый год несёт свою тему. Они идут по кругу 1→9 и повторяются на новом витке. Вот что ждёт тебя год за годом:</p>
      </Card>
      {p.forecast.map((f,i)=>(
        <Card key={f.year} style={{ animationDelay:`${i*.05}s`, border:`2px solid ${i===0?C.violet:C.line}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <span style={{ fontFamily:"'Quicksand',sans-serif", fontSize:20, fontWeight:700, color:C.violetD }}>
              {f.year}{i===0 && <span style={{ fontSize:12.5, color:C.mint, marginLeft:8 }}>● сейчас</span>}
            </span>
            <span style={{ fontSize:13, color:"#fff", background:i===0?grad:C.violet, padding:"3px 11px", borderRadius:20 }}>{f.num} · {YEAR_THEME[f.num]}</span>
          </div>
          <p style={{ ...pp, margin:"0 0 6px" }}>{PERSONAL_YEAR[f.num]}</p>
          <p style={{ ...pp, fontSize:15, color:C.violetD, margin:0 }}>✦ Хорошо: {YEAR_FOCUS[f.num]}</p>
        </Card>
      ))}
      <AISection {...{premium,openPaywall,save}} p={p} histType="Прогноз на годы" title="Личный прогноз на 9 лет" cta="Составить мой прогноз"
        prompt={`Вдохновляющий персональный прогноз по годам для ${p.name} (знак ${p.sun.n}, число пути ${p.lp}, число души ${p.soul}). Личные годы: ${p.forecast.map(f=>`${f.year} — число ${f.num} (${YEAR_THEME[f.num]})`).join(", ")}. По 1-2 тёплых предложения на КАЖДЫЙ год: ключевая тема и добрая возможность. В конце — общее напутствие на весь цикл. Только позитивно.`}/>
    </div>
  );
}

// ---------- ПАРА ----------
function CompatibilityTab({ p,save,premium,openPaywall }){
  const [f,setF]=useState({ name:"", day:"", month:"", year:"" });
  const [pt,setPt]=useState(null);
  const inp=(k,ph,max)=>(
    <input value={f[k]} placeholder={ph} inputMode={k==="name"?"text":"numeric"} maxLength={max}
      onChange={e=>setF({...f,[k]:e.target.value.replace(k==="name"?"":/\D/g,"")})}
      style={{ flex:1, minWidth:0, padding:"12px 14px", borderRadius:14, fontSize:16.5, background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none" }}/>
  );
  const calc=()=>{ const d=+f.day,m=+f.month,y=+f.year; if(!f.name||d<1||d>31||m<1||m>12||y<1900||y>2025)return;
    setPt({ name:f.name,d,m,y,sun:sunSign(d,m),lp:lifePath(d,m,y) }); };
  if(!pt) return (
    <Card>
      <h3 style={h3}>💞 Кто твой партнёр?</h3>
      <p style={{ ...pp, color:C.inkSoft, margin:"4px 0 14px" }}>Введи имя и дату рождения второго человека.</p>
      {inp("name","Имя партнёра",24)}
      <div style={{ display:"flex", gap:8, marginTop:10 }}>{inp("day","ДД",2)}{inp("month","ММ",2)}{inp("year","ГГГГ",4)}</div>
      <button onClick={calc} style={{ ...bigBtn, marginTop:16 }}>Проверить совместимость</button>
    </Card>
  );
  const el=(a,b)=>{ if(a===b)return 78; const good=[["Огонь","Воздух"],["Земля","Вода"]],tough=[["Огонь","Вода"],["Земля","Воздух"]];
    const has=(arr)=>arr.some(([x,y])=>(a===x&&b===y)||(a===y&&b===x)); return has(good)?92:has(tough)?64:72; };
  const ns=Math.max(60,96-Math.abs(p.lp-pt.lp)*6);
  const score=Math.round(el(p.sun.el,pt.sun.el)*.6+ns*.4);
  const lbl=score>=85?"Сильное притяжение 💖":score>=72?"Хорошая совместимость 😊":"Есть над чем расти вместе 🌱";
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card style={{ textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center" }}>
          <div><div style={{ fontSize:34 }}>{p.sun.s}</div><div style={{ color:C.inkSoft, fontSize:14 }}>{p.name}</div></div>
          <div style={{ fontSize:26, color:C.coral }}>💞</div>
          <div><div style={{ fontSize:34 }}>{pt.sun.s}</div><div style={{ color:C.inkSoft, fontSize:14 }}>{pt.name}</div></div>
        </div>
        <div style={{ fontSize:46, fontFamily:"'Quicksand',sans-serif", fontWeight:700, color:C.violetD, marginTop:8 }}>{score}%</div>
        <div style={{ color:C.coral, fontWeight:700 }}>{lbl}</div>
        <div style={{ color:C.inkSoft, fontSize:14.5, marginTop:8 }}>{p.sun.n} ({p.sun.el}) · {p.lp} ↔ {pt.sun.n} ({pt.sun.el}) · {pt.lp}</div>
        <button onClick={()=>setPt(null)} style={{ ...ghostBtn, marginTop:14 }}>Сменить партнёра</button>
      </Card>
      <AISection key={`${pt.d}.${pt.m}.${pt.y}`} {...{premium,openPaywall,save}} p={p} histType="Совместимость" title="Тёплый разбор пары" cta="Раскрыть совместимость"
        prompt={`Разбери совместимость пары по-доброму. Первый: ${p.name}, ${p.sun.n} (${p.sun.el}), число ${p.lp}. Второй: ${pt.name}, ${pt.sun.n} (${pt.sun.el}), число ${pt.lp}. Индекс ${score}%. Опиши: в чём вы прекрасно дополняете друг друга, ваши сильные стороны как пары, маленькие различия и тёплые советы, как сделать союз ещё крепче. Без приговоров, бережно. Обращайся на «вы». 4-5 абзацев.`}/>
    </div>
  );
}

// ---------- РАБОТА ----------
function CareerTab({ p,save,premium,openPaywall }){
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <h3 style={h3}>💼 Твоя профессиональная природа</h3>
        <p style={pp}>{CAREER[p.lp]}</p>
        <h3 style={{ ...h3, marginTop:14 }}>Рабочая тема {new Date().getFullYear()} года</h3>
        <p style={pp}>{PERSONAL_YEAR[p.personalYearNow]}</p>
      </Card>
      <AISection {...{premium,openPaywall,save}} p={p} histType="Прогноз по работе" title="Прогноз по карьере и деньгам" cta="Раскрыть карьерный прогноз"
        prompt={`Добрый карьерный разбор для ${p.name} (знак ${p.sun.n}, ${p.sun.el}; число пути ${p.lp}; личный год ${p.personalYearNow}). Опиши: профессиональные суперсилы, подходящие сферы и роли, как комфортнее обращаться с деньгами, и вдохновляющий прогноз на год — возможности и приятные шаги к росту. Это поддержка и идеи, без финансовых гарантий. 4-5 абзацев.`}/>
    </div>
  );
}

// ---------- ЛАЙФХАКИ ----------
function LifehacksTab({ p,save,premium,openPaywall }){
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <h3 style={h3}>💡 Лайфхаки по твоей энергии</h3>
        <p style={{ ...pp, color:C.inkSoft }}>Маленькие добрые подсказки под твой характер и число — как жить легче, приятнее и в гармонии с собой.</p>
      </Card>
      <AISection {...{premium,openPaywall,save}} p={p} histType="Лайфхаки" title="Персональные лайфхаки" cta="Получить мои лайфхаки"
        prompt={`Дай ${p.name} (знак ${p.sun.n}, ${p.sun.el}, число пути ${p.lp}) 7 тёплых практичных лайфхаков по жизни под его характер: как восполнять энергию, организовать день, беречь отношения, расти в деле, радовать себя. Каждый — короткий, конкретный, добрый и выполнимый. Только позитив и поддержка. Оформи списком с эмодзи.`}/>
    </div>
  );
}

function TarotTab({ p,save,premium,openPaywall }){
  const [cards,setCards]=useState(null);
  const pos=["Прошлое","Настоящее","Будущее"];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {!cards ? (
        <Card style={{ textAlign:"center", padding:30 }}>
          <div style={{ fontSize:40, marginBottom:10 }}>🃏 🃏 🃏</div>
          <p style={{ ...pp, marginBottom:16 }}>Подумай о приятном вопросе и вытяни три карты.</p>
          <button onClick={()=>setCards(shuffle(TAROT).slice(0,3))} style={bigBtn}>Вытянуть карты</button>
        </Card>
      ) : (
        <>
          {cards.map((c,i)=>(
            <Card key={i} style={{ animationDelay:`${i*.12}s` }}>
              <div style={{ fontSize:12.5, color:C.inkSoft, textTransform:"uppercase", letterSpacing:.5 }}>{pos[i]}</div>
              <h3 style={{ ...h3, fontSize:20, margin:"2px 0 6px" }}>🃏 {c[0]}</h3>
              <p style={{ ...pp, margin:0 }}>{c[1]}</p>
            </Card>
          ))}
          <button onClick={()=>setCards(shuffle(TAROT).slice(0,3))} style={ghostBtn}>Перетянуть</button>
          <AISection {...{premium,openPaywall,save}} p={p} histType="Расклад Таро" title="Тёплое толкование расклада" cta="Истолковать расклад"
            prompt={`Истолкуй по-доброму расклад Таро для ${p.name}. Прошлое: ${cards[0][0]}. Настоящее: ${cards[1][0]}. Будущее: ${cards[2][0]}. Свяжи карты в светлую историю и дай мягкий обнадёживающий совет. 3-4 абзаца, на «ты».`}/>
        </>
      )}
    </div>
  );
}

// ---------- ЧАТ (3 сообщения бесплатно) ----------
function ChatTab({ p,premium,openPaywall,save }){
  const sys=`Ты — добрый ассистент "Цифрология", помогаешь через нумерологию, астрологию и таро как тёплые инструменты самопознания (не медицина, не гарантии). Клиент: ${p.name}, знак ${p.sun.n} (${p.sun.el}), число пути ${p.lp}, восточный знак ${p.chinese}, личный год ${p.personalYearNow}. Отвечай тепло и по делу, 2-4 абзаца. ${SAFE}`;
  const [msgs,setMsgs]=useState([{ role:"assistant", content:`Привет, ${p.name}! 🌿 Я тут, чтобы поддержать. О чём поговорим — отношения, дело, настроение, выбор?` }]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);
  const userCount=msgs.filter(m=>m.role==="user").length;
  const locked=!premium && userCount>=3;
  const send=async()=>{ if(!input.trim()||loading||locked)return;
    const next=[...msgs,{role:"user",content:input.trim()}]; setMsgs(next); setInput(""); setLoading(true);
    const r=await ask(next.map(m=>({role:m.role,content:m.content})),sys); setMsgs([...next,{role:"assistant",content:r}]); setLoading(false); };
  return (
    <Card style={{ padding:14 }}>
      <div className="scrollbox" style={{ maxHeight:400, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, paddingRight:4 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ alignSelf:m.role==="user"?"flex-end":"flex-start", maxWidth:"86%" }}>
            <div style={{ padding:"10px 14px", borderRadius:16, fontSize:16, lineHeight:1.5, whiteSpace:"pre-wrap",
              background:m.role==="user"?C.violet:C.soft, color:m.role==="user"?"#fff":C.ink }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ color:C.inkSoft, fontStyle:"italic", fontSize:15 }}>печатает…</div>}
        <div ref={endRef}/>
      </div>
      {locked ? (
        <div style={{ marginTop:12, textAlign:"center", background:C.soft, borderRadius:16, padding:16 }}>
          <p style={{ ...pp, margin:"0 0 10px" }}>Бесплатные вопросы на сегодня закончились 🙂 В премиуме — общение без ограничений.</p>
          <button onClick={openPaywall} style={bigBtn}>★ Открыть премиум</button>
        </div>
      ) : (
        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          <input value={input} placeholder="Напиши вопрос…" onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            style={{ flex:1, minWidth:0, padding:"12px 14px", borderRadius:14, fontSize:16, background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none" }}/>
          <button onClick={send} disabled={loading} style={{ padding:"0 18px", borderRadius:14, border:"none", cursor:"pointer", background:grad, color:"#fff", fontSize:18, fontWeight:700 }}>➤</button>
        </div>
      )}
      {!premium && !locked && <div style={{ textAlign:"center", color:C.inkSoft, fontSize:13, marginTop:8 }}>Бесплатно: {3-userCount} вопроса осталось</div>}
    </Card>
  );
}

// ---------- КАБИНЕТ ----------
function HistoryTab({ history,del,saveOn }){
  const [open,setOpen]=useState(null);
  if(!saveOn) return <Card style={{ textAlign:"center" }}><p style={pp}>Сохранение выключено. Включи «личный кабинет» на стартовом экране, чтобы хранить разборы.</p></Card>;
  if(!history.length) return <Card style={{ textAlign:"center" }}><p style={pp}>Здесь будут твои сохранённые разборы 🌿 Нажми «Сохранить» под любым разбором — и он появится тут.</p></Card>;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {history.map(h=>(
        <Card key={h.id}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div><div style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, color:C.violetD }}>{h.title}</div>
              <div style={{ color:C.inkSoft, fontSize:13.5 }}>{h.type} · {h.ts}</div></div>
            <span onClick={()=>del(h.id)} style={{ color:C.inkSoft, cursor:"pointer", fontSize:20 }}>✕</span>
          </div>
          {open===h.id ? <p style={{ ...pp, marginTop:10, whiteSpace:"pre-wrap" }}>{h.content}</p>
            : <span onClick={()=>setOpen(h.id)} style={{ color:C.violet, cursor:"pointer", fontSize:15, display:"inline-block", marginTop:8, fontWeight:700 }}>раскрыть ▾</span>}
        </Card>
      ))}
    </div>
  );
}

// ---------- ИИ-СЕКЦИЯ (премиум) ----------
function AISection({ p,title,cta,prompt,save,histType,premium,openPaywall,sys }){
  const [text,setText]=useState(""); const [loading,setLoading]=useState(false); const [saved,setSaved]=useState(false);
  if(!premium) return (
    <Card style={{ textAlign:"center", background:C.soft }}>
      <div style={{ fontSize:30 }}>🔒✨</div>
      <h3 style={{ ...h3, marginTop:6 }}>{title}</h3>
      <p style={{ ...pp, color:C.inkSoft, margin:"4px 0 14px" }}>Подробный персональный разбор доступен в премиуме.</p>
      <button onClick={openPaywall} style={bigBtn}>★ Открыть полный доступ</button>
    </Card>
  );
  const gen=async()=>{ setLoading(true); const r=await ask([{role:"user",content:prompt}], sys || `Ты — добрый ассистент "Цифрология". ${SAFE}`); setText(r); setLoading(false); };
  return (
    <Card>
      <h3 style={h3}>✨ {title}</h3>
      {text ? (
        <>
          <p style={{ ...pp, whiteSpace:"pre-wrap" }}>{text}</p>
          {save && <button onClick={()=>{ save({type:histType,title,content:text}); setSaved(true); }} disabled={saved}
            style={{ ...ghostBtn, marginTop:12, color:saved?C.mint:C.violetD, borderColor:saved?C.mint:C.line }}>{saved?"Сохранено ✓":"Сохранить в кабинет"}</button>}
        </>
      ) : <button onClick={gen} disabled={loading} style={{ ...bigBtn, marginTop:6 }}>{loading?"Думаю…":cta}</button>}
    </Card>
  );
}

// ---------- ОПЛАТА (2 варианта: разовая Kaspi и подписка) ----------
function Paywall({ onClose,onUnlock }){
  const [code,setCode]=useState(""); const [note,setNote]=useState(""); const [cfg,setCfg]=useState({}); const [checking,setChecking]=useState(false);
  useEffect(()=>{ (async()=>setCfg(await apiConfig()))(); },[]);
  const openKaspi=(label)=>{
    if(cfg.kaspiLink){ window.open(cfg.kaspiLink,"_blank"); setNote(`Открыли оплату Kaspi (${label}). После оплаты нажми «Я оплатил — проверить».`); }
    else setNote("Ссылка Kaspi ещё не настроена администратором. Зайди в админку (#admin) и вставь ссылку Kaspi.");
  };
  const checkPaid=async()=>{ setChecking(true); const paid=await apiStatus(); setChecking(false); if(paid)onUnlock(); else setNote("Оплата пока не подтверждена. Обычно доступ открывают в течение нескольких минут."); };
  const tryCode=()=>{ if(code.trim().toUpperCase()==="DEMO"){ onUnlock(); } else setNote("Промокод не подошёл. Для теста введи DEMO."); };
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:10, background:"rgba(40,30,70,.45)",
      display:"flex", alignItems:"flex-end", justifyContent:"center", padding:14 }}>
      <div onClick={e=>e.stopPropagation()} style={{ animation:"pop .25s ease both", width:"100%", maxWidth:520,
        background:"#fff", borderRadius:26, padding:22, maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:34 }}>✨</div>
          <h2 style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, fontSize:24, margin:"4px 0" }}>Премиум-доступ</h2>
          <p style={{ ...pp, color:C.inkSoft }}>Глубокие разборы, натальная карта, Сюцай, прогнозы, совместимость и чат без лимитов.</p>
        </div>
        <div style={{ marginTop:16, borderRadius:18, border:`2px solid ${C.line}`, padding:16 }}>
          <div style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, fontSize:18 }}>💳 Разовая оплата</div>
          <div style={{ color:C.inkSoft, fontSize:14.5, margin:"2px 0 6px" }}>Полный доступ к одному подробному разбору.</div>
          <div style={{ color:C.violetD, fontWeight:800, fontSize:20, marginBottom:8 }}>{cfg.price || "2 990 ₸"}</div>
          <button onClick={()=>openKaspi("разовая")} style={{ ...bigBtn, background:"#ff3b30" }}>Оплатить через Kaspi</button>
        </div>
        <div style={{ marginTop:12, borderRadius:18, border:`2px solid ${C.violet}`, background:C.soft, padding:16, position:"relative" }}>
          <div style={{ position:"absolute", top:-10, left:16, background:grad, color:"#fff", fontSize:10.5, fontWeight:700, padding:"2px 10px", borderRadius:20 }}>ВЫГОДНО</div>
          <div style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, fontSize:18 }}>♾️ Подписка</div>
          <div style={{ color:C.inkSoft, fontSize:14.5, margin:"2px 0 6px" }}>Все разборы и чат без ограничений на месяц.</div>
          <div style={{ color:C.violetD, fontWeight:800, fontSize:20, marginBottom:8 }}>{cfg.subPrice || "5 900 ₸ / мес"}</div>
          <button onClick={()=>openKaspi("подписка")} style={bigBtn}>Оформить подписку</button>
        </div>
        {note && <p style={{ ...pp, fontSize:14.5, color:C.inkSoft, background:C.soft, borderRadius:14, padding:12, marginTop:12 }}>{note}</p>}
        <button onClick={checkPaid} disabled={checking} style={{ ...ghostBtn, marginTop:12 }}>{checking?"Проверяю…":"Я оплатил — проверить доступ"}</button>
        <div style={{ display:"flex", gap:8, marginTop:10 }}>
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Промокод"
            style={{ flex:1, padding:"12px 14px", borderRadius:14, fontSize:16, background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none" }}/>
          <button onClick={tryCode} style={{ ...ghostBtn, width:"auto", padding:"0 18px" }}>Ввести</button>
        </div>
        <button onClick={onClose} style={{ width:"100%", marginTop:10, background:"none", border:"none", color:C.inkSoft, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Позже</button>
      </div>
    </div>
  );
}

// ---------- АДМИНКА ----------
function AdminPanel(){
  const [pass,setPass]=useState(""); const [authed,setAuthed]=useState(false);
  const [users,setUsers]=useState([]); const [cfg,setCfg]=useState({}); const [msg,setMsg]=useState("");
  const call=(body)=>fetch("/api/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const login=async()=>{ const r=await call({password:pass,action:"list"}); if(r.status!==200){ setMsg("Неверный пароль или база не подключена"); return; } const d=await r.json(); setUsers(d.users||[]); setCfg(d.config||{}); setAuthed(true); setMsg(""); };
  const setPaid=async(id,paid)=>{ await call({password:pass,action:"setPaid",id,paid}); login(); };
  const saveCfg=async()=>{ await call({password:pass,action:"setConfig",kaspiLink:cfg.kaspiLink,price:cfg.price,subPrice:cfg.subPrice}); setMsg("Настройки сохранены ✓"); };
  const paidCount=users.filter(u=>u.paid).length;
  const box={ minHeight:"100vh", background:"#f6f2ff", fontFamily:"'Nunito',sans-serif", color:C.ink, padding:"24px 16px" };
  const inpS={ width:"100%", padding:"12px 14px", borderRadius:12, fontSize:16, background:"#fff", border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none", marginTop:8 };
  if(!authed) return (
    <div style={box}><Fonts/>
      <div style={{ maxWidth:420, margin:"40px auto", background:"#fff", borderRadius:22, padding:24, border:`1px solid ${C.line}` }}>
        <h2 style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700 }}>🔐 Админка «Цифрология»</h2>
        <p style={{ ...pp, color:C.inkSoft, fontSize:15 }}>Введи пароль администратора (переменная ADMIN_PASSWORD на Vercel).</p>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Пароль" style={inpS}/>
        <button onClick={login} style={{ ...bigBtn, marginTop:12 }}>Войти</button>
        {msg && <p style={{ color:"#e0554b", fontSize:14.5, marginTop:10 }}>{msg}</p>}
        <a href="#" onClick={()=>{location.hash="";location.reload();}} style={{ display:"block", textAlign:"center", color:C.inkSoft, fontSize:14, marginTop:14 }}>← на сайт</a>
      </div>
    </div>
  );
  return (
    <div style={box}><Fonts/>
      <div style={{ maxWidth:720, margin:"0 auto" }}>
        <h2 style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, marginBottom:4 }}>📊 Админка</h2>
        <p style={{ color:C.inkSoft, marginBottom:16 }}>Всего: <b>{users.length}</b> · Оплатили: <b style={{color:C.mint}}>{paidCount}</b></p>

        <div style={{ background:"#fff", borderRadius:18, padding:18, border:`1px solid ${C.line}`, marginBottom:16 }}>
          <h3 style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, margin:"0 0 8px" }}>⚙️ Настройка оплаты Kaspi</h3>
          <label style={{ fontSize:14.5, color:C.inkSoft }}>Ссылка Kaspi на оплату (из приложения Kaspi → Бизнес → выставить счёт/ссылка)</label>
          <input value={cfg.kaspiLink||""} onChange={e=>setCfg({...cfg,kaspiLink:e.target.value})} placeholder="https://pay.kaspi.kz/..." style={inpS}/>
          <div style={{ display:"flex", gap:8 }}>
            <input value={cfg.price||""} onChange={e=>setCfg({...cfg,price:e.target.value})} placeholder="Цена разовая, напр. 2 990 ₸" style={inpS}/>
            <input value={cfg.subPrice||""} onChange={e=>setCfg({...cfg,subPrice:e.target.value})} placeholder="Цена подписки, напр. 5 900 ₸ / мес" style={inpS}/>
          </div>
          <button onClick={saveCfg} style={{ ...bigBtn, marginTop:12 }}>Сохранить настройки</button>
          {msg && <p style={{ color:C.mint, fontSize:14.5, marginTop:8 }}>{msg}</p>}
        </div>

        <div style={{ background:"#fff", borderRadius:18, padding:18, border:`1px solid ${C.line}` }}>
          <h3 style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, margin:"0 0 8px" }}>👥 Пользователи</h3>
          {!users.length && <p style={{ color:C.inkSoft }}>Пока никто не зарегистрировался.</p>}
          {users.map(u=>(
            <div key={u.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.line}`, gap:10 }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontWeight:700 }}>{u.name||"—"} <span style={{ color:C.inkSoft, fontWeight:400 }}>· {u.dob||""}</span></div>
                <div style={{ color:C.inkSoft, fontSize:13 }}>{u.ts?new Date(u.ts).toLocaleString("ru-RU"):""}</div>
              </div>
              <button onClick={()=>setPaid(u.id,!u.paid)} style={{ flex:"none", padding:"8px 12px", borderRadius:12, border:"none", cursor:"pointer", fontFamily:"'Quicksand',sans-serif", fontWeight:700, fontSize:13,
                background:u.paid?C.mint:C.soft, color:u.paid?"#fff":C.violetD }}>{u.paid?"✓ оплатил":"отметить оплату"}</button>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:16 }}>
          <a href="#" onClick={()=>{location.hash="";location.reload();}} style={{ color:C.inkSoft, fontSize:14 }}>← на сайт</a>
        </div>
      </div>
    </div>
  );
}

const Disclaimer=()=>(
  <p style={{ textAlign:"center", color:"#a9a2c2", fontSize:13, marginTop:24, lineHeight:1.5, fontFamily:"'Nunito',sans-serif" }}>
    Цифрология — добрый помощник для самопознания и хорошего настроения. Это не медицинская, психологическая,
    юридическая или финансовая консультация. Если тебе тяжело — поделись с близкими или специалистом, рядом всегда есть поддержка. 💛
  </p>
);
