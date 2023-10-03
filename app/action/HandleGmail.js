const Functions = require(__path_util + 'functions');
const HandlePage = require(__path_action + 'HandlePage');
const Urls = require(__path_util + 'urls');

class HandleGmail {
    static $cookieDir = __path_public + '/cookie/gmail/';

    static async loginGmail(page, user, pass) {
        try {
            await HandlePage.gotoUrl(page, 'https://www.google.com.vn/');
            const isLogin = await page.$('.gb_b.gb_Rd.gb_3f.gb_x.gb_Ud');
            if (!isLogin) {
                await HandlePage.gotoUrl(page, Urls.GOOGLE_LOGIN);
                // Login Account
                await page.waitForSelector('form input[name="identifier"]', { visible: true, timeout: 10000 });
                await page.type('form input[name="identifier"]', user);
                await page.click('button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.qIypjc.TrZEUc.lw1w4b');
    
                // Login Password
                await page.waitForSelector('form input[name="Passwd"]', { visible: true, timeout: 10000 });
                await page.type('form input[name="Passwd"]', pass);
                await Functions.sleep(1000);
                await page.click('button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.qIypjc.TrZEUc.lw1w4b');
            }
            // Load after login
            await page.waitForSelector('.gb_b.gb_Rd.gb_3f.gb_x.gb_Ud', { visible: true });

            // Lưu cookie
            // await HandlePage.saveCookiePage(page, HandleGmail.$cookieDir, user);
            return true;
        } catch (error) {
            console.log('Lỗi Login tài khoản: ' + user + ' ,error: ' + error);
            return false;
        }
    }

    static async getEmail(page) {
        try {
            await HandlePage.gotoUrl(page, 'https://www.google.com.vn/');
            const isLogin = await page.$('.gb_b.gb_Rd.gb_3f.gb_x.gb_Ud');
            if (isLogin) {
                const email = page.evaluate(el => {
                    const myRe = /.*\((.*?)\).*/gmi;
                    let result = el.querySelector('a.gb_d.gb_Fa.gb_x').getAttribute('aria-label');
                    result = myRe.exec(result);
                    return result[1];
                }, isLogin);
                return email;
            } else {
                return false;
            }
        } catch (error) {
            console.log('getEmail(): ' + error);
            return false;
        }
    }
}

module.exports = HandleGmail;
