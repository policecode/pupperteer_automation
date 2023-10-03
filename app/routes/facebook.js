const express = require('express');
const axios = require('axios');

var router = express.Router();
// Util
const Urls = require(__path_util + 'urls');
const RandomString = require(__path_util + 'randomString');
const JsonDatabase = require(__path_json);
const Functions = require(__path_util + 'functions');

// Action
const HandleFacebook = require(__path_action + 'HandleFacebook');
const HandlePage = require(__path_action + 'HandlePage');
const HandleGmail = require(__path_action + 'HandleGmail');
const HandleVnxpress = require(__path_action + 'HandleVnxpress');
const HandleYoutube = require(__path_action + 'HandleYoutube');

router.post('/register', async (req, res) => {
    const randomString = new RandomString();
    const tableFacebook = new JsonDatabase('facebook');
    // __Gpm_Browser(profile_id)
    const browser = await __Gpm_Browser('686db52c-d85a-4c9e-85a0-1ecf62675b53');
    try {
        let page = await browser.newPage();
        // Việc đăng ký dựa trên việc tài khoản gmail (profile google) đã đăng nhập trước đó
        const email = await HandleGmail.getEmail(page);
        // 1. Thao tác khác trước khi đăng ký
        // Truy cập vào trang đọc báo
        await HandlePage.gotoUrl(page, 'https://vnexpress.net/'); 
        await HandlePage.scroll(page, randomString.getRandomNumber(5, 15), 'random'); 
        for (let i = 0; i < 5; i++) {
            await HandleVnxpress.hoverAndClickRandomPage(page);
            await HandlePage.scroll(page, randomString.getRandomNumber(5, 15)); 
        }

        await HandlePage.gotoUrl(page, 'https://www.youtube.com/'); 
        const isClick = await HandleYoutube.clickVideo(page, randomString.getRandomNumber(1, 10));
            if (isClick) {
                await HandleYoutube.watchAds(page, 'ads_off');
                await HandleYoutube.watchVideo(page);
            }
        // 2. Thực hiện đăng ký
        await HandleFacebook.setVietNamese(page); 
        await HandlePage.gotoUrl(page, Urls.FACEBOONK_LOGIN);
        await page.waitForTimeout(30000);
        const bodyLogin = await page.$('#globalContainer');
        if (!bodyLogin) {
            await HandlePage.closeBrowser(browser);
            return res.send('Email ' + email + ' đã được dùng để đăng ký facebook');
        } 

        // Load form đăng ký
        await page.click('#globalContainer a[data-testid="open-registration-form-button"]');
        await page.waitForSelector('._8ien form#reg');
        await page.waitForTimeout(20000);

        // Nhạp dữ liệu form đăng ký
        const firstName = randomString.getFirstName();
        const lastName = randomString.getLastName();
        const passWord = randomString.getPassWord();

        const dateObj = randomString.getDate();
        const day = dateObj.day;
        const month = dateObj.month;
        const year = dateObj.year;
        // const gender = gmail.gender;
        const gender = randomString.getGender().key;
        await page.type('._8ien form#reg input[name="firstname"]', firstName, {delay: 200});
        await page.type('._8ien form#reg input[name="lastname"]', lastName, {delay: 200});
        await page.type('._8ien form#reg input[name="reg_email__"]', email, {delay: 200});
        await page.waitForSelector('._8ien form#reg input[name="reg_email_confirmation__"]');
        await page.type('._8ien form#reg input[name="reg_email_confirmation__"]', email, {delay: 200});
        await page.type('._8ien form#reg input[name="reg_passwd__"]', passWord, {delay: 200});
        await page.select('._8ien form#reg select[name="birthday_day"]', day);
        await page.waitForTimeout(1000);
        await page.select('._8ien form#reg select[name="birthday_month"]', month);
        await page.waitForTimeout(1000);
        await page.select('._8ien form#reg select[name="birthday_year"]', year);
        await page.waitForTimeout(1000);
        const inputRadios = await page.$$('._8ien form#reg input[name="sex"]');
        for (const radio of inputRadios) {
            const valueRaido = await page.evaluate(el => {
                return el.value;
            }, radio);
            if (gender == valueRaido) {
                await radio.click();
                break;
            }
        }
        await page.waitForTimeout(1000);
        await page.hover('button._6j.mvm._6wk._6wl._58mi._6o._6v');
        await page.waitForTimeout(1000);
        await page.click('button._6j.mvm._6wk._6wl._58mi._6o._6v');
        await page.waitForTimeout(5000); 
        // Lấy code confirm
        await page.waitForSelector('form input#code_in_cliff');
        const code = await HandleFacebook.getCodeConfirmFacebook(browser); 
        await page.type('form input#code_in_cliff', code, {delay: 200});
        await page.waitForTimeout(1000);
        await page.click('button[name="confirm"]');
        await page.waitForTimeout(5000); 
        await page.waitForSelector('role="button"');
        await page.click('role="button"');

        await page.waitForTimeout(1000);

        // const record = tableFacebook.post({
        //     email: email,
        //     passWord: passWord,
        //     firstName: firstName,
        //     lastName: lastName,
        //     birthDay: dateObj.fullDate,
        //     gender: (gender == 1)?'Nữ':'Nam'
        // });

        // await HandlePage.closeBrowser(browser);
        return res.send('Đăng ký thành công');

    } catch (error) {
        // await HandlePage.closeBrowser(browser);
        return res.send("Lỗi ở /api/v1/facebook/register: " + error);
    }
})
router.post('/set_vietnamese', async (req, res) => {
    let groupName = req.body.group_name;
    const groups = await axios.get(__API_GPM + "profiles");
    const profiles = groups.data.filter(o => o.group_name === groupName);
    for (const profile of profiles) {
        try {
            const browser = await __Gpm_Browser(profile.id);
            let page = await browser.newPage();
            await HandlePage.gotoUrl(page, Urls.FACEBOONK_LOGIN);
            await page.waitForTimeout(5000);
            const isLoginFacebook = await HandleFacebook.isLogin(page); 
            if (isLoginFacebook == 'login') {
                await HandleFacebook.setVietNamese(page); 
            } else {
                console.log(isLoginFacebook);
            }
            await HandlePage.closeBrowser(browser);
        } catch (error) {
            console.log('is_login: ' + error);
            await HandlePage.closeBrowser(browser);
        }
    }
    return res.send("Kiểm tra login và chuyển sang dùng tiếng việt");
})
router.post('/post_status', async (req, res) => {
    let list_content = req.body.contents;
    let groupName = req.body.group_name;
    const groups = await axios.get(__API_GPM + "profiles");
    const profiles = groups.data.filter(o => o.group_name === groupName);
    if (Array.isArray(list_content)) {
        for (const profile of profiles) {
            // const browser = await __Gpm_Browser('a00b4e51-2af8-4657-a422-994bef49b105');
            const browser = await __Gpm_Browser(profile.id);
            const content = list_content[Math.floor(Math.random() * list_content.length)];
            try {
                let page = await browser.newPage();
                await HandlePage.gotoUrl(page, Urls.FACEBOONK_LOGIN);
                await page.waitForTimeout(1000);
                const isLoginFacebook = await HandleFacebook.isLogin(page); 
                if (isLoginFacebook == 'login') {
                    await HandleFacebook.gotoPageProfile(page); 
                    await HandleFacebook.postStatus(page, content); 
                    console.log('upload status ' + profile.name);
                } else {
                    console.log('status: ' + isLoginFacebook);
                }
                await HandlePage.closeBrowser(browser);
            } catch (error) {
                console.log('post_status: ' + error );
                await HandlePage.closeBrowser(browser);
            }
            console.log('next');
        }
        return res.send('up status');
    } else {
        return res.send('contents cần là một mảng các mẫu câu trạng thái đăng facebook');
    }
});
router.get('/', async (req, res) => {
    let tableDatabase = new JsonDatabase('facebook');
    const records = tableDatabase.get();

    return res.send({
        staus: 'success',
        records: records
    });
});
router.post('/', async (req, res) => {
    let tableDatabase = new JsonDatabase('facebook');
    let data = req.body;
    const record = tableDatabase.post(data);

    return res.send({
        staus: 'create',
        record: record
    });
});
router.delete('/:id', async (req, res) => {
    let tableDatabase = new JsonDatabase('facebook');
    const record = tableDatabase.destroy(req.params.id);
    if (record) {
        res.send({
            staus: 'delete',
            data: record
        });
    } else {
        res.send({
            status: 'no_data',
            msg: 'Không có kết quả phù hợp'
        });
    }
});

router.post('/add_friends', async (req, res) => {
    let groupName = req.body.group_name;
    const groups = await axios.get(__API_GPM + "profiles");
    const profiles = groups.data.filter(o => o.group_name === groupName);
    for (const profile of profiles) {
        const browser = await __Gpm_Browser(profile.id);
        try {
            const page = await browser.newPage();
            await HandlePage.gotoUrl(page, Urls.FACEBOONK_LOGIN);
            const isLoginFacebook = await HandleFacebook.isLogin(page); 
            if (isLoginFacebook == 'login') {
                await HandleFacebook.addFiends(page); 
                await HandleFacebook.activeFriends(page);
                console.log('Add firend: ' + profile.name);
            } else {
                console.log(isLoginFacebook + ' ' + profile.name);
            }
            await HandlePage.closeBrowser(browser);
        } catch (error) {
            console.log("Lỗi: " + error);
            await HandlePage.closeBrowser(browser);
        }
    }
    return res.send("Thực hiện xong phần kết bạn");

});

router.post('/like_page', async (req, res) => {
    let page_link = req.body.page_link;
    let groupName = req.body.group_name;
    const groups = await axios.get(__API_GPM + "profiles");
    const profiles = groups.data.filter(o => o.group_name === groupName);
    for (const profile of profiles) {
        try {
            const browser = await __Gpm_Browser(profile.id);
            const page = await browser.newPage();
            await HandlePage.gotoUrl(page, Urls.FACEBOONK_LOGIN);
            const isLoginFacebook = await HandleFacebook.isLogin(page); 
            if (isLoginFacebook == 'login') {
                await HandleFacebook.likePage(page, page_link); 
            } else {
                console.log(isLoginFacebook + ' ' + profile.name);
            }
            await HandlePage.closeBrowser(browser);
        } catch (error) {
            console.log("Lỗi: " + error);
            await HandlePage.closeBrowser(browser);
        }
    }
    return res.send("Thực hiện xong phần like page");
});

router.post('/like_share_comment_post', async (req, res) => {
    let post_link = req.body.post_link;
    let list_comment = req.body.list_comment;
    let shareStatus = req.body.share;
    let post = req.body.post;
    let groupName = req.body.group_name;
    const groups = await axios.get(__API_GPM + "profiles");
    const profiles = groups.data.filter(o => o.group_name === groupName);
    for (const profile of profiles) {
        const browser = await __Gpm_Browser(profile.id);
        try {
            const page = await browser.newPage();
            await HandlePage.gotoUrl(page, Urls.FACEBOONK_LOGIN);
            const isLoginFacebook = await HandleFacebook.isLogin(page); 
            if (isLoginFacebook == 'login') {
                if (post == 'post') {
                    await HandleFacebook.handlePost(page, post_link, list_comment, shareStatus); 
                }
                if (post == 'video') {
                    await HandleFacebook.handlePostVideo(page, post_link, list_comment, shareStatus); 
                }
            } else {
                console.log(isLoginFacebook + ' ' + profile.name);
            }
            await HandlePage.closeBrowser(browser);
        } catch (error) {
            console.log("Lỗi: " + error);
            await HandlePage.closeBrowser(browser);
        }
    }
    return res.send("Xử lý xong bài viết");
});
router.post('/test', async (req, res) => {
    try {
        let page_link = req.body.page_link;
        const browser = await __Gpm_Browser('47cd4c40-791b-4d4e-b348-db3893bf3935');
        const page = await browser.newPage();
        await HandlePage.gotoUrl(page, Urls.FACEBOONK_LOGIN);
        const isLoginFacebook = await HandleFacebook.isLogin(page); 
        if (isLoginFacebook == 'login') {
            await HandleFacebook.handlePost(page, page_link); 
        } else {
            console.log(isLoginFacebook);
        }
        // await HandlePage.closeBrowser(browser);
        return res.send('Add firend');
    } catch (error) {
        return res.send("Lỗi ở /api/v1/facebook/test: " + error);
    }
});
router.post('/test_list', async (req, res) => {
    let groupName = 'test_pupperteer';
    const groups = await axios.get(__API_GPM + "profiles");
    const profiles = groups.data.filter(o => o.group_name === groupName);
    for (const profile of profiles) {
        const browser = await __Gpm_Browser(profile.id);
        try {
            const page = await browser.newPage();
            await HandlePage.gotoUrl(page, Urls.FACEBOONK_LOGIN);
            const isLoginFacebook = await HandleFacebook.isLogin(page); 
            if (isLoginFacebook == 'login') {
                await HandleFacebook.addFiends(page); 
                console.log('Add firend: ' + profile.name);
            } else {
                console.log(isLoginFacebook);
            }
            await HandlePage.closeBrowser(browser);
        } catch (error) {
            console.log("Lỗi: " + error);
            await HandlePage.closeBrowser(browser);
        }
    }
    return res.send("Thực hiện xong phần kết bạn");

});

module.exports = router;
