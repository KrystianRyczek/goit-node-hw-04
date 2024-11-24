const express = require('express')
const users = require('../../controllers/users/users.js')
const router = express.Router()


router.post('/users/signup', users.signUpUser)
router.post('/users/login', users.signIpUser)
router.get('/users/logout', users.signOutUser)
router.get('/users/current', users.currentUser)

module.exports = router

// mongodb+srv://TEST_USER:Test_User@db-contacts.hmcyp.mongodb.net/?retryWrites=true&w=majority&appName=db-contacts