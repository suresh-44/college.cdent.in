const multer = require("multer");
const path = require("path");

const dest = path.join(__dirname + "../../uploads/");

// const storagePdf = multer.diskStorage({
// 	destination: dest,
// 	filename: (req, file, callback) => {
// 		callback(null, Date.now() + ".pdf");
// 	},
// });

exports.storageCsv = multer({
	storage : multer.diskStorage({
		destination: dest,
		filename: (req, file, callback) => {
			callback(null, file.originalname);
		},
	})
} )

exports.storagePdf = multer({storage: multer.diskStorage({
	destination: dest,
	filename: (req, file, callback) => {
		callback(null, Date.now() + ".pdf");
	},
})});
