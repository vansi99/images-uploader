const express = require("express");
const bodyParser = require("body-parser");
const multerMiddleware = require("./multer-middleware");
const morgan = require("morgan");
const hostname = process.env.HOSTNAME;
const fs = require("fs");

const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('combined'));
app.use("/images",express.static('images'));

app.post("/", multerMiddleware.upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("file is missing")
        }
        const filePathImage = `./images/${req.file.filename}`;
        const url ='https://' + hostname + filePathImage.slice(1,filePathImage.length);
        await res.json({
            success: true,
            data: {url}
        })
    } catch (err) {
        await res.json({
            success: false,
            reason: err.message
        })
    }
});

app.listen(port, () => {
    console.log("server images-uploader is running on port: ", port);
});

module.exports = app;