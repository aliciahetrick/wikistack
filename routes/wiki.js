const express = require('express')
const wikiRouter = express.Router()
const { Page, User } = require('../models')
const { addPage, wikiPage, main } = require('../views')

wikiRouter.get('/', async (req, res, next) => {
  const indexPage = await Page.findAll()
  res.send(main(indexPage))
})

wikiRouter.get('/add', (req, res, next) => {
  res.send(addPage())
})

wikiRouter.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug,
      },
    })
    const author = await page.getAuthor()
    res.send(wikiPage(page, author))
  } catch (error) {
    next(error)
  }
})

wikiRouter.post('/', async (req, res, next) => {
  const { title, content } = req.body

  try {
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email,
      },
    })

    const page = await Page.create(req.body)

    // `setAuthor` returns a Promise! We should await it so we don't redirect before the author is set
    await page.setAuthor(user)

    res.redirect(`/wiki/${page.slug}`)
  } catch (err) {
    console.log('catch errror', err)
  }
})

module.exports = wikiRouter
