const proxyMap = {
  mock: 'http://127.0.0.1:8080/mock/5f9fd0a200281386ece4fa3',
};

let pid: string | number;
console.log(process.argv, 'argv');
console.log(process.env.NODE_ENV, 'env');
const server = process.argv[2];
let currentRd = server ? server.slice(2) : 'mock';
if (typeof +currentRd === 'number' && !isNaN(+currentRd)) {
  pid = currentRd;
  currentRd = 'ronghe';
  console.log('pid:  ' + pid);
} else {
  console.log('rd:   ' + currentRd);
}

const proxyConfig = (proxy: any) => {
  proxy.on('proxyReq', (proxyReq) => {
    pid ? proxyReq.setHeader('pid', pid) : '';
  });
};
//proxy 配置
const proxyData = {};
//代理接口
const interfacePorxy = ['/test/'];
interfacePorxy.forEach((el) => {
  proxyData[el] = {
    target: `${proxyMap[currentRd]}`,
    rewrite: (path) => path.replace(/^\`${el}`/, ''),
    changeOrigin: true,
    configure: proxyConfig,
  };
});

export default proxyData;
