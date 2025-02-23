const buildOptions = require('../utils/bland')

const getCalls = async (req, res) => {
  try {
    const response = await fetch(
      'https://api.bland.ai/v1/calls',
      buildOptions('GET')
    )
    const data = await response.json()
    console.log(data)
    res.send(data)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { getCalls }
