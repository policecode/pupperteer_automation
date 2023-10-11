const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Đường dẫn lưu trữ tệp
      const pathFolderUpload = path.join(__base+'public/upload/');

      cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
      // Đặt tên tệp
      cb(null, file.originalname);
    }
  });
  
// Tạo middleware Multer
const upload = multer({ storage: storage });

module.exports = {upload}