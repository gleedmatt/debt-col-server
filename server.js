const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

require('dotenv').config()

app.use(bodyParser.json())
app.use(cors())

// Routes
app.use('/', require('./routes/index'))
app.use('/api', require('./routes/api'))

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
