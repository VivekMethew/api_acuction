const express = require('express')
const auctionRouter = express.Router()
const { auctions, auction, addAuction, removeAuction } = require('../modal/auctions')
const bcrypt = require('bcryptjs');
const validator = require('validator');
var jwt = require('jsonwebtoken');
const auth_user = require('../config/auth_check_users')
var multer = require('multer')


// Add Aunction Routes
auctionRouter.get('/auctions', (req, res) => {
    try {
        const all_auctions = auctions();
        if (all_auctions.length > 0) {
            return res.status(302).json({
                success: true,
                message: 'Found',
                all_auctions: all_auctions,
            })
        } else {
            return res.status(404).json({
                success: false,
                message: 'Not Found',
                all_auctions: null,
            })
        }

    } catch {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
})

auctionRouter.get('/auctions/:auc_id', (req, res) => {
    try {
        const aucs = auction(req.params.auc_id);
        if (aucs === undefined) {
            return res.status(404).json({ success: false, message: 'Not Found', aucs: null })
        } else {
            return res.status(302).json({ success: true, message: 'Found', aucs: aucs })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
})


auctionRouter.post('/auctions', auth_user, (req, res) => {
    try {
        jwt.verify(req.token, process.env.TOKEN_KEY_TEXT, (err, data) => {
            if (err) {
                return res.status(203).json({ success: false, message: err.message });
            } else {
                if (data.type === 'admin') {
                    const auction = addAuction({
                        a_type: req.body.a_type,
                        a_name: req.body.a_name,
                        a_price: req.body.a_price,
                        e_date: req.body.e_date,
                        e_time: req.body.e_time,
                        img_urls: req.body.img_urls,
                        desc: req.body.desc,
                        status: 1
                    })
                    return res.status(201).json({ success: true, message: 'successfully add auctions', auction: auction })
                }
                return res.status(203).json({ success: false, message: 'only can add admin add auctions', auction: undefined })
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
})

auctionRouter.delete('/auctions/:auc_id', auth_user, (req, res) => {
    try {
        const auction_delete = removeAuction(req.params.auc_id)
        return res.status(200).json({ success: true, auction_delete: auction_delete })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

auctionRouter.put('/auctions/:auc_id', auth_user, (req, res) => {
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


module.exports = auctionRouter