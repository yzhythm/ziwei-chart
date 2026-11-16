/* ============================================================
   同类型命盘检索引擎  similar.js
   ------------------------------------------------------------
   三路检索：
   A. 同年同构 —— 与你同年出生，且骨架层完全相同（脚本同步）
   B. 跨年同构 —— 骨架层相同（四化落宫与命宫主星一致），不论年份
   C. 名人对照 —— 与名人库逐一比对，给出结构相似度排序
   ------------------------------------------------------------
   「同构」不是玄学概念，是可验证的结构等同：
   命宫主星相同 + 五行局相同 + 身宫位次相同 + 生年四化落宫相同
   → 这意味着先天格局与资源分布一致，人生剧本的"类型"相同。
   ============================================================ */
(function(){
var ZW = window.ZW || {}; window.ZW = ZW;

/* ============================================================
   A. 同年同构：遍历出生年的全部日期×时辰
   ------------------------------------------------------------
   一年 = 365（或闰年 366）× 12 时辰 = 约 4400 个盘
   引擎每盘 0.073 ms，全扫仅 0.3 秒，可在浏览器实时跑
   ============================================================ */
function scanSameYear(C, opts){
  opts = opts || {};
  var m = C.meta;
  /* ⚠ 用【公历年】而非 meta.birthYear（后者是农历年，两者可能差一年）
     「同年同构」指的是同一个公历出生年 */
  var year = m.solar[0];
  var myFp = ZW.FP.fingerprint(C);
  var gender = m.gender;
  var out = [];
  var DAY = 30;   /* 每月按 30 天扫，覆盖全部可能农历日期 */

  for(var mo=1; mo<=12; mo++){
    for(var d=1; d<=DAY; d++){
      for(var h=0; h<12; h++){
        var sub;
        try {
          sub = ZW.paiPan({calendar:'solar', year:year, month:mo, day:d, hour:h, gender:gender});
        } catch(e){ continue; }
        if(!sub || !sub.meta || sub.meta.mingZhi===undefined) continue;
        /* 引擎会把 2/30 之类归一到下月，需按返回的实际公历去重 */
        var f = ZW.FP.fingerprint(sub);
        var sim = ZW.FP.similarity(myFp, f);
        /* 同年同构的判定：骨架层完全相同 */
        if(sim.sameCore){
          out.push({
            solar: sub.meta.solar.slice(), hour:h, hourZhi:(ZW.hourZhi(h).zhi),
            gz:sub.meta.yearGZ,
            lunar: sub.meta.lunar.monthName + sub.meta.lunar.dayName,
            sim: sim,
            fp: f,
            chart: sub
          });
        }
      }
    }
  }
  /* 去重：公历日+时辰唯一（引擎归一后可能出现重复） */
  var seen={}, dedup=[];
  out.forEach(function(x){
    var k = x.solar.join('-')+'|'+x.hourZhi;
    if(seen[k]) return;
    seen[k]=1; dedup.push(x);
  });
  /* 按相似度排序 */
  dedup.sort(function(a,b){ return b.sim.total-a.sim.total; });
  return {sameYear: dedup, scanned: 12*DAY*12, year: year};
}

/* ============================================================
   B. 跨年同构检索
   ------------------------------------------------------------
   全扫 1900-2099 需 73 万盘（约 54 秒），浏览器不可接受。
   改用【骨架键先筛后排】：
     骨架相同 = 五行局 + 命宫主星 + 身宫位次 + 四化落宫 全同
     → 先算 sig1 签名，sig1 不同直接跳过，不进相似度计算
   参数 maxScan 控制扫描量，抽样步长可调以平衡速度与覆盖率。
   ============================================================ */
function findCrossYear(C, opts){
  opts = opts || {};
  var y0 = opts.y0 || 1900, y1 = opts.y1 || 2099;
  var maxScan = opts.maxScan || 90000;
  var dayStep = opts.dayStep || 3;      /* 每 4 天扫一次，降低耗时 */
  var myFp = ZW.FP.fingerprint(C);
  var mySig = myFp.sig1;
  var myMingZhi = C.meta.mingZhi;
  var myJu = C.meta.juName;
  var hits = [];
  var scanned = 0;

  /* 逐年分段配额：保证时间跨度全覆盖，
     而不是把配额全耗在最前面的年份 */
  var totalYears = y1 - y0 + 1;
  var perYear = Math.max(150, Math.floor(maxScan / totalYears));

  for(var y=y0; y<=y1; y++){
    var yearScanned = 0;
    for(var mo=1; mo<=12; mo++){
      for(var d=1; d<=30; d+=dayStep){
        for(var h=0; h<12; h++){
          if(scanned>=maxScan || yearScanned>=perYear) break;
          scanned++; yearScanned++;
          /* 快速预筛：只看命宫地支与五行局，不建完整指纹。
             骨架相同必然满足这两项，先用它砍掉大部分候选 */
          var sub = null;
          try { sub = ZW.paiPan({calendar:'solar', year:y, month:mo, day:d, hour:h, gender:'男'}); }
          catch(e){ continue; }
          if(!sub || !sub.meta || sub.meta.mingZhi===undefined) continue;
          if(sub.meta.mingZhi !== myMingZhi) continue;
          if(sub.meta.juName !== myJu) continue;
          var f = ZW.FP.fingerprint(sub);
          if(f.sig1 !== mySig) continue;          /* 骨架不同，直接跳过 */
          var sim = ZW.FP.similarity(myFp, f);
          hits.push({
            solar: sub.meta.solar.slice(),
            hour: h, hourZhi: ZW.hourZhi(h).zhi,
            gz: sub.meta.yearGZ,
            lunar: sub.meta.lunar.monthName + sub.meta.lunar.dayName,
            sim: sim, fp: f, chart: sub
          });
        }
      }
    }
  }
  /* 去重（引擎日期归一可能造成重复） */
  var seen={}, dedup=[];
  hits.forEach(function(x){
    var k=x.solar.join('-')+'|'+x.hourZhi;
    if(seen[k]) return; seen[k]=1; dedup.push(x);
  });
  dedup.sort(function(a,b){ return b.sim.total-a.sim.total; });
  return {list: dedup, scanned: scanned, sig: mySig};
}

/* ============================================================
   C. 名人对照
   ============================================================ */
function compareCelebs(C){
  var myFp = ZW.FP.fingerprint(C);
  var list = ZW.CELEB.reachable();
  var res = [];
  for(var i=0;i<list.length;i++){
    var c = list[i];
    var r = ZW.CELEB.chart(c);
    if(!r) continue;
    var sim = ZW.FP.similarity(myFp, r.fp);
    res.push({
      celeb: c,
      sim: sim,
      diff: ZW.FP.diffExplain(myFp, r.fp),
      fp: r.fp,
      chart: r.chart
    });
  }
  res.sort(function(a,b){ return b.sim.total-a.sim.total; });
  return res;
}

/* ============================================================
   综合分析入口
   ============================================================ */
function analyze(C, opts){
  opts = opts || {};
  var myFp = ZW.FP.fingerprint(C);
  var m = C.meta;

  /* 结构画像：把指纹翻译成人话 */
  var profile = {
    ju: m.juName,
    mingStars: myFp.l1.mingStars,
    shenRel: myFp.l1.shenRel,
    shenSame: myFp.l1.shenSame,
    huaPos: myFp.l1.huaPos,
    laiYin: myFp.l1.laiYin,
    emptyCount: myFp.l2.emptyCount,
    shaTotal: myFp.l2.shaTotal,
    downCount: myFp.l2.down.length,
    upCount: myFp.l2.up.length,
    sig1: myFp.sig1
  };

  var sameYear = opts.skipSameYear ? [] : scanSameYear(C, opts);
  var celebs = compareCelebs(C);
  var crossYear = opts.skipCrossYear ? [] : findCrossYear(C, opts).list;

  return {
    profile: profile,
    fp: myFp,
    sameYear: sameYear.sameYear,
    sameYearScanned: sameYear.scanned,
    crossYear: crossYear,
    celebs: celebs,
    /* 统计 */
    stats: {
      sameYearCount: sameYear.sameYear.length,
      crossYearCount: crossYear.length,
      celebBest: celebs.length? celebs[0].sim.total : 0,
      celebTop3: celebs.slice(0,3).map(function(c){ return c.celeb.n+':'+c.sim.total; })
    }
  };
}

/* ============================================================
   结构画像的人话解读
   ============================================================ */
function profileText(p){
  var out = [];
  out.push('五行局 '+p.ju+'：'+
    ({'木三局':'生发柔韧，宜以专业与积累取胜','火六局':'热烈外扬，宜主动出击、趁势而为',
      '土五局':'厚重稳健，宜守成积累、不宜轻动','金四局':'刚锐果决，宜专业立身、当断则断',
      '水二局':'灵活流动，宜以智取胜、广结善缘'}[p.ju]||'格局基调由此决定'));
  out.push('命宫主星 '+(p.mingStars==='空'?'空宫（借对宫）':p.mingStars)+'：'+
    (p.mingStars.indexOf('借')===0?'本宫无主星，借对宫之力——人生弹性大，依赖外部环境与他人给支点':
     '本宫自主，气质由此定'));
  out.push(p.shenSame? '身命同宫：自我与外在高度一致，一生「自己扛」':
     '身宫距命宫 '+p.shenRel+' 位：人生重心从自我逐步移向'+({1:'兄弟',2:'夫妻',3:'子女',4:'财帛',5:'疾厄',6:'迁移',7:'交友',8:'官禄',9:'田宅',10:'福德',11:'父母'}[p.shenRel]||'他宫'));
  out.push('生年四化落宫：禄'+p.huaPos[0]+'、权'+p.huaPos[1]+'、科'+p.huaPos[2]+'、忌'+p.huaPos[3]+
    ' —— 资源、压力、缓冲、功课各落一处，先天能量分布由此定');
  out.push('空宫 '+p.emptyCount+' 个，煞曜共 '+p.shaTotal+' 处，自化链 ↓'+p.downCount+' / ↑'+p.upCount+
    ' —— 漏口与补给点的分布，决定遇到坎时靠什么渡过');
  return out;
}

ZW.SIM = {
  analyze: analyze,
  scanSameYear: scanSameYear,
  findCrossYear: findCrossYear,
  compareCelebs: compareCelebs,
  profileText: profileText,

};
})();
