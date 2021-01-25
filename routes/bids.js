const express = require('express')
const bidsRouter = express.Router()
const { bids, bid, addBids, removeBid, findUserBids } = require('../modal/bids')
const bcrypt = require('bcryptjs');
const validator = require('validator');
var jwt = require('jsonwebtoken');
const auth_user = require('../config/auth_check_users')

// add bids routes

bidsRouter.get('/bids', auth_user, (req, res) => {
    try {
        jwt.verify(req.token, process.env.TOKEN_KEY_TEXT, (err, data) => {
            if (err) {
                return res.status(203).json({
                    success: false,
                    message: err.message
                });
            } else {
                const all_bids = bids();
                return res.status(302).json({
                    success: true,
                    message: 'Found',
                    bids: all_bids
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
})

bidsRouter.get('/bids/:bid_id', auth_user, (req, res) => {
    try {
        jwt.verify(req.token, process.env.TOKEN_KEY_TEXT, (err, data) => {
            if (err) {
                return res.status(203).json({ success: false, message: err.message });
            } else {
                const my_bid = bid(req.params.bid_id);
                return res.status(302).json({ success: true, message: 'Found', my_bid: my_bid })
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: err.message
        });
    }
})

bidsRouter.post('/bids', auth_user, (req, res) => {
    try {
        jwt.verify(req.token, process.env.TOKEN_KEY_TEXT, (err, data) => {
            if (err) {
                return res.status(403).json({ success: false, message: err.message });
            } else {
                if (data.type === 'user') {
                    const bidAdd = addBids({
                        user_id: data.id,
                        a_id: req.body.auc_id,
                        a_name: req.body.a_name,
                        a_price: req.body.a_price,
                        act_date_time: new Date(),
                        status: 1
                    })
                    return res.status(201).json({ success: true, message: 'success', bidAdd: bidAdd })
                } else {
                    return res.status(203).json({ success: false, message: 'failed', bidAdd: undefined })
                }
            }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
})

bidsRouter.delete('/bids/:bid_id', auth_user, (req, res) => {
    try {
        jwt.verify(req.token, process.env.TOKEN_KEY_TEXT, (err, data) => {
            if (err) {
                return res.status(203).json({ success: false, message: err.message });
            } else {
                const bid_delete = removeBid(req.params.bid_id)
                return res.status(302).json({ success: true, message: 'Deleted', bid_delete: bid_delete })
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

bidsRouter.get('/user_bids/:userid', auth_user, (req, res) => {
    try {
        jwt.verify(req.token, process.env.TOKEN_KEY_TEXT, (err, data) => {
            if (err) {
                return res.status(203).json({ success: false, message: err.message });
            } else {
                const user_bids = findUserBids(req.params.userid)
                return res.status(302).json({
                    success: true,
                    message: 'Found',
                    bids: user_bids
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

module.exports = bidsRouter