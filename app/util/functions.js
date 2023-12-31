const fs = require('fs');
const https = require('https');
const path = require('path');
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
    const dirParent = path.join(__pathFolder);
    if (!fs.existsSync(dirParent)) {
      fs.mkdirSync(dirParent, {recursive: true})
    }
    if (__fileName) {
      const pathText = path.join(dirParent, __fileName);
      fs.writeFileSync(pathText, __text, 'utf-8');
    }
  }
  /**
   * Tạo file mới, nếu đã tồn tại thì sẽ xóa đi tạo lại, trả về đường dẫn tuyệt đối của file
   */
  const createNewFile = (__pathFolder, __fileName) => {
    const dirParent = path.join(__pathFolder);
    if (!fs.existsSync(dirParent)) {
      fs.mkdirSync(dirParent, {recursive: true})
    }
    const pathFile = path.join(dirParent, __fileName);
    if (fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile)
        fs.openSync(pathFile, 'w');
    } else {
        fs.openSync(pathFile, 'w');
    }
    return pathFile;
  }

  const downloadFile = (__url, __pathFolder, __fileName) => {
    if (!fs.existsSync( __pathFolder)) {
        fs.mkdirSync(__pathFolder, {recursive: true})
    }
    https.get(__url, (res) => {
        res.pipe(fs.createWriteStream(__pathFolder + __fileName));
    });
  }

  const totalFolder = (__path_folder_parent) => {
    try {
      const listDir = fs.readdirSync(__path_folder_parent);
      let total = 0;
      listDir.forEach(dir => {
        const pathFolderChild = path.join(__path_folder_parent, dir);
        const dirent = fs.statSync(pathFolderChild);
        if (dirent.isDirectory()) total++;
      });
      return total;
    } catch (error) {
      console.log('FileHelper class totalFolder(): ' +error);
      return 0;
    }
  }

  // Đọc file 
  const readFile = (__path_dir) => {
    const pathFile = path.join(__path_dir);
    if (fs.existsSync(pathFile)) {
      return fs.readFileSync(pathFile, {
        encoding: 'utf-8'
      });
    }
    return '';
  }

  // Lấy danh danh thư mục các chương và sắp xếp
  const getFolderChapter = (__path_dir) => {
    const tmp = fs.readdirSync(__path_dir);
    const listChapter = [];
    for (let index = 0; index < tmp.length; index++) {
        let objNumber = tmp[index].match(/[0-9]+/);
        if (objNumber) {
            let number = Number(objNumber[0]);
            listChapter.push({
                index: number,
                path: tmp[index]
            });
        }
    }
    
    for (let i = 0; i < listChapter.length - 1; i++) {
        for (let j = listChapter.length - 1; j > i; j--) {
          if (listChapter[j].index < listChapter[j - 1].index) {
            let t = listChapter[j];
            listChapter[j] = listChapter[j - 1];
            listChapter[j - 1] = t;
          }
        }
      }
    
    const result = [];
    for (let a = 0; a < listChapter.length; a++) {
        result.push(listChapter[a].path)
    }
    return result;
  }

  /**
   * Tìm kiếm một file hoặc thư mục (DIR) trong thư mục
   * - __path_dir: Thu mục tiến hành tìm kiếm
   * - __file_key: Từ khóa tìm kiếm
   * - resulit: Trả ra DIR đầu tiên phù hợp với kết quả
   */
const findFile = (__path_dir, __file_key) => {
    let listDirStory = fs.readdirSync(__path_dir);
    const result = listDirStory.find(el => {
        return el.includes(__file_key);
    })
    if (result) {
      return result;
    }
    return false;
}
module.exports = {sleep, changeTimeSecond, dateToObject, createFolderAnfFile, downloadFile, totalFolder, readFile, getFolderChapter, findFile, createNewFile};
