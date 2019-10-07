/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

// Todo change the collegeAdminList to proper name
const collegeAdminList = require("../services/college-admin");
const college = require("../database/models/college");
/* GET home page. */
router.get("/", function(req, res) {
	res.render("login", {title: "Express", layout: false});
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
		res.render("404.hbs", {message: e.message});
	}
});

router.post("/account/create/:uniqueString", async (req, res) => {
	try {
		await collegeAdminList.setPassword(req, res);
		res.render("login", {message: "successfully created the password"});
	} catch (e) {
		res.render("create_password", {error: e.message,
			title: "Create Password",
			key: process.env.RECAPCTHA_KEY,
			uniqueString: req.params.uniqueString});
	}
});

// College dashboard starts here
router.get("/:college_name", async (req, res)=> {
	try {
		await college.getcollege(req.params.college_name);
		res.render("login", {college: req.params.college_name});
	} catch (e) {
		res.render("404", {message: e.message});
	}
});

router.post("/:college_name", async (req, res) => {
	const collegeName = req.params.college_name;

	try {
		const collegeDB = await college.getcollege(collegeName);
		await collegeAdminList.login(req, res, collegeDB);
		res.send({msg: "Your an admin"});
	} catch (e) {
		res.status(401).send({error: e.message});
	//	Todo Work on catch function
	}
});

module.exports = router;
