const express = require('express')
const router = express.Router()

// Bland AI

const { getCalls, sendBatchCall } = require('../controllers/blandController')

router.get('/get-calls', getCalls)
router.post('/send-batch-call', sendBatchCall)

module.exports = router
