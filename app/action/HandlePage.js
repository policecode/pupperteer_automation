const fs = require('fs');

const RandomString = require(__path_util + 'randomString');

class HandlePage {
    /**
     * Điều hướng đến trang web chỉ định
     */
    static async gotoUrl(page, url) {
        await page.goto(url, {
            waitUntil: "load"
        });
    }

    /**
     * thực hiện scrrll trên trang web
     * - action: Mặc định scroll từ trên xuống, 'random' - scroll ngẫu nhiên lên xuống
     * - count: số lượt thực hiện scroll trên trang
     */
    static async scroll(page, count, action = '') {
        try {
            const randomString = new RandomString();
            let sizeScroll;
            for (let i = 1; i <= count; i++) {
                if (action == 'random') {
                    sizeScroll = randomString.getRandomNumber(-1000, 500)
                } else {
                    sizeScroll = randomString.getRandomNumber(0, 500)
                }
                await page.mouse.wheel({deltaY: sizeScroll});
                await page.waitForTimeout(500);
            }
        } catch (error) {
            console.log('lỗi scroll: ' + error);
        }
    }

    /**
     * Đóng tất cả các trang web
     */
    static async closeBrowser(browser) {
        try {
            let pages = await browser.pages();
            for (const page of pages) {
                await page.close();
            }
            await browser.close();
        } catch (error) {
            console.log('closeBrowser: ' + error);
        }
    }

    /**
     * Lưu cookie vào file txt: app/public/cookie/...
     */
    static async saveCookiePage(page, DIR, FILE_NAME) {
        try {
            const getCookies = await page.cookies();
            const file = DIR + FILE_NAME + '.txt';
            fs.writeFileSync(file, JSON.stringify(getCookies), 'utf-8');
            console.log('lưu cookie file: ' + file);
        } catch (error) {
            console.log('cần tạo trước thư mục: ' + DIR);
        }
    }
    /**
     * Lấy cookie từ local và đưa vào trình duyệt: app/public/cookie/...
     */
    static async setCookiePage(page, DIR, FILE_NAME) {
        try {
            const file = DIR + FILE_NAME + '.txt';
            const cookieJson = fs.readFileSync(file, 'utf-8');
            const cookieList = JSON.parse(cookieJson);
            await page.setCookie(...cookieList);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Thao tác trên bàn phím
     * - Key Input: https://pptr.dev/api/puppeteer.keyinput
     */
    static async setKeyboard(page, keyInput) {
        await page.keyboard.press(keyInput)
    }
}

module.exports = HandlePage;
