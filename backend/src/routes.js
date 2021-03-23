require('dotenv').config()

const express = require('express')

const authenticate = require("./config/authenticate")

const authController = require("./controllers/auth")
const logoutController = require("./controllers/logout")
const loginController = require("./controllers/login")
const userController = require("./controllers/user")
const postController = require("./controllers/post")
const followController = require("./controllers/follow")
const feedController = require("./controllers/feed")
const commentController = require("./controllers/comment")
const searchUserController = require("./controllers/searchUser")
const listPostsController = require("./controllers/listPosts")

const router = express.Router()

// verify authentication 
router.post('/auth', authenticate, authController)

// logout
router.post('/logout', logoutController)

// login
router.post('/login', loginController)

// create user
router.post('/user', authenticate, userController.create)

// update user
router.put('/user', authenticate, userController.update)

// list user's posts
router.get('/:username/posts', authenticate, listPostsController)

// create post
router.post('/post', authenticate, postController.create)

// create comment
router.post('/:username/post/:postId/comment', authenticate, commentController.create)

// follow
router.put('/:username/follow', authenticate, followController.create)

// unfollow
router.put('/:username/unfollow', authenticate, followController.destroy)

// feed
router.get('/user/feed', authenticate, feedController)

// search user
router.get('/search/:username', authenticate, searchUserController)

// get user
router.get('/:username', authenticate, userController.read)

module.exports = router
