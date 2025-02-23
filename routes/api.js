const express = require('express')
const router = express.Router()

// Bland AI

const { getCalls } = require('../controllers/blandController')

router.get('/get-calls', getCalls)

module.exports = router
