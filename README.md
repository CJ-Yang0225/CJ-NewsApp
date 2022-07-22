# CJ-NewsApp

有時想看些新聞、時事，但不想被單一媒體的觀點所侷限，所以自製一個新聞的 Web App，藉由串接集成的 [Taiwan News API](https://newsapi.org/s/taiwan-news-api)，獲取各方新聞媒體的報導。

## Client

原生 Vanilla.js 撰寫前端 Client App，受到 React.js 和 Vue.js 的啟發，嘗試運用框架的核心理念，自訂 Webpack 環境，打造出專屬的專案架構。一方面可強化原生控制資料、事件、畫面三者的能力，另一方面能反思框架存在的意義，想解決什麼問題呢？。

### Features & Technologies

#### 首頁（index.html）

- 使用自己簡單封裝的 [XMLHttpRequest 工具](https://github.com/CJ-Yang0225/CJ-NewsApp/blob/main/src/utils/http.js)，發送 AJAX GET 請求，獲取類別（`ex. ?category=sports`）對應的新聞，預設每頁為 10 筆報導。

- 點擊新聞卡 `NewsCard` 開啟有獨特 name 的分頁，讓點擊相同新聞卡時跳至同樣的分頁，不會重複開啟同一則新聞；反之用滑鼠中鍵或是 context menu 的「在新分頁中開啟連結」則可重複開啟。

- 已獲取的資料會利用記憶體快取（memory cache）並附加一個判斷資料是否過期的 timestamp（類似 Cookie 的 `Max-Age`），再將這個加工過的資料儲存至 `localStorage`，設定 5 分鐘後過期，需要重新請求資料，以確保新聞的即時性。

- 點擊上方導覽列 `Navbar`，更換新聞的類別，並即時更新 URL Search parameters（`?category=technology`），操控瀏覽器歷史紀錄（`history.pushState`）和監聽 `popstate` 事件。

- 當滾動至底部時觸發 `loadMore()` 載入更多新聞，如果還有資料就更新頁數並再加上 10 筆報導。

- 可對想追蹤、收藏的新聞報導點擊書籤圖示，使用 localStorage 儲存已收藏的新聞資料陣列，實現跨頁攜帶資料，加到**書籤收藏頁（collection.html）**

- 固定在左下角的部件組 `Widgets`，hover 後會展開內部組件，其一可進行主題模式（theme mode）的切換（預設採用使用者偏好的系統設定 `prefers-color-scheme `）；另一點擊後回到頁面頂部。

#### 書籤收藏頁（collections.html）

- 取出 localStorage 新聞資料陣列，展示出已收藏的全部新聞報導。

- 點擊新聞卡 `NewsCard` 開啟有獨特 name 的分頁，讓點擊相同新聞卡時跳至同樣的分頁，不會重複開啟同一則新聞；反之用滑鼠中鍵或是 context menu 的「在新分頁中開啟連結」則可重複開啟。

- 可切換成管理模式進行整個 localStorage 新聞資料陣列的操作。

- 固定在左下角的部件組 `Widgets`，hover 後會展開內部組件，其一可進行主題模式（theme mode）的切換（預設採用使用者偏好的系統設定 `prefers-color-scheme `）；另一點擊後回到頁面頂部。

### Module Bundler / Dependencies

- Webpack5

  - plugins

    - [webpack.DefinePlugin](https://webpack.js.org/plugins/define-plugin/)

      定義全域的環境變數 `NODE_ENV`，可判斷環境是 `"development"` 或 `"production"` 做出相應處理。

    - [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)

      進入點（entry）主要分成 index.html 和 collections.html 兩頁面，共同的依賴包為 common.js。可以根據設定自動注入 title 名稱、SEO-friendly 標籤和解決需手動引入 JavaScript 與 CSS 的困擾。

    - [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin)

      `"development"` 環境下會以 CSS 注入 style 標籤的形式加到 HTML 中，但在 `"production"` 環境需要將 CSS 獨立抽離成靜態檔案，有利於提升效能與維護性，因此使用此 plugin。

    - [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

      視覺化分析工具，查看套件、模組的體積。

  - loaders

    - [babel-loader](https://www.npmjs.com/package/babel-loader)

      搭配 Webpack 並與以下核心、preset 和 plugin 進行語法轉譯（transpiling）。

      - [@babel/core](https://www.npmjs.com/package/@babel/core)

        babel 的核心，負責讀取設定，提供執行轉譯的 API。

      - [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)

        讓專案使用新的 JavaScript 語法，並根據瀏覽器環境（browserslist）添加需要的 polyfill，進而節省處理兼容所花費的時間。

      - [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)

        進一步減少 bundle size。處理語法兼容經常會加上 helper function，此 plugin 可以在使用相同 helper function 時，預設以 import 的方式。

    - raw-loader（內建）
    - file-loader（內建）
    - [sass-loader](https://www.npmjs.com/package/sass-loader)
    - [postcss-loader](https://www.npmjs.com/package/postcss-loader)
    - [css-loader](https://www.npmjs.com/package/css-loader)
    - [style-loader](https://www.npmjs.com/package/style-loader)

  - Others
    - [node-sass](https://www.npmjs.com/package/node-sass)
    - [autoprefixer](https://www.npmjs.com/package/autoprefixer)
    - [browserslist](https://www.npmjs.com/package/browserslist)
    - [webpack-cli](https://www.npmjs.com/package/webpack-cli)
    - [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server)
    - [webpack-merge](https://www.npmjs.com/package/webpack-merge)
    - [cross-env](https://www.npmjs.com/package/cross-env)

## Proxy Server

由於 News API 需要驗證 API Key 才能使用，為避免 API Key 在前端洩漏以及方便後續功能的擴充，所以用 Koa2 架設一個 Proxy Server，簡單路由後使用 Axios 帶上 API Key 到 Request Header 中，然後對目標 API 發送請求，最後獲得所需的新聞資料並回傳給前端。

### Technologies & Features

- 環境變數（Environment variables）

  使用 `dotenv` 讀取 .env 和 .env.local 的環境變數

  - .env： 新增檔案命名為 .env，裡面放上本地開發用伺服器的 HOSTNAME 和 PORT。

    ```plain
    HOSTNAME=127.0.0.1
    PORT=8080
    ```

  - .env.local： 放上 [Taiwan News API](https://newsapi.org/s/taiwan-news-api) Request Header 之 `X-Api-Key` 要驗的 `NEWS_API_KEY`，可放多支 key 增加請求次數（要用 NEWS_API_KEY 開頭）。

    ```plain
    NEWS_API_KEY0=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    NEWS_API_KEY1=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    NEWS_API_KEY2=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    NEWS_API_KEY3=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    NEWS_API_KEY4=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

- [Axios 使用](https://github.com/CJ-Yang0225/CJ-NewsApp/blob/main/server/src/config/index.js)

  - 創建 Axios 的實例（instance），設定預設的選項，方便重用。
  - 使用實例的 Interceptors，管理 Request 和 Response 過程發生的事情，像是處理 429 Too many requests 狀況（每支 API Key 有限制請求次數），更換成另一支 API Key。

- [路由（routes）](https://github.com/CJ-Yang0225/CJ-NewsApp/blob/main/server/src/routes/news.js)

  `/api` 或 `/api/news`： 接收前端的 GET Request，調用中介層函式的 `getNews`

- [控制器（controllers）](https://github.com/CJ-Yang0225/CJ-NewsApp/blob/main/server/src/controllers/news.js)

  `getNews(ctx)`： koa2 會調用此中介層函式，放入包裝過、便於開發的 `ctx` 參數（HTTP `req` 和 `res` 等）。用於回傳新聞資料及處理例外事件。

### Dependencies

- [axios](https://www.npmjs.com/package/axios)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [koa](https://www.npmjs.com/package/koa)
- [koa-router](https://www.npmjs.com/package/koa-router)
- [nodemon](https://www.npmjs.com/package/nodemon)
