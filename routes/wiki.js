const express = require('express')
const wikiRouter = express.Router()
const { Page } = require('../models')
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
    res.send(wikiPage(page))
  } catch (error) {
    next(error)
  }
})

wikiRouter.post('/', async (req, res, next) => {
  const { title, content } = req.body

  try {
    const page = await Page.create({
      title,
      content,
    })

    res.redirect(`/wiki/${page.slug}`)
  } catch (err) {
    console.log('catch errror', err)
  }
})

module.exports = wikiRouter
