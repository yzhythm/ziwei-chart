# Zi Wei Dou Shu Chart · 紫微斗数在线排盘

A **pure front-end, zero-dependency, offline-capable** Zi Wei Dou Shu (Purple Star Astrology) charting and analysis tool.

Enter a birth time → get a full 12-palace chart, a 12-volume in-depth report, and an 84-candle life K-line.
Everything is computed locally in your browser — **no network calls, no data upload, no account needed**.

![Preview](preview.png)

---

## ✨ Features

| Module | Description |
|---|---|
| **New Chart** | Solar / lunar calendar input, 1900–2099, with hour branch and gender |
| **Chart Map** | Full 12-palace grid: major stars, auxiliaries, minor stars, four transformations, self-transformations, twelve officials |
| **Interpretation** | 12-volume report: chart map, core structure, 12-palace close reading, natal transformations, flying transformations, self-transformation chains, adjacencies & empty palaces, **钦天取用神 (Qintian use-god method)**, six life topics, decade cycles with annual fortunes, key events with monthly timing, methodology & disclaimer |
| **钦天取用神** | Qintian-school use-god procedure (华山钦天系 · 钟明修 · 蔡明宏): set the Taiji → choose the use-god palace → four transformations as use-god stars → Ji (obstacle) judges fortune → yin-yang combination → Zuo-Fu / You-Bi / Wen-Chang / Wen-Qu reading → decade-borrowed transformations |
| **Chart Q&A** | 10 computed Q&A pairs for the current chart + free-form keyword questions |
| **Luck Analysis** | 84-candle life K-line (start value 1.000) with decade bands, hover for per-year trigger details, range switching |
| **同类型命盘** | 结构指纹检索：同年同构（同年 + 骨架全同）、跨年同构（1900–2099 抽样）、名人命盘对照（18 位） |
| **Similar Charts** | Structural-fingerprint search: same-year isomorphism, cross-year isomorphism (sampled 1900–2099), celebrity chart comparison (18 figures) |
| **Synastry** | Two-chart comparison across 9 dimensions + a 10-volume synastry report: life-palace resonance, marriage-palace dialogue, cross-chart transformations, self-transformation supply/demand, 12-theme complementarity matrix, luck resonance with monthly timing |
| **Languages** | 简体中文 / 繁體中文 / English (English mode adds a computed Executive Summary) |

## 🌐 Live Demo

- <https://YOUR-USERNAME.github.io/ziwei-chart/>
- Or download `紫微排盘_分享包.zip`, extract it, and double-click `命盘工作台.html` (single file, works fully offline)

## 📦 What's in the share package

```
紫微排盘_分享包/
├─ 开始.html              ← index page (ink-and-starry-sky style)
├─ 命盘工作台.html        ← main app · single self-contained file, zero dependencies
├─ 浅色水墨版.html        ← light rice-paper variant
├─ 分享页.html            ← QR-code generator page (paste any URL, instant re-render)
├─ 二维码与卡片/          ← QR codes + ink-style share cards
├─ site/                  ← full website source
├─ 启动局域网服务.bat      ← local LAN server for phone access
└─ 使用说明.txt
```

> ⚠️ **Windows users**: don't double-click files from inside the zip window. Windows only extracts
> that one file to a temp folder, so links break with `ERR_FILE_NOT_FOUND`. Use "Extract All…" first.

## 🛠 Technical notes

- **No framework, no build step, no external dependencies** — plain HTML / CSS / JavaScript
- **Charting engine** `js/chart.js`: life/body palace, five-element cycle, 14 major stars, auxiliaries,
  natal transformations, self-transformation chains, twelve officials, decade/minor/annual cycles,
  origin palace, triangular & opposite relationships
- **Lunar engine** `js/lunar-data.js`: 1900–2099 lunar month table, four pillars, five-tiger/five-rat escapes
- **Report generator** `js/report-core.js` + `js/report-extra.js` + `js/qintian-report.js`: every reading is derived from chart data at
  runtime — nothing is a hard-coded template
- **Qintian use-god engine** `js/qintian.js`: yin/yang palace classification (six yang + six yin palaces),
  four-transformation ordering by 禄权科忌, Ji-as-chief judgement, palace-stem borrowing for decade
  cycles (no separate five-tiger escape), plus a rule library for Zuo-Fu / You-Bi / Wen-Chang / Wen-Qu
  with cross-rules that only fire when those stars actually share a palace
- **K-line model** `js/interpret.js` + `js/kline.js`: explainable OHLC fortune index, hand-drawn on Canvas
- **Style isolation**: reports and the K-line are hosted in `iframe srcdoc`, so the paper theme never
  bleeds into the dark workspace shell
- **Cache-busting**: every JS/CSS reference carries a `?v=<content-hash>` stamp, so a code change is
  picked up immediately instead of being masked by the browser cache
- **One-command build**: `python _calc/build_github_version.py` rebuilds the embed bundle, the
  content-hash stamps, the single-file build, this repository folder and the upload folder, then
  self-checks the result (zero external references, every engine present, document sizes and
  volume counts in sync)

**Structural fingerprint engine** `js/fingerprint.js` + `js/similar.js`: compresses a chart into a three-layer signature (skeleton / features / texture) and searches for isomorphic charts. Similarity thresholds are calibrated against the measured distribution of 7,140 random chart pairs.

**Engine accuracy**: core star-placement rules were regression-checked against real charts —
198 items (major stars, auxiliaries, palace stems, four pillars, five-element cycle, life/body rulers,
dou jun, decade/minor/annual cycles, minor stars) all matched, with separate verification of
self-transformation chains and the twelve officials.

## ⚖️ Disclaimer

This project is a technical implementation and academic presentation of traditional Chinese astrology
(Zi Wei Dou Shu). **All outputs are symbolic references and tendencies only, and do not constitute
medical, legal, financial, investment, or life-decision advice.**

## 📄 License

MIT
