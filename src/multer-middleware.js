const multer = require("multer");
const gm = require('gm').subClass({imageMagick: true});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/svg')
        cb(null, true);
    else cb(new Error('file is not image'), false);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

const resize = (filePathImage, filePathImageResize) => {
    return new Promise((resolve, reject) => {
        gm(filePathImage)
            .resize(256, 256)
            .write(filePathImageResize, (err) => {
                if(err) reject(new Error(err.message));
                resolve()
            });
    })
};

module.exports = {
    upload,
    resize
};