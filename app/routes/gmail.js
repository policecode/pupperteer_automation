// Util
const Functions = require(__path_util + 'functions');
const Urls = require(__path_util + 'urls');
const RandomString = require(__path_util + 'randomString');
const JsonDatabase = require(__path_json);
// Action
const HandleGmail = require(__path_action + 'HandleGmail');
const HandlePage = require(__path_action + 'HandlePage');
const HandleYoutube = require(__path_action + 'HandleYoutube');
const HandleFacebook = require(__path_action + 'HandleFacebook');
const HandleVnxpress = require(__path_action + 'HandleVnxpress');

// package
const express = require('express');
const axios = require('axios');

var router = express.Router();

router.post('/register', async (req, res) => {
    let tableDatabase = new JsonDatabase('gmail');
    const randomString = new RandomString();
    try {
        const browser = await __Gpm_Browser('686db52c-d85a-4c9e-85a0-1ecf62675b53');
        let page = await browser.newPage();
        await page.goto(Urls.GMAIL_REGISTER, {
            waitUntil: "load"
        });
        // Load form full name
        await page.waitForSelector('.DRS7Fe.bxPAYd.k6Zj8d form[jsaction="submit:JM9m2e;"]', { visible: true });
        const lastName = randomString.getLastName();
        const firstName = randomString.getFirstName();
        await page.type('.DRS7Fe.bxPAYd.k6Zj8d form[jsaction="submit:JM9m2e;"] input[name="lastName"]', lastName);
        await page.type('.DRS7Fe.bxPAYd.k6Zj8d form[jsaction="submit:JM9m2e;"] input[name="firstName"]', firstName);
        await page.click('.DRS7Fe.bxPAYd.k6Zj8d button[jsname="LgbsSe"]');

        // Load form birthday
        await Functions.sleep(3000);
        const dateObj = randomString.getDate();
        const day = dateObj.day;
        const month = dateObj.month;
        const year = dateObj.year;
        const genderObj = randomString.getGender();
        await page.type('.DRS7Fe.bxPAYd.k6Zj8d form input[name="day"]', day);
        await page.select('.Wxwduf.Us7fWe.JhUD8d form select[id="month"]', month);
        await page.type('.DRS7Fe.bxPAYd.k6Zj8d form input[name="year"]', year);
        await page.select('.Wxwduf.Us7fWe.JhUD8d form select[id="gender"]', genderObj.key);
        await page.click('.DRS7Fe.bxPAYd.k6Zj8d button[jsname="LgbsSe"]');

        // Load form tk login gmail
        await Functions.sleep(3000);
        const inputUser = await page.$('.DRS7Fe.bxPAYd.k6Zj8d form input[name="Username"]');
        let userName;
        const btnChooseAcc = await page.$$('.BudEQ.rBUW7e .enBDyd');
        if (btnChooseAcc.length > 0) {
            await btnChooseAcc[btnChooseAcc.length - 1].click();
        }

        while (true) {
            // Tạo tài khoản không bị trùng
            userName = randomString.getUserName(lastName + firstName);
            await page.type('.DRS7Fe.bxPAYd.k6Zj8d form input[name="Username"]', userName);
            await page.click('.DRS7Fe.bxPAYd.k6Zj8d button[jsname="LgbsSe"]');
            await Functions.sleep(1000);
            let isValid = await page.evaluate(el => el.getAttribute('aria-invalid'), inputUser);

            if (!!isValid) {
                await inputUser.dispose();
                break;
            }
        }

        // Load form tk password 
        await Functions.sleep(3000);
        const passWord = randomString.getPassWord();
        await page.type('.DRS7Fe.bxPAYd.k6Zj8d form input[name="Passwd"]', passWord);
        await page.type('.DRS7Fe.bxPAYd.k6Zj8d form input[name="PasswdAgain"]', passWord);
        await page.click('.DRS7Fe.bxPAYd.k6Zj8d button[jsname="LgbsSe"]');

        // Số điện thoại xác minh
        await Functions.sleep(3000);
        const phone = req.body.phone;
        await page.type('.DRS7Fe.bxPAYd.k6Zj8d form input#phoneNumberId', phone);
        await page.click('.DRS7Fe.bxPAYd.k6Zj8d button[jsname="LgbsSe"]');
        await Functions.sleep(3000);
        // Kiểm tra xem sđt có dùng được không
        let isValidPhoneNumber = await page.$('.DRS7Fe.bxPAYd.k6Zj8d form input#phoneNumberId');
        if (isValidPhoneNumber) {
            return res.send('Số điện thoại không sử dụng được');
        } else {
            // Tạo profile trong GPM
            const urlCreateGPM = __API_GPM + 'create?name=' + userName + '@gmail.com';
            await axios.get(urlCreateGPM);
            // Lưu tài khoản đã đăng ký
            const dataRegister = tableDatabase.post({
                lastName: lastName, 
                firstName: firstName, 
                birthDay: dateObj.fullDate,
                gender: genderObj.value,
                userName: userName + '@gmail.com',
                password: passWord,
                phone: phone
            });
            return res.send(dataRegister);
        }
    } catch (error) {
        return res.send("Lỗi ở /api/v1/gmail/register: " + error);
    }
});

router.post('/login_google', async (req, res) => {
    let groupName = req.body.group_name ? req.body.group_name : "test_pupperteer";
    const groups = await axios.get(__API_GPM + "profiles");
    const profiles = groups.data.filter(o => o.group_name === groupName);
    const tableDatabase = new JsonDatabase('gmail');
    for (let i = 0; i < profiles.length; i++) {
        let gmail = tableDatabase.find(i+1);
        try {
            let browser = await __Gpm_Browser(profiles[i].id);
            let page = await browser.newPage(); 
            await HandleGmail.loginGmail(page, gmail.userName, gmail.password);
            await HandlePage.closeBrowser(browser);
        } catch (error) {
            // await HandlePage.closeBrowser(browser);
            console.log('login_google: ' + error);
        }
    }
    return res.send("Login thành công");
});

router.post('/visit_website', async (req, res) => {
    // let groupName = 'test_pupperteer';
    let groupName = req.body.group_name ? req.body.group_name : "test_pupperteer";
    let thread = 1;
    let queueThread = [];

    const groups = await axios.get(__API_GPM + "profiles");
    const profiles = groups.data.filter(o => o.group_name === groupName);
    const randomString = new RandomString();
    const listSearch = [{search: 'buồn thì cứ khóc đi', index: 0}, {search: 'maria', index: 1}, {search: 'tokyo drift', index: 1}, {search: 'tình yêu mang theo', index: 0}, {search: 'khuê mộc lan', index: 1}, {search: 'thằng hầu', index: 1}, {search: 'em là nhất miền tây', index: 1},  {search: 'mong một ngày anh nhớ đến em', index: 1}, {search: 'nothing in your eyes', index: 1}, {search: 'anh tin minh da cho nhau 1 ki niem', index: 0}, {search: 'chính em', index: 0}, {search: 'tòng phu', index: 0}, {search: 'hoa cưới', index: 1}];

    const visitWebsite = async (i) => {
        // run profile gpm
        let browser = await __Gpm_Browser(profiles[i].id);
        try {

            let page = await browser.newPage(); 
            const searchObj = listSearch[Math.floor(Math.random() * listSearch.length)];
            // Truy cập và xem youtube
            await HandlePage.gotoUrl(page, 'https://www.youtube.com/'); 
            await HandleYoutube.search(page, searchObj.search);
            const isClick = await HandleYoutube.clickVideo(page, searchObj.index, 'search');
            if (isClick) {
                await HandleYoutube.watchAds(page, 'ads_off');
                await HandleYoutube.watchVideo(page);
            }
            // Truy cập vào trang đọc báo
            await HandlePage.gotoUrl(page, 'https://vnexpress.net/'); 
            await HandlePage.scroll(page, randomString.getRandomNumber(5, 15), 'random'); 
            for (let i = 0; i < 5; i++) {
                await HandleVnxpress.hoverAndClickRandomPage(page);
                await HandlePage.scroll(page, randomString.getRandomNumber(5, 15)); 
            }
            await HandlePage.closeBrowser(browser);
            return i;
        } catch (error) {
            await HandlePage.closeBrowser(browser);
            console.log('visitWebsite func: ' + error);
            return i;
        }
    }
    let i = 0;
    while (i < profiles.length) {
        if (queueThread.length < thread && !queueThread.includes(i)) {
            queueThread.push(i);
            visitWebsite(i).then((indexProfile) => {
                const index = queueThread.indexOf(indexProfile);
                if (index !== -1) {
                    console.log('success theard: ' + indexProfile);
                    queueThread.splice(index, 1);
                }
            }).catch((indexProfile) => {
                const index = queueThread.indexOf(indexProfile);
                if (index !== -1) {
                    console.log('error theard: ' + indexProfile);
                    queueThread.splice(index, 1);
                }
            });
            i++;
        } else {
            await Functions.sleep(15000);
        }
    }
    return res.send("Kiểm tra thành công");
});

router.get('/', async (req, res) => {
    let tableDatabase = new JsonDatabase('gmail');
    const records = tableDatabase.get();

    return res.send({
        staus: 'success',
        records: records
    });
});
router.post('/', async (req, res) => {
    let tableDatabase = new JsonDatabase('gmail');
    let data = req.body;
    const record = tableDatabase.post(data);
    // Tạo profile trong GPM
    const urlCreateGPM = __API_GPM + 'create?name=' + data.userName + '&group=new_gmail';
    await axios.get(urlCreateGPM);
    return res.send({
        staus: 'create',
        record: record
    });
});
router.post('/update/:id', async (req, res) => {
    let tableDatabase = new JsonDatabase('gmail');
    let data = req.body;
    let id = req.params.id;
    const record = tableDatabase.put(data, id);
    return res.send({
        staus: 'update',
        record: record
    });
});
router.delete('/:id', async (req, res) => {
    let tableDatabase = new JsonDatabase('gmail');
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

router.get('/test', async (req, res) => {
    let groupName = 'test_pupperteer';
    let thread = 5;
    let queueThread = [];

    const groups = await axios.get(__API_GPM + "profiles");
    const profiles = groups.data.filter(o => o.group_name === groupName);
    const tableDatabase = new JsonDatabase('gmail');

    const visitWebsite = async (index) => {
        try {
            const gmail = tableDatabase.find(i+1);
            // run profile gpm
            let browser = await __Gpm_Browser(profiles[i].id);

            let page = await browser.newPage(); 
            const isLogin = await HandleGmail.loginGmail(page, gmail.userName, gmail.password);
            
            await HandlePage.closeBrowser(browser);
            return index;
        } catch (error) {
            console.log('visitWebsite func: ' + error);
            await HandlePage.closeBrowser(browser);
            return index;
        }
    }
    let i = 0;
    while (i < profiles.length) {
        console.log('thread: ' + i);
        if (queueThread.length < thread && !queueThread.includes(i)) {
            queueThread.push(i);
            visitWebsite(i).then((indexProfile) => {
                console.log('success: ' + indexProfile);
                const index = queueThread.indexOf(indexProfile);
                if (index !== -1) {
                    queueThread.splice(index, 1);
                }
            }).catch((indexProfile) => {
                console.log('error: ' + indexProfile);
                const index = queueThread.indexOf(indexProfile);
                if (index !== -1) {
                    queueThread.splice(index, 1);
                }
            });
            i++;
        } else {
            await Functions.sleep(60000);
        }
        await Functions.sleep(2000);
        
    }
    return res.send("Kiểm tra thành công");
});
module.exports = router;
