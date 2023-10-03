const puppeteer = require('puppeteer');
const Functions = require(__path_util + 'functions');
const axios = require('axios');

const gpmBrowswer = async (profile_id) => {
    try {
      const dataRunProfile = (await axios.get(__API_GPM + `start?profile_id=${profile_id}`)).data;
        // lấy ws 
        const browserTmp = await puppeteer.launch({
            headless: true,
        });
      const pageTmp = await browserTmp.newPage();
      await pageTmp.goto('http://' + dataRunProfile.selenium_remote_debug_address + '/json/version');
      await Functions.sleep(1000);
  
      const dataBrowser = await pageTmp.evaluate(() => {
        return JSON.parse(document.querySelector('body').innerText);
      });
      await browserTmp.close();
  
      const browser = await puppeteer.connect({ 
        browserWSEndpoint: dataBrowser.webSocketDebuggerUrl,
        defaultViewport: false
      });

      return browser;
    } catch (error) {
        console.log('Khong tao duoc browser ' + error);
    }
}

module.exports = gpmBrowswer;