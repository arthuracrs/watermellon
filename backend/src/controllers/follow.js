const db = require("../models.js")

const create = (req, res) => {
    const flashMessages = []

    // o que vai ser seguido
    db.User.findOne({ username: req.params.username }, (error, followQuery) => {

        if (error) {
            console.error(error)

            flashMessages.push({ text: 'Error', ok: false })
            return res.json({ flashMessages })
        }

        if (followQuery == null) {
            flashMessages.push({
                text: 'O usuario ' + req.params.follow + ' não existe',
                ok: false
            })

            return res.json({ flashMessages })
        }

        // ser seguido
        db.User.updateOne({ username: followQuery.username, followers: { $ne: res.locals.user._id } }, { $push: { followers: res.locals.user._id } }, (error, query) => {
            if (error) {
                console.error(error)

                flashMessages.push({ text: 'Error', ok: false })
                return res.json({ flashMessages })
            }
        })
        // o que seguiu
        db.User.updateOne({ username: res.locals.user.username, following: { $ne: followQuery._id } }, { $push: { following: followQuery._id } },
            (error, query) => {
                if (error) {
                    console.error(error)

                    flashMessages.push({ text: 'Error', ok: false })
                    return res.json({ flashMessages })
                }
            })

        flashMessages.push({
            text: "Follow feito",
            ok: true
        })

        return res.json({ flashMessages })
    })

}

const destroy = (req, res) => {
    const flashMessages = []

    db.User.findOne({ username: req.params.username }, (error, unFollowQuery) => {

        if (error) {
            console.error(error)

            flashMessages.push({ text: 'Erro', ok: false })
            return res.json({ flashMessages })
        }

        if (unFollowQuery == null) {
            flashMessages.push({
                text: 'O usuario ' + req.params.follow + ' não existe',
                ok: false
            })

            return res.json({ flashMessages })
        }

        db.User.updateOne({ username: unFollowQuery.username }, { $pull: { followers: res.locals.user._id } }, (error, query) => {
            if (error) {
                console.error(error)

                flashMessages.push({ text: 'Erro', ok: false })
                return res.json({ flashMessages })
            }
        })

        db.User.updateOne({ username: res.locals.user.username }, { $pull: { following: unFollowQuery._id } },
            (error, query) => {
                if (error) {
                    console.error(error)

                    flashMessages.push({ text: 'Erro', ok: false })
                    return res.json({ flashMessages })
                }
            })

        flashMessages.push({
            text: "Unfollow feito",
            ok: true
        })

        return res.json({ flashMessages })
    })
}

module.exports = { create, destroy}
