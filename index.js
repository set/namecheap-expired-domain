const axios = require('axios');
const moment = require('moment/moment');
const xml2js = require('xml2js');

module.exports = class Namecheap {
  constructor(settings) {
    this.apiUser = settings.apiUser;
    this.apiKey = settings.apiKey;
    this.isSandbox = settings.isSandbox || false;
  }

  async getDomainInfo(domain) {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.${this.isSandbox ? 'sandbox.' : ''}namecheap.com/xml.response?ApiUser=${this.apiUser}&ApiKey=${this.apiKey}&UserName=${this.apiUser}&Command=namecheap.domains.getInfo&ClientIp=192.168.1.109&DomainName=${domain}`).then(response => {
        // parse xml response with xml2js
        const parser = new xml2js.Parser();
        parser.parseString(response.data, (err, result) => {
          if (err) {
            reject(err);
          }
          const expireDate = result.ApiResponse.CommandResponse[0].DomainGetInfoResult[0].Whoisguard[0].ExpiredDate;
          if( moment(expireDate, 'MM/DD/YYYY').diff(moment()) > 0 ) {
            resolve(`${domain} is active`);
          }
          resolve(`${domain} is expired`);
        });
    
      }).catch(error => {
        reject(error);
      });
    });
  }
}
