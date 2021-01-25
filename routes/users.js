const express = require('express')
const userRouter = express.Router()
const { addUser, removeUser, getUser, getAllUsers, getAuthUser } = require('../modal/users')
const login_auth = require('../config/login_auth')
const bcrypt = require('bcryptjs');
const validator = require('validator');
var jwt = require('jsonwebtoken');
const auth_user = require('../config/auth_check_users')
var multer = require('multer')
var upload = multer({ dest: 'uploads/img/' })

userRouter.post('/saveImage', upload.single('imgFile'), (req, res) => {
    console.log(req.file)
    res.send(req.file)
})


// users crud operations

userRouter.get('/users', auth_user, (req, res) => {
    try {
        jwt.verify(req.token, process.env.TOKEN_KEY_TEXT, (err, data) => {
            if (err) {
                console.log('Error ', err.message)
                return res.status(203).json({
                    success: false,
                    message: err.message
                });
            }
            if (data.type === 'admin') {
                const users = getAllUsers();
                console.log(data)
                return res.status(302).json({
                    success: true,
                    message: 'Found',
                    users: users
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: 'only can access all user admin',
                    users: null
                })
            }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

userRouter.get('/users/:userid', auth_user, (req, res) => {
    try {
        jwt.verify(req.token, process.env.TOKEN_KEY_TEXT, (err, data) => {
            if (err) {
                return res.status(203).json({ success: false, message: 'unauthorized user', user: null });
            } else {
                const user = getUser(req.params.userid)
                return res.status(200).json({ success: true, message: 'success result', user: user })
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

userRouter.post('/users', async(req, res) => {
    // name, email, password, phone, createAt, status
    try {
        const user_data = await addUser({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            phone: req.body.phone,
            createAt: Date.now(),
            updatedAt: Date.now(),
            status: 1
        })
        return res.status(201).json({ success: true, message: 'successfully regsiter', user: user_data })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

userRouter.delete('/users/:userid', auth_user, (req, res) => {
    try {
        jwt.verify(req.token, process.env.TOKEN_KEY_TEXT, (err, data) => {
            if (err) {
                return res.status(203).json({ success: false, message: err.message });
            } else {
                if (data.type === 'admin') {
                    const user_delete = removeUser(req.params.userid)
                    return res.status(202).json({ success: true, message: 'deleted', user_delete: user_delete })
                } else {
                    return res.status(202).json({ success: false, message: 'deleted only admin', user_delete: null })
                }

            }
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

userRouter.put('/users/:userid', auth_user, (req, res) => {
    try {
        jwt.verify(req.token, process.env.TOKEN_KEY_TEXT, (err, data) => {
            if (err) {
                return res.status(203).json({ success: false, message: 'failed' });
            } else {
                if (data.type === 'admin') {
                    return res.status(200).json({ success: true, message: 'successfully updated!!!' })
                }
                return res.status(200).json({ success: false, message: 'only can admin updated!!!' })
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
})

userRouter.post('/login', login_auth, (req, res) => {
    try {
        let token = jwt.sign(req.user, process.env.TOKEN_KEY_TEXT, { expiresIn: '30m' }); //set jwt token
        return res.status(202).json({
            success: true,
            message: "user login successfully",
            jwtToken: token,
            tokenId: req.user.id
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
})


module.exports = userRouter