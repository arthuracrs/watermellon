const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors')
const cookieParser = require('cookie-parser')

mongoose.connect('mongodb+srv://thesupremebot:123@cluster0.hjizl.mongodb.net/teste?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: true, credentials: true}))

const router = require("./routes")
app.use(router)

app.listen(3080, () => {
    console.log('running on 3080')
})
