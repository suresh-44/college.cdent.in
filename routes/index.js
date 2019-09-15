/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const collegeAdmin = require("../services/college-admin");

/* GET home page. */
router.get("/", function(req, res) {
	res.render("index", {title: "Express"});
});

router.get("/register", (req, res) => {
	res.render("register", {title: "Register", key: process.env.RECAPCTHA_KEY});
});
//  POST /register for register the college
router.post("/register", upload.single("file"), async (req, res) => {
	const rVal = {};

	try {
		await collegeAdmin.register(req, res);
		rVal.message = "Registration is Done Successful";
		rVal.code = 200;
	} catch (error) {
		rVal.message = error.message;
		rVal.code = 402;
	}
	console.log(rVal);
	res.render("register", {
		response: rVal,
		title: "Register",
		key: process.env.RECAPCTHA_KEY,
	});
});

router.get("/account/create/:uniqueString", async (req, res) => {
	try {
		await collegeAdmin.checkExists(req);
		res.render("create_password", {
			title: "Create Password",
			key: process.env.RECAPCTHA_KEY,
			uniqueString: req.params.uniqueString,
		});
	} catch (e) {
		res.render("404.hbs", {title: "Not Found", message: "Account is not created"});
	}
});

router.post("/account/create/:uniqueString", async (req, res) => {
	try {
		await collegeAdmin.setPassword(req);
		res.render("login", {role: "college_admin"});
	} catch (e) {
		res.render("create_password", {error: e.message,
			title: "Create Password",
			key: process.env.RECAPCTHA_KEY,
			uniqueString: req.params.uniqueString});
	}
});

module.exports = router;
