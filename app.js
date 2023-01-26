const express = require('express')
const app = express()
const morgan = require('morgan')
const { db, Page, User } = require('./models')
const wikiRouter = require('./routes/wiki')
const userRouter = require('./routes/users')

app.use(morgan('dev'))
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))
app.use('/wiki', wikiRouter)
app.use('/users', userRouter)

const main = require('./views/main')

db.authenticate().then(() => {
  console.log('connected to the database')
})

app.get('/', (req, res, next) => {
  res.redirect('/wiki')
})

const PORT = 3010

const init = async () => {
  await db.sync({ force: true })
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`)
  })
}

init()
