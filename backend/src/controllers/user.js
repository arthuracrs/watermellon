const db = require("../models.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports = {
    create: (req, res) => {
        const flashMessages = []

        db.User.find({ username: req.body.username })
            .then(query => {

                if (query.length != 0) {
                    flashMessages.push({ text: 'Usuario já existe', ok: false })
                    return res.json({ flashMessages })
                }

                bcrypt.hash(req.body.password, 10)
                    .then(result => {
                        if (req.body.password != req.body.confirmPassword) flashMessages.push({ text: 'As senhas estão diferentes', ok: false })
                        if (req.body.username.length > 30) flashMessages.push({ text: 'Seu username é muito longo', ok: false })
                        if (req.body.password.length > 40) flashMessages.push({ text: 'Sua senha é muito longa', ok: false })
                        if (req.body.password.length < 8) flashMessages.push({ text: 'Sua senha deve ter pelo menos 8 caracteres', ok: false })

                        if (flashMessages.length > 0) return res.json({ flashMessages })

                        const newUser = new db.User({
                            username: req.body.username,
                            password: result
                        })

                        newUser.save((error, model) => {
                            if (error) {
                                console.error(error)
                                return res.send(error)
                            }

                            const token = jwt.sign({ userId: model._id }, process.env.JWT_SECRET, { expiresIn: 30000 })

                            res.cookie('token', token, {
                                httpOnly: true
                            })

                            flashMessages.push({ text: 'Inscrição feita com sucesso', ok: true })
                            res.json({ flashMessages })
                        })
                    })
                    .catch(error => {
                        console.error(error)

                        flashMessages.push({ text: 'Erro', ok: false })
                        res.json({ flashMessages })
                    })
            })
    },
    read: (req, res) => {
        const flashMessages = []

        db.User.findOne({ username: req.params.username }, (error, query) => {
            if (error) {
                console.error(error)

                flashMessages.push({ text: 'Erro', ok: false })
                res.json({ flashMessages })
            }

            if (query == null) {
                flashMessages.push({ text: 'Usuario não encontrado', ok: false })
                return res.json({ flashMessages })
            }

            flashMessages.push({
                text: "Pesquisa feita com sucesso",
                ok: true
            })

            res.json({
                flashMessages: flashMessages,
                content: query,
                user: res.locals.user
            })
        })
    },
    update: (req, res) => {
        const flashMessages = []

        if (req.body.bio && req.body.bio.length > 100) {
            flashMessages.push({
                text: 'Sua bio é muito longa',
                ok: false
            })

            return res.json({ flashMessages })
        }

        db.User.updateOne({ username: res.locals.user.username }, req.body, { useFindAndModify: false, upsert: true },
            (error, query) => {
                if (error) {
                    console.error(error)

                    flashMessages.push({ text: 'Erro', ok: false })
                    return res.json({ flashMessages })
                }

                flashMessages.push({
                    text: "Update feito",
                    ok: true
                })

                return res.json({ flashMessages })
            })

    }
}
