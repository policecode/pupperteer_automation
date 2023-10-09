const express = require('express');
const fs = require('fs');
const https = require('https');
var router = express.Router();
// Action
const HandlePage = require(__path_action + 'HandlePage');
const HandleTruyenfull = require(__path_action + 'HandleTruyenfull');
const RandomString = require(__path_util + 'randomString');
const Functions = require(__path_util + 'functions');

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

router.post('/test', async (req, res) => {
    const browser = await __Start_Browser();
    const {link}= req.body;

    try {
        let page = await browser.newPage();
        await HandlePage.gotoUrl(page, link); 
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
        const dirStoryName = __base + 'public/download/'+RandomString.changeSlug('truyện để test')+'/';
        if (!fs.existsSync(dirStoryName)) {
            fs.mkdirSync(dirStoryName)
        }
        // Thư mục chương
        const dirChapterFolder = dirStoryName + 'chapter-1/';
        if (!fs.existsSync(dirChapterFolder)) {
            fs.mkdirSync(dirChapterFolder)
        }
        
        // Xử lý trường hợp trang truyện có hình ảnh hoặc có nội dung chữ
        let rexgex = /<img.*?>/g;
        let arrImg = contentHTML.match(rexgex);
        if (arrImg) {
            
            const dirImage = dirChapterFolder + 'image/';
            if (!fs.existsSync(dirImage)) {
                fs.mkdirSync(dirImage)
            }
            for (let i = 0; i < arrImg.length; i++) {
                try {
                    const resultMatch = /src="(.*?)"/g.exec(arrImg[i]);
                    const urlImage = resultMatch[1];
                    contentHTML = contentHTML.replace(urlImage, '{{image-'+(i + 1)+'}}');
                    const arrSplitLink = urlImage.split('.');
                    const tmpFormat = arrSplitLink[arrSplitLink.length - 1];
                    https.get(urlImage, (res) => {
                        res.pipe(fs.createWriteStream(dirImage + (i + 1) + '.' + tmpFormat));
                    });
                } catch (error) {
                    console.log('Lỗi lưu ảnh ' + error);
                }
            }
            if (!fs.existsSync(dirChapterFolder + 'text.txt')) {
                fs.writeFileSync(dirChapterFolder + 'text.txt', contentHTML, 'utf-8');
            }
        } else {
            if (!fs.existsSync(dirChapterFolder + 'text.txt')) {
                fs.writeFileSync(dirChapterFolder + 'text.txt', contentHTML, 'utf-8');
            }

        }
        await page.waitForTimeout(1000);
        await HandlePage.closeBrowser(browser);

    } catch (error) {
        console.log('Lỗi đường link lần ' + error);
        await HandlePage.closeBrowser(browser);

    }

    // await HandlePage.closeBrowser(browser);
    return res.send('Tải truyện thành công');
})
module.exports = router;