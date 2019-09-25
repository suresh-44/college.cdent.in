/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

// Todo change the collegeAdminList to proper name
const collegeAdminList = require("../services/college-admin");
const college = require("../database/models/college");
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
		await collegeAdminList.register(req, res);
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
		await collegeAdminList.checkExists(req);
		res.render("create_password", {
			title: "Create Password",
			key: process.env.RECAPCTHA_KEY,
			uniqueString: req.params.uniqueString,
		});
	} catch (e) {

	}
});

router.post("/account/create/:uniqueString", async (req, res) => {
	try {
		await collegeAdminList.setPassword(req);
		res.render("login", {role: "college_admin"});
	} catch (e) {
		res.render("create_password", {error: e.message,
			title: "Create Password",
			key: process.env.RECAPCTHA_KEY,
			uniqueString: req.params.uniqueString});
	}
});

router.get("/:college_name", async (req, res)=> {
	res.render("login", {colleg: req.params.college_name});
});

router.post(":/college_name", async (req, res) => {
	const collegeName = req.params.college_name;
	const collegeDB = college.getcollege(collegeName);
	try {
		await collegeAdminList.login(req, res, collegeDB);
	} catch (e) {
	//	Todo Work on catch function
	}
});

// TODO have to block /favicon.ico
router.get("/favicon.ico", function(req, res) {
	console.log("+++++================This is getting");
	res.sendStatus(204);
});

module.exports = router;
