const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const register = require("../services/registration");
const collegeAdmin = require("../services/college-admin");

/* GET home page. */
router.get("/", function(req, res, next) {
	res.render("index", {title: "Express"});
});

router.get("/register", (req, res) => {
	res.render("register", {title: "Register", key: process.env.RECAPCTHA_KEY});
});
//
router.post("/register", upload.single("file"), async (req, res) => {
	const rVal = {};

	try {
		await register(req, res);
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
		// TODO show the password creation dialog box.
	} catch (e) {
		// TODO show error, invalid link
	}
});

router.post("/account/create/:uniqueString", async (req, res) => {
	try {
		await collegeAdmin.setPassword(req);
		res.redirect("/admin/login");
	} catch (e) {
		// TODO show error.
	}
});

module.exports = router;
