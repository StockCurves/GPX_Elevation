# GPX 高度分析工具 - 系統規格文件

## 1. 專案概述

### 1.1 專案目標
開發一個靜態網頁應用，用於上傳和分析 GPX 文件，可視化路線的高度變化，支援多路線比較和圖表下載功能。

### 1.2 技術架構
- **前端**: 純 HTML5 + CSS3 + JavaScript (ES6+)
- **圖表庫**: Chart.js v4.x
- **部署**: 靜態文件，無需服務器
- **瀏覽器支援**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

## 2. 功能規格

### 2.1 核心功能

#### 2.1.1 GPX 文件上傳
- **功能描述**: 支援多個 GPX 文件同時上傳
- **文件格式**: 標準 GPX 1.1 格式
- **必要元素**: `<trkpt>` 軌跡點，`<ele>` 高度信息
- **用戶體驗**: 拖拽上傳區域，視覺反饋

#### 2.1.2 GPX 數據解析
- **解析內容**: 
  - 經緯度座標 (lat, lon)
  - 高度數據 (elevation)
  - 軌跡點序列
- **距離計算**: 使用 Haversine 公式計算累積距離
- **數據驗證**: 檢查文件格式和必要元素

#### 2.1.3 路線管理
- **路線列表**: 顯示所有上傳的路線
- **路線信息**: 路線名稱、總距離、高度範圍
- **選擇控制**: 每個路線都有 checkbox 控制顯示/隱藏
- **統計信息**: 最小/最大高度、總距離

### 2.2 圖表可視化

#### 2.2.1 圖表類型
- **圖表類型**: 折線圖 (Line Chart)
- **X軸**: 距離 (公里)
- **Y軸**: 高度 (公尺)
- **多路線支援**: 不同顏色區分不同路線

#### 2.2.2 圖表規格
- **尺寸**: 螢幕寬度的 80%，最大寬度 800px
- **長寬比**: 4:3 固定比例
- **置中顯示**: 圖表在容器中置中
- **響應式**: 支援桌面和移動設備
- **背景色**: 白色背景 (#ffffff)
- **下載品質**: 高品質 PNG 格式，保持原始顏色

#### 2.2.3 視覺設計
- **線條樣式**: 
  - 線寬: 1.5px
  - 預設無點符號 (radius: 0)
  - 懸停時顯示點符號 (hoverRadius: 6)
- **顏色方案**: 8種預設顏色循環使用
- **網格**: 淺灰色網格線
- **圖例**: 頂部顯示，使用點樣式

### 2.3 互動功能

#### 2.3.1 游標互動
- **互動模式**: `mode: 'point'`, `intersect: true`
- **工具提示**: 只顯示游標指向的單一數據點
- **顯示內容**: 
  - 標題: "距離: X.XX km"
  - 標籤: "路線名稱: 高度 m"
- **精確性**: 避免顯示多筆重複資料
- **單點顯示**: 確保只顯示一個高度值，不會重複顯示

#### 2.3.2 路線選擇
- **即時更新**: 勾選/取消勾選立即更新圖表
- **視覺反饋**: 路線項目懸停效果
- **狀態保持**: 記住每個路線的顯示狀態

### 2.4 下載功能

#### 2.4.1 圖表下載
- **格式**: PNG 圖片
- **檔名**: `gpx-elevation-chart-YYYY-MM-DD.png`
- **品質**: 高解析度，保持 4:3 比例
- **背景**: 白色背景，避免透明或反白問題
- **顏色保持**: 確保下載圖片保持原始顏色
- **觸發**: 點擊下載按鈕

#### 2.4.2 數據清除
- **功能**: 清除所有上傳的路線和圖表
- **重置**: 恢復初始狀態
- **確認**: 無需確認，直接清除

## 3. 技術規格

### 3.1 文件結構
```
GPX_Elevation/
├── index.html          # 主頁面
├── script.js           # JavaScript 邏輯
├── spec.md            # 規格文件
└── README.md          # 使用說明
```

### 3.2 核心類別設計

#### 3.2.1 GPXAnalyzer 類別
```javascript
class GPXAnalyzer {
    constructor()                    // 初始化
    initializeEventListeners()        // 事件監聽器
    initializeChart()               // 圖表初始化
    handleFileUpload()               // 文件上傳處理
    parseGPXFile()                   // GPX 文件解析
    extractRouteData()               // 路線數據提取
    calculateDistance()              // 距離計算
    updateRoutesList()               // 路線列表更新
    toggleRoute()                    // 路線顯示切換
    updateChart()                    // 圖表更新
    downloadChart()                  // 圖表下載 (含白色背景處理)
    clearAllData()                   // 數據清除
}
```

#### 3.2.2 路線數據結構
```javascript
routeData = {
    id: number,                    // 唯一識別碼
    name: string,                  // 路線名稱
    points: Array<{                // 軌跡點陣列
        lat: number,               // 緯度
        lon: number,              // 經度
        elevation: number,         // 高度
        distance: number          // 累積距離
    }>,
    totalDistance: number,         // 總距離
    minElevation: number,         // 最低高度
    maxElevation: number,         // 最高高度
    visible: boolean              // 顯示狀態
}
```

### 3.3 Chart.js 配置規格

#### 3.3.1 圖表選項
```javascript
options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { /* 圖例配置 */ },
        tooltip: { /* 工具提示配置 */ }
    },
    scales: {
        x: { /* X軸配置 */ },
        y: { /* Y軸配置 */ }
    },
    interaction: {
        intersect: true,
        mode: 'point'
    },
    elements: {
        point: { /* 點樣式配置 */ },
        line: { /* 線樣式配置 */ }
    }
}
```

#### 3.3.2 工具提示配置
```javascript
tooltip = {
    enabled: true,
    mode: 'point',
    intersect: true,
    callbacks: {
        title: function(context) { /* 標題回調 */ },
        label: function(context) { /* 標籤回調 */ }
    }
}
```

#### 3.3.3 下載功能配置
```javascript
downloadChart() {
    // 創建臨時畫布並添加白色背景
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // 設定尺寸
    tempCanvas.width = originalCanvas.width;
    tempCanvas.height = originalCanvas.height;
    
    // 填充白色背景
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // 繪製圖表
    tempCtx.drawImage(originalCanvas, 0, 0);
    
    // 下載
    link.href = tempCanvas.toDataURL('image/png', 1.0);
}
```

### 3.4 CSS 規格

#### 3.4.1 響應式設計
- **桌面**: 最大寬度 1200px，置中顯示
- **平板**: 寬度 80%，保持比例
- **手機**: 寬度 100%，垂直佈局

#### 3.4.2 圖表容器
```css
.chart-wrapper {
    width: 80%;
    max-width: 800px;
    margin: 0 auto;
    aspect-ratio: 4/3;
}
```

## 4. 用戶體驗規格

### 4.1 視覺設計
- **主題**: 現代化漸層設計
- **主色調**: 藍色系漸層 (#4facfe → #00f2fe)
- **字體**: Segoe UI 系統字體
- **圓角**: 15px 容器圓角，8px 元素圓角
- **陰影**: 柔和陰影效果

### 4.2 互動設計
- **懸停效果**: 按鈕和路線項目的懸停動畫
- **載入狀態**: 文件上傳時的視覺反饋
- **錯誤處理**: 友好的錯誤提示訊息
- **空狀態**: 無數據時的引導訊息

### 4.3 無障礙設計
- **鍵盤導航**: 支援 Tab 鍵導航
- **對比度**: 符合 WCAG 2.1 AA 標準
- **字體大小**: 最小 12px，可讀性良好
- **色彩**: 不依賴顏色傳達信息

## 5. 性能規格

### 5.1 文件大小限制
- **單個 GPX**: 最大 10MB
- **同時上傳**: 最多 10 個文件
- **總大小**: 最大 50MB

### 5.2 渲染性能
- **圖表更新**: < 100ms
- **文件解析**: < 2s (10MB 文件)
- **記憶體使用**: < 100MB

### 5.3 瀏覽器兼容性
- **ES6+ 支援**: 箭頭函數、Promise、async/await
- **Canvas 支援**: 2D 渲染上下文
- **File API**: 文件上傳和讀取

## 6. 測試規格

### 6.1 功能測試
- [x] GPX 文件上傳和解析
- [x] 多路線顯示和隱藏
- [x] 圖表互動和工具提示 (單點顯示)
- [x] 圖表下載功能 (白色背景)
- [x] 數據清除功能
- [x] 響應式設計測試
- [x] 游標互動精確性測試

### 6.2 兼容性測試
- [ ] Chrome 60+ 測試
- [ ] Firefox 55+ 測試
- [ ] Safari 12+ 測試
- [ ] Edge 79+ 測試
- [ ] 移動設備測試

### 6.3 性能測試
- [ ] 大文件處理測試
- [ ] 多路線渲染測試
- [ ] 記憶體使用測試

## 7. 部署規格

### 7.1 部署要求
- **靜態託管**: GitHub Pages, Netlify, Vercel
- **HTTPS**: 必須使用 HTTPS
- **CDN**: 使用 CDN 加速 Chart.js 載入
- **自動部署**: GitHub Actions 自動部署到 Pages

### 7.2 環境變數
- 無需環境變數配置
- 所有依賴通過 CDN 引入

### 7.3 GitHub 部署
- **倉庫結構**: 包含完整的專案文件
- **工作流程**: `.github/workflows/deploy.yml`
- **文檔**: README.md, CONTRIBUTING.md, LICENSE
- **忽略文件**: .gitignore 配置

## 8. 維護規格

### 8.1 代碼品質
- **ESLint**: 使用標準 JavaScript 規範
- **註釋**: 關鍵函數添加 JSDoc 註釋
- **模組化**: 類別和方法職責分離

### 8.2 文檔要求
- **README**: 使用說明和安裝指南
- **規格文件**: 詳細的技術規格
- **貢獻指南**: CONTRIBUTING.md
- **授權文件**: LICENSE
- **更新日誌**: 版本變更記錄

### 8.3 GitHub 倉庫管理
- **Issues**: 問題追蹤和功能請求
- **Pull Requests**: 代碼審查和合併
- **Releases**: 版本發布和標籤
- **Wiki**: 詳細文檔和教程

## 9. 版本歷史

### v1.0.0 (2024-12)
- ✅ 初始版本發布
- ✅ GPX 文件上傳和解析
- ✅ 多路線高度剖面圖
- ✅ 路線選擇功能
- ✅ 圖表下載 (白色背景)
- ✅ 響應式設計
- ✅ GitHub Pages 部署
- ✅ 完整文檔和授權

### 未來版本規劃
- 🔄 更多圖表類型
- 🔄 數據統計功能
- 🔄 國際化支援
- 🔄 PWA 功能

---

**版本**: 1.0.0  
**最後更新**: 2024年12月  
**作者**: AI Assistant  
**狀態**: 完成  
**GitHub**: 準備就緒
