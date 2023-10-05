const RandomString = require('./app/util/randomString');

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

const string = `<div class="reading-detail box_doc">
<div id="page_1" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 1" data-index="1" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUftYEQ8XJDG93i5w+zD81eXg+XO+URgft0h08oLSZ3uPQ==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUftYEQ8XJDG93i5w+zD81eXg+XO+URgft0h08oLSZ3uPQ=="></div><div id="page_2" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 2" data-index="2" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUcxauUCDNvb8NGEF9Xm0cOqYSVbrPrYROrMSPxqszgkrw==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUcxauUCDNvb8NGEF9Xm0cOqYSVbrPrYROrMSPxqszgkrw=="></div><div id="page_3" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 3" data-index="3" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUdQHKZxnMWaqChp6UvSJgxRUVuZiu/dycEHKMDjnCpDZg==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUdQHKZxnMWaqChp6UvSJgxRUVuZiu/dycEHKMDjnCpDZg=="></div><div id="page_4" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 4" data-index="4" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUeRpYQBH5X3O31Lrjou2HzJwx3Qg5IIlkRvhX/zUM73QA==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUeRpYQBH5X3O31Lrjou2HzJwx3Qg5IIlkRvhX/zUM73QA=="></div><div id="page_5" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 5" data-index="5" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUfYpUgJGkOud86H4CY/5HnPfoLt5yMz4mcRK7HFFS7LNw==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUfYpUgJGkOud86H4CY/5HnPfoLt5yMz4mcRK7HFFS7LNw=="></div><div id="page_6" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 6" data-index="6" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUcMbWIa1j3hv4ZMHb/yLJX+5DgVxeAFE0meiOTRE5ZKoA==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUcMbWIa1j3hv4ZMHb/yLJX+5DgVxeAFE0meiOTRE5ZKoA=="></div><div id="page_7" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 7" data-index="7" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUe7dWEyfY39i3Ey6a62epr/JS0nS8idD+73Av5K1mI+QA==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUe7dWEyfY39i3Ey6a62epr/JS0nS8idD+73Av5K1mI+QA=="></div><div id="page_8" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 8" data-index="8" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUfk/HgxJhvPoXEACt7E0+CE3fgn25NP4vYT145kCB9xwg==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUfk/HgxJhvPoXEACt7E0+CE3fgn25NP4vYT145kCB9xwg=="></div><div id="page_9" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 9" data-index="9" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUemnk5zusStRztXfRlVgApr9n9UkcneKxh5KKJbxG07OQ==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUemnk5zusStRztXfRlVgApr9n9UkcneKxh5KKJbxG07OQ=="></div><div id="page_10" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 10" data-index="10" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUdIyglowVPkBX0fSwb0Ao1YSjHMnuVfozTw43+PUSHYSQ==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUdIyglowVPkBX0fSwb0Ao1YSjHMnuVfozTw43+PUSHYSQ=="></div><div id="page_11" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 11" data-index="11" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUcNRaNiP1iWoQojdc0z0j0DLD0KnMQIpeD4WGrNkmab5w==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUcNRaNiP1iWoQojdc0z0j0DLD0KnMQIpeD4WGrNkmab5w=="></div><div id="page_12" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 12" data-index="12" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUfvLVL5baCIR9QwbfU3Qx7HjSjcThJwD072ZCDOp000bA==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUfvLVL5baCIR9QwbfU3Qx7HjSjcThJwD072ZCDOp000bA=="></div><div id="page_13" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 13" data-index="13" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUeCBLhbjS0XBXiK98e8ihznIz7det9woxIufqW0+cejqQ==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUeCBLhbjS0XBXiK98e8ihznIz7det9woxIufqW0+cejqQ=="></div><div id="page_14" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 14" data-index="14" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUcybJIyaaWrBHU6HZox9eNsIxYn92jaRpghdiOodPzINw==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUcybJIyaaWrBHU6HZox9eNsIxYn92jaRpghdiOodPzINw=="></div><div id="page_15" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 15" data-index="15" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUe59wqjNDqwPccfNBxxneYHHH0vEteS8hXzwFUKwWU1Cw==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUe59wqjNDqwPccfNBxxneYHHH0vEteS8hXzwFUKwWU1Cw=="></div><div id="page_16" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 16" data-index="16" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUcVSJvGuyvq6D7d27mpupIrIilE8OT4Q97mwt/YZzXgdg==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUcVSJvGuyvq6D7d27mpupIrIilE8OT4Q97mwt/YZzXgdg=="></div><div id="page_17" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 17" data-index="17" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUclgy8qEQ/Pl4Y8CCcnXqABcqWryQlZFOp0CDZZgEV4/w==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUclgy8qEQ/Pl4Y8CCcnXqABcqWryQlZFOp0CDZZgEV4/w=="></div><div id="page_18" class="page-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 18" data-index="18" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUdtTGoGG7qTzflLw/P0ThFtyqfJ2N0o660YHf0AUVv4uw==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUdtTGoGG7qTzflLw/P0ThFtyqfJ2N0o660YHf0AUVv4uw=="></div><div id="page_19" class="page-chapter lazy-module" data-type="end-chapter"><img alt="Sotodura Danshi No Shimizu-Kun chap 1 - Trang 19" data-index="19" src="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUfauFpUHcbOHuAahrG6ZTwCztGfrJqquCe9nHjmAkMwsQ==" data-original="//p2.ntcdntempv26.com/content/image.jpg?data=lYQzNlIkekgNptSkjz69cIanZRijc3GwqpWMNf4dSUfauFpUHcbOHuAahrG6ZTwCztGfrJqquCe9nHjmAkMwsQ=="></div>
</div>`
var myArray = /<img.*?>/g.exec(string);
console.log(myArray);