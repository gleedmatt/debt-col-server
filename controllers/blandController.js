const { buildOptions, buildBatchCallsData } = require('../utils/bland')
const { getContactsMock } = require('../mocks/contacts')

const getCalls = async (req, res) => {
  try {
    const response = await fetch(
      'https://api.bland.ai/v1/calls',
      buildOptions('GET')
    )
    const data = await response.json()
    res.send(data)
  } catch (err) {
    console.error(err)
  }
}

const sendBatchCall = async (req, res) => {
  try {
    const mockPayload = getContactsMock()
    const payload = buildBatchCallsData(mockPayload) // req.body
    const response = await fetch(
      'https://api.bland.ai/v1/batches',
      buildOptions('POST', payload)
    )
    const data = await response.json()
    res.send(data)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { getCalls, sendBatchCall }
