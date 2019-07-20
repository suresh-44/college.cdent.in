const createError = require("http-errors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
<<<<<<< HEAD
const hbs = require('hbs')

// const fileUpload = require("express-fileupload");
=======
const hbs = require("hbs");
const methodOveride = require("method-override");
>>>>>>> fef4bd1be7cc14279eb699f95d5b5c419f35feb8

require("dotenv").config();

const indexRouter = require("./routes/index");
const superAdminRouter = require("./routes/super.admin");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
<<<<<<< HEAD
hbs.registerPartials(__dirname + '/views/partials');
=======
hbs.registerHelper("each", (items, options) => {
	let out = "";
	for (let i = 0, l = items.length; i < l; i++) {
		out += options.fn(items[i]);
	}
	return out;
});
hbs.registerPartials(__dirname + "/views/partials");

// Method Override Middleware
app.use(methodOveride("_method"));
>>>>>>> fef4bd1be7cc14279eb699f95d5b5c419f35feb8

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// session setup
const sessionOptions = {
	store: new FileStore({}),
	secret: "dfsdfsd", //process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false,
	cookie: {secure: false},
};


if (process.env.NODE_ENV === "production") {
	app.set("trust proxy", 1);
	sessionOptions.cookie.secure = true; // for https connections
}

app.use(session(sessionOptions));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/super/admin", superAdminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
