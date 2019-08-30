const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

aws.config.update({
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	region: "ap-south-1",
});
const s3 = new aws.S3();

const multerS3Config = multerS3({
	s3,
	bucket: process.env.AWS_BUCKET_NAME,
	key: function(req, file, cb) {
		// console.log(file);
		cb(null, new Date().getTime().toString() + ".pdf");
	},
});

module.exports = multer({
	storage: multerS3Config,
});
