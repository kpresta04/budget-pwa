const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const mongojs = require("mongojs");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
	process.env.MONGODB_URI ||
		"mongodb://user11:user11@ds235947.mlab.com:35947/heroku_m8pntnf4",
	{
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	}
);

const databaseUrl = process.env.MONGODB_URI || "budget";
const collections = ["budget"];
const db = mongojs(databaseUrl, collections);

db.on("error", (error) => {
	console.log("Error: ", error);
});

// routes here

app.use(require("./routes/api.js"));

app.listen(PORT, () => {
	console.log(`App running on port ${PORT}!`);
});
