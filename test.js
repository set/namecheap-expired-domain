const Namecheap = require('./index.js');

const n = new Namecheap({
  apiUser: 'servettuncel',
  apiKey: 'd7beeeef18484f31af69bdf4e0689275',
  isSandbox: true,
});

n.getDomainInfo('domain1.com').then(result => {
  console.log(result);
}).catch(error => {
  console.log(error);
});
