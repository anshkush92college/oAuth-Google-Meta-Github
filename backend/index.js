// Test -------------------------- Importing the Packages ---------------------------------
require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/googleAuth");
const db = require('./config/db');
const cors = require("cors");

// Session is stored on the server and the cookie is stored on the browser
const cookieSession = require("cookie-session");

// Passport JS is an middleware 
const passport = require("passport");

const app = express();
const PORT = 8000 || process.env.PORT;

// Test ------------------------ Middlewares (Use this code on every route) ----------------
// ORDER of the middlewares matters, so don't forget that

// Converting the JSON data received by client into the JS object
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Using the auth Routes 
app.use("/auth", authRoutes);

// Adding the session, automatically logs out if the session has expired
app.use(cookieSession({
    name: "session",
    // The key which will be used to encrypt the cookie that we are gonna set
    keys: [process.env.SECRET],
    // The time for which the cookie will remain in the browser storage
    maxAge: 24 * 60 * 60 * 1000,
}));

// Initializing the passport.js
app.use(passport.initialize());

// Using the session that we have created
app.use(passport.session());

// Using cors, so that we can communicate with our client which is on other server
app.use(cors({
    origin: "http://localhost:3000/",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
}))

// Test -------------------------- The Server Side Code ----------------------------------
app.get("/", (req, res) => { res.send("Hello World") });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// Sending the error middleware at last, so that we can get the error  -----> Best Practice
app.use((err, req, res, next) => { console.log(err) });

// Test -------------------------- Exporting the server side code ------------------------