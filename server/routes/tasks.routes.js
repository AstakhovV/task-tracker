const express = require('express')
const auth = require('../middleware/auth.middleware')
const Task = require('../models/Task')
const router = express.Router({mergeParams: true})

router.get('/', auth, async (req, res) => {
  try {
    const task = await Task.find()
    res.status(200).send(task)
  } catch (e) {
    res.status(500).json({
      message: "На сервере произошла ошибка. Попробуйте позже"
    })
  }
})

module.exports = router
