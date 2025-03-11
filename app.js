require("dotenv").config();
const express = require("express");
const app = express();

// body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./config/passport");

// routes
const authRouter = require("./routers/authRouter");
app.use("/api/auth", authRouter);


app.listen(3000, () => console.log("listening to port 3000"));
