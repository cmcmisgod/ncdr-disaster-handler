/**
 * disasterHandler.js (GAS 版本)
 * 
 * 【🧭 災防警報指令群】
 * 資料來源：NCDR 災害防救科技中心
 * RSS Feed：https://alerts.ncdr.nat.gov.tw/RssAtomFeeds.ashx
 * 
 * 本模組無需 API key，可安全公開。
 * 
 * Released under the MIT License
 * Copyright (c) 2025
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 */

function handleDisasterCommand(text, replyToken) {
  const RSS_URL = "https://alerts.ncdr.nat.gov.tw/RssAtomFeeds.ashx";

  const DISASTER_KEYWORDS = {
    "地震": "Earthquake",
    "海嘯": "Tsunami",
    "颱風": "Typhoon",
    "風颱": "Typhoon",
    "豪雨": "Rainstorm",
    "雷雨": "Thunderstorm",
    "土石流": "DebrisFlow",
    "山崩": "Landslide",
    "乾旱": "Drought",
    "寒流": "ColdWave",
    "強風": "StrongWind",
    "高溫": "Heatwave",
    "低溫": "LowTemp",
    "淹水": "Flood",
    "水庫放流": "Reservoir",
    "停水": "WaterSupply",
    "停電": "PowerOutage",
    "空汙": "AirPollution",
    "海洋": "Marine",
    "海灘": "Beach",
    "擱淺": "Stranding",
    "森林": "Forest",
    "山火": "ForestFire",
    "火災": "Fire",
    "化學": "Chemical",
    "核能": "Nuclear",
    "石油": "Petroleum",
    "交通": "Traffic",
    "台鐵": "Rail",
    "高鐵": "HSR",
    "道路": "Road",
    "橋樑": "Bridge",
    "海難": "MarineAccident",
    "放流": "Release",
    "風力": "WindPower",
    "急診": "Emergency",
    "醫院": "Hospital",
    "疫情": "Epidemic",
    "傳染病": "Infection",
    "登革熱": "Dengue",
    "畜禽": "Livestock",
    "核安": "NuclearSafety"
  };

  const keyword = text.replace("!", "").trim();
  const category = DISASTER_KEYWORDS[keyword];
  if (!category) return replyText(replyToken, "⚠️ 無此災防類別指令");

  try {
    const xml = UrlFetchApp.fetch(RSS_URL, { muteHttpExceptions: true }).getContentText();
    const document = XmlService.parse(xml);
    const entries = document.getRootElement().getChildren("entry", document.getRootElement().getNamespace());

    const results = entries
      .filter(e => {
        const title = e.getChildText("title", document.getRootElement().getNamespace());
        return title && title.includes(category);
      })
      .slice(0, 3)
      .map(e => {
        const ns = document.getRootElement().getNamespace();
        const title = e.getChildText("title", ns);
        const summary = e.getChildText("summary", ns);
        const updated = e.getChildText("updated", ns);
        const link = e.getChild("link", ns).getAttribute("href").getValue();
        return `🌀 ${title}\n📅 ${updated}\n${summary}\n🔗 ${link}`;
      });

    if (results.length > 0) {
      return replyText(replyToken, results.join("\n\n"));
    } else {
      return replyText(replyToken, `目前無 ${keyword} 警報資訊`);
    }
  } catch (e) {
    return replyText(replyToken, "⚠️ 災防警報查詢失敗：" + e.message);
  }
}

if (typeof exports !== "undefined") {
  exports.handleDisasterCommand = handleDisasterCommand;
}
