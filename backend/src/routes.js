const express = require('express')
const db = require("./models.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config()

const router = express.Router()

const autenticate = require("./config/authenticate")

const authController = require("./controllers/auth")
const logoutController = require("./controllers/logout")
const loginController = require('./controllers/login')
const userController = require('./controllers/user')
const postController = require('./controllers/post')
const listPostsController = require('./controllers/listPosts')
const commentController = require('./controllers/comment')
const followController = require("./controllers/follow")
const feedController = require("./controllers/feed")
const searchUser = require("./controllers/searchUser")

router.post('/auth', autenticate, authController)

router.get('/', (req, res) => {

    res.send('working')
})

router.post('/logout', logoutController)

// login
router.post('/login', loginController)

// create user
router.post('/user', userController.create)

// create post
router.post('/post', autenticate, postController.create)

// list user's posts
router.get('/:username/posts', autenticate, listPostsController)

// create comment
router.post('/:username/post/:postId/comment', autenticate, commentController.create)

// update user
router.put('/user', autenticate, userController.update)

// follow
router.put('/:username/follow', autenticate, followController.create)

// unfollow
router.put('/:username/unfollow', autenticate, followController.destroy)

// feed
router.get('/user/feed', autenticate, feedController)

// parsial search user
router.get('/search/:username', autenticate, searchUser)

// get user
router.get('/:username', autenticate, userController.read)

module.exports = router
