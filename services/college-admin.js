const crypto = require("crypto");

// Database modles
const TempModel = require("../database/models/temp-model");
const AdminModel = require("../database/models/admin-model");

// Utils
const reCaptcha = require("./utils/index").reCaptcha;

exports.checkExists = async req => {
  const uniqueString = req.params.uniqueString;
  if (uniqueString === 0) {
    throw new Error("Incorrect access.");
  }
  // Checking the unique String is exists in database
  const exists = await AdminModel.exists({ uniqueString });
  if (!exists) {
    throw new Error("Entry not in database.");
  }
};

// Updating password for accepted college
exports.setPassword = async req => {
  const pwd = req.body.password;
  const rpwd = req.body.r_password;

  // recaptcha to prevent bots.
  const response = reCaptcha(req, res);

	// Checking the response
  if (!response.data.success) {
    throw new Error(response.data["error-codes"]);
  } else {
    if (pwd !== rpwd) {
      throw new Error("Passwords doesn't match");
    }

    const uniqueString = req.params.uniqueString;
    try {
      await AdminModel.checkExists(req);
    } catch (e) {
      throw new Error(e);
    }

    const pwdHash = crypto
      .createHash("sha512")
      .update(pwd, "utf8")
      .digest("hex");

    const query = { uniqueString };
    const update = {
      password: pwdHash,
      accountValid: true,
      uniqueString: 1
    };
    await AdminModel.findOneAndUpdate(query, update);
  }
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const pwd = req.body.password;
  const inputHash = crypto
    .createHash("sha512")
    .update(pwd, "utf-8")
    .digest("hex");

  // eslint-disable-next-line  no-unused-vars
  const query = {email, password: inputHash};
  // const data = await AdminModel.findOne(query);
  // TODO check if password is correct
  // if correct check if payment is done.
  // if payment is done redirect to /admin/dashboard
  // else redirect to /admin/pay
};

exports.register = async (req, res) => {
  let tempModel;

  const response = reCaptcha(req, res);

  if (!response.data.success) {
    throw new Error(response.data["error-codes"]);
  } else {
    const temp = await TempModel.find({
      email: req.body.email
    });

    if (temp.length > 0) {
      throw new Error("Email address already exists");
    } else {
      tempModel = new TempModel({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        phone_no: req.body.phone_no,
        collegeName: req.body.clgName,
        collegeAddr: req.body.clgAddr,
        collegeWebsite: req.body.clgUrl,
        authLetterFile: req.file.location
      });
      return await tempModel.save();
    }
  }
};
