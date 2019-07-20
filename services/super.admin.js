const crypto = require("crypto");

const TempModel = require("../database/models/temp-model");
const hash = crypto.createHash("sha512");

const superAdminServices = {
  login: async (req, res) => {
    const inputPwdHash = crypto
      .createHash("sha512")
      .update(req.body.password, "utf8")
      .digest("hex");

    if (process.env.SUPER_ADMIN_PWD === inputPwdHash) {
      // Password is correct Login user now

      const browser = req.headers["user-agent"];
      const userIP =
        req.header("x-forwarded-for") ||
        req.connection.remoteAddress + inputPwdHash;
      const str = browser + userIP;
      const secret = crypto.createHash("sha512").update(str, "utf8");
      req.session.login = true;
      req.session.superAdmin = true;
      req.session.user = req.body.username;
      req.session.secret = secret.digest("hex");
      res.redirect("admin/dashboard/");
    } else {
      throw new Error("Incorrect Password or username");
    }
  },
  checkLogin: async (req, res) => {
    const browser = req.headers["user-agent"];
    const userIP =
      req.header("x-forwarded-for") || req.connection.remoteAddress;
    const str = browser + userIP + process.env.SUPER_ADMIN_PWD;
    const loginHash = hash.update(str, "utf8").digest("hex");
    if (
      !(
        req.session.login &&
        req.session.superAdmin &&
        loginHash === req.session.secret
      )
    ) {
      res.redirect("/super/admin");
    }
  },
  logout: async req => {},
  getCollegeData: async () => {
    return TempModel.find();
  },
  acceptCollege: async collegeID => {}
};

module.exports = superAdminServices;
