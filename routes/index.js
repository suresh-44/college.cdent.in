/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const collegeAdmin = require("../services/college-admin");

/* GET home page. */
router.get("/", function(req, res, next) {
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
		res.render("login", {success: "Successfully created the Password"});
	} catch (e) {
		es.render("404.hbs", {"message": e.message});
	}
});

router.get("/admin/login", async (req, res) => {
	// TODO load the admin login form
	res.send("Hello for the login");
});

router.post("/admin/login", async (req, res) => {
	try {
		await collegeAdmin.login(req, res);
	} catch (e) {

	}
});

module.exports = router;
