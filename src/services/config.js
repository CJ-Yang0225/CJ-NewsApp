const NODE_ENV = process.env.NODE_ENV;

const config = {
  development: {
    PROXY_SERVER_HOST: location.origin, //'http://localhost:3000'
  },
  production: {
    PROXY_SERVER_HOST: 'https://cj-news-server.vercel.app',
  },
};

export default config[NODE_ENV];
