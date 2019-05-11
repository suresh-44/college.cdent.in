const express = require("express");
const router = express.Router();
const register = require("../services/registration");

/* GET home page. */
router.get("/", function(req, res, next) {
	res.render("index", {title: "Express"});
});

router.post("/register", async (req, res) => {

	const rVal = {};
	try {
		await register(req.body, req.files.authLetter);
		rVal.message = "Registration successful.";
		rVal.code = 200;
	} catch (error) {
		rVal.message = error.message;
		rVal.code = 402;
	}
	res.json(rVal);
});

module.exports = router;
