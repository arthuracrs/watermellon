const db = require("../models.js")

module.exports = (req, res) => {
    const flashMessages = []

    db.User
        .find({ followers: { $in: res.locals.user._id } })
        .distinct('_id')
        .exec((error1, query1) => {
            db.Post
                .find({ userId: { $in: query1 } })
                .populate([{
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
                }])
                .limit(10)
                .sort({ creationDate: -1 })
                .exec((error2, query2) => {

                    if (error2) {
                        flashMessages.push({
                            text: 'Error',
                            ok: false
                        })
                    }

                    flashMessages.push({
                        text: 'Listagem feita',
                        ok: true
                    })

                    return res.json({ flashMessages: flashMessages, query: query2 })
                })

        })
}