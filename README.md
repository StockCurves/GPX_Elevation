# 🏔️ GPX 高度分析工具

一個靜態網頁應用，用於上傳和分析 GPX 文件，可視化路線的高度變化。

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/yourusername/gpx-elevation-analyzer)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chart.js&logoColor=white)](https://www.chartjs.org/)

## ✨ 功能特色

- 📁 **多文件上傳**: 支援同時上傳多個 GPX 文件
- 📊 **高度剖面圖**: 使用 Chart.js 繪製美觀的高度變化圖表
- ✅ **路線選擇**: 可勾選要顯示的路線，靈活控制圖表內容
- 💾 **圖表下載**: 一鍵下載圖表為 PNG 格式
- 📱 **響應式設計**: 支援桌面和移動設備
- 🎨 **現代化 UI**: 美觀的漸層設計和流暢動畫

## 🚀 快速開始

### 方法一：直接使用
1. 下載或克隆此倉庫
2. 打開 `index.html` 文件
3. 開始使用！

### 方法二：GitHub Pages
1. Fork 此倉庫
2. 在倉庫設定中啟用 GitHub Pages
3. 訪問 `https://yourusername.github.io/gpx-elevation-analyzer`

### 方法三：本地服務器
```bash
# 使用 Python 3
python -m http.server 8000

# 使用 Node.js
npx http-server

# 使用 PHP
php -S localhost:8000
```

## 📖 使用方法

1. **上傳 GPX 文件**: 點擊「選擇 GPX 文件」按鈕上傳您的 GPX 文件
2. **選擇路線**: 在路線列表中勾選要顯示的路線
3. **查看圖表**: 查看生成的高度剖面圖
4. **下載圖表**: 使用「下載圖表」按鈕保存圖片

## 🛠️ 技術特點

- **純前端實現**: 無需服務器，完全在瀏覽器中運行
- **GPX 解析**: 自動解析 GPX 文件中的軌跡點和高度數據
- **距離計算**: 使用 Haversine 公式計算精確的距離
- **圖表庫**: 使用 Chart.js 提供豐富的圖表功能
- **文件處理**: 支援多文件上傳和批量處理

## 📋 支援的 GPX 格式

- 標準 GPX 1.1 格式
- 包含 `<trkpt>` 軌跡點的 GPX 文件
- 包含 `<ele>` 高度信息的軌跡點

## 🌐 瀏覽器支援

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📁 文件結構

```
GPX_Elevation/
├── index.html          # 主頁面
├── script.js           # JavaScript 邏輯
├── spec.md            # 系統規格文件
├── README.md          # 說明文件
├── .gitignore         # Git 忽略文件
└── LICENSE            # 授權文件
```

## 🔧 開發說明

這個工具使用純 HTML、CSS 和 JavaScript 開發，無需任何構建工具或依賴管理。所有外部依賴都通過 CDN 引入：

- Chart.js: 圖表繪製
- Chart.js Date Adapter: 時間軸支援

## 🎨 自定義選項

您可以通過修改 `script.js` 中的配置來自定義：

- 圖表顏色方案
- 圖表樣式和選項
- 距離計算精度
- UI 主題和樣式

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

1. Fork 此倉庫
2. 創建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 📄 授權

此專案使用 MIT 授權 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 🙏 致謝

- [Chart.js](https://www.chartjs.org/) - 強大的圖表庫
- [GPX 格式](https://www.topografix.com/GPX/1/1/) - 標準 GPS 交換格式
- 所有貢獻者和使用者

## 📞 支援

如果您遇到任何問題或有建議，請：

1. 查看 [Issues](https://github.com/yourusername/gpx-elevation-analyzer/issues)
2. 創建新的 Issue
3. 聯繫維護者

---

⭐ 如果這個專案對您有幫助，請給它一個星標！
