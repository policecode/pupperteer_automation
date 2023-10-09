const fs = require('fs');
const https = require('https');

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

/**
 * Không điền thông tin file thì mặc định tạo folder
 */
const createFolderAnfFile = (__pathFolder, __fileName='', __text='') => {
    if (!fs.existsSync( __pathFolder)) {
      fs.mkdirSync(__pathFolder, {recursive: true})
    }
    if (__fileName && (!fs.existsSync( __pathFolder + __fileName))) {
      fs.writeFileSync(__pathFolder + __fileName, __text, 'utf-8');
    }
  }

  const downloadFile = (__url, __pathFolder, __fileName) => {
    if (!fs.existsSync( __pathFolder)) {
        fs.mkdirSync(__pathFolder, {recursive: true})
    }
    https.get(__url, (res) => {
        res.pipe(fs.createWriteStream(__pathFolder + __fileName));
    });
  }
module.exports = {sleep, changeTimeSecond, dateToObject, createFolderAnfFile, downloadFile};
