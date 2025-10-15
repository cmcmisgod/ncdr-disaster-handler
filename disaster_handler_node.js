/**
 * disasterHandler_node.js (Node.js 版本)
 * 
 * 【🧭 災防警報指令群】
 * 資料來源：NCDR 災害防救科技中心
 * RSS Feed：https://alerts.ncdr.nat.gov.tw/RssAtomFeeds.ashx
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

import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

export async function handleDisasterCommand(text) {
  const RSS_URL = 'https://alerts.ncdr.nat.gov.tw/RssAtomFeeds.ashx';

  const DISASTER_KEYWORDS = {
    '地震': 'Earthquake', '海嘯': 'Tsunami', '颱風': 'Typhoon', '風颱': 'Typhoon',
    '豪雨': 'Rainstorm', '雷雨': 'Thunderstorm', '土石流': 'DebrisFlow', '山崩': 'Landslide',
    '乾旱': 'Drought', '寒流': 'ColdWave', '強風': 'StrongWind', '高溫': 'Heatwave',
    '低溫': 'LowTemp', '淹水': 'Flood', '水庫放流': 'Reservoir', '停水': 'WaterSupply',
    '停電': 'PowerOutage', '空汙': 'AirPollution', '海洋': 'Marine', '海灘': 'Beach',
    '擱淺': 'Stranding', '森林': 'Forest', '山火': 'ForestFire', '火災': 'Fire',
    '化學': 'Chemical', '核能': 'Nuclear', '石油': 'Petroleum', '交通': 'Traffic',
    '台鐵': 'Rail', '高鐵': 'HSR', '道路': 'Road', '橋樑': 'Bridge', '海難': 'MarineAccident',
    '放流': 'Release', '風力': 'WindPower', '急診': 'Emergency', '醫院': 'Hospital',
    '疫情': 'Epidemic', '傳染病': 'Infection', '登革熱': 'Dengue', '畜禽': 'Livestock', '核安': 'NuclearSafety'
  };

  const keyword = text.replace('!', '').trim();
  const category = DISASTER_KEYWORDS[keyword];
  if (!category) return `⚠️ 無此災防類別指令 (${keyword})`;

  try {
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const parsed = await parseStringPromise(xml);
    const entries = parsed.feed.entry || [];

    const results = entries
      .filter(e => e.title && e.title[0].includes(category))
      .slice(0, 3)
      .map(e => {
        const title = e.title[0];
        const updated = e.updated[0];
        const summary = e.summary ? e.summary[0] : '';
        const link = e.link && e.link[0]?.$.href;
        return `🌀 ${title}\n📅 ${updated}\n${summary}\n🔗 ${link}`;
      });

    return results.length > 0
      ? results.join('\n\n')
      : `目前無 ${keyword} 警報資訊`;
  } catch (e) {
    return `⚠️ 災防警報查詢失敗：${e.message}`;
  }
}

// 測試執行：
// (async () => console.log(await handleDisasterCommand('!地震')))();
