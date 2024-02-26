import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
require("./connect_DB");



const app = express()
const port = process.env.PORT || 3000


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})