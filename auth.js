const jwt = require("jsonwebtoken");

async function generateAccessToken(userId) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            {
                userId,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            }
        );
    });
}

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1]; // "Bearer kjhkf9s979fshjfa..."
        console.log(authHeader);
        jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.userId = token.userId;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { generateAccessToken, verifyToken };