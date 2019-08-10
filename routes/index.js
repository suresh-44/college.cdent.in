const express = require("express");
const csv = require('fast-csv');
const fs = require('fs');

const upload= require("../utils/multer");


// const csvfile = __dirname+'/../playground/test.csv'
// fs.createReadStream(csvfile)
// 	.pipe(csv.parse({headers: true}))
// 	.on('data', row => console.log(row))

const router = express.Router();

const register = require("../services/registration");

/* GET home page. */
router.get("/", (req, res, next) => {
	res.render("index", {title: "Express"});
});

router.post('/',upload.storageCsv.single("csv"), (req, res) => {

	// console.log(req.file);
	// res.send(req.file);
	fs.createReadStream(req.file.path)
		.pipe(csv.parse(	{headers: true}))
		.on('data', row => console.log(row))
})

router.get("/register", (req, res) => {
	res.render("register", {title: "Register"});
});

router.post("/register", async (req, res) => {
	const rVal = {};

	try {
		await register(req, res);
		rVal.message = "Registration successful.";
		rVal.code = 200;
	} catch (error) {
		rVal.message = error.message;
		rVal.code = 402;
	}
	res.json(rVal);
});

router.get("");

module.exports = router;
