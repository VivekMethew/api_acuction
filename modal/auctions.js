const { auctionData } = require('../db/auctiondb')
var uniqid = require('uniqid');

// e_date: req.body.e_date,
// e_time: req.body.e_time,
const addAuction = ({ a_type, a_name, a_price, e_date, e_time, desc, img_urls, status }) => {
    // Clean the data
    a_name = a_name.trim().toLowerCase()
    desc = desc.trim().toLowerCase()

    // GENERATE AUCTIONS ID 
    const auc_id = uniqid();

    // Store auctions
    const auction = { auc_id, a_type, a_name, a_price, e_date, e_time, desc, img_urls, status }
    auctionData.push(auction)
    return { auction }
}

const auctions = () => {
    return auctionData;
}

const auction = (auc_id) => {
    return auctionData.find((a) => a.auc_id === auc_id)
}

const removeAuction = (auc_id) => {
    const index = auctionData.findIndex(a => a.auc_id.id === auc_id)
    if (index !== -1) {
        return auctionData.splice(index, 1)[0]
    }
    if (index === -1) {
        return 'AUCTION NOT FOUND!!!'
    }
}


module.exports = {
    auctions,
    auction,
    addAuction,
    removeAuction
}