const db = require("../models.js")

module.exports = (req, res) => {

    const flashMessages = []

    db.User.findOne({ username: req.params.username })
        .populate({
            path: 'posts',
            model: 'Post',
            options: {
                sort: {
                    creationDate: -1
                }
            },
            populate: [{
                path: 'comments',
                model: 'Comment',
                populate: {
                    path: 'userId'
                },
                options: {
                    sort: {
                        creationDate: -1
                    }
                }
            }, {
                path: 'userId',
                model: 'User'
            }]
        })
        .exec((error, queryUser) => {

            if (error) {
                flashMessages.push({
                    text: 'Error',
                    ok: false
                })

                return res.json({ flashMessages })
            }

            if (queryUser == null) {
                flashMessages.push({ text: 'Esse Usuario não exite', ok: false })
                return res.json({ flashMessages })
            }

            flashMessages.push({
                text: 'Listagem feita com sucesso',
                ok: true
            })
            res.json({ flashMessages: flashMessages, query: queryUser.posts })

        })

}
