# ncdr-disaster-handler

NCDR 災防警報指令（GAS + Node.js），用於串接國家災害防救科技中心（NCDR）的公開災害示警資料。

---

## 📘 使用方式

### 1. Google Apps Script (GAS)

此版本適用於直接部署在 Google Apps Script 平台，通常用於 LINE Bot。

**步驟：**
1.  複製 `disasterHandler_gas.js` 檔案內的所有程式碼。
2.  貼到你的 Google Apps Script 專案中即可使用。

---

### 2. Node.js

此版本適用於 Node.js 環境，可整合至現有的後端服務。

**安裝依賴套件：**

```bash
npm install node-fetch xml2js
```
使用範例：
```javascript
import { handleDisasterCommand } from './disaster_handler_node.js';

console.log(await handleDisasterCommand('!地震'));
```
📚 資料來源
國家災害防救科技中心 (NCDR) 公開資料

（本專案串接其公開的 RSS 與 CAP 資料）

🪪 授權 (License)
本專案依據 MIT License 授權，可自由使用與修改。
