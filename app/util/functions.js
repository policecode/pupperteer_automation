const sleep = (ms) =>  new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });

const changeTimeSecond = (stringTime) => {
    const arrayTime = stringTime.split(':').reverse();
    let secondResult = 0;
    arrayTime.forEach((number, index) => {
        if (index === 0) {
            secondResult += Number(number);
        }
        if (index === 1) {
            secondResult += Number(number)*60;
        }
        if (index === 2) {
            secondResult += Number(number)*60*60;
        }
    });
    return secondResult;
}

/**
 * Đưa chuỗi thời gian về dạng obj: dd/mm/YYY
 */
const dateToObject = (date) => {
    const arrayDate = date.split('/');
    return {
        day: arrayDate[0],
        month: arrayDate[1],
        year: arrayDate[2]
    }
}
module.exports = {sleep, changeTimeSecond, dateToObject};
