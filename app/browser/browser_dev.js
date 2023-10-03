const puppeteer = require('puppeteer');
const startBrowswer = async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            // Có hiện UI của Chromium hay không, false là có
            headless: false,
            // devtools: true,
            defaultViewport: false,
            // Chrome sử dụng mutiple layers của sandbox để tránh những nội dung web không đáng tin cậy
            // Nếu tin tưởng content dung thì set như vậy
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: [
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-client-side-phishing-detection',
                '--disable-default-apps',
                '--disable-dev-shm-usage',
                '--disable-extensions',
                '--disable-features=site-per-process',
                '--disable-hang-monitor',
                '--disable-popup-blocking',
                '--disable-prompt-on-repost',
                '--disable-sync',
                '--disable-translate',
                '--disable-web-security',
                '--metrics-recording-only',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                // `--proxy-server=13.228.200.6:80`
            ],
            // Truy cập website qua lỗi liên quan http secere
            ignoreHTTPSErrors: true
        });

    } catch (error) {
        console.log('Khong tao duoc browser ' + error);
    }
    return browser;
}

module.exports = startBrowswer;