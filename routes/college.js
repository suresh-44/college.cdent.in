const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	console.log(req.params.college_name);
	res.send(req.params.college_name);
});

module.exports = router;
