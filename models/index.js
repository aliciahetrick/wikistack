const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false,
})

const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  status: {
    type: Sequelize.BOOLEAN,
  },
})

Page.beforeValidate(async (page, options) => {
  if (!page.slug) {
    page.slug = await page.title.replace(/\s+/g, '_').replace(/\W/g, '')
  }
})

// Page.addHook('beforeValidate', (title) => title.replace(/\s+/g, '_').replace(/\W/g, ''))

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
})

module.exports = {
  db,
  Page,
  User,
}
