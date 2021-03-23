const jwt = require("jsonwebtoken")
const db = require("../models.js")

module.exports = (req, res, next) => {
    const flashMessages = []
    const token = req.cookies.token

    flashMessages.push({
        text: 'No token provided',
        ok: false
    })

    if (!token) return res.json({ flashMessages })

    jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {

        if (error) {
            flashMessages.push({
                text: error.message,
                ok: false
            })
            return res.json({ flashMessages })
        }

        db.User.findById(decoded.userId, (error, query) => {
            if (error) console.error(error)

            if (query == null) {
                flashMessages.push({
                    text: 'User does not exit',
                    ok: false
                })
                return res.json({ flashMessages })
            }
            res.locals.user = query
            next()
        })


    })

}

