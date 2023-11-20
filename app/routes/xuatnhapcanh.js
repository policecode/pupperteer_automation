const express = require('express');
const fs = require('fs');
// const axios = require('axios');
const path = require('path');
// const FormData = require('form-data');
var router = express.Router();
// Action
const HandlePage = require(__path_action + 'HandlePage');

// const RandomString = require(__path_util + 'randomString');
const Functions = require(__path_util + 'functions');
const MicrosoftOffice = require(__path_util + 'microsoftOffice');
const {listArea} = require(__path_configs + 'xuatnhapcanh');


router.post('/crawl_person_long_time', async (req, res) =>  {
    const browser = await __Start_Browser();
    const {address}= req.body;
    try {
        let page = await browser.newPage();
        
        await HandlePage.gotoUrl(page, 'https://hanoi.xuatnhapcanh.gov.vn/faces/login.jsf'); 
        // Login
        await page.waitForSelector('.form-login-cell', { visible: true });
        await page.type('.form-login-cell input[id="pt1\:s1\:it1\:\:content"]', '664317', {delay: 10});
        await page.type('.form-login-cell input[id="pt1\:s1\:it2\:\:content"]', 'dat9531487', {delay: 10});
        await page.click('.form-login-cell div[id="pt1\:s1\:b1"]');
        try {
            // Check login
            await page.waitForSelector('span.tileUserName', { visible: true, timeout: 3000 });
            console.log("Login");
        } catch (error) {
            console.log("Logout");
            await HandlePage.closeBrowser(browser);
            return res.send("Logout");
        }
        let dataExcel = [];
        // Xử lý trang kiểm tra thông tin người lưu trú
        for (let t = 0; t < listArea.length; t++) {
            if (address != listArea[t].code) continue;
            await HandlePage.gotoUrl(page, 'https://hanoi.xuatnhapcanh.gov.vn/faces/search_kbtt.jsf'); 
            await page.waitForSelector('span[id="pt1\:pt_pgl6"]', { visible: true }); //Form
            await page.select('span[id="pt1\:pt_pgl6"] select[id="pt1\:soc5\:\:content"]', '0'); //ô chọn khách đang tạm trú
            await page.select('span[id="pt1\:pt_pgl6"] select[id="pt1\:soc15\:\:content"]', listArea[t].code); // Chọn phường tìm kiếm
            await page.click('span[id="pt1\:pt_pgl6"] div[id="pt1\:b1"]');// Btn tìm kiếm
            await page.waitForTimeout(3000);
    
            // Lấy dữ liệu ở table
            await page.waitForSelector('div[id="pt1\:pb2\:\:content"] table', { visible: true }); //Table
            while (true) {
                let listForeigner = await page.$$('div[id="pt1\:table\:\:db"] table tbody tr');
                for (let i = 0; i < listForeigner.length; i++) {
                    let foreigner = await page.evaluate(el => {
                        const listTitle = el.querySelectorAll('td');
                        // Xử lý thời gian, được 1 tháng thì lấy kết quả
                        let dateArr = listTitle[6].innerText.split('/'); // dateArr[0] - Day, dateArr[1] - Month, dateArr[2] - Year
                        let oldTime = (new Date(dateArr[2], dateArr[1] - 1, dateArr[0])).getTime()/86400000;
                        let currentTime = (new Date()).getTime()/86400000; // 86400000 milisecond = 1 ngày
                        let checkDay = Math.floor(currentTime - oldTime);
                        if (checkDay >= 30) {
                            return {
                                name: listTitle[1].innerText,
                                birthday: listTitle[2].innerText,
                                gender: listTitle[3].innerText,
                                country: listTitle[4].innerText,
                                passport: listTitle[5].innerText,
                                startDate: listTitle[6].innerText,
                                endDate: listTitle[7].innerText,
                                hotel: listTitle[8].innerText,
                            };
                        } else {
                            return false;
                        }
                    }, listForeigner[i]);
                    if (foreigner) {
                        foreigner.address = listArea[t].display;
                        dataExcel.push(foreigner);
                    }
                }
                // Xử lý việc sang trang tiếp theo
                try {
                    let nextPage = await page.$('a[id="pt1\:table\:\:nb_nx"].x13o.p_AFDisabled');
                    // console.log(!nextPage);
                    if (!nextPage) {
                        await page.click('a[id="pt1\:table\:\:nb_nx"].x13o');
                        await page.waitForTimeout(1000);
                    } else {
                        break;
                    }
                } catch (error) {
                    let nextPage = await page.$('a[id="pt1\:table\:\:nb_nx"].x13k.p_AFDisabled');
                    if (!nextPage) {
                        await page.click('a[id="pt1\:table\:\:nb_nx"].x13k');
                        await page.waitForTimeout(1000);
                    } else {
                        break;
                    }
                }
            }
            await HandlePage.gotoUrl(page, 'https://hanoi.xuatnhapcanh.gov.vn/faces/manage_cslt.jsf'); 
        }
        // Ghi file excel
        const pathXlsx = Functions.createNewFile(__base + 'public/xuatnhapcanh/', 'xuat-nhap-canh.xlsx');
        MicrosoftOffice.writeFileXlsx(pathXlsx, dataExcel, 'luu tru dai han');
        await HandlePage.closeBrowser(browser);
        return res.send("Thành công");
    } catch (error) {
        await HandlePage.closeBrowser(browser);
        console.log("Error in /api/v1/xuatnhapcanh/crawl_person_long_time: " + error);
        return res.send("Error in /api/v1/xuatnhapcanh/crawl_person_long_time: " + error);
    }
});

module.exports = router;