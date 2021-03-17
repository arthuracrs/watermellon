const express = require('express')
const db = require("./models.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config()

const router = express.Router()

const autenticate = (req, res, next) => {
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

            res.locals.username = query.username
            res.locals.userId = decoded.userId
            next()
        })


    })

}

router.post('/auth', autenticate, (req, res) => {
    const flashMessages = []

    flashMessages.push({
        text: 'Voce está autenticado',
        ok: true
    })

    res.json({ flashMessages: flashMessages, username: res.locals.username })
})

router.get('/', (req, res) => {

    res.send('working')
})

router.post('/logout', (req, res) => {
    const flashMessages = []

    flashMessages.push({
        text: 'Voce está autenticado',
        ok: true
    })

    res.cookie('token', '', {
        httpOnly: true
    })

    res.send('working')
})

// login
router.post('/login', async(req, res) => {
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

})

// create user
router.post('/user', async(req, res) => {
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
})

// list users
router.get('/users', autenticate, (req, res) => {
    const flashMessages = []

    db.User.find({}, (error, query) => {
        if (error) {
            console.error(error)

            flashMessages.push({ text: 'Erro', ok: false })
            return res.json({ flashMessages })
        }

        flashMessages.push({
            text: "Listagem feita",
            ok: true
        })

        res.json({
            flashMessages: flashMessages,
            content: query
        })
    })
})
// search user
router.get('/user/:username', autenticate, (req, res) => {
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
            content: query
        })
    })
})

// create post
router.post('/post', autenticate, (req, res) => {
    const flashMessages = []
    const userId = res.locals.userId

    if (req.body.content.length > 280) {
        flashMessages.push({
            text: 'Seu post é muito longo',
            ok: false
        })

        return res.json({ flashMessages })
    }

    db.User.findById(userId)
        .then(query => {


            if (query == null) {
                flashMessages.push({
                    text: 'User does not exists',
                    ok: false
                })
                return res.json({ flashMessages })
            }

            const newPost = new db.Post({
                userId: userId,
                content: req.body.content
            })

            newPost.save((error, model) => {
                if (error) {
                    console.error(error)
                    return res.send(error)
                }
                flashMessages.push({
                    text: 'Post criado com sucesso',
                    ok: true
                })
                res.json({ model, flashMessages })
            })
        })
        .catch(error => {
            console.error(error)
            return res.send(error)
        })
})

// get post by id
router.get('/post/:postId', autenticate, (req, res) => {
    db.Post.find({ _id: req.params.postId }).populate('userId comments')
        .then(query => {
            res.send(query)
        })
        .catch(error => {
            console.error(error)
            return res.send(error)
        })
})

// list user's posts
router.get('/user/:username/post', autenticate, (req, res) => {

    const flashMessages = []

    db.User.findOne({ username: req.params.username })
        .then(queryUser => {

            if (queryUser == null) {
                flashMessages.push({ text: 'Esse Usuario não exite', ok: false })
                return res.json({ flashMessages })
            }

            db.Post.find({ userId: queryUser._id })
                .sort({
                    creationDate: -1
                })
                .populate({
                    path: "comments",
                    populate: {
                        path: "userId",
                    },
                    options: {
                        sort: {
                            creationDate: -1
                        }
                    }
                })
                .populate({
                    path: "userId"
                })
                .then(query => {

                    if (query == null) {
                        flashMessages.push({ text: 'Esse Usuario não exite', ok: false })
                        return res.json({ flashMessages })
                    }

                    flashMessages.push({
                        text: 'Listagem feita com sucesso',
                        ok: true
                    })

                    res.json({ flashMessages, query })

                })
                .catch(error => {
                    console.error(error)

                    flashMessages.push({ text: 'Erro', ok: false })
                    res.json({ flashMessages })
                })
        })


})

// create comment
router.post('/comment/:postId', autenticate, (req, res) => {
    const flashMessages = []

    if (req.body.content.length > 280) {
        flashMessages.push({
            text: 'O comentario é muito longo',
            ok: false
        })
        return res.json({
            flashMessages: flashMessages
        })
    }

    const newComment = new db.Comment({
        userId: res.locals.userId,
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

})

// update user
router.put('/user', autenticate, (req, res) => {
    const flashMessages = []

    if (req.body.bio && req.body.bio.length > 100) {
        flashMessages.push({
            text: 'Sua bio é muito longa',
            ok: false
        })

        return res.json({ flashMessages })
    }

    if (req.body.follow) {
        let followUserId = ''
        // o que vai ser seguido
        db.User.findOne({ username: req.body.follow }, (error, followQuery) => {

            if (error) {
                console.error(error)

                flashMessages.push({ text: 'Erro', ok: false })
                return res.json({ flashMessages })
            }

            if (followQuery == null) {
                flashMessages.push({
                    text: 'O usuario ' + req.body.follow + ' não existe',
                    ok: false
                })
                
                return res.json({ flashMessages })
            }

            // ser seguido
            db.User.updateOne({ username: followQuery.username, followers: { $ne: res.locals.userId } }, { $push: { followers: res.locals.userId } }, (error, query) => {
                if (error) {
                    console.error(error)

                    flashMessages.push({ text: 'Erro', ok: false })
                    return res.json({ flashMessages })
                }
            })
            // o que seguiu
            db.User.updateOne({ username: res.locals.username, following: { $ne: followQuery._id } }, { $push: { following: followQuery._id } },
                (error, query) => {
                    if (error) {
                        console.error(error)

                        flashMessages.push({ text: 'Erro', ok: false })
                        return res.json({ flashMessages })
                    }
                })

            flashMessages.push({
                text: "Update feito",
                ok: true
            })

            return res.json({ flashMessages })
        })
    }
    else {
        db.User.updateOne({ username: res.locals.username }, req.body, { useFindAndModify: false, upsert: true },
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
})


// feed
router.get('/feed', autenticate, (req, res) => {

    const flashMessages = []

    db.User.findOne({ username: req.params.username }, (error, queryUser) => {
        if (error) {
            console.error(error)

            flashMessages.push({ text: 'Erro', ok: false })
            res.json({ flashMessages })
        }
        if (queryUser == null) {
            flashMessages.push({ text: 'Esse Usuario não exite', ok: false })
            return res.json({ flashMessages })
        }

        db.Post.find({ userId: queryUser._id })
            .sort({
                creationDate: -1
            })
            .populate({
                path: "comments",
                populate: {
                    path: "userId",
                },
                options: {
                    sort: {
                        creationDate: -1
                    }
                }
            })
            .populate({
                path: "userId"
            })
            .then(query => {

                if (query == null) {
                    flashMessages.push({ text: 'Esse Usuario não exite', ok: false })
                    return res.json({ flashMessages })
                }

                flashMessages.push({
                    text: 'Listagem feita com sucesso',
                    ok: true
                })

                res.json({ flashMessages, query })

            })
    })


})



module.exports = router
