const { admin, users, myBid, auctionData } = require('../db/auctiondb')
var uniqid = require('uniqid')

const addUser = ({ name, email, password, phone, createAt, updatedAt, status }) => {
    // Clean the data
    name = name.trim().toLowerCase()
    email = email.trim().toLowerCase()

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.email === email
    })

    // Validate email
    if (existingUser) {
        return {
            error: 'user allready exists'
        }
    }

    // Store user
    const id = uniqid();
    const type = 'user';
    const user = { id, type, name, email, password, phone, createAt, updatedAt, status }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
    if (index === -1) {
        return 'USER NOT FOUND!!!'
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}


const getAllUsers = () => {
    return users.find((user) => user.type !== 'admin')
}



module.exports = {
    addUser,
    removeUser,
    getUser,
    getAllUsers,
}