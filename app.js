const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("./db");
const { generateAccessToken, verifyToken } = require("./auth")
const app = express();
require("dotenv").config();

console.log(process.env.JWT_SECRET);
app.use(express.json());

async function verifyUser(req, res, next) {
    const authHeader = req.headers.authorization;
    const base64 = authHeader.split(" ")[1];
    const usernamePassword = String(Buffer.from(base64, "base64"));
    const [username, password] = usernamePassword.split(":");
    const userRecord = await User.findOne({
        where: {
            username,
        },
    });
    if (!userRecord) {
        return res.sendStatus(404);
    }
    const passwordIsCorrect = await bcrypt.compare(
        password,
        userRecord.passwordHash
    );
    if (passwordIsCorrect) {
        next();
    } else {
        return res.sendStatus(403);
    }
}

app.post("/login", verifyUser, async (req, res) => {
    const authHeader = req.headers.authorization;
    const base64 = authHeader.split(" ")[1];
    const usernamePassword = String(Buffer.from(base64, "base64"));
    const [username, password] = usernamePassword.split(":");
    result = await generateAccessToken(username)
    console.log(result)
    res.send(result)
});

app.post("/users", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password)
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash });
    res.sendStatus(201);
});

app.get("/greeting", verifyToken,  (req, res) => {
    res.send("Hello " + req.userId)
    console.log( req.userId)
});

module.exports = app;
