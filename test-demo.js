const RandomString = require('./app/util/randomString');
const fs = require('fs');
const https = require('https');
// const date = new Date();
// const timeStamp = Math.floor(Math.random() * (975665154348 - 318247514507)) + 318247514507;
// date.setTime(timeStamp);
// date.setFullYear(2000);
// date.setDate(31);
// date.setMonth(11);

// console.log(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());
// 318247514507 : 1/1/1908
// 975665154348 : 31/12/2000


// Tạo chuỗi string
// function removeVietnameseTones(str) {
//     str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
//     str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
//     str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
//     str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
//     str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
//     str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
//     str = str.replace(/đ/g,"d");
//     str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
//     str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
//     str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
//     str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
//     str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
//     str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
//     str = str.replace(/Đ/g, "D");
//     // Some system encode vietnamese combining accent as individual utf-8 characters
//     // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
//     str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
//     str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
//     // Remove extra spaces
//     // Bỏ các khoảng trắng liền nhau
//     str = str.replace(/ + /g," ");
//     str = str.trim();
//     // Remove punctuations
//     // Bỏ dấu câu, kí tự đặc biệt
//     str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
//     return str;
// }
// let str = 'Nguyễn Hoàng Đạt';
// const regex = /\s/gi;
// let strReplace = str.replace(regex, '').toLowerCase();
// console.log(removeVietnameseTones(strReplace));

// Tạo mật khẩu

// function getPassWord(string_length = 16) {
//     const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
//     var randomstring = '';
//     for (var i=0; i<string_length; i++) {
//         var rnum = Math.floor(Math.random() * chars.length);
//         randomstring += chars.substring(rnum,rnum+1);
//     }
//     return randomstring;
// }
// console.log(getPassWord());

// const axios = require('axios');

// axios.get('http://localhost:8002/api/v1/facebook')
//     .then(result => {
//         return result.data
//     })
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => console.log(err))

// const stringTime = '0:12';
// const arrayTime = stringTime.split(':').reverse();
// let secondResult = 0;
// arrayTime.forEach((number, index) => {
//     if (index === 0) {
//         secondResult += Number(number);
//     }
//     if (index === 1) {
//         secondResult += Number(number)*60;
//     }
//     if (index === 2) {
//         secondResult += Number(number)*60*60;
//     }
// });
// console.log(secondResult);
// console.log(Math.floor(Math.random() * (-800)) + 400);

// async function handlePromiss (a) {
//     try {
//         // let result = a/0;
//         return 'hàm thực thi thành công ' + result
//     } catch (error) {
//         return 'hàm bị lỗi ' + error
//     }
// }

// handlePromiss(43).then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// });

// const string = `<div class="content_p fs-16 content_p_al">
// <p class="noi_dung_online"> <img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-0.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-1.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-2.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-3.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-4.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-5.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-6.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-7.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-8.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-9.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-10.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-11.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-12.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-13.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-14.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-15.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-16.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-17.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-18.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-19.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-20.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-21.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-22.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-23.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-24.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-25.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-26.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-27.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-28.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-29.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-30.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-31.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-32.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-33.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-34.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-35.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-36.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-37.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-38.jpg" class="truyen-tranh" alt=""><img decoding="async" src="https://file.nhasachmienphi.com/jpg/nhasachmienphi-sieu-quay-teppi-332605-39.jpg" class="truyen-tranh" alt=""> </p>
// </div>`

// let rexgex = /<img.*?>/g;
// // var myArray = /<img.*?>/g.exec(string);
// arrImg = string.match(rexgex);
// for (let i = 0; i < arrImg.length; i++) {
//     const resultMatch = /src="(.*?)"/g.exec(arrImg[i]);
//     const urlImage = resultMatch[1];
//     const arrSplitLink = urlImage.split('.');
//     const tmpFormat = arrSplitLink[arrSplitLink.length - 1];
    
//     https.get(urlImage, (res) => {
//         res.pipe(fs.createWriteStream('./public/download/' + (i + 1) + '.' + tmpFormat));
//     });
// }

if (!fs.existsSync( './public/nguyen-hoang-dat/thu-muc-de-test/')) {
    fs.mkdirSync('./public/nguyen-hoang-dat/thu-muc-de-test/', {recursive: true});
  }