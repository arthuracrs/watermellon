const db = require("../models.js")

module.exports = {
    create: (req, res) => {
        const flashMessages = []
        const userId = res.locals.user._id

        if (req.body.content.length > 280) {
            flashMessages.push({
                text: 'Seu post é muito longo',
                ok: false
            })

            return res.json({ flashMessages })
        }

        const newPost = new db.Post({
            userId: userId,
            content: req.body.content
        })

        newPost.save((error, post) => {
            db.User.findOneAndUpdate({ username: res.locals.user.username }, { $push: { posts: post._id } }, { new: true })
                .exec((error, query) => {
                    if (error) {
                        console.error(error)

                        flashMessages.push({
                            text: 'error',
                            ok: false
                        })
                        return res.json({ flashMessages })

                    }

                    flashMessages.push({
                        text: 'Postagem feita',
                        ok: true
                    })

                    return res.json({ flashMessages })
                })
        })


    }
}
