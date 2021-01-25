const { users } = require('../db/auctiondb')
const bcrypt = require('bcryptjs');

const login_auth = (req, res, next) => {
    let user = users.find((user) => user.email === req.body.email)
    if (user) {
        bcrypt.compare(req.body.password, user.password).then((result) => {
            if (result) {
                console.log(result)
                req.user = user;
                next()
            } else {
                return res.status(203).json({
                    status: false,
                    message: 'password does not matched!!!'
                });
            }
        })
    } else {
        return res.status(203).json({
            status: false,
            message: "user not found!!!"
        });
    }
}

module.exports = login_auth