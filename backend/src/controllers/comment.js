const db = require("../models.js")

const create = (req, res) => {
    const flashMessages = []

    if (req.body.content.length > 100) {
        flashMessages.push({
            text: 'O comentario é muito longo',
            ok: false
        })
        return res.json({
            flashMessages: flashMessages
        })
    }

    const newComment = new db.Comment({
        userId: res.locals.user._id,
        content: req.body.content
    })

    newComment.save((error, model) => {
        if (error) {
            console.error(error)
            return res.send(error)
        }

        db.Post.findOneAndUpdate({ _id: req.params.postId }, { $push: { comments: model._id } }, { new: true })
            .populate('comments')
            .then(query => {
                flashMessages.push({
                    text: 'Comentario feito com sucesso',
                    ok: true
                })
                res.json({
                    flashMessages: flashMessages,
                    content: query
                })
            })
            .catch(error => {
                console.error(error)
                flashMessages.push({
                    text: 'error',
                    ok: false
                })
                res.json({ flashMessages })
            })
    })

}

module.exports = { create }