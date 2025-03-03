// Bland AI

const express = require('express');
const router = express.Router();
const { getCalls, sendBatchCall, getCallDetails, getCallStatistics} = require('../controllers/blandController');

router.get('/get-calls', getCalls);
router.post('/send-batch-call', sendBatchCall);
router.get('/get-call-details/:callId', getCallDetails);
router.get('/get-call-statistics', getCallStatistics);

module.exports = router;
