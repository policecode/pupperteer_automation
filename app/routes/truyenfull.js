const express = require('express');
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const path = require('path');
const FormData = require('form-data');
var router = express.Router();
// Action
const HandlePage = require(__path_action + 'HandlePage');
const HandleTruyenfull = require(__path_action + 'HandleTruyenfull');
const RandomString = require(__path_util + 'randomString');
const Functions = require(__path_util + 'functions');
const {upload} = require(__path_util + 'upload');



router.post('/crawl_tool_story', async (req, res) => {
    const {link, action}= req.body;
    let queueThread = [];
    let thread = req.body.thread?req.body.thread :1;
    /**
     * Lấy bắt đầu từ trang danh sách các truyện
     * - action: one - lấy theo link một bộ truyện cụ thể; mutiple - Lấy theo danh sách liệt kê các bộ truyện
     */
    let listTruyen = [];
    if (action == 'one') {
        listTruyen.push(link);
    } else if (action == 'mutiple') {
        const browserLocal = await __Start_Browser();
        try {
            let pageLocal = await browserLocal.newPage();
            await HandlePage.gotoUrl(pageLocal, link); 
            const elListTruyen = await pageLocal.waitForSelector('.container .col-truyen-main .list.list-truyen', { visible: true });
            listTruyen = await elListTruyen.evaluate(el => {
                const listElement= el.querySelectorAll('h3.truyen-title a');
                let arr = [];
                listElement.forEach(a => {
                    arr.push(a.href);
                });
                return arr;
             });
             await HandlePage.closeBrowser(browserLocal);
        } catch (error) {
            await HandlePage.closeBrowser(browserLocal);
            return res.send("Lỗi ở /api/v1/truỳenull/crawl_tool_story: " + error);
        }
    } else {
        listTruyen.push(link);
    }


    const downloadTruyenfull = async (link, number) => {
        const browser = await __Start_Browser();
        try {
        let page = await browser.newPage();
            await HandlePage.gotoUrl(page, link); 
            let listChapter = [];
            /**
             * Tạo thư mục chứa truyện
             */
            // Tên truyện
            await page.waitForSelector('.col-truyen-main h3.title', { visible: true });
            const titleStory = await page.$eval('.col-truyen-main h3.title', el => el.innerText);
            // Description
            await page.waitForSelector('.col-truyen-main .desc-text.desc-text-full', { visible: true });
            const description = await page.$eval('.col-truyen-main .desc-text.desc-text-full', el => el.innerText);
            // Author & category
            await page.waitForSelector('.col-truyen-main .info-holder .info', { visible: true });
            const author = await page.$eval('.col-truyen-main .info-holder .info', el => {
                 return el.querySelector('a[itemprop="author"]').innerText;
            });
            const category = await page.$eval('.col-truyen-main .info-holder .info', el => {
                let categoryList = el.querySelectorAll('a[itemprop="genre"]');
                let str = ''; 
                categoryList.forEach(catEl => {
                    str+= catEl.innerText + '\n';
                });
                return str;
           });
    
           
           // File thông tin truyện
            const dirStoryName = __base + 'public/download/'+RandomString.changeSlug(titleStory)+'/';
            Functions.createFolderAnfFile(dirStoryName, 'title.txt', titleStory);
            Functions.createFolderAnfFile(dirStoryName, 'description.txt', description);
            Functions.createFolderAnfFile(dirStoryName, 'author.txt', author);
            Functions.createFolderAnfFile(dirStoryName, 'category.txt', category);
           
            /**
             * Lấy danh sách các chương truyện
             */
            while (true) {
                const ChapterEl = await page.waitForSelector('#list-chapter', { visible: true });
                const list = await ChapterEl.evaluate(el => {
                    let listTmp = [];
                    const listElement = el.querySelectorAll('.list-chapter li');
                    listElement.forEach(elChapter => {
                        const url = elChapter.querySelector('a').href;
                        const chapterText = elChapter.querySelector('a').innerHTML;
                        listTmp.push({chapterText, url});
                    });
                    return listTmp;
                });
    
                listChapter = listChapter.concat(list);
    
                isPaging = await page.$('#list-chapter .pagination li.active + li');
                if (isPaging) {
                    const isChoosePage = await isPaging.evaluate(el => {
                       return !el.classList.contains('page-nav');
                    });
                    if (isChoosePage) {
                        await page.click('#list-chapter .pagination li.active + li');
                        await page.waitForTimeout(1000);
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
            /**
             * Lấy nội dung chương truyện
            */
           let index = 1;
           for (const chapter of listChapter) {
            for (let i = 0; i < 2; i++) {
                try {
                    await HandlePage.gotoUrl(page, chapter.url); 
                    let contentPage = await page.waitForSelector('#chapter-big-container', { visible: true });
                    let contentHTML = await contentPage.evaluate(el => {
                        const content = el.querySelector('.chapter-c').innerHTML;
                        return content;
                     });
                    //  Loại bỏ quảng cáo khi tải về
                    contentHTML = contentHTML.replace(/<div.*?\/div>/g, '');
                    contentHTML = contentHTML.replace(/<script.*?\/script>/g, '');
                    
                    /**
                     * Xử lý việc ghi file
                     */
                    
                    // Thư mục chương
                    const dirChapterFolder = dirStoryName + 'chapter-'+index +'/';
                    // tiêu đề chương
                    Functions.createFolderAnfFile(dirChapterFolder, 'title.txt', chapter.chapterText);
                    // Xử lý trường hợp trang truyện có hình ảnh hoặc có nội dung chữ
                    let rexgex = /<img.*?>/g;
                    let arrImg = contentHTML.match(rexgex);
                    if (arrImg) {
                        const dirImage = dirChapterFolder + 'image/';
                        for (let i = 0; i < arrImg.length; i++) {
                            try {
                                const resultMatch = /src="(.*?)"/g.exec(arrImg[i]);
                                const urlImage = resultMatch[1];
                                // Loại bỏ đường dẫn ảnh cũ đổi thành {{image-i}}; i tương ứng với tên ảnh trong folder image
                                contentHTML = contentHTML.replace(urlImage, '{{image-'+(i + 1)+'}}');
                                const arrSplitLink = urlImage.split('.');
                                const tmpFormat = arrSplitLink[arrSplitLink.length - 1];
                                Functions.downloadFile(urlImage, dirImage, (i + 1) + '.' + tmpFormat);
                              
                            } catch (error) {
                                console.log('Lỗi lưu ảnh ' + titleStory + ' chapter-'+index + ' :' + error );
                            }
                        }
                      
                    }
                    Functions.createFolderAnfFile(dirChapterFolder, 'text.txt', contentHTML);

                    await page.waitForTimeout(1000);
                    index++;
                    break;
                } catch (error) {
                    console.log('Lỗi đường link lần ' + i + ' '+chapter.url+ ': ' + error);
                }
            }
            
           }
           await HandlePage.closeBrowser(browser);
           return number;
        } catch (error) {
            await HandlePage.closeBrowser(browser);
            console.log("Lỗi ở /api/v1/truỳenull/crawl_tool_story: " + error);
            return number;
        }
    } 

    // Chạy các luồng
    let number = 0;
    while (number < listTruyen.length) {
        if (queueThread.length < thread && !queueThread.includes(number)) {
            queueThread.push(number);
            downloadTruyenfull(listTruyen[number], number).then((indexNumber) => {
                const index = queueThread.indexOf(indexNumber);
                if (index !== -1) {
                    console.log('success theard: ' + indexNumber);
                    queueThread.splice(index, 1);
                }
            }).catch((indexNumber) => {
                const index = queueThread.indexOf(indexNumber);
                if (index !== -1) {
                    console.log('error theard: ' + indexNumber);
                    queueThread.splice(index, 1);
                }
            });
            number++;
        } else {
            await Functions.sleep(15000);
        }
    }
    // await HandlePage.closeBrowser(browser);
    return res.send('Tải truyện thành công');
});
router.get('/path_folder_truyen', async (req, res) => {
    // Lấy danh sách các thư mục đã download về
    try {
        const listPath = [];
        const pathFolder = path.join(__base+'public/download/');
        const listDirStory = fs.readdirSync(pathFolder);
        listDirStory.forEach(dir => {
            const pathStory = path.join(pathFolder, dir);
            const direntStory = fs.statSync(pathStory);
            if (direntStory.isDirectory()) {
                const pathChildTitle = path.join(pathStory, 'title.txt');
                const readFileChild = fs.readFileSync(pathChildTitle, {encoding: 'utf-8'});
                listPath.push({
                    folder: dir,
                    name: readFileChild
                })
            }
        });
        return res.status(200).send(listPath);
    } catch (error) {
        return res.send('Lỗi: ' + error);
    }
});
router.post('/handle_duplicate_file', async (req, res) => {
    const {list_path}= req.body;
    let count = 0;
    try {
        // Vào danh sách các folder cần thực hiện thao tác
        if (list_path.length > 0) {
            list_path.forEach(dir => {
                let listStory = [];
                // Lấy danh sách các dir con
                const pathFolder = path.join(__base+'public/download/', dir);
                const listDirChapter = fs.readdirSync(pathFolder);
                // Làm thao tác kiểm tra các folder con, tìm những folder có nội dung giống nhau
                listDirChapter.forEach(dirChild => {
                    const pathChild = path.join(pathFolder, dirChild);
                    // Lấy trạng thái của dir
                    const dirrentChild = fs.statSync(pathChild);
                    if (dirrentChild.isDirectory()) {
                        // Vào các folder con là các chương, kiểm tra phần title.txt xem có bị trùng lặp chương không
                        const pathTitleChapter = path.join(pathChild, 'title.txt');
                        const readFileTitle = fs.readFileSync(pathTitleChapter, {encoding: 'utf-8'});
                        const indexChapter = listStory.indexOf(readFileTitle)
                        if (indexChapter>= 0) {
                            // Nếu có chương trùng thì xóa đi
                            fs.rmSync(pathChild, {recursive: true});
                            count++;
                            console.log(`đã xóa folder ${dirChild} - parent: ${dir}`);
                        } else {
                            listStory.push(readFileTitle)
                        }
                    }
                });
            });
        }

        return res.send(`Đã xóa ${count} thư mục bị trùng lặp`);
    } catch (error) {
        return res.send('Lỗi: ' + error);
    }
    // text-1.txt
});

router.post('/demo_call_api', async (req, res) => {
    try {
        upload.single('image')
        return res.send({message: 'Thêm mới thành công'});
    } catch (error) {
        return res.send('Lỗi: ' + error);
    }

})
router.post('/test', async (req, res) => {
    try {
        const form = new FormData();
        const pathImage = path.join(__base+'public/image', 'pngtree-beauty-logo-design-png-image_6568470.png');
        form.append('image', fs.createReadStream(pathImage));
        const respone = await axios({
            baseURL: 'http://localhost:8002',
            url: '/api/v1/truyenfull/demo_call_api',
            method: 'post',
            headers: form.getHeaders(),
            data: form
          });
        //   const respone = await axios({
        //     method: 'get',
        //     url: 'http://localhost:8002/api/v1/truyenfull/path_folder_truyen',
        //   })
        // console.log(axios.isCancel('something'));
        return res.send(respone.data);
    } catch (error) {
        return res.send('Lỗi: ' + error);
    }
})
module.exports = router;