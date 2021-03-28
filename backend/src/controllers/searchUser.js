const db = require("../models.js")

module.exports = (req, res) => {
    const flashMessages = []

    db.User.find({ username: { $regex: req.params.username, $ne: res.locals.user.username } }, 
        'username avatar'
    )
        .limit(5)
        .exec((error, query) => {
            
            if (error) {
                console.error(error)

                flashMessages.push({ text: 'Erro', ok: false })
                res.json({ flashMessages })
            }

            flashMessages.push({
                text: "Pesquisa feita com sucesso",
                ok: true
            })

            if (query.length == 0) query.push(0)

            return res.json({
                flashMessages: flashMessages,
                query
            })
        })
}