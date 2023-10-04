const express = require('express');

var router = express.Router();
// Action
const HandlePage = require(__path_action + 'HandlePage');
const HandleTruyenfull = require(__path_action + 'HandleTruyenfull');

router.post('/crawl_tool_story', async (req, res) => {
    const browser = await __Start_Browser();
    try {
        let page = await browser.newPage();

        /**
         * Lấy danh sách các chương truyện
         */
        await HandlePage.gotoUrl(page, 'https://truyenfull.com/cam-dinh.32887/'); 
        let listChapter = [];
        while (true) {
            const ChapterEl = await page.waitForSelector('#list-chapter', { visible: true });
            const list = await ChapterEl.evaluate(el => {
                let listTmp = [];
                const listElement = el.querySelectorAll('.list-chapter li');
                listElement.forEach(elChapter => {
                    const url = elChapter.querySelector('a').href;
                    const chapterText = elChapter.querySelector('a').innerText;
                    listTmp.push({chapterText, url});
                });
                return listTmp;
            });

            listChapter = listChapter.concat(list);

            isPaging = await page.$('#list-chapter .pagination li.active + li');
            if (isPaging) {
                await page.click('#list-chapter .pagination li.active + li');
                await page.waitForTimeout(1000);
            } else {
                break;
            }
        }
        /**
         * Lấy nội dung chương truyện
        */
       let index = 0;
       for (const chapter of listChapter) {
           await HandlePage.gotoUrl(page, chapter.url); 
           if (index > 5) break;
           let contentPage = await page.waitForSelector('#chapter-big-container', { visible: true });
           let content = await contentPage.evaluate(el => {
               const content = el.querySelector('.chapter-c').innerText;
               return content;
            });
            chapter.content = content;
            index++
           await page.waitForTimeout(2000);
       }
        // console.log(listChapter);

    } catch (error) {
        await HandlePage.closeBrowser(browser);
        return res.send("Lỗi ở /api/v1/truỳenull/crawl_tool_story: " + error);
    }

    // await HandlePage.closeBrowser(browser);
    return res.send('Tải truyện thành công');
});

module.exports = router;