const buildOptions = (method) => ({
  method,
  headers: {
    authorization: process.env.BLAND_API_KEY,
  },
})

module.exports = buildOptions
