const auth = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader !== undefined) {
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next()
    } else {
        return res.status(203).json({ success: false, error: 'No Authorization token!!!' });
    }
}

module.exports = auth