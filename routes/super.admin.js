const express = require("express");
const router = express.Router();

const superAdmin = require("./../services/super.admin");

router.get("/", (req, res) => {
	res.render("super.admin.login", {title: "SuperAdmin"});
});

router.post("/", async (req, res) => {
	try {
		await superAdmin.login(req, res);
	} catch (e) {
		const errorMsg = e.message;
	}
});

router.get("/list/college", async (req, res) => {
	try {
		await superAdmin.checkLogin(req, res);
		let data = await superAdmin.getCollegeData();
		res.render("super.admin.dashboard", data);
	} catch (e) {

	}
});

router.get("/accept/:collegeID", async (req, res) => {
	try {
		await superAdmin.checkLogin(req, res);
		await superAdmin.acceptCollege(req.params.collegeID);
	} catch (e) {

	}
});

module.exports = router;
