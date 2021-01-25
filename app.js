require('dotenv').config()
const express = require('express')
const app = express()
const userRouter = require('./routes/users')
const auctionRouter = require('./routes/auctions')
const bidRouter = require('./routes/bids')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const port = process.env.PORT || 5000


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,token,Accept, Authorization')
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        return res.status(200).json({})
    }
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
});
app.use(morgan('dev'))

app.use('/api', userRouter)
app.use('/api', auctionRouter)
app.use('/api', bidRouter)

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})



app.listen(port, () => {
    console.log('Server on Running', port)
})