const express = require('express')
const db = require("./models.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config()


const router = express.Router()

const multer = require("./config/multer")
const authenticate = require("./config/authenticate")

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

router.post('/auth', authenticate, authController)

router.get('/', (req, res) => {

    res.send('working')
})

router.post('/logout', logoutController)

// login
router.post('/login', loginController)

// create user
router.post('/user', userController.create)

// update user
router.put('/user', authenticate, multer.updateUser, userController.update)

// create post
router.post('/post', authenticate, postController.create)

// list user's posts
router.get('/:username/posts', authenticate, listPostsController)

// create comment
router.post('/:username/post/:postId/comment', authenticate, commentController.create)

// follow
router.put('/:username/follow', authenticate, followController.create)

// unfollow
router.put('/:username/unfollow', authenticate, followController.destroy)

// feed
router.get('/user/feed', authenticate, feedController)

// parsial search user
router.get('/search/:username', authenticate, searchUser)

// get user
router.get('/:username', authenticate, userController.read)

module.exports = router
