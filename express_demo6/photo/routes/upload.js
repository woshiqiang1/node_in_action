const express = require('express')
const router = express.Router()

router.get('/', photos.form)
router.post('/', photos.submit(router.get('photos')))