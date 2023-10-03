const Functions = require(__path_util + 'functions');

class HandleYoutube {
    /**
     * Xử lý việc nhập form tìm kiếm trên you tube
     */
    static async search(page, search) {
        try {
            await page.waitForSelector('form#search-form', { visible: true });
            // Việc tìm kiêm lần tiếp theo nếu form có ký tự thì tự động xóa
            const closeSearch = await page.$eval('form#search-form #search-clear-button', el => {
                return el.getAttribute('hidden') == null
            });
            if (closeSearch) {
                await page.click('form#search-form #search-clear-button');
            }
            // Thực hieneje việc tìm kiếm trên youtube
            await page.type('form#search-form input#search', search);
            await page.click('button#search-icon-legacy');
        } catch (error) {
            console.log('Không tìm tháy form tìm kiếm youtube');
        }
    }

    /**
     * Xử lý việc click vào một video trên trang chủ hoặc trang tìm kiếm 
     * - index: Vị trí thứ tự video sẽ click()
     * - action: mặc định - click trên trang chủ, search - click trên trang tìm kiếm
     */
    static async clickVideo(page, index, action = '') {
        try {
            if (action == 'search') {
                await page.waitForSelector('#container.style-scope.ytd-search', { visible: true });
                const listVideo = await page.$$('#dismissible.style-scope.ytd-video-renderer a.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail');
                await listVideo[index].click();
            } else {
                await page.waitForSelector('#primary.style-scope.ytd-two-column-browse-results-renderer', { visible: true });
                const listVideo = await page.$$('#content.style-scope.ytd-rich-item-renderer a.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail');
                await listVideo[index].click();
            }
            return true;
        } catch (error) {
            console.log('HandlePage clickVideo(): ' + error);
            return false;
        }
    }

    /**
     * Xử lý quảng cáo ở trong video
     * - action: mặc định thì xem hết quảng cáo mới tắt;
     * ads_off: Tắt quảng cáo ngay khi có thể
     */
    static async watchAds(page, action='') {
        await page.waitForSelector('#player-container-outer', { visible: true });
        // Kiểm tra trong video có ADS hay không, xử lý tăt ADS
        const isAds = await page.$('#player-container-outer .video-ads.ytp-ad-module') != null;
        // console.log('Ads 1: ' + isAds); 
        if (isAds) {
            while (true) {
                await Functions.sleep(1000);
                const isAdsPlay = await page.$eval('#player-container-outer .video-ads.ytp-ad-module', el => {
                    // Kiểm tra ADS có chạy hay không; true - là có chạy, false - không chạy
                    const isAdsPlay = !!el.innerText;
                    return isAdsPlay
                });
                // console.log('Ads 2: ' + isAdsPlay); 
    
                if (isAdsPlay) {
                    if (action == 'ads_off') {
                        try {
                            await page.waitForSelector('button.ytp-ad-skip-button.ytp-button', { visible: true });
                        } catch (error) {
                            console.log('Quảng cáo không có nút bỏ qua');
                        }
                    } else {
                        const durationAds = await page.$eval('.ytp-chrome-bottom .ytp-time-duration', el => {
                            const duration = el.innerText;
                            return duration;
                        });
                        const miliSecond = (Functions.changeTimeSecond(durationAds) - 2)*1000;
                        await Functions.sleep(miliSecond);
                    }
                    try {
                        await page.click('button.ytp-ad-skip-button.ytp-button');
                    } catch (error) {
                        console.log('Không thực hiện được hành vi click');
                    }
                } else {
                    // Kiểm tra xem còn quảng hay không thứ 2 hay không, lượt sau nếu không có thì sẽ kết thúc vòng lặp
                    break;
                }
            }
        }
    }

    /**
     * Xử lý việc xem video
     */

    static async watchVideo(page) {
        try {
            // .ytp-chrome-bottom .ytp-time-duration :Lấy thời gian video
            await page.waitForSelector('.ytp-chrome-bottom .ytp-time-duration', { visible: true });
            const durationVideo = await page.$eval('.ytp-chrome-bottom .ytp-time-duration', el => {
                const duration = el.innerText;
                return duration;
            });
            let timeSecond = Functions.changeTimeSecond(durationVideo) -2;
            if (timeSecond > 300) {
                timeSecond = 300;
            }
            const miliSecond = timeSecond*1000;
            console.log('Thời gian xem video: ' + durationVideo);
            await Functions.sleep(miliSecond);
        } catch (error) {
            console.log('trang không có video');
        }
    }
}

module.exports = HandleYoutube;
