const RandomString = require(__path_util + 'randomString');

class HandleVnxpress {
    static async hoverAndClickRandomPage(page) {
        try {
            const randomString = new RandomString();
            // section top-header; section top-header sticky; section section_header
            await page.waitForSelector('header.section', { visible: true });
            const listTitle = await page.$$('.item-news');
            const index = randomString.getRandomNumber(0, listTitle.length - 1);
            for (let i = 0; i < listTitle.length; i++) {
                const isHiddenArticle = await page.evaluate(article => {
                    return article.classList.contains('hidden');
                }, listTitle[i]);
                if (!isHiddenArticle) {
                    if (index <= i) {
                        await page.evaluate(article => {
                            article.querySelector('.title-news a').click();
                        }, listTitle[i]);
                        await page.bringToFront();
                        break;
                    }
                    await listTitle[i].hover();
                    await page.waitForTimeout(2000);
                }
            }
        } catch (error) {
            console.log('HandleVnxpress: ' + error);
        }
    }
}

module.exports = HandleVnxpress;
