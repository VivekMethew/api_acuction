const { myBids } = require('../db/auctiondb')
var uniqid = require('uniqid');

const addBids = ({ user_id, a_id, a_name, a_price, act_date_time, status }) => {
    // Clean the data
    // a_name = a_name.trim().toLowerCase()

    // GENERATE AUCTIONS ID 
    const bid_id = uniqid();

    // Store auctions
    const bid = { bid_id, user_id, a_id, a_name, a_price, act_date_time, status }
    myBids.push(bid)
    return { bid }
}

// All Bids
const bids = () => {
    if (myBids.length === 0) {
        return 0;
    } else {
        return myBids;
    }
}

// Get Single Bids
const bid = (bid_id) => {
    return myBids.find((b) => b.bid_id === bid_id)
}

// Remove Bids
const removeBid = (bid_id) => {
    const index = myBids.findIndex(b => b.bid_id === bid_id)
    if (index !== -1) {
        return myBids.splice(index, 1)[0]
    }
    if (index === -1) {
        return 'BID NOT FOUND!!!'
    }
}

const findUserBids = (userid) => {
    return myBids.filter(b => b.user_id === userid)
}


module.exports = {
    bids,
    bid,
    addBids,
    removeBid,
    findUserBids
}