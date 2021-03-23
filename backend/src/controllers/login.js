const db = require("../models.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports = (req, res) => {
    const flashMessages = []

    db.User.findOne({ username: req.body.username }).select('+password')
        .then(query => {
            if (query == null) {
                flashMessages.push({ text: 'Esse Usuario não exite', ok: false })
                return res.json({ flashMessages })
            }

            bcrypt.compare(req.body.password, query.password)
                .then(x => {
                    if (!x) {
                        flashMessages.push({ text: 'Senha incorreta', ok: false })
                        return res.json({ flashMessages })
                    }
                    const userId = query._id

                    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: 30000 })
                    res.cookie('token', token, {
                        httpOnly: true
                    })
                    flashMessages.push({
                        text: 'Login feito com sucesso',
                        ok: true
                    })
                    res.json({ flashMessages })

                })
                .catch(error => {
                    console.error(error)
                    res.json({ text: 'erro', ok: false })
                })
        })
        .catch(error => {
            console.error(error)
            res.send(error)
        })
}
