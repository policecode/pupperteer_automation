const express = require('express');
const fs = require('fs');
var router = express.Router();
// Action
const HandlePage = require(__path_action + 'HandlePage');
const HandleTruyenfull = require(__path_action + 'HandleTruyenfull');

router.post('/crawl_tool_story', async (req, res) => {
    const browser = await __Start_Browser();
    const {link}= req.body;
    try {
        let page = await browser.newPage();

        /**
         * Lấy danh sách các chương truyện
         */
        await HandlePage.gotoUrl(page, link); 
        let listChapter = [];
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
                // Xử lý trường hợp trang truyện có hình ảnh
                let rexgex = /<img.*?>/g;
                myArray = contentHTML.match(rexgex);
                if (myArray) {
                    console.log('Chương ' + chapter.chapterText + ' có hình ảnh');
                }
                /**
                 * Xử lý việc ghi file
                 */
                const dirDownload = __base + 'public/download/';
                // const dirStoryName = dirDownload
                // Thư mục chương
                const dirChapterFolder = dirDownload + 'chapter-'+index +'/';
                if (!fs.existsSync(dirChapterFolder)) {
                    fs.mkdirSync(dirChapterFolder)
                }
                // Nội dung truyện
                if (!fs.existsSync(dirChapterFolder + 'title.txt')) {
                    fs.writeFileSync(dirChapterFolder + 'title.txt', chapter.chapterText, 'utf-8');
                }
                if (!fs.existsSync(dirChapterFolder + 'text.txt')) {
                    fs.writeFileSync(dirChapterFolder + 'text.txt', contentHTML, 'utf-8');
                }
                await page.waitForTimeout(1000);
                index++;
                break;
            } catch (error) {
                console.log('Lần ' + i + ': ' + error);
            }
        }
        
       }

    } catch (error) {
        await HandlePage.closeBrowser(browser);
        return res.send("Lỗi ở /api/v1/truỳenull/crawl_tool_story: " + error);
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
         * Lấy nội dung chương truyện
        */
        let index = 1;
        try {
            await HandlePage.gotoUrl(page, link); 
            let contentPage = await page.waitForSelector('#chapter-big-container', { visible: true });
            let contentHTML = await contentPage.evaluate(el => {
                const content = el.querySelector('.chapter-c').innerHTML;
                return content;
                });
            //  Loại bỏ quảng cáo khi tải về
            contentHTML = contentHTML.replace(/<div.*\/div>/g, '');
            contentHTML = contentHTML.replace(/<script.*\/script>/g, '');
            
            /**
             * Xử lý việc ghi file
             */
            const dirDownload = __base + 'public/download/';
            // Thư mục chương
            const dirChapterFolder = dirDownload + 'chapter-'+index +'/';
            if (!fs.existsSync(dirChapterFolder)) {
                fs.mkdirSync(dirChapterFolder)
            }
            // Nội dung truyện
            // if (!fs.existsSync(dirChapterFolder + 'title.txt')) {
            //     fs.writeFileSync(dirChapterFolder + 'title.txt', chapter.chapterText, 'utf-8');
            // }
            if (!fs.existsSync(dirChapterFolder + 'text.txt')) {
                fs.writeFileSync(dirChapterFolder + 'text.txt', contentHTML, 'utf-8');
            }
            await page.waitForTimeout(1000);
        } catch (error) {
            console.log('Lần ' + i + ': ' + error);
        }
   

    } catch (error) {
        await HandlePage.closeBrowser(browser);
        return res.send("Lỗi ở /api/v1/truỳenull/crawl_tool_story: " + error);
    }

    // await HandlePage.closeBrowser(browser);
    return res.send('Tải truyện thành công');
})
module.exports = router;