require("dotenv").config();

const express = require('express')
const app = express()
const port = 5000

app.use(express.static('public'))

app.use(express.json({ extended: false }));

app.listen(port, () => console.log(`Server started on port ${port}!`))