# CJ-NewsApp

有時想看點新聞時事，但不想被單一媒體的觀點所侷限，所以藉由串接集成的 [Taiwan News API](https://newsapi.org/s/taiwan-news-api)，建立新聞 App 以獲取各方新聞媒體的報導。

## Client

<!-- ### Features -->

<!-- ### Technologies -->

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

      搭配 Webpack 並與以下核心、preset 和 plugin 進行語法轉譯（transpiling）

      - [@babel/core](https://www.npmjs.com/package/@babel/core)

        babel 的核心，負責讀取設定，提供執行轉譯的 API

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

### Dependencies

- [axios](https://www.npmjs.com/package/axios)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [koa](https://www.npmjs.com/package/koa)
- [koa-router](https://www.npmjs.com/package/koa-router)
- [nodemon](https://www.npmjs.com/package/nodemon)
