const express = require('express');
const fs = require('fs');
var router = express.Router();
// Action
const HandlePage = require(__path_action + 'HandlePage');
const HandleTruyenfull = require(__path_action + 'HandleTruyenfull');
const RandomString = require(__path_util + 'randomString');
const Functions = require(__path_util + 'functions');

router.post('/crawl_tool_story', async (req, res) => {
    const {link}= req.body;
    let queueThread = [];
    let thread = 3;
    /**
     * Lấy bắt đầu từ trang danh sách các truyện
     */
    const browserLocal = await __Start_Browser();
    let listTruyen = [];
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
    
            const dirStoryName = __base + 'public/download/'+RandomString.changeSlug(titleStory)+'/';
            if (!fs.existsSync( __base + 'public/')) {
                fs.mkdirSync(__base + 'public/')
            }
            if (!fs.existsSync( __base + 'public/download/')) {
                fs.mkdirSync(__base + 'public/download/')
            }
            if (!fs.existsSync( dirStoryName)) {
                fs.mkdirSync(dirStoryName)
            }
            // File thông tin truyện
            if (!fs.existsSync( dirStoryName + 'title.txt')) {
                fs.writeFileSync(dirStoryName + 'title.txt', titleStory, 'utf-8');
            }
            if (!fs.existsSync( dirStoryName + 'description.txt')) {
                fs.writeFileSync(dirStoryName + 'description.txt', description, 'utf-8');
            }
            if (!fs.existsSync( dirStoryName + 'author.txt')) {
                fs.writeFileSync(dirStoryName + 'author.txt', author, 'utf-8');
            }
            if (!fs.existsSync( dirStoryName + 'category.txt')) {
                fs.writeFileSync(dirStoryName + 'category.txt', category, 'utf-8');
            }
    
            while (true) {
    
                /**
                 * Lấy danh sách các chương truyện
                 */
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
                    if (!fs.existsSync(dirChapterFolder)) {
                        fs.mkdirSync(dirChapterFolder)
                    }
                    // tiêu đề chương
                    if (!fs.existsSync(dirChapterFolder + 'title.txt')) {
                        fs.writeFileSync(dirChapterFolder + 'title.txt', chapter.chapterText, 'utf-8');
                    }
                    // Xử lý trường hợp trang truyện có hình ảnh hoặc có nội dung chữ
                    let rexgex = /<img.*?>/g;
                    let arrImg = contentHTML.match(rexgex);
                    if (arrImg) {
                        if (!fs.existsSync(dirChapterFolder + 'text.txt')) {
                            fs.writeFileSync('' + 'text.txt', contentHTML, 'utf-8');
                        }
                        for (let i = 0; i < arrImg.length; i++) {
                            const dirImage = dirChapterFolder + 'image/'
                            try {
                                const resultMatch = /src="(.*?)"/g.exec(arrImg[i]);
                                const urlImage = resultMatch[1];
                                const arrSplitLink = urlImage.split('.');
                                const tmpFormat = arrSplitLink[arrSplitLink.length - 1];
                                https.get(urlImage, (res) => {
                                    res.pipe(fs.createWriteStream(dirImage + (i + 1) + '.' + tmpFormat));
                                });
                            } catch (error) {
                                console.log('Lỗi lưu ảnh ' + titleStory + ' chapter-'+index + ' :' + error );
                            }
                        }
                    } else {
                        if (!fs.existsSync(dirChapterFolder + 'text.txt')) {
                            fs.writeFileSync(dirChapterFolder + 'text.txt', contentHTML, 'utf-8');
                        }
    
                    }
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

        /**
         * Lấy bắt đầu từ trang danh sách các truyện
         */
        await HandlePage.gotoUrl(page, link); 
        const elListTruyen = await page.waitForSelector('.container .col-truyen-main .list.list-truyen', { visible: true });
        const listTruyen = await elListTruyen.evaluate(el => {
            const listElement= el.querySelectorAll('h3.truyen-title a');
            let arr = [];
            listElement.forEach(a => {
                arr.push(a.href);
            });
            return arr;
         });
        //  console.log(listTruyen);
        await HandlePage.closeBrowser(browser);
        return res.send(listTruyen);

    } catch (error) {
        await HandlePage.closeBrowser(browser);
        return res.send("Lỗi ở /api/v1/truỳenull/crawl_tool_story: " + error);
    }

    // await HandlePage.closeBrowser(browser);
    // return res.send('Tải truyện thành công');
})
module.exports = router;