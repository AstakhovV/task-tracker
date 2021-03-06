const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const tokenService = require('../services/token.service')
const router = express.Router({mergeParams: true})

const signUpValidations = [
  check('email', 'Некорректный email').notEmpty().isEmail().normalizeEmail(),
  check('name', 'Имя не должно быть пустым').notEmpty(),
  check('name', 'Минимальное количество символов 3').isLength({min: 3}),
  check('password').trim().notEmpty().withMessage('Пароль не может быть пустым')
    .isLength({ min: 8 }).withMessage('Длина пароля не менее 8 символов')
    .matches(/(?=.*?[A-Z])/).withMessage('По крайней мере один заглавный символ')
    .matches(/(?=.*?[0-9])/).withMessage('Отсутствует цифровой символ в пароле')
    .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('Отсутствует спец символ "#?!@$%^&*"')
    .not().matches(/^$|\s+/).withMessage('Пробелы недопустимы в пароле'),
]
const signInValidations = [
  check('email', 'Email некорректный').notEmpty().isEmail().normalizeEmail(),
  check('password', 'Пароль не может быть пустым').trim().notEmpty(),
]

router.post('/signUp', signUpValidations, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send(errors)
    }
    const {email, password} = req.body

    const existingUser = await User.findOne({email})
    if (existingUser) {
      return res.status(400).send( "EMAIL_EXISTS")
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,

    })

    const tokens = tokenService.generate({_id: newUser._id})
    await tokenService.save(newUser._id, tokens.refreshToken)

    res.status(201).send({...tokens, userId: newUser._id})
  } catch (e) {
    res.status(500).send( "На сервере произошла ошибка. Попробуйте позже")
  }
})

router.post('/signInWithPassword', signInValidations, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send('INVALID_DATA')
    }

    const {email, password} = req.body
    const existingUser = await User.findOne({email})
    if (!existingUser) {

      return res.status(400).send('EMAIL_NOT_FOUND')
    }
    const isPasswordEqual = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordEqual) {
      return res.status(400).send('INVALID_PASSWORD')
    }

    const tokens = tokenService.generate({_id: existingUser._id})
    await tokenService.save(existingUser._id, tokens.refreshToken)
    res.status(200).send({...tokens, userId: existingUser._id})
  } catch (e) {
    res.status(500).send("На сервере произошла ошибка. Попробуйте позже")
  }
})

function isTokenInvalid(data, dbToken) {
  return !data || !dbToken || data._id !== dbToken?.user?.toString()
}

router.post('/token', async (req, res) => {
  try {
    const {refresh_token: refreshToken} = req.body
    const data = tokenService.validateRefresh(refreshToken)
    const dbToken = await tokenService.findToken(refreshToken)
    if (isTokenInvalid(data, dbToken)) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }

    const tokens = await tokenService.generate({
      _id: data._id
    })
    await tokenService.save(data._id, tokens.refreshToken)
    res.status(200).send({...tokens, userId: data._id})
  } catch (e) {
    res.status(500).json({
      message: "На сервере произошла ошибка. Попробуйте позже"
    })
  }
})
module.exports = router
