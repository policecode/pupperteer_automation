const express = require('express');
// const fs = require('fs');
// const axios = require('axios');
// const path = require('path');
// const FormData = require('form-data');
var router = express.Router();
// Action
const HandlePage = require(__path_action + 'HandlePage');
// const RandomString = require(__path_util + 'randomString');
// const Functions = require(__path_util + 'functions');

router.post('/crawl_person_long_time', async (req, res) =>  {
    const browser = await __Start_Browser();
    try {
        let page = await browser.newPage();
        await HandlePage.gotoUrl(page, 'https://hanoi.xuatnhapcanh.gov.vn/faces/login.jsf'); 
        // Login
        await page.waitForSelector('.form-login-cell', { visible: true });
        await page.type('.form-login-cell input[id="pt1\:s1\:it1\:\:content"]', '664317', {delay: 100});
        await page.type('.form-login-cell input[id="pt1\:s1\:it2\:\:content"]', 'dat9531487', {delay: 100});
        await page.click('.form-login-cell div[id="pt1\:s1\:b1"]');

        // Xử lý trang kiểm tra thông tin người lưu trú
        await HandlePage.gotoUrl(page, 'https://hanoi.xuatnhapcanh.gov.vn/faces/search_kbtt.jsf'); 
        await page.waitForSelector('span[id="pt1\:pt_pgl6"]', { visible: true }); //Form
        await page.select('span[id="pt1\:pt_pgl6"] select[id="pt1\:soc5\:\:content"]', '0');
        await page.select('span[id="pt1\:pt_pgl6"] select[id="pt1\:soc15\:\:content"]', '101005001');
        await page.click('span[id="pt1\:pt_pgl6"] div[id="pt1\:b1"]');
        await Functions.sleep(3000);

        // Lấy dữ liệu ở table
        return res.send("Thành công");
    } catch (error) {
        await HandlePage.closeBrowser(browser);
        console.log("Error in /api/v1/xuatnhapcanh/crawl_person_long_time: " + error);
        return res.send("Error in /api/v1/xuatnhapcanh/crawl_person_long_time: " + error);
    }
});
/**
 * 101005001 - Phường Cửa Nam
 * 101005003 - Phường Trần Hưng Đạo
 * 101005005 - Phường Hàng Bài
 * 101005007 - Phường Phan Chu Trinh
 * 101005009 - Phường Tràng Tiền
 * 101005011 - Phường Hàng Bạc
 * 101005013 - Phường Lý Thái Tổ
 * 101005015 - Phường Hàng Buồm
 * 101005017 - Phường Đồng Xuân
 * 101005019 - Phường Hàng Đào
 * 101005021 - Phường Hàng Mã
 * 101005023 - Phường Hàng Bồ
 * 101005025 - Phường Cửa Đông
 * 101005027 - Phường Hàng Bông
 * 101005029 - Phường Hàng Gai
 * 101005031 - Phường Hàng Trống
 * 101005033 - Phường Phúc Tân
 * 101005035 - Phường Chương Dương
 */
module.exports = router;