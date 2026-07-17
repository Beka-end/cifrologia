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
    @keyframes spin{to{transform:rotate(360deg)}}
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

// ---------- ЯЗЫК / LANGUAGE ----------
let LANG = (typeof localStorage !== "undefined" && localStorage.getItem("cifro:lang")) || "ru";
let LANGS = [{code:"ru",label:"RU"},{code:"en",label:"EN"},{code:"kk",label:"ҚАЗ"},{code:"zh",label:"中文"}];
const TX = {}; // TX[ru] = { en, kk, zh, ...любой код языка }
const t = (ru, en) => {
  if (LANG === "ru") return ru;
  const row = TX[ru] || {};
  if (LANG === "en") return row.en || en;
  return row[LANG] || ru;
};
// ---------- КАЗАХСКИЙ (перевод интерфейса; чего нет — показывается по-русски) ----------
const KK = {
  "Цифрология":"Цифрология",
  "тёплый разбор тебя по дате рождения":"туған күнің бойынша жылы талдау",
  "Введи имя (латинскими буквами) и пароль. Новое имя — создадим профиль, уже есть — попросим пароль.":"Атыңды (латын әріптерімен) және құпиясөзді енгіз. Жаңа ат — профиль ашамыз, бар болса — құпиясөз сұраймыз.",
  "Имя (буквы, уникальное)":"Ат (әріптер, бірегей)","Пароль":"Құпиясөз","Дата рождения":"Туған күні",
  "📅 из списка":"📅 тізімнен","⌨️ вручную":"⌨️ қолмен","ДД":"КК","ММ":"АА","ГГГГ":"ЖЖЖЖ","День":"Күн","Мес":"Ай","Год":"Жыл",
  "Узнать о себе ✨":"Өзің туралы білу ✨","Минутку…":"Бір сәт…","С возвращением,":"Қайта келгеніңмен,",
  "Открыть мой профиль":"Профилімді ашу","Войти под другим именем":"Басқа атпен кіру",
  "Имя (латинские буквы), минимум 3 символа.":"Ат (латын әріптері), кемінде 3 таңба.","Пароль: минимум 4 символа.":"Құпиясөз: кемінде 4 таңба.",
  "Проверь дату рождения.":"Туған күнін тексер.","Такой профиль уже есть в базе — введи правильный пароль. Если это не ты, выбери другое имя.":"Мұндай профиль базада бар — дұрыс құпиясөзді енгіз. Егер бұл сен болмасаң, басқа ат таңда.",
  "Новое имя! Укажи дату рождения, чтобы создать профиль.":"Жаңа ат! Профиль ашу үшін туған күнін көрсет.",
  "✨ Профиль":"✨ Профиль","🪔 Натал":"🪔 Натал","☯️ Сюцай":"☯️ Сюцай","🔢 Матрица":"🔢 Матрица","☀️ День":"☀️ Күн","🗓️ Прогноз":"🗓️ Болжам","💞 Пара":"💞 Жұп","💼 Работа":"💼 Жұмыс","💡 Лайфхаки":"💡 Кеңестер","🃏 Таро":"🃏 Таро","💬 Чат":"💬 Чат","📁 Кабинет":"📁 Кабинет",
  "← выход":"← шығу","★ Премиум":"★ Премиум","★ Премиум активен":"★ Премиум белсенді",
  "Знак":"Белгі","Душа":"Жан","Путь":"Жол","Число жизненного пути":"Өмір жолы саны","Число души":"Жан саны","Год по восточному календарю":"Шығыс күнтізбесі жылы",
  "Подробный персональный разбор доступен в премиуме.":"Толық жеке талдау премиумда қолжетімді.","★ Открыть полный доступ":"★ Толық қолжетімділік","↻ Узнать ещё":"↻ Тағы білу","💾 Сохранить":"💾 Сақтау","Сохранено ✓":"Сақталды ✓","Думаю…":"Ойланудамын…",
  "Премиум-доступ":"Премиум-қолжетімділік","Подписка":"Жазылым","Оплатить через Kaspi":"Kaspi арқылы төлеу","Оформить подписку":"Жазылу","Я оплатил — проверить доступ":"Төледім — тексеру","Есть промокод?":"Промокод бар ма?","Введите промокод":"Промокод енгіз","Применить":"Қолдану","Позже":"Кейінірек","ПОЛНЫЙ ДОСТУП":"ТОЛЫҚ ҚОЛЖЕТІМДІЛІК",
  "Проверяю…":"Тексерудемін…","печатает…":"жазып жатыр…","Сегодня осталfirсь":"Бүгін қалды","На сегодня бесплатные вопросы закончились 🙂 Новые — завтра. В премиуме — общение без ограничений.":"Бүгінге тегін сұрақтар бітті 🙂 Жаңасы — ертең. Премиумда — шексіз әңгіме.",
  "★ Открыть премиум":"★ Премиум ашу","Напиши вопрос…":"Сұрақ жаз…","Сегодня осталось":"Бүгін қалды","вопр.":"сұрақ",
  "Проверить совместимость":"Үйлесімділікті тексеру","Кто твой партнёр?":"Серігің кім?","Сменить партнёра":"Серікті ауыстыру","Вытянуть карты":"Карталарды тарту","Перетянуть":"Қайта тарту","Хочу стишок ✨":"Өлең қалаймын ✨","Посмеши меня":"Күлдір мені",
  "стихия":"стихия","Позже":"Кейінірек",
};
// ---------- УПРОЩЁННЫЙ КИТАЙСКИЙ ----------
const ZH = {
  "Цифрология":"数字学",
  "тёплый разбор тебя по дате рождения":"根据你的出生日期为你做温暖的解读",
  "Введи имя (латинскими буквами) и пароль. Новое имя — создадим профиль, уже есть — попросим пароль.":"请输入用户名（拉丁字母）和密码。新用户名将创建档案，已有的会要求输入密码。",
  "Имя (буквы, уникальное)":"用户名（字母，唯一）","Пароль":"密码","Дата рождения":"出生日期",
  "📅 из списка":"📅 从列表","⌨️ вручную":"⌨️ 手动","ДД":"日","ММ":"月","ГГГГ":"年","День":"日","Мес":"月","Год":"年",
  "Узнать о себе ✨":"了解自己 ✨","Минутку…":"稍等…","С возвращением,":"欢迎回来，",
  "Открыть мой профиль":"打开我的档案","Войти под другим именем":"用其他用户名登录",
  "Имя (латинские буквы), минимум 3 символа.":"用户名（拉丁字母），至少3个字符。","Пароль: минимум 4 символа.":"密码：至少4个字符。",
  "Проверь дату рождения.":"请检查出生日期。","Такой профиль уже есть в базе — введи правильный пароль. Если это не ты, выбери другое имя.":"该档案已存在——请输入正确密码。如果不是你，请换一个用户名。",
  "Новое имя! Укажи дату рождения, чтобы создать профиль.":"新用户名！请填写出生日期以创建档案。",
  "✨ Профиль":"✨ 档案","🪔 Натал":"🪔 星盘","☯️ Сюцай":"☯️ 秀才","🔢 Матрица":"🔢 矩阵","☀️ День":"☀️ 今日","🗓️ Прогноз":"🗓️ 预测","💞 Пара":"💞 配对","💼 Работа":"💼 事业","💡 Лайфхаки":"💡 生活建议","🃏 Таро":"🃏 塔罗","💬 Чат":"💬 聊天","📁 Кабинет":"📁 我的",
  "← выход":"← 退出","★ Премиум":"★ 高级版","★ Премиум активен":"★ 高级版已开通",
  "Знак":"星座","Душа":"灵魂","Путь":"生命","Число жизненного пути":"生命历程数","Число души":"灵魂数","Год по восточному календарю":"生肖年",
  "Подробный персональный разбор доступен в премиуме.":"详细的个人解读在高级版中提供。","★ Открыть полный доступ":"★ 解锁完整权限","↻ Узнать ещё":"↻ 换一个","💾 Сохранить":"💾 保存","Сохранено ✓":"已保存 ✓","Думаю…":"思考中…",
  "Премиум-доступ":"高级版权限","Подписка":"订阅","Оплатить через Kaspi":"通过 Kaspi 支付","Оформить подписку":"订阅","Я оплатил — проверить доступ":"我已支付——检查权限","Есть промокод?":"有优惠码吗？","Введите промокод":"输入优惠码","Применить":"使用","Позже":"稍后","ПОЛНЫЙ ДОСТУП":"完整权限",
  "Проверяю…":"检查中…","печатает…":"正在输入…","На сегодня бесплатные вопросы закончились 🙂 Новые — завтра. В премиуме — общение без ограничений.":"今天的免费提问已用完 🙂 明天再来。高级版可无限畅聊。",
  "★ Открыть премиум":"★ 开通高级版","Напиши вопрос…":"输入问题…","Сегодня осталось":"今日剩余","вопр.":"个",
  "Проверить совместимость":"检查配对","Кто твой партнёр?":"你的另一半是谁？","Сменить партнёра":"更换伴侣","Вытянуть карты":"抽牌","Перетянуть":"重新抽牌","Хочу стишок ✨":"来首小诗 ✨","Посмеши меня":"逗我笑",
  "стихия":"元素",
};
// начальное заполнение из встроенных словарей
for(const k in KK){ (TX[k]=TX[k]||{}).kk=KK[k]; }
for(const k in ZH){ (TX[k]=TX[k]||{}).zh=ZH[k]; }
function mergeTx(data){ if(!data) return; for(const ru in data){ const tr=data[ru]||{}; const row=TX[ru]||(TX[ru]={}); for(const lang in tr){ if(tr[lang]) row[lang]=tr[lang]; } } }
// Подгрузка переводов: сначала файл-основа, затем правки из базы (админка)
async function loadTranslations(){
  let ok=false;
  try{ const r=await fetch("/translations.json",{cache:"no-store"}); mergeTx(await r.json()); ok=true; }catch(e){}
  try{ const r=await fetch("/api/i18n",{cache:"no-store"}); const d=await r.json();
    if(d){ if(Array.isArray(d.langs)&&d.langs.length) LANGS=d.langs; mergeTx(d.tx); } ok=true; }catch(e){}
  return ok;
}

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
const SIGNMOJI = { "Овен":"🐏","Телец":"🐂","Близнецы":"👯","Рак":"🦀","Лев":"🦁","Дева":"🌾","Весы":"⚖️","Скорпион":"🦂","Стрелец":"🏹","Козерог":"🐐","Водолей":"🏺","Рыбы":"🐟" };
const ELEMOJI = { "Огонь":"🔥","Земля":"🌍","Воздух":"🌬️","Вода":"💧" };
const pad2 = (n)=>String(n).padStart(2,"0");
const fmtDate = (d,m,y)=>`${pad2(d)}.${pad2(m)}.${y}`;
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
  1:"День начинаний. Сделай первый шаг — сегодня удача любит смелых. Хорошее время начать новое дело, разговор или проект.",
  2:"День тепла и союзов. Договаривайся, поддержи близких и слушай сердце — сегодня мягкость сильнее напора.",
  3:"День общения и идей. Встречи, творчество, лёгкость — делись собой, пробуй новое и не бойся быть заметным.",
  4:"День дел и порядка. Спокойно разбери задачи и наведи структуру — то, что сделаешь сегодня, станет опорой завтра.",
  5:"День перемен и движения. Возможны приятные сюрпризы и новые возможности — будь гибким и лови момент.",
  6:"День заботы и уюта. Удели время дому, любимым и себе — тепло, которое отдашь, вернётся к тебе вдвойне.",
  7:"День тишины и размышлений. Хорош для учёбы, отдыха и восстановления — прислушайся к внутреннему голосу.",
  8:"День результата и силы. Удачен для важных дел, финансов и решительных шагов — действуй уверенно.",
  9:"День завершений и доброты. Доведи начатое до конца, отпусти лишнее и порадуй кого-то — это освободит место новому.",
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

// ---------- АНГЛИЙСКИЕ ВЕРСИИ / ENGLISH ----------
const LIFE_PATH_EN = {
  1:"Leader. Independence, initiative, willpower. Your path is to go first and lead.",
  2:"Diplomat. Sensitivity, partnership, intuition. Your strength is in unions and listening.",
  3:"Creator. Self-expression, connection, lightness and joy. Avoid scattering yourself.",
  4:"Builder. Order, discipline, reliability. You create a solid foundation.",
  5:"Seeker. Freedom, change, experience. Life opens up through movement.",
  6:"Keeper. Love, care, harmony. Home, loved ones and beauty are your support.",
  7:"Sage. Analysis, depth, a search for meaning. You need quiet and growth.",
  8:"Creator of scale. Goals, resources, results. You learn to balance work and heart.",
  9:"Humanist. Kindness, generosity, helping people. You complete cycles beautifully.",
  11:"Inspirer. Strong intuition and ideas. You are a channel of light for others.",
  22:"Master builder. Big dreams brought into reality.",
  33:"Teacher of the heart. Love, support and healing for people.",
};
const SOUL_EN = {
  1:"Soul of a leader. Deep down wants to be first, values freedom and recognition.",
  2:"Soul of a peacemaker. Craves love, warmth, harmony and close bonds.",
  3:"Soul of a creator. Wants joy, self-expression, connection and vivid emotions.",
  4:"Soul of a builder. Seeks stability, order and a reliable foundation.",
  5:"Soul of freedom. Craves novelty, movement, adventure and impressions.",
  6:"Soul of love. Wants to care, build a home and give warmth to others.",
  7:"Soul of a sage. Seeks knowledge, depth, quiet and self-understanding.",
  8:"Soul of achievement. Wants fulfillment, strength and worthy results.",
  9:"Soul of a humanist. Longs to give, help and make the world kinder.",
};
const PERSONAL_YEAR_EN = {
  1:"A year of new beginnings. Time to plant — what you sow will grow for 9 years.",
  2:"A year of partnership and patience. Listen more, rush less — it all comes together.",
  3:"A year of creativity and connection. Widen your circle, express yourself, try new things.",
  4:"A year of foundation and work. Discipline now becomes stability later.",
  5:"A year of change and freedom. New horizons open — stay flexible.",
  6:"A year of warmth and home. Family, love and care come first.",
  7:"A year of inner growth. Study, rest, rethink — fill yourself up.",
  8:"A year of strength and results. Great for goals, career and achievements.",
  9:"A year of completion. Gently release the old — make room for the new.",
};
const DAY_EN = {
  1:"A day of beginnings. Take the first step — today luck favors the bold. A good time to start a new project, task or conversation.",
  2:"A day of warmth and unions. Cooperate, support your loved ones and listen to your heart — softness beats pressure today.",
  3:"A day of connection and ideas. Meetings, creativity, lightness — share yourself, try new things and let yourself be seen.",
  4:"A day of tasks and order. Calmly handle your to-dos and bring structure — what you do today becomes a support tomorrow.",
  5:"A day of change and movement. Pleasant surprises and new options are possible — stay flexible and seize the moment.",
  6:"A day of care and comfort. Give time to home, loved ones and yourself — the warmth you give will come back doubled.",
  7:"A day of quiet and reflection. Great for study, rest and recovery — listen to your inner voice.",
  8:"A day of results and strength. Good for important matters, finances and decisive steps — act with confidence.",
  9:"A day of completion and kindness. Finish what you started, release the old and bring someone joy — it makes room for the new.",
};
const CAREER_EN = {
  1:"Leader and pioneer — your own business, management, launching projects.",
  2:"Diplomat and partner — teamwork, negotiation, mediation, HR.",
  3:"Creator and communicator — media, sales, art, blogging.",
  4:"Systems person — engineering, finance, analytics, reliable crafts.",
  5:"Person of change — marketing, sales, travel, all things dynamic.",
  6:"Caring pro — medicine, teaching, service, beauty, design.",
  7:"Expert — science, IT, research, consulting, psychology.",
  8:"Manager — business, finance, scale; you know how to get results.",
  9:"Humanist — helping people, art, mentoring, nonprofits.",
  11:"Inspirer — psychology, coaching, spiritual practice, the stage.",
  22:"Systems builder — big projects, the architecture of a venture.",
  33:"Teacher — mentoring, care, supporting and educating people.",
};
const YEAR_THEME_EN = {1:"Start",2:"Unions",3:"Creativity",4:"Foundation",5:"Change",6:"Home & love",7:"Inner growth",8:"Power & money",9:"Completion"};
const YEAR_FOCUS_EN = {
  1:"starting new things, taking initiative, daring to be first.",
  2:"growing relationships and partnerships, being patient.",
  3:"connecting, creating, meeting people, expressing yourself.",
  4:"bringing order, working steadily, building a base.",
  5:"trying new things, traveling, staying flexible.",
  6:"investing in family, home, love and care.",
  7:"learning, resting, restoring energy, knowing yourself.",
  8:"advancing career and finances, taking responsibility.",
  9:"finishing things, releasing the old, helping others.",
};
const SYU_CONS_EN = {
  1:"Leader. You think independently and love being first. Light: will, courage, responsibility. Growth: hear others.",
  2:"Diplomat. You sense people finely and seek harmony. Light: sensitivity, support, peace. Growth: don't lose yourself.",
  3:"Creator. Quick mind, loves connection and ideas. Light: joy, lightness, inspiration. Growth: finish what you start.",
  4:"Practical. You think systematically and value order. Light: reliability, endurance. Growth: flexibility and trust.",
  5:"Free spirit. You love change, movement, experience. Light: liveliness, adaptability. Growth: stability.",
  6:"Caring. You think through love and duty. Light: warmth, responsibility for loved ones. Growth: care for yourself too.",
  7:"Thinker. You analyze and seek meaning. Light: depth, intuition, wisdom. Growth: trust and share with people.",
  8:"Manager. You think in goals and results. Light: strength, organization. Growth: softness toward people.",
  9:"Humanist. You think broadly — about people and the world. Light: kindness, wisdom. Growth: stay grounded.",
};
const SYU_MIS_EN = {
  1:"Leadership — take responsibility, lead, create something new.",
  2:"Peace and support — connect people, help, be a reliable pillar.",
  3:"Creativity — inspire, bring joy and self-expression to the world.",
  4:"Building — create something solid, bring order, serve through work.",
  5:"Freedom and experience — live vividly and teach others courage.",
  6:"Love and care — create harmony, home, beauty; serve with the heart.",
  7:"Wisdom — learn, explore and share knowledge with people.",
  8:"Fulfillment — achieve, manage resources, help others thrive.",
  9:"Service — give, help people and complete cycles with kindness.",
};
const MATRIX_CELLS_EN = {
  1:{name:"Character, will",levels:{0:"Soft character, shaped through life's lessons.",1:"Gentle, yielding, kind.",2:"Calm, ready to compromise.",3:"A golden mean — flexible with an inner core.",4:"Strong will and leadership potential."}},
  2:{name:"Energy",levels:{0:"Best to draw energy from outside — people, nature, activity.",1:"Saves strength, picks what matters.",2:"Enough energy for yourself and loved ones.",3:"High, warm energy.",4:"Powerful energy that charges others."}},
  3:{name:"Interest, knowledge",levels:{0:"Drawn to creativity and people.",1:"Interest in exact sciences comes and goes.",2:"A gift for order and analysis.",3:"A bright analytical mind."}},
  4:{name:"Health",levels:{0:"Health needs gentle attention.",1:"Average, depends on habits.",2:"Strong health with a good reserve.",3:"Excellent stamina."}},
  5:{name:"Logic, intuition",levels:{0:"Intuition leads — learn to trust logic too.",1:"Logic grows with experience.",2:"Well-developed logic.",3:"Logic and intuition work together.",4:"Strong intuition and a sense for things."}},
  6:{name:"Work, mastery",levels:{0:"Work needs meaning and inspiration.",1:"Works when needed.",2:"Loves and knows how to work with the hands.",3:"A natural craftsperson."}},
  7:{name:"Luck, talent",levels:{0:"You forge your own luck — talent through effort.",1:"Ability is there — develop it.",2:"Noticeable talent and luck.",3:"A bright gift and an easy fate."}},
  8:{name:"Kindness, care",levels:{0:"Kindness unfolds over the years.",1:"Caring in what matters.",2:"Kind, dependable, warm.",3:"A big, generous heart."}},
  9:{name:"Memory, mind",levels:{0:"Nice to train the memory.",1:"Remembers what matters.",2:"Good memory and sharpness.",3:"Sharp mind, learns easily."}},
};
const LINES_EN = [
  {n:"Self-esteem",cells:[1,2,3]},{n:"Sense of family",cells:[4,5,6]},{n:"Stability",cells:[7,8,9]},
  {n:"Determination",cells:[1,4,7]},{n:"Attachment to family",cells:[2,5,8]},{n:"Talent",cells:[3,6,9]},
  {n:"Spirituality",cells:[1,5,9]},{n:"Temperament",cells:[3,5,7]},
];
const TAROT_EN = [
  ["The Fool","Beginnings, spontaneity, pure potential, a light step into the new."],
  ["The Magician","Will, mastery, resources at hand — time to act."],
  ["The High Priestess","Intuition, quiet knowing, trust in yourself."],
  ["The Empress","Abundance, care, blossoming and beauty."],
  ["The Emperor","Structure, support, confidence."],
  ["The Hierophant","Mentorship, tradition, values."],
  ["The Lovers","Union, harmony, an important choice of the heart."],
  ["The Chariot","Moving forward, focus, a victory of will."],
  ["Strength","Gentle power, warmth, inner steadiness."],
  ["The Hermit","Seeking answers within, wisdom, calm."],
  ["Wheel of Fortune","Good change, a lucky turn."],
  ["Justice","Balance, honesty, clear decisions."],
  ["The Hanged Man","A pause, a new view, acceptance."],
  ["Death","Renewal, ending the old for the new."],
  ["Temperance","Harmony, measure, the golden mean."],
  ["The Devil","Habits and temptations — gently free yourself."],
  ["The Tower","Change toward the light, a clearing."],
  ["The Star","Hope, inspiration, healing."],
  ["The Moon","Intuition, dreams, sensitivity to the hidden."],
  ["The Sun","Joy, success, warmth and clarity."],
  ["Judgement","Awakening, a new calling, reassessment."],
  ["The World","Completing a cycle, wholeness, harmony."],
];
// геттеры по языку
const gLP=(n)=>LANG==="en"?LIFE_PATH_EN[n]:LIFE_PATH[n];
const gSOUL=(n)=>LANG==="en"?SOUL_EN[n]:SOUL[n];
const gPY=(n)=>LANG==="en"?PERSONAL_YEAR_EN[n]:PERSONAL_YEAR[n];
const gDAY=(n)=>LANG==="en"?DAY_EN[n]:DAY[n];
const gCAREER=(n)=>LANG==="en"?CAREER_EN[n]:CAREER[n];
const gYT=(n)=>LANG==="en"?YEAR_THEME_EN[n]:YEAR_THEME[n];
const gYF=(n)=>LANG==="en"?YEAR_FOCUS_EN[n]:YEAR_FOCUS[n];
const gSC=(n)=>LANG==="en"?SYU_CONS_EN[n]:SYU_CONS[n];
const gSM=(n)=>LANG==="en"?SYU_MIS_EN[n]:SYU_MIS[n];
const gCELL=(n)=>LANG==="en"?MATRIX_CELLS_EN[n]:MATRIX_CELLS[n];
const gLINES=()=>LANG==="en"?LINES_EN:LINES;
const deck=()=>LANG==="en"?TAROT_EN:TAROT;

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
function curLogin(){ try{ return localStorage.getItem("cifro:login")||""; }catch(e){ return ""; } }
const histKey=(login)=>"cifro:history:"+(login||"guest");
async function authApi(action,body){ try{ const r=await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,...body})}); return await r.json(); }catch(e){ return {error:"net"}; } }
async function apiStatus(){ try{ const r=await fetch("/api/status?id="+encodeURIComponent(curLogin())); const d=await r.json(); return !!d.paid; }catch(e){ return false; } }
async function apiConfig(){ try{ const r=await fetch("/api/config"); return await r.json(); }catch(e){ return {}; } }
async function apiRedeem(code){ try{ const r=await fetch("/api/redeem",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:curLogin(),code})}); const d=await r.json(); return !!d.ok; }catch(e){ return false; } }

// ---------- ИИ ----------
const EXPERT = `Ты — опытный наставник «Цифрологии»: соединяешь нумерологию, астрологию, психологию и практику Сюцай с глубиной и точностью специалиста с многолетним опытом. Разбирай человека структурно и обоснованно — объясняй «почему именно так», связывай числа, знаки, стихию и характер в единую цельную картину. Пиши уверенно, профессионально и содержательно, как настоящий эксперт, но тепло, доступно и с уважением. Ты помощник для самопознания, а не врач: не ставь медицинских или психиатрических диагнозов и не назначай лечения.`;
const SAFE = `Пиши тепло, по-доброму и с поддержкой, простым языком, на «ты». Давай глубокий, но понятный разбор и практические подсказки. Только позитивный, обнадёживающий настрой: никаких пугающих, фаталистичных или негативных предсказаний, никаких тем болезней с плохим исходом, смерти, вреда себе. Подчёркивай свободу выбора — это подсказки для размышления, а не приговор. Если человек делится тяжёлыми чувствами — мягко поддержи и по-доброму предложи опереться на близких или специалиста, без каких-либо инструкций.`;
function cleanText(s){
  if(!s) return s;
  let x = s
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")   // заголовки ## → обычный текст
    .replace(/\*\*(.*?)\*\*/g, "$1")       // **жирный** → обычный
    .replace(/\*\*/g, "")                  // одиночные **
    .replace(/^\s*-{3,}\s*$/gm, "")        // линии ---
    .replace(/[ \t]+\n/g, "\n")            // хвостовые пробелы
    .replace(/(\n\s*){2,}/g, "\n\n")       // схлопнуть пустые строки в один отступ
    .trim();
  if(!/[.!?…»)"'。！？]$/.test(x)){              // если текст оборвался на полуслове
    const i = Math.max(x.lastIndexOf("."),x.lastIndexOf("!"),x.lastIndexOf("?"),x.lastIndexOf("…"),x.lastIndexOf("»"),x.lastIndexOf("。"),x.lastIndexOf("！"),x.lastIndexOf("？"));
    if(i>40) x = x.slice(0,i+1).trim();
  }
  return x;
}
async function ask(messages, system){
  const FMT_EN = " Be compact: 3-5 short paragraphs, no Markdown (no ##, **, ---, asterisk lists) and no big empty gaps. Always finish with a complete closing sentence.";
  const langLine =
    LANG === "en" ? " Respond in warm, natural English." + FMT_EN
  : LANG === "kk" ? " Жауапты қазақ тілінде, жылы әрі табиғи тілмен жаз. Ықшам жаз: 3-5 шағын абзац, Markdown белгілерінсіз (##, **, ---, жұлдызшалы тізімдерсіз). Соңғы сөйлемді міндетті түрде толық аяқта."
  : LANG === "zh" ? " 请用简体中文、温暖自然地回答。简洁一些：3-5个短段落，不要使用Markdown（不要##、**、---或星号列表）。务必用完整的句子结尾。"
  : " Отвечай на русском языке. Пиши компактно: 3–5 небольших абзацев, без Markdown-разметки (никаких ##, **, ---, списков со звёздочками) и без больших пустых отступов между строками. Обязательно заверши текст цельным финальным предложением — не обрывайся на полуслове.";
  try{
    const res = await fetch("/api/oracle",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ system:(system||"")+langLine, messages, max_tokens:2500 }),
    });
    const data = await res.json();
    if(!data || !data.content) return t("Связь сейчас прервалась 🙏 Попробуй ещё разок через минутку.","Connection dropped 🙏 Please try again in a moment.");
    return cleanText(data.content.map(c=>c.type==="text"?c.text:"").join("\n").trim());
  }catch(e){ return t("Связь сейчас прервалась 🙏 Попробуй ещё разок через минутку.","Connection dropped 🙏 Please try again in a moment."); }
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
const Spinner = ({ color })=>(
  <span style={{ display:"inline-block", width:16, height:16, verticalAlign:"-2px",
    border:`2px solid ${color||"#fff"}`, borderTopColor:"transparent", borderRadius:"50%",
    animation:"spin .7s linear infinite", marginRight:8 }} />
);
// разбить текст на строки-буллеты по предложениям
const Bulleted = ({ text, style })=>{
  const parts = String(text||"").split(/(?<=[.!?;])\s+/).map(s=>s.trim().replace(/[.;]+$/,"")).filter(Boolean);
  if(parts.length<2) return <p style={{ ...pp, ...style }}>{text}</p>;
  return (
    <div style={{ ...pp, ...style }}>
      {parts.map((s,i)=>(
        <div key={i} style={{ display:"flex", gap:8, marginTop:i?4:0 }}>
          <span style={{ color:C.violet, flex:"none" }}>•</span><span>{s}</span>
        </div>
      ))}
    </div>
  );
};
// сохранение ИИ-разборов между вкладками и перезагрузкой
const rdKey = (title)=>`cifro:rd:${curLogin()}:${title}`;
const loadReading = (title)=>{ try{ return localStorage.getItem(rdKey(title))||""; }catch(e){ return ""; } };
const saveReading = (title,text)=>{ try{ if(text) localStorage.setItem(rdKey(title),text); }catch(e){} };
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
  const [showHistory,setShowHistory]=useState(true);
  const [, setI18n]=useState(0);
  useEffect(()=>{ loadTranslations().then(ok=>{ if(ok) setI18n(v=>v+1); }); },[]);
  const [lang,setLangState]=useState(LANG);
  const setLang=(l)=>{ LANG=l; try{localStorage.setItem("cifro:lang",l);}catch(e){} setLangState(l); };
  LANG = lang;

  useEffect(()=>{ (async()=>{
    const a=await loadData(KEY_ACC), pr=await loadData(KEY_PRO);
    if(a){ setAccount(a); const h=await loadData(histKey(a.login)); if(h)setHistory(h); }
    if(pr)setPremium(true);
    if(await apiStatus()){ setPremium(true); await saveData(KEY_PRO,true); }
    try{ const c=await apiConfig(); if(c && c.showHistory===false) setShowHistory(false); }catch(e){}
    setLoaded(true);
  })(); },[]);

  useEffect(()=>{
    if(stage!=="result") return;
    const ping=()=>{ fetch("/api/ping",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:curLogin()})}).catch(()=>{}); };
    ping(); const tmr=setInterval(ping,30000); return ()=>clearInterval(tmr);
  },[stage]);

  const build=(name,d,m,y)=>{
    const sun=sunSign(d,m), lp=lifePath(d,m,y), now=new Date().getFullYear();
    return { name,d,m,y,sun,lp, soul:reduce(d,false), chinese:chineseSign(y), personalYearNow:personalYear(d,m,now),
      forecast:Array.from({length:9},(_,i)=>({ year:now+i, num:personalYear(d,m,now+i) })) };
  };
  const onAuthed=async({login,name,dob,paid})=>{
    const [d,m,y]=String(dob).split(".").map(Number);
    setProfile(build(name||login,d,m,y));
    try{ localStorage.setItem("cifro:login",login); }catch(e){}
    const acc={login,name:name||login,d,m,y}; setAccount(acc); await saveData(KEY_ACC,acc);
    const h=await loadData(histKey(login)); setHistory(h||[]);
    if(paid){ setPremium(true); await saveData(KEY_PRO,true); }
    setStage("result"); setTab("profile");
  };
  const enterSaved=async()=>{
    setProfile(build(account.name,account.d,account.m,account.y));
    try{ localStorage.setItem("cifro:login",account.login||""); }catch(e){}
    const h=await loadData(histKey(account.login)); setHistory(h||[]);
    if(await apiStatus()){ setPremium(true); await saveData(KEY_PRO,true); }
    setStage("result"); setTab("profile");
  };
  const logout=async()=>{ setAccount(null); setPremium(false); try{ localStorage.removeItem("cifro:login"); }catch(e){} await saveData(KEY_PRO,false); };
  const addHistory=async(item)=>{ const e={ id:Date.now(), ts:new Date().toLocaleString(LANG==="en"?"en-US":"ru-RU"), ...item };
    const next=[e,...history]; setHistory(next); await saveData(histKey(account&&account.login),next); };
  const delHistory=async(id)=>{ const next=history.filter(h=>h.id!==id); setHistory(next); await saveData(histKey(account&&account.login),next); };
  const unlock=async()=>{ setPremium(true); await saveData(KEY_PRO,true); setPaywall(false); };

  if(typeof window!=="undefined" && window.location.hash==="#admin") return <AdminPanel/>;

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(180deg,#fdf4ef,#f1ecfb)`,
      fontFamily:"'Nunito',sans-serif", position:"relative", color:C.ink }}>
      <Fonts/><Blobs/>
      <div style={{ position:"absolute", top:14, right:14, zIndex:2, display:"flex", gap:4, background:"#fff", border:`1px solid ${C.line}`, borderRadius:20, padding:3 }}>
        {LANGS.map(({code,label})=>(
          <button key={code} onClick={()=>setLang(code)} style={{ border:"none", cursor:"pointer", borderRadius:16, padding:"5px 9px",
            fontFamily:"'Quicksand',sans-serif", fontWeight:700, fontSize:12,
            background: lang===code?C.violet:"transparent", color: lang===code?"#fff":C.inkSoft }}>{label}</button>
        ))}
      </div>
      <div style={{ position:"relative", zIndex:1, maxWidth:560, margin:"0 auto", padding:"58px 16px 56px" }}>
        {stage==="intro"
          ? <Intro {...{onAuthed,account,enterSaved,logout,loaded}}/>
          : <Result {...{profile,tab,setTab,history,addHistory,delHistory,saveOn,premium,showHistory,
              openPaywall:()=>setPaywall(true), reset:()=>setStage("intro")}}/>}
        <Disclaimer/>
      </div>
      {paywall && <Paywall onClose={()=>setPaywall(false)} onUnlock={unlock}/>}
    </div>
  );
}

// ---------- ВХОД / РЕГИСТРАЦИЯ (один экран) ----------
function Intro({ onAuthed,account,enterSaved,logout,loaded }){
  const [name,setName]=useState("");
  const [pass,setPass]=useState("");
  const [f,setF]=useState({ day:"", month:"", year:"" });
  const [msg,setMsg]=useState(""); const [busy,setBusy]=useState(false);
  const [dateMode,setDateMode]=useState("manual");
  const monthRef=useRef(null), yearRef=useRef(null);
  const nameSan=(v)=>v.replace(/[^\p{L}\p{N} _.\-]/gu,"");   // буквы (любые), цифры, пробел и простые символы; регистр сохраняем
  const inpBase={ padding:"13px 14px", borderRadius:14, fontSize:16.5, background:C.soft,
    border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none" };
  const field=(val,set,ph,type,max)=>(
    <input value={val} placeholder={ph} type={type||"text"} maxLength={max}
      onChange={e=>set(e.target.value)}
      style={{ ...inpBase, width:"100%", marginTop:8 }}/>
  );
  const num=(k,ph,max,nextRef,selfRef)=>(
    <input ref={selfRef} value={f[k]} placeholder={ph} inputMode="numeric" maxLength={max}
      onChange={e=>{ const v=e.target.value.replace(/\D/g,""); setF({...f,[k]:v}); if(v.length>=max && nextRef && nextRef.current) nextRef.current.focus(); }}
      style={{ ...inpBase, flex:1, minWidth:0 }}/>
  );
  const sel=(k,list,ph,showZero)=>(
    <select value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})} style={{ ...inpBase, flex:1, minWidth:0, appearance:"auto", colorScheme:"light" }}>
      <option value="">{ph}</option>
      {list.map(n=><option key={n} value={String(n)}>{showZero?pad2(n):n}</option>)}
    </select>
  );
  const days=[...Array(31)].map((_,i)=>i+1);
  const months=[...Array(12)].map((_,i)=>i+1);
  const years=[...Array(2050-1920+1)].map((_,i)=>2050-i);
  const validDob=()=>{ const d=+f.day,m=+f.month,y=+f.year; return d>=1&&d<=31&&m>=1&&m<=12&&y>=1900&&y<=2050; };
  const go=async()=>{
    setMsg("");
    const disp=name.trim();
    const id=disp.toLowerCase();
    if(id.length<2){ setMsg(t("Имя: минимум 2 символа.","Name: at least 2 characters.")); return; }
    if(pass.length<4){ setMsg(t("Пароль: минимум 4 символа.","Password: at least 4 characters.")); return; }
    setBusy(true);
    let r=await authApi("login",{login:id,password:pass});
    if(r.error==="db"||r.error==="net"){ // база не подключена — гостевой режим
      setBusy(false);
      if(!validDob()){ setMsg(t("Проверь дату рождения.","Check the birth date.")); return; }
      onAuthed({ login:id, name:disp, dob:`${+f.day}.${+f.month}.${+f.year}`, paid:false }); return;
    }
    if(r.ok){ setBusy(false); onAuthed({ login:id, name:r.profile.name, dob:r.profile.dob, paid:r.paid }); return; }
    if(r.error==="badpass"){ setBusy(false); setMsg(t("Такой профиль уже есть в базе — введи правильный пароль. Если это не ты, выбери другое имя.","This profile already exists — enter the correct password. If it's not you, choose another name.")); return; }
    // пользователя нет → регистрируем (имя свободно)
    if(!validDob()){ setBusy(false); setMsg(t("Новое имя! Укажи дату рождения, чтобы создать профиль.","New name! Enter your birth date to create a profile.")); return; }
    const dob=`${+f.day}.${+f.month}.${+f.year}`;
    const reg=await authApi("register",{login:id,password:pass,name:disp,dob});
    setBusy(false);
    if(reg.ok){ onAuthed({ login:id, name:disp, dob, paid:false }); return; }
    if(reg.error==="exists") setMsg(t("Это имя только что заняли. Введи пароль или выбери другое.","This name was just taken. Enter the password or choose another."));
    else setMsg(t("Не удалось создать профиль.","Could not create the profile."));
  };

  return (
    <div>
      <div className="reveal" style={{ textAlign:"center", margin:"18px 0 22px" }}>
        <div style={{ fontSize:46 }}>✨🔢</div>
        <h1 style={{ fontFamily:"'Quicksand',sans-serif", fontSize:32, margin:"6px 0 2px", fontWeight:700,
          background:grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{t("Цифрология","Numerology")}</h1>
        <p style={{ color:C.inkSoft, fontSize:18, margin:0 }}>{t("тёплый разбор тебя по дате рождения","a warm reading of you by your birth date")}</p>
      </div>

      {loaded && account && (
        <Card style={{ marginBottom:14, textAlign:"center" }}>
          <p style={{ margin:"0 0 12px", fontSize:19 }}>{t("С возвращением,","Welcome back,")} <b style={{color:C.violetD}}>{account.name}</b> 👋</p>
          <button onClick={enterSaved} style={bigBtn}>{t("Открыть мой профиль","Open my profile")}</button>
          <button onClick={logout} style={{ ...ghostBtn, marginTop:8 }}>{t("Войти под другим именем","Sign in as someone else")}</button>
        </Card>
      )}

      <Card>
        <p style={{ ...pp, color:C.inkSoft, margin:"0 0 6px" }}>
          {t("Введи имя и пароль. Новое имя — создадим профиль, уже есть — попросим пароль.","Enter a name and password. A new name creates a profile, an existing one asks for the password.")}
        </p>
        {field(name,(v)=>setName(nameSan(v)),t("Имя (уникальное)","Name (unique)"),"text",30)}
        {field(pass,setPass,t("Пароль","Password"),"password",40)}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
          <span style={{ color:C.inkSoft, fontSize:14 }}>{t("Дата рождения","Birth date")}</span>
          <span onClick={()=>setDateMode(dateMode==="manual"?"list":"manual")} style={{ color:C.violet, fontSize:14, cursor:"pointer", fontWeight:700 }}>
            {dateMode==="manual"?t("📅 из списка","📅 from list"):t("⌨️ вручную","⌨️ type")}
          </span>
        </div>
        {dateMode==="manual"
          ? <div style={{ display:"flex", gap:8, marginTop:8 }}>{num("day",t("ДД","DD"),2,monthRef)}{num("month",t("ММ","MM"),2,yearRef,monthRef)}{num("year",t("ГГГГ","YYYY"),4,null,yearRef)}</div>
          : <div style={{ display:"flex", gap:8, marginTop:8 }}>{sel("day",days,t("День","Day"),true)}{sel("month",months,t("Мес","Mon"),true)}{sel("year",years,t("Год","Year"),false)}</div>}
        <button onClick={go} disabled={busy} style={{ ...bigBtn, marginTop:16 }}>{busy?<><Spinner/>{t("Минутку…","One moment…")}</>:t("Узнать о себе ✨","Discover yourself ✨")}</button>
        {msg && <p style={{ color:"#e0554b", fontSize:14.5, marginTop:10 }}>{msg}</p>}
      </Card>
    </div>
  );
}

// ---------- РЕЗУЛЬТАТ ----------
function Result({ profile,tab,setTab,history,addHistory,delHistory,saveOn,premium,showHistory,openPaywall,reset }){
  const tabs=[["profile",t("✨ Профиль","✨ Profile")],["natal",t("🪔 Натал","🪔 Natal")],["syu",t("☯️ Сюцай","☯️ Syucai")],["matrix",t("🔢 Матрица","🔢 Matrix")],["day",t("☀️ День","☀️ Day")],["forecast",t("🗓️ Прогноз","🗓️ Forecast")],
    ["love",t("💞 Пара","💞 Couple")],["career",t("💼 Работа","💼 Career")],["life",t("💡 Лайфхаки","💡 Life hacks")],["tarot",t("🃏 Таро","🃏 Tarot")],["chat",t("💬 Чат","💬 Chat")]]
    .concat(showHistory!==false ? [["history",t("📁 Кабинет","📁 Account")]] : []);
  if(tab==="history" && showHistory===false) tab="profile";
  const common={ p:profile, save:saveOn?addHistory:null, premium, openPaywall };
  return (
    <div>
      <div className="reveal" style={{ textAlign:"center", marginBottom:14 }}>
        <span onClick={reset} style={{ color:C.inkSoft, fontSize:15, cursor:"pointer", float:"left" }}>{t("← выход","← exit")}</span>
        {!premium && <span onClick={openPaywall} style={{ float:"right", fontSize:13, fontWeight:700, color:"#fff",
          background:grad, padding:"4px 12px", borderRadius:20, cursor:"pointer" }}>{t("★ Премиум","★ Premium")}</span>}
        {premium && <span style={{ float:"right", fontSize:13, fontWeight:700, color:C.mint }}>{t("★ Премиум активен","★ Premium active")}</span>}
        <h2 style={{ fontFamily:"'Quicksand',sans-serif", fontSize:24, margin:0, fontWeight:700 }}>{profile.name}</h2>
        <p style={{ color:C.inkSoft, margin:"2px 0 0", fontSize:15 }}>{fmtDate(profile.d,profile.m,profile.y)}</p>
      </div>
      <div style={{ display:"flex", gap:6, overflowX:"auto",
        position:"sticky", top:0, zIndex:5, background:"#fdf4ef", margin:"0 -16px 12px", padding:"8px 16px" }}>
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
        <Stat big={p.sun.s} label={t("Знак","Sign")} sub={p.sun.n}/><Stat big={p.soul} label={t("Душа","Soul")}/><Stat big={p.lp} label={t("Путь","Path")}/><Stat big={p.personalYearNow} label={t("Год","Year")}/>
      </Card>
      <Card>
        <h3 style={h3}>☉ {p.sun.s} {SIGNMOJI[p.sun.n]||""} {p.sun.n} · стихия {ELEMOJI[p.sun.el]||""} «{p.sun.el}»</h3>
        <p style={pp}>Солнце в знаке {p.sun.n} задаёт твою тёплую природу и то, как ты светишь миру.</p>
        <h3 style={{ ...h3, marginTop:14 }}>🔢 {t("Число жизненного пути","Life Path number")} — {p.lp}</h3>
        <Bulleted text={gLP(p.lp)}/>
        <h3 style={{ ...h3, marginTop:14 }}>💗 {t("Число души","Soul number")} — {p.soul}</h3>
        <Bulleted text={gSOUL(p.soul)}/>
        <h3 style={{ ...h3, marginTop:14 }}>🐉 {t("Год по восточному календарю","Eastern zodiac year")} — {p.chinese}</h3>
        <p style={pp}>{t(`Год ${p.chinese} добавляет тебе свои славные черты.`,`The year of the ${p.chinese} adds its fine traits to you.`)}</p>
      </Card>
      <AISection {...{premium,openPaywall,save}} p={p} histType={t("Портрет личности","Personality portrait")} title={t("Глубокий портрет личности","Deep personality portrait")} cta={t("Раскрыть подробный портрет","Reveal detailed portrait")}
        prompt={`Сделай глубокий, тёплый и структурный портрет: ${p.name}, знак ${p.sun.n} (${p.sun.el}), число пути ${p.lp}, число души ${p.soul}, восточный знак ${p.chinese}. Раскрой: 1) сильные стороны и таланты, 2) как мыслит и чувствует, 3) что важно для души и в отношениях, 4) зоны роста по-доброму, 5) тёплое напутствие. 3-4 небольших абзаца.`}/>
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
        <h3 style={h3}>🪔 {t('Натальная карта','Natal chart')}</h3>
        <p style={{ ...pp, color:C.inkSoft, margin:"4px 0 12px" }}>{t('Укажи время и город рождения, если знаешь — так точнее лягут асцендент и Луна. Это необязательно.','Add your birth time and city if you know them — the ascendant and Moon will be more accurate. Optional.')}</p>
        <div style={{ display:"flex", gap:8 }}>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)}
            style={{ flex:1, padding:"12px 14px", borderRadius:14, fontSize:16.5, background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none", colorScheme:"light" }}/>
          <input value={place} onChange={e=>setPlace(e.target.value)} placeholder={t('Город рождения','Birth city')}
            style={{ flex:2, minWidth:0, padding:"12px 14px", borderRadius:14, fontSize:16.5, background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none" }}/>
        </div>
      </Card>
      <AISection key={`${time}|${place}`} {...{premium,openPaywall,save}} p={p} sys={sys}
        histType={t("Натальная карта","Natal chart")} title={t("Детальный разбор натальной карты","Detailed natal chart reading")} cta={t("Раскрыть натальную карту","Reveal natal chart")}
        prompt={`Сделай детальный, тёплый разбор по натальной карте и нумерологии как ведический астролог и нумеролог. Человек: ${p.name}, дата рождения ${p.d}.${p.m}.${p.y}${time?`, время рождения ${time}`:", время рождения неизвестно"}${place?`, место рождения ${place}`:""}. Данные: солнечный знак ${p.sun.n} (стихия ${p.sun.el}), число пути ${p.lp}, число души ${p.soul}, восточный знак ${p.chinese}. Раскрой по разделам: 1) Личность и асцендент-лагна — как человек проявляется в мире; 2) Луна и эмоциональный мир; 3) Предназначение и кармические задачи (дхарма); 4) Любовь, дело и здоровье; 5) Сильные стороны по стихии и числам. Затем — краткий прогноз на ближайшие 3 года (по 1 предложению на год). В конце — мягкое благословение-напутствие. Доступно, без жаргона, только в позитивном ключе.`}/>
      <Card style={{ background:C.soft }}>
        <p style={{ ...pp, fontSize:14, color:C.inkSoft, margin:0 }}>
          {t('🔮 Для максимально точной карты (дома, точные положения планет) в рабочей версии подключаются астрологические эфемериды/API по времени и месту рождения. Здесь разбор формирует ИИ-наставник по доступным данным.','🔮 For a fully precise chart (houses, exact planet positions), the production version connects an astrology ephemeris/API using birth time and place. Here the reading is created by the AI guide from the available data.')}
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
        <h3 style={h3}>☯️ {t('Что такое Сюцай','What is Syucai')}</h3>
        <p style={{ ...pp, color:C.inkSoft, margin:0 }}>{t('Практика самопознания по дате рождения. В отличие от обычной нумерологии — без фатальности: каждая энергия имеет светлую и теневую сторону, и её можно развивать. Три опоры: число сознания, число миссии и матрица.','A self-discovery practice based on your birth date. Unlike ordinary numerology it is non-fatalistic: every energy has a light and a shadow side and can be developed. Three pillars: the consciousness number, the mission number and the matrix.')}</p>
      </Card>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ ...h3, margin:0 }}>🧠 {t('Число сознания','Consciousness number')}</h3>
          <span style={{ fontSize:26, fontFamily:"'Quicksand',sans-serif", fontWeight:700, color:C.violetD }}>{cons}</span>
        </div>
        <p style={{ ...pp, color:C.inkSoft, margin:"2px 0 8px", fontSize:14.5 }}>{t('Вектор эго — как ты думаешь и действуешь (по дню рождения).','Ego vector — how you think and act (from your day of birth).')}</p>
        <p style={pp}>{gSC(cons)}</p>
      </Card>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ ...h3, margin:0 }}>🎯 {t('Число миссии','Mission number')}</h3>
          <span style={{ fontSize:26, fontFamily:"'Quicksand',sans-serif", fontWeight:700, color:C.violetD }}>{mission}</span>
        </div>
        <p style={{ ...pp, color:C.inkSoft, margin:"2px 0 8px", fontSize:14.5 }}>{t('Предназначение — раскрывается в полной мере к 33 годам (по всей дате).','Your purpose — fully unfolds by age 33 (from the whole date).')}</p>
        <p style={pp}>{gSM(mission)}</p>
      </Card>
      <Card>
        <h3 style={h3}>🌱 {t('Три состояния эго','Three states of the ego')}</h3>
        <p style={pp}>{t('Страдающее эго — живёшь импульсами «хочу / не хочу». Эго безразличия — устал, не действуешь. Эго, ищущее счастья — растёшь через осознанность и знание. Путь Сюцай — про третье.','The suffering ego — you live by want / do-not-want impulses. The indifferent ego — tired, not acting. The ego seeking happiness — you grow through awareness and knowledge. The path of Syucai is about the third one.')}</p>
        <p style={{ ...pp, color:C.inkSoft, fontSize:14.5, marginTop:8 }}>{t('Полную матрицу энергий смотри во вкладке «🔢 Матрица».','See the full energy matrix in the 🔢 Matrix tab.')}</p>
      </Card>
      <AISection {...{premium,openPaywall,save}} p={p} sys={sys}
        histType={t("Сюцай","Syucai")} title={t("Разбор по Сюцай и прогноз","Syucai reading and forecast")} cta={t("Раскрыть разбор Сюцай","Reveal Syucai reading")}
        prompt={`Сделай тёплый разбор по практике Сюцай для ${p.name} (дата ${p.d}.${p.m}.${p.y}). Число сознания ${cons}, число миссии ${mission}. Раскрой: 1) как работает энергия числа сознания — светлая и теневая стороны, как развивать светлую; 2) число миссии — предназначение и как к нему идти (учитывая раскрытие к 33 годам); 3) как перейти от «страдающего эго» к «эго, ищущему счастья» — конкретные шаги; 4) добрый прогноз на ближайшие годы. Без фатальности и страха, только поддержка и рост. 3-4 небольших абзаца.`}/>
    </div>
  );
}

function MatrixTab({ p,save,premium,openPaywall }){
  const { counts:c, work } = buildMatrix(p.d,p.m,p.y);
  const order=[1,4,7,2,5,8,3,6,9];
  const cs=(n)=>c[n]?String(n).repeat(c[n]):"—";
  const interp=(n)=>{ const lv=gCELL(n).levels; return lv[Math.min(c[n],4)]||lv[3]||lv[2]; };
  const ls=(cells)=>cells.reduce((a,n)=>a+c[n],0);
  const str=(v)=>v===0?t('пусто','empty'):v<=2?t('средняя','medium'):v<=4?t('сильная','strong'):t('очень сильная','very strong');
  const promptCounts=[1,2,3,4,5,6,7,8,9].map(n=>`${n}×${c[n]}`).join(", ");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <h3 style={{ ...h3, textAlign:"center" }}>{t('Квадрат Пифагора','Pythagorean square')}</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:6 }}>
          {order.map(n=>(
            <div key={n} style={{ borderRadius:16, padding:"12px 6px", textAlign:"center", minHeight:80,
              border:`2px solid ${c[n]?C.violet:C.line}`, background:c[n]?C.soft:"#fff" }}>
              <div style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, fontSize:c[n]>3?20:24,
                color:c[n]?C.violetD:C.inkSoft, wordBreak:"break-all" }}>{cs(n)}</div>
              <div style={{ fontSize:12, color:C.inkSoft, marginTop:4, lineHeight:1.2 }}>{gCELL(n).name}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", color:C.inkSoft, fontSize:14, marginTop:10 }}>{t('Рабочие числа','Working numbers')}: {work.join(" · ")}</div>
      </Card>
      <Card>
        <h3 style={h3}>{t('Что значат ячейки','What the cells mean')}</h3>
        {[1,2,3,4,5,6,7,8,9].map(n=>(
          <div key={n} style={{ padding:"8px 0", borderBottom:`1px solid ${C.line}` }}>
            <span style={{ color:C.violetD, fontWeight:700 }}>{cs(n)} · {gCELL(n).name}</span>
            <p style={{ ...pp, fontSize:15.5, margin:"2px 0 0" }}>{interp(n)}</p>
          </div>
        ))}
      </Card>
      <Card>
        <h3 style={h3}>{t('Линии судьбы','Lines of destiny')}</h3>
        {gLINES().map(l=>{ const v=ls(l.cells); return (
          <div key={l.n} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${C.line}` }}>
            <span style={{ fontSize:16 }}>{l.n} <span style={{ color:C.inkSoft, fontSize:13.5 }}>({l.cells.join("-")})</span></span>
            <span style={{ color:"#fff", fontSize:13, background:v>=3?C.mint:C.violet, padding:"2px 10px", borderRadius:20 }}>{v} · {str(v)}</span>
          </div>
        );})}
      </Card>
      <AISection {...{premium,openPaywall,save}} p={p} histType={t("Психоматрица","Psychomatrix")} title={t("Разбор психоматрицы и прогноз","Psychomatrix reading and forecast")} cta={t("Раскрыть психоматрицу","Reveal psychomatrix")}
        prompt={`Тёплый разбор психоматрицы (квадрат Пифагора) для ${p.name}. Ячейки (цифра×кол-во): ${promptCounts}. Объясни простыми словами сильные стороны и зоны роста по ячейкам и линиям (самооценка, семья, стабильность, талант, духовность). Затем добрый прогноз: на что опереться, к чему идёшь, как раскрыть потенциал. 3-4 небольших абзаца.`}/>
    </div>
  );
}

function DayTab({ p,save,premium,openPaywall }){
  const iso=(dt)=>dt.toISOString().slice(0,10);
  const tmr=new Date(); tmr.setDate(tmr.getDate()+1);
  const [d,setD]=useState(iso(tmr));
  const [ty,tm,td]=d.split("-").map(Number);
  const pd=personalDay(p.d,p.m,ty,tm,td);
  const human=new Date(ty,tm-1,td).toLocaleDateString(LANG==="en"?"en-US":"ru-RU",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const q=(o)=>{ const x=new Date(); x.setDate(x.getDate()+o); setD(iso(x)); };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <h3 style={h3}>{t('На какую дату заглянуть?','Which date shall we look at?')}</h3>
        <div style={{ display:"flex", gap:8, margin:"10px 0" }}>
          <button onClick={()=>q(0)} style={chip}>{t('Сегодня','Today')}</button><button onClick={()=>q(1)} style={chip}>{t('Завтра','Tomorrow')}</button><button onClick={()=>q(7)} style={chip}>{t('+ неделя','+ week')}</button>
        </div>
        <input type="date" value={d} onChange={e=>setD(e.target.value)} style={{ width:"100%", padding:"12px 14px",
          borderRadius:14, fontSize:16.5, background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none", colorScheme:"light" }}/>
      </Card>
      <Card style={{ textAlign:"center" }}>
        <div style={{ color:C.inkSoft, fontSize:15.5, textTransform:"capitalize" }}>{human}</div>
        <div style={{ fontSize:46, color:C.violetD, fontFamily:"'Quicksand',sans-serif", fontWeight:700, margin:"4px 0" }}>{pd}</div>
        <div style={{ color:C.inkSoft, fontSize:12.5, textTransform:"uppercase", marginBottom:8 }}>{t('число дня','day number')}</div>
        <p style={{ ...pp, margin:0 }}>{gDAY(pd)}</p>
      </Card>
      <AISection key={d} {...{premium,openPaywall,save}} p={p} histType={t("Прогноз на день","Day forecast")} title={t("Подробный добрый прогноз на день","Detailed forecast for the day")} cta={t("Раскрыть, что ждёт","Reveal what is ahead")}
        prompt={`Тёплый прогноз на день ${human} для ${p.name} (знак ${p.sun.n}, число пути ${p.lp}). Число дня — ${pd} (${gDAY(pd)}). Опиши: настроение дня, что приятно и удачно сделать, как провести время с пользой и радостью, мягкий совет и приятную мысль на день. 3-4 коротких абзаца.`}/>
    </div>
  );
}

function ForecastTab({ p,save,premium,openPaywall }){
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card style={{ background:C.soft }}>
        <h3 style={h3}>🗓️ {t('Твой 9-летний цикл','Your 9-year cycle')}</h3>
        <p style={{ ...pp, color:C.inkSoft, margin:0 }}>{t('Каждый год несёт свою тему. Они идут по кругу 1→9 и повторяются на новом витке. Вот что ждёт тебя год за годом:','Each year carries its own theme. They move in a circle 1→9 and repeat on a new turn. Here is what awaits you year by year:')}</p>
      </Card>
      {p.forecast.map((f,i)=>(
        <Card key={f.year} style={{ animationDelay:`${i*.05}s`, border:`2px solid ${i===0?C.violet:C.line}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <span style={{ fontFamily:"'Quicksand',sans-serif", fontSize:20, fontWeight:700, color:C.violetD }}>
              {f.year}{i===0 && <span style={{ fontSize:12.5, color:C.mint, marginLeft:8 }}>● {t('сейчас','now')}</span>}
            </span>
            <span style={{ fontSize:13, color:"#fff", background:i===0?grad:C.violet, padding:"3px 11px", borderRadius:20 }}>{f.num} · {gYT(f.num)}</span>
          </div>
          <p style={{ ...pp, margin:"0 0 6px" }}>{gPY(f.num)}</p>
          <p style={{ ...pp, fontSize:15, color:C.violetD, margin:0 }}>✦ {t('Хорошо для','Good for')}: {gYF(f.num)}</p>
        </Card>
      ))}
      <AISection {...{premium,openPaywall,save}} p={p} histType={t("Прогноз на годы","Year forecast")} title={t("Личный прогноз на 9 лет","Personal 9-year forecast")} cta={t("Составить мой прогноз","Create my forecast")}
        prompt={`Вдохновляющий персональный прогноз по годам для ${p.name} (знак ${p.sun.n}, число пути ${p.lp}, число души ${p.soul}). Личные годы: ${p.forecast.map(f=>`${f.year} — число ${f.num} (${gYT(f.num)})`).join(", ")}. По 1 тёплому предложению на каждый год: ключевая тема и добрая возможность. В конце — общее напутствие на весь цикл. Только позитивно.`}/>
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
      <h3 style={h3}>💞 {t('Кто твой партнёр?','Who is your partner?')}</h3>
      <p style={{ ...pp, color:C.inkSoft, margin:"4px 0 14px" }}>{t('Введи имя и дату рождения второго человека.','Enter the name and birth date of the second person.')}</p>
      {inp("name",t('Имя партнёра','Partner name'),24)}
      <div style={{ display:"flex", gap:8, marginTop:10 }}>{inp("day",t('ДД','DD'),2)}{inp("month",t('ММ','MM'),2)}{inp("year",t('ГГГГ','YYYY'),4)}</div>
      <button onClick={calc} style={{ ...bigBtn, marginTop:16 }}>{t('Проверить совместимость','Check compatibility')}</button>
    </Card>
  );
  const el=(a,b)=>{ if(a===b)return 78; const good=[["Огонь","Воздух"],["Земля","Вода"]],tough=[["Огонь","Вода"],["Земля","Воздух"]];
    const has=(arr)=>arr.some(([x,y])=>(a===x&&b===y)||(a===y&&b===x)); return has(good)?92:has(tough)?64:72; };
  const ns=Math.max(60,96-Math.abs(p.lp-pt.lp)*6);
  const score=Math.round(el(p.sun.el,pt.sun.el)*.6+ns*.4);
  const lbl=score>=85?t('Сильное притяжение 💖','Strong attraction 💖'):score>=72?t('Хорошая совместимость 😊','Great compatibility 😊'):t('Есть над чем расти вместе 🌱','Room to grow together 🌱');
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
        <button onClick={()=>setPt(null)} style={{ ...ghostBtn, marginTop:14 }}>{t('Сменить партнёра','Change partner')}</button>
      </Card>
      <AISection key={`${pt.d}.${pt.m}.${pt.y}`} {...{premium,openPaywall,save}} p={p} histType={t("Совместимость","Compatibility")} title={t("Тёплый разбор пары","A warm couple reading")} cta={t("Раскрыть совместимость","Reveal compatibility")}
        prompt={`Разбери совместимость пары по-доброму. Первый: ${p.name}, ${p.sun.n} (${p.sun.el}), число ${p.lp}. Второй: ${pt.name}, ${pt.sun.n} (${pt.sun.el}), число ${pt.lp}. Индекс ${score}%. Опиши: в чём вы прекрасно дополняете друг друга, ваши сильные стороны как пары, маленькие различия и тёплые советы, как сделать союз ещё крепче. Без приговоров, бережно. Обращайся на «вы». 3-4 небольших абзаца.`}/>
    </div>
  );
}

// ---------- РАБОТА ----------
function CareerTab({ p,save,premium,openPaywall }){
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <h3 style={h3}>💼 {t('Твоя профессиональная природа','Your professional nature')}</h3>
        <p style={pp}>{gCAREER(p.lp)}</p>
        <h3 style={{ ...h3, marginTop:14 }}>{t('Рабочая тема','Focus of')} {new Date().getFullYear()}</h3>
        <p style={pp}>{gPY(p.personalYearNow)}</p>
      </Card>
      <AISection {...{premium,openPaywall,save}} p={p} histType={t("Прогноз по работе","Career forecast")} title={t("Прогноз по карьере и деньгам","Career and money forecast")} cta={t("Раскрыть карьерный прогноз","Reveal career forecast")}
        prompt={`Добрый карьерный разбор для ${p.name} (знак ${p.sun.n}, ${p.sun.el}; число пути ${p.lp}; личный год ${p.personalYearNow}). Опиши: профессиональные суперсилы, подходящие сферы и роли, как комфортнее обращаться с деньгами, и вдохновляющий прогноз на год — возможности и приятные шаги к росту. Это поддержка и идеи, без финансовых гарантий. 3-4 небольших абзаца.`}/>
    </div>
  );
}

// ---------- ЛАЙФХАКИ ----------
function LifehacksTab({ p,save,premium,openPaywall }){
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <h3 style={h3}>💡 {t('Лайфхаки по твоей энергии','Life hacks for your energy')}</h3>
        <p style={{ ...pp, color:C.inkSoft }}>{t('Маленькие добрые подсказки под твой характер и число — как жить легче, приятнее и в гармонии с собой.','Small kind tips tuned to your character and number — how to live easier, happier and in harmony with yourself.')}</p>
      </Card>
      <AISection {...{premium,openPaywall,save}} p={p} histType={t("Лайфхаки","Life hacks")} title={t("Персональные лайфхаки","Personal life hacks")} cta={t("Получить мои лайфхаки","Get my life hacks")}
        prompt={`Дай ${p.name} (знак ${p.sun.n}, ${p.sun.el}, число пути ${p.lp}) 7 тёплых практичных лайфхаков по жизни под его характер: как восполнять энергию, организовать день, беречь отношения, расти в деле, радовать себя. Каждый — короткий, конкретный, добрый и выполнимый. Только позитив и поддержка. Каждый лайфхак с новой строки, начинай с эмодзи.`}/>
      <AISection {...{premium,openPaywall,save}} p={p} histType={t("Шуточный прогноз","Funny prediction")} title={t("😄 Шуточное предсказание","😄 Funny prediction")} cta={t("Посмеши меня","Make me smile")}
        prompt={`Придумай тёплое, доброе и смешное шуточное предсказание для ${p.name} (знак ${p.sun.n}, число пути ${p.lp}) на ближайшее время. Лёгкий юмор и милая самоирония, без обидного и без негатива — только по-доброму, чтобы человек улыбнулся. 1-2 коротких абзаца, заверши законченным предложением.`}/>
      <AISection {...{premium,openPaywall,save}} p={p} histType={t("Предсказание в стихах","Prediction in verse")} title={t("📜 Предсказание в стихах","📜 Prediction in verse")} cta={t("Хочу стишок ✨","I want a rhyme ✨")}
        prompt={`Сочини короткое ОРИГИНАЛЬНОЕ шуточное предсказание-стишок для ${p.name} (знак ${p.sun.n}, число пути ${p.lp}): 4–8 строк, с рифмой, тёплое и с добрым юмором, только позитив. Каждая строка с новой строки. Обязательно заверши последнюю строку точкой или восклицательным знаком.`}/>
    </div>
  );
}

function TarotTab({ p,save,premium,openPaywall }){
  const [cards,setCards]=useState(null);
  const pos=[t('Прошлое','Past'),t('Настоящее','Present'),t('Будущее','Future')];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {!cards ? (
        <Card style={{ textAlign:"center", padding:30 }}>
          <div style={{ fontSize:40, marginBottom:10 }}>🃏 🃏 🃏</div>
          <p style={{ ...pp, marginBottom:16 }}>{t('Подумай о приятном вопросе и вытяни три карты.','Think of a pleasant question and draw three cards.')}</p>
          <button onClick={()=>setCards(shuffle(deck()).slice(0,3))} style={bigBtn}>{t('Вытянуть карты','Draw cards')}</button>
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
          <button onClick={()=>setCards(shuffle(deck()).slice(0,3))} style={ghostBtn}>{t('Перетянуть','Redraw')}</button>
          <AISection {...{premium,openPaywall,save}} p={p} histType={t("Расклад Таро","Tarot spread")} title={t("Тёплое толкование расклада","A warm reading of your spread")} cta={t("Истолковать расклад","Interpret the spread")}
            prompt={`Истолкуй по-доброму расклад Таро для ${p.name}. Прошлое: ${cards[0][0]}. Настоящее: ${cards[1][0]}. Будущее: ${cards[2][0]}. Свяжи карты в светлую историю и дай мягкий обнадёживающий совет. 3-4 абзаца, на «ты».`}/>
        </>
      )}
    </div>
  );
}

// ---------- ЧАТ (3 сообщения бесплатно) ----------
function ChatTab({ p,premium,openPaywall,save }){
  const sys=`${EXPERT} Клиент: ${p.name}, знак ${p.sun.n} (${p.sun.el}), число пути ${p.lp}, восточный знак ${p.chinese}, личный год ${p.personalYearNow}. Отвечай тепло, глубоко и по делу, 2-4 абзаца. ${SAFE}`;
  const [msgs,setMsgs]=useState([{ role:"assistant", content:t(`Привет, ${p.name}! 🌿 Я тут, чтобы поддержать. О чём поговорим — отношения, дело, настроение, выбор?`,`Hi, ${p.name}! 🌿 I am here to support you. What shall we talk about — relationships, work, mood, a choice?`) }]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);
  const chatKey=()=>`cifro:chat:${curLogin()}:${new Date().toISOString().slice(0,10)}`;
  const [used,setUsed]=useState(()=>{ try{ return +(localStorage.getItem(chatKey())||0); }catch(e){ return 0; } });
  const LIMIT=3;
  const locked=!premium && used>=LIMIT;
  const send=async()=>{ if(!input.trim()||loading||locked)return;
    const next=[...msgs,{role:"user",content:input.trim()}]; setMsgs(next); setInput(""); setLoading(true);
    if(!premium){ const n=used+1; setUsed(n); try{ localStorage.setItem(chatKey(),String(n)); }catch(e){} }
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
        {loading && <div style={{ color:C.inkSoft, fontStyle:"italic", fontSize:15 }}>{t('печатает…','typing…')}</div>}
        <div ref={endRef}/>
      </div>
      {locked ? (
        <div style={{ marginTop:12, textAlign:"center", background:C.soft, borderRadius:16, padding:16 }}>
          <p style={{ ...pp, margin:"0 0 10px" }}>{t('На сегодня бесплатные вопросы закончились 🙂 Новые — завтра. В премиуме — общение без ограничений.','You have used your free questions for today 🙂 New ones tomorrow. Premium gives unlimited chat.')}</p>
          <button onClick={openPaywall} style={bigBtn}>{t('★ Открыть премиум','★ Unlock premium')}</button>
        </div>
      ) : (
        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          <input value={input} placeholder={t('Напиши вопрос…','Type your question…')} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            style={{ flex:1, minWidth:0, padding:"12px 14px", borderRadius:14, fontSize:16, background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none" }}/>
          <button onClick={send} disabled={loading} style={{ padding:"0 18px", borderRadius:14, border:"none", cursor:"pointer", background:grad, color:"#fff", fontSize:18, fontWeight:700 }}>➤</button>
        </div>
      )}
      {!premium && !locked && <div style={{ textAlign:"center", color:C.inkSoft, fontSize:13, marginTop:8 }}>{t('Сегодня осталось','Left today')}: {LIMIT-used} {t('вопр.','q.')}</div>}
    </Card>
  );
}

// ---------- КАБИНЕТ ----------
function HistoryTab({ history,del,saveOn }){
  const [open,setOpen]=useState(null);
  if(!saveOn) return <Card style={{ textAlign:"center" }}><p style={pp}>{t('Сохранение выключено. Включи «личный кабинет» на стартовом экране, чтобы хранить разборы.','Saving is off. Turn on the personal account on the start screen to keep your readings.')}</p></Card>;
  if(!history.length) return <Card style={{ textAlign:"center" }}><p style={pp}>{t('Здесь будут твои сохранённые разборы 🌿 Нажми «Сохранить» под любым разбором — и он появится тут.','Your saved readings will appear here 🌿 Tap Save under any reading and it will show up.')}</p></Card>;
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
            : <span onClick={()=>setOpen(h.id)} style={{ color:C.violet, cursor:"pointer", fontSize:15, display:"inline-block", marginTop:8, fontWeight:700 }}>{t('раскрыть ▾','expand ▾')}</span>}
        </Card>
      ))}
    </div>
  );
}

// ---------- ИИ-СЕКЦИЯ (премиум) ----------
function AISection({ p,title,cta,prompt,save,histType,premium,openPaywall,sys }){
  const [text,setText]=useState(()=>loadReading(histType)); const [loading,setLoading]=useState(false); const [saved,setSaved]=useState(false);
  if(!premium) return (
    <Card style={{ textAlign:"center", background:C.soft }}>
      <div style={{ fontSize:30 }}>🔒✨</div>
      <h3 style={{ ...h3, marginTop:6 }}>{title}</h3>
      <p style={{ ...pp, color:C.inkSoft, margin:"4px 0 14px" }}>{t("Подробный персональный разбор доступен в премиуме.","This detailed personal reading is available in premium.")}</p>
      <button onClick={openPaywall} style={bigBtn}>{t("★ Открыть полный доступ","★ Unlock full access")}</button>
    </Card>
  );
  const gen=async(again)=>{ setLoading(true); setSaved(false);
    const extra = again ? (LANG==="en" ? "\n\nGive a fresh, new perspective — do not repeat the previous reading, reveal something more." : "\n\nДай свежий, новый взгляд — не повторяй прошлый разбор, раскрой что-то ещё.") : "";
    const r=await ask([{role:"user",content:prompt+extra}], sys || `${EXPERT} ${SAFE}`); setText(r); saveReading(histType,r); setLoading(false); };
  return (
    <Card>
      <h3 style={h3}>✨ {title}</h3>
      {text ? (
        <>
          <p style={{ ...pp, whiteSpace:"pre-wrap" }}>{text}</p>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button onClick={()=>gen(true)} disabled={loading} style={{ ...ghostBtn, width:"auto", flex:1 }}>{loading?<><Spinner color={C.violetD}/>{t("Думаю…","Thinking…")}</>:t("↻ Узнать ещё","↻ Get more")}</button>
            {save && <button onClick={()=>{ save({type:histType,title:title+" · "+new Date().toLocaleDateString(LANG==="en"?"en-US":"ru-RU"),content:text}); setSaved(true); }} disabled={saved}
              style={{ ...ghostBtn, width:"auto", flex:1, color:saved?C.mint:C.violetD, borderColor:saved?C.mint:C.line }}>{saved?t("Сохранено ✓","Saved ✓"):t("💾 Сохранить","💾 Save")}</button>}
          </div>
        </>
      ) : <button onClick={()=>gen(false)} disabled={loading} style={{ ...bigBtn, marginTop:6 }}>{loading?<><Spinner/>{t("Думаю…","Thinking…")}</>:cta}</button>}
    </Card>
  );
}

// ---------- ОПЛАТА (2 варианта: разовая Kaspi и подписка) ----------
function Paywall({ onClose,onUnlock }){
  const [code,setCode]=useState(""); const [note,setNote]=useState(""); const [cfg,setCfg]=useState({}); const [checking,setChecking]=useState(false);
  useEffect(()=>{ (async()=>setCfg(await apiConfig()))(); },[]);
  const checkPaid=async()=>{ setChecking(true); const paid=await apiStatus(); setChecking(false); if(paid)onUnlock(); else setNote(t("Оплата пока не подтверждена. Обычно доступ открывают в течение нескольких минут.","Payment isn't confirmed yet. Access is usually granted within a few minutes.")); };
  const tryCode=async()=>{ const ok=await apiRedeem(code.trim()); if(ok){ onUnlock(); return; } if(code.trim().toUpperCase()==="DEMO"){ onUnlock(); return; } setNote(t("Промокод не подошёл.","That promo code didn't work.")); };
  const payLink=(link,label,text,style)=> link
    ? <a href={link} target="_blank" rel="noopener noreferrer" onClick={()=>setNote(t(`Открыли оплату (${label}). После оплаты нажми «Я оплатил — проверить».`,`Opened payment (${label}). After paying, tap “I've paid — check access”.`))}
        style={{ ...style, display:"block", textAlign:"center", textDecoration:"none", boxSizing:"border-box" }}>{text}</a>
    : <button onClick={()=>setNote(t("Способ оплаты ещё не настроен. Открой /#admin и вставь ссылку.","This payment method isn't set up yet. Open /#admin and add a link."))} style={style}>{text}</button>;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:10, background:"rgba(40,30,70,.45)",
      display:"flex", alignItems:"flex-end", justifyContent:"center", padding:14 }}>
      <div onClick={e=>e.stopPropagation()} style={{ animation:"pop .25s ease both", width:"100%", maxWidth:520,
        background:"#fff", borderRadius:26, padding:22, maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:34 }}>✨</div>
          <h2 style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, fontSize:24, margin:"4px 0" }}>{t("Премиум-доступ","Premium access")}</h2>
          <p style={{ ...pp, color:C.inkSoft }}>{t("Глубокие разборы, натальная карта, Сюцай, прогнозы, совместимость и чат без лимитов.","Deep readings, natal chart, forecasts, compatibility and unlimited chat.")}</p>
        </div>
        <div style={{ marginTop:16, borderRadius:18, border:`2px solid ${C.violet}`, background:C.soft, padding:16, position:"relative" }}>
          <div style={{ position:"absolute", top:-10, left:16, background:grad, color:"#fff", fontSize:10.5, fontWeight:700, padding:"2px 10px", borderRadius:20 }}>{t("ПОЛНЫЙ ДОСТУП","FULL ACCESS")}</div>
          <div style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, fontSize:18 }}>♾️ {t("Подписка","Subscription")}</div>
          <div style={{ color:C.inkSoft, fontSize:14.5, margin:"2px 0 6px" }}>{t("Открывает все разборы, прогнозы, совместимость и чат без ограничений.","Unlocks all readings, forecasts, compatibility and unlimited chat.")}</div>
          <div style={{ color:C.violetD, fontWeight:800, fontSize:22, marginBottom:10 }}>{cfg.price || t("4 990 ₸ / месяц","$9.90 / month")}</div>
          {payLink(cfg.kaspiLink, "Kaspi", t("Оплатить через Kaspi","Pay with Kaspi"), { ...bigBtn, background:"#ff3b30" })}
          {cfg.appleLink && <><div style={{ height:8 }}/>{payLink(cfg.appleLink, "Apple Pay", " Pay", { ...bigBtn, background:"#000" })}</>}
        </div>
        {note && <p style={{ ...pp, fontSize:14.5, color:C.inkSoft, background:C.soft, borderRadius:14, padding:12, marginTop:12 }}>{note}</p>}
        <button onClick={checkPaid} disabled={checking} style={{ ...ghostBtn, marginTop:12 }}>{checking?t("Проверяю…","Checking…"):t("Я оплатил — проверить доступ","I've paid — check access")}</button>
        <div style={{ marginTop:14, borderTop:`1px solid ${C.line}`, paddingTop:14 }}>
          <div style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, fontSize:15, marginBottom:6 }}>🎁 {t("Есть промокод?","Have a promo code?")}</div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={code} onChange={e=>setCode(e.target.value)} placeholder={t("Введите промокод","Enter promo code")}
              style={{ flex:1, padding:"12px 14px", borderRadius:14, fontSize:16, background:C.soft, border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none" }}/>
            <button onClick={tryCode} style={{ ...bigBtn, width:"auto", padding:"0 20px" }}>{t("Применить","Apply")}</button>
          </div>
        </div>
        <button onClick={onClose} style={{ width:"100%", marginTop:12, background:"none", border:"none", color:C.inkSoft, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>{t("Позже","Later")}</button>
      </div>
    </div>
  );
}

// ---------- АДМИНКА ----------
function AdminPanel(){
  const [pass,setPass]=useState(""); const [authed,setAuthed]=useState(false);
  const [users,setUsers]=useState([]); const [cfg,setCfg]=useState({}); const [msg,setMsg]=useState(""); const [online,setOnline]=useState(0);
  const call=(body)=>fetch("/api/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const login=async(p)=>{ const pw=p||pass; const r=await call({password:pw,action:"list"}); if(r.status!==200){ setMsg("Неверный пароль или база не подключена"); return; } const d=await r.json(); setUsers(d.users||[]); setCfg(d.config||{}); setOnline(d.onlineCount||0); setAuthed(true); setMsg(""); };
  useEffect(()=>{ if(!authed) return; const id=setInterval(()=>login(),20000); return ()=>clearInterval(id); },[authed,pass]);
  const setPaid=async(id,paid)=>{ await call({password:pass,action:"setPaid",id,paid}); login(); };
  const delUser=async(id)=>{ await call({password:pass,action:"delUser",id}); login(); };
  const editUser=async(u)=>{ const name=prompt("Имя:",u.name||""); if(name===null)return; const dob=prompt("Дата рождения (ДД.ММ.ГГГГ):",u.dob||""); if(dob===null)return; await call({password:pass,action:"setUser",id:u.id,name,dob}); login(); };
  const saveCfg=async()=>{ await call({password:pass,action:"setConfig",kaspiLink:cfg.kaspiLink,appleLink:cfg.appleLink,price:cfg.price,promo:cfg.promo,showHistory:cfg.showHistory!==false}); setMsg("Настройки сохранены ✓"); };
  const paidCount=users.filter(u=>u.paid).length;
  const box={ minHeight:"100vh", background:"#f6f2ff", fontFamily:"'Nunito',sans-serif", color:C.ink, padding:"24px 16px" };
  const inpS={ width:"100%", padding:"12px 14px", borderRadius:12, fontSize:16, background:"#fff", border:`2px solid ${C.line}`, color:C.ink, fontFamily:"inherit", outline:"none", marginTop:8 };
  if(!authed) return (
    <div style={box}><Fonts/>
      <div style={{ maxWidth:420, margin:"40px auto", background:"#fff", borderRadius:22, padding:24, border:`1px solid ${C.line}` }}>
        <h2 style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700 }}>🔐 Админка «Цифрология»</h2>
        <p style={{ ...pp, color:C.inkSoft, fontSize:15 }}>Введи пароль администратора (переменная ADMIN_PASSWORD на Vercel).</p>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Пароль" style={inpS}/>
        <button onClick={()=>login()} style={{ ...bigBtn, marginTop:12 }}>Войти</button>
        {msg && <p style={{ color:"#e0554b", fontSize:14.5, marginTop:10 }}>{msg}</p>}
        <a href="#" onClick={()=>{location.hash="";location.reload();}} style={{ display:"block", textAlign:"center", color:C.inkSoft, fontSize:14, marginTop:14 }}>← на сайт</a>
      </div>
    </div>
  );
  return (
    <div style={box}><Fonts/>
      <div style={{ maxWidth:720, margin:"0 auto" }}>
        <h2 style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, marginBottom:4 }}>📊 Админка</h2>
        <p style={{ color:C.inkSoft, marginBottom:16 }}>Всего: <b>{users.length}</b> · Оплатили: <b style={{color:C.mint}}>{paidCount}</b> · <span style={{color:C.mint}}>🟢 сейчас на сайте: <b>{online}</b></span></p>

        <div style={{ background:"#fff", borderRadius:18, padding:18, border:`1px solid ${C.line}`, marginBottom:16 }}>
          <h3 style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, margin:"0 0 8px" }}>⚙️ Настройка оплаты Kaspi</h3>
          <label style={{ fontSize:14.5, color:C.inkSoft }}>Ссылка Kaspi на оплату (из приложения Kaspi → Бизнес → выставить счёт/ссылка)</label>
          <input value={cfg.kaspiLink||""} onChange={e=>setCfg({...cfg,kaspiLink:e.target.value})} placeholder="https://pay.kaspi.kz/..." style={inpS}/>
          <label style={{ fontSize:14.5, color:C.inkSoft, display:"block", marginTop:8 }}>Ссылка Apple Pay / Stripe (для англоязычной аудитории, можно оставить пустым)</label>
          <input value={cfg.appleLink||""} onChange={e=>setCfg({...cfg,appleLink:e.target.value})} placeholder="https://buy.stripe.com/... (Apple Pay включается в Stripe)" style={inpS}/>
          <label style={{ fontSize:14.5, color:C.inkSoft, display:"block", marginTop:8 }}>Цена подписки (в неделю) — что видит клиент</label>
          <input value={cfg.price||""} onChange={e=>setCfg({...cfg,price:e.target.value})} placeholder="Напр. 4 990 ₸ / месяц (или / неделя)" style={inpS}/>
          <label style={{ fontSize:14.5, color:C.inkSoft, display:"block", marginTop:8 }}>🔑 Секретный промокод (полный доступ бесплатно). Держи в тайне — кому дашь, тот заходит везде.</label>
          <input value={cfg.promo||""} onChange={e=>setCfg({...cfg,promo:e.target.value})} placeholder="Напр. VIP2026" style={inpS}/>
          <label onClick={()=>setCfg({...cfg,showHistory:cfg.showHistory===false?true:false})} style={{ display:"flex", alignItems:"center", gap:10, marginTop:14, cursor:"pointer", fontSize:15 }}>
            <span style={{ width:24, height:24, borderRadius:8, flex:"none", border:`2px solid ${C.violet}`, display:"flex", alignItems:"center", justifyContent:"center",
              background:cfg.showHistory!==false?grad:"transparent", color:"#fff", fontWeight:800 }}>{cfg.showHistory!==false?"✓":""}</span>
            <span>Показывать клиентам «Кабинет» с историей разборов</span>
          </label>
          <div style={{ fontSize:13, color:C.inkSoft, marginTop:4, marginLeft:34 }}>Выключишь — вкладка «Кабинет» пропадёт у клиентов (можно продавать как отдельную опцию).</div>
          <button onClick={saveCfg} style={{ ...bigBtn, marginTop:12 }}>Сохранить настройки</button>
          {msg && <p style={{ color:C.mint, fontSize:14.5, marginTop:8 }}>{msg}</p>}
        </div>

        <div style={{ background:"#fff", borderRadius:18, padding:18, border:`1px solid ${C.line}` }}>
          <h3 style={{ fontFamily:"'Quicksand',sans-serif", fontWeight:700, margin:"0 0 8px" }}>👥 Пользователи</h3>
          {!users.length && <p style={{ color:C.inkSoft }}>Пока никто не зарегистрировался.</p>}
          {users.map(u=>(
            <div key={u.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.line}`, gap:10 }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontWeight:700 }}>
                  <span style={{ color:u.online?C.mint:"#d8d3e6", fontSize:12 }}>●</span> {u.name||"—"} <span style={{ color:C.inkSoft, fontWeight:400 }}>· {u.dob||""}</span>
                  {u.online && <span style={{ color:C.mint, fontSize:12, fontWeight:700, marginLeft:6 }}>онлайн</span>}
                </div>
                <div style={{ color:C.inkSoft, fontSize:13 }}>@{u.id} · {u.ts?new Date(u.ts).toLocaleString("ru-RU"):""}</div>
              </div>
              <div style={{ display:"flex", gap:6, flex:"none", alignItems:"center" }}>
                <button onClick={()=>setPaid(u.id,!u.paid)} style={{ padding:"8px 12px", borderRadius:12, border:"none", cursor:"pointer", fontFamily:"'Quicksand',sans-serif", fontWeight:700, fontSize:13,
                  background:u.paid?C.mint:C.soft, color:u.paid?"#fff":C.violetD }}>{u.paid?"✓ оплатил":"отметить оплату"}</button>
                <button onClick={()=>editUser(u)} title="Редактировать"
                  style={{ padding:"8px 10px", borderRadius:12, border:`1px solid ${C.line}`, background:"#fff", cursor:"pointer", color:C.violetD, fontSize:14 }}>✏️</button>
                <button onClick={()=>{ if(confirm("Удалить "+(u.name||u.id)+"?")) delUser(u.id); }} title="Удалить"
                  style={{ padding:"8px 10px", borderRadius:12, border:`1px solid ${C.line}`, background:"#fff", cursor:"pointer", color:"#e0554b", fontSize:14 }}>🗑</button>
              </div>
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
    {t("Цифрология — добрый помощник для самопознания и хорошего настроения. Это не медицинская, психологическая, юридическая или финансовая консультация. Если тебе тяжело — поделись с близкими или специалистом, рядом всегда есть поддержка. 💛",
       "Numerology here is a kind helper for self-discovery and good mood. It is not medical, psychological, legal or financial advice. If you're going through a hard time, please reach out to someone close or a professional — support is always near. 💛")}
  </p>
);
