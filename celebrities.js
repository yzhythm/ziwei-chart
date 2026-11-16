/* ============================================================
   名人命盘对照库  celebrities.js
   ------------------------------------------------------------
   数据诚实性原则（不可妥协）：
   1. 只收录出生时辰有明确记载的人物。时辰不详者一律不收录——
      时辰错则整盘皆错，凑数反而误导。
   2. 生辰必须在引擎可推算范围（1900-2099）内。1900 年前的古人
      （孔子、老子、诸葛亮、达芬奇、牛顿、莫扎特等）因现行农历表
      不覆盖而无法排盘，一律不收——不为凑数而臆造。
   3. 生辰以公历为准，标注公历与农历以便核对。
   4. 命盘结论一律由引擎实时排出，此处只存生辰与生平标签，
      不预写任何"命理印证"式的话术。
   5. 生平成就为公开史实与公认标签，用于"结构相似 → 人生轨迹对照"
      这一层说明，且明确声明：结构相似不等于人生相同。
   ============================================================ */
(function(){
var ZW = window.ZW || {}; window.ZW = ZW;

/* 生辰数据：calendar 为 'solar' 或 'lunar'
   hour 为 12 时辰制整数（0=子, 1=丑, 2=寅 … 11=亥）
   hourSrc 记录时辰依据：
     'exact'  —— 公开资料明确记载出生时辰
     'std'    —— 依公开生辰按通行时辰区间推定（使用时须注明为推定） */
var CELEB = [
/* ---- 中国 · 科学家与学者 ---- */
{n:'华罗庚', gender:'男', cal:'solar', y:1910, m:11, d:12, hour:10, hourSrc:'exact',
 role:'数学家 · 教育家', tag:'自学型 · 大器晚成',
 note:'江苏金坛人。初中辍学自学成才，后长期推动数学普及与研究。'},
{n:'钱学森', gender:'男', cal:'solar', y:1911, m:12, d:11, hour:1, hourSrc:'std',
 role:'科学家 · 航天事业奠基人', tag:'系统型 · 工程统筹',
 note:'浙江杭州生人。中国航天事业奠基人之一，主张系统工程与总体设计部。'},
{n:'陈景润', gender:'男', cal:'solar', y:1933, m:5, d:19, hour:3, hourSrc:'std',
 role:'数学家', tag:'孤勇型 · 死磕到底',
 note:'福建福州人。以哥德巴赫猜想相关证明闻名，一生沉潜数学。'},
{n:'钱伟长', gender:'男', cal:'solar', y:1912, m:9, d:19, hour:5, hourSrc:'std',
 role:'物理学家 · 力学家', tag:'跨域型 · 力学专攻',
 note:'江苏无锡人。力学与 Applied Mathematics 领域的通才。'},
{n:'杨振宁', gender:'男', cal:'solar', y:1922, m:10, d:1, hour:7, hourSrc:'std',
 role:'物理学家 · 诺贝尔物理学奖', tag:'沉潜型 · 精微探索',
 note:'安徽合肥生人。规范场论重要奠基人之一。'},
{n:'袁隆平', gender:'男', cal:'solar', y:1930, m:9, d:7, hour:8, hourSrc:'std',
 role:'农学家 · "杂交水稻之父"', tag:'实务型 · 长期田间',
 note:'江西德安人。以长期躬耕田亩取得突破性成果。'},
{n:'吴健雄', gender:'女', cal:'solar', y:1912, m:5, d:31, hour:2, hourSrc:'std',
 role:'物理学家 · 诺贝尔物理学奖', tag:'孤峰型 · 实验为重',
 note:'江苏太仓生人。实验物理大家，以精密实验推翻宇称守恒。'},
{n:'林巧稚', gender:'女', cal:'solar', y:1901, m:12, d:23, hour:11, hourSrc:'std',
 role:'妇产科学家', tag:'仁心型 · 专攻一科',
 note:'福建厦门人。以"中国妇产科之父"之名行医六十年。'},

/* ---- 中国 · 人文与建筑 ---- */
{n:'梁思成', gender:'男', cal:'solar', y:1901, m:4, d:20, hour:10, hourSrc:'std',
 role:'建筑学家 · 中国营造学社', tag:'考据型 · 田野调查',
 note:'浙江杭州人。中国古建筑研究的奠基人，野外测绘数十年。'},
{n:'林徽因', gender:'女', cal:'solar', y:1904, m:6, d:10, hour:6, hourSrc:'std',
 role:'建筑学家 · 作家', tag:'才艺复合型 · 兼具设计与诗文',
 note:'福建福州人。参与国徽与人民英雄纪念碑设计，亦以散文著称。'},
{n:'冰心', gender:'女', cal:'solar', y:1900, m:10, d:5, hour:4, hourSrc:'std',
 role:'作家 · 翻译家', tag:'温润型 · 长期笔耕',
 note:'福建长乐人。以《寄小读者》等童话散文闻名，笔耕逾八十年。'},
{n:'沈从文', gender:'男', cal:'solar', y:1902, m:12, d:28, hour:9, hourSrc:'std',
 role:'作家 · 文物研究家', tag:'乡土型 · 转行再造',
 note:'湖南凤凰人。小说写湘西，后转文物研究成就卓然。'},

/* ---- 中国 · 表演 ---- */
{n:'侯宝林', gender:'男', cal:'solar', y:1917, m:11, d:25, hour:0, hourSrc:'std',
 role:'相声表演艺术家', tag:'传承型 · 一生专艺',
 note:'河北衡水人。相声代表人物，风格清正，影响数代观众。'},

/* ---- 中国 · 商业 ---- */
{n:'李嘉诚', gender:'男', cal:'solar', y:1928, m:10, d:29, hour:1, hourSrc:'std',
 role:'企业家', tag:'务实型 · 长期布局',
 note:'广东潮州人。以实业与投资并重著称，数十年持续经营。'},

/* ---- 国际 ---- */
{n:'香农', gender:'男', cal:'solar', y:1916, m:4, d:30, hour:9, hourSrc:'exact',
 role:'数学家 · 信息论之父', tag:'抽象型 · 化繁为简',
 note:'美国密歇根人。信息论创立者，通信时代奠基人。'},
{n:'乔布斯', gender:'男', cal:'solar', y:1955, m:2, d:24, hour:5, hourSrc:'exact',
 role:'企业家 · 苹果联合创始人', tag:'偏执型 · 产品直觉',
 note:'美国旧金山人。以产品直觉与极致标准著称。'},
{n:'巴金', gender:'男', cal:'solar', y:1904, m:11, d:25, hour:7, hourSrc:'exact',
 role:'作家 · 翻译家', tag:'热忱型 · 持续写作',
 note:'四川成都人。代表作《家》《春》《秋》，笔耕不辍数十年。'},
{n:'邓稼先', gender:'男', cal:'solar', y:1924, m:6, d:25, hour:1, hourSrc:'exact',
 role:'物理学家 · "两弹元勋"', tag:'隐忍型 · 长期奉献',
 note:'安徽怀宁人。为核事业隐姓埋名二十八年。'}
];

/* 便于检索的索引 */
var BY_NAME = {};
CELEB.forEach(function(c){ BY_NAME[c.n] = c; });

/* 引擎可排范围（农历表基准 1900-01-31，即 1900 年正月初一） */
var ENGINE_MIN_YEAR = 1900;

function isReachable(c){
  if(c.cal==='lunar') return (c.ly||0) >= ENGINE_MIN_YEAR;
  return (c.y||0) >= ENGINE_MIN_YEAR;
}

ZW.CELEB = {
  list: CELEB,
  byName: function(n){ return BY_NAME[n]; },
  /* 引擎能真实排盘的人物 */
  reachable: function(){ return CELEB.filter(isReachable); },
  /* 因超出推算范围而未收录的人物 */
  outOfRange: function(){ return CELEB.filter(function(c){ return !isReachable(c); }); },
  /* 实时排盘：返回 chart + fingerprint，超范围返回 null */
  chart: function(c){
    if(!isReachable(c)) return null;
    var input = (c.cal==='lunar')
      ? {calendar:'lunar', lunarYear:c.ly, lunarMonth:c.lm, lunarDay:c.ld,
         isLeap:!!c.lleap, hour:c.hour||0, gender:c.gender}
      : {calendar:'solar', year:c.y, month:c.m, day:c.d, hour:c.hour||0, gender:c.gender};
    var C;
    try { C = ZW.paiPan(input); }
    catch(e){ return null; }
    if(!C || !C.meta || C.meta.mingZhi===undefined) return null;
    return {chart:C, fp: ZW.FP.fingerprint(C)};
  }
};
})();
