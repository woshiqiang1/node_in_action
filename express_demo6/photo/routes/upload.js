const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const Photo = require('../models/Photo')

const join = path.join
const upload = multer()

const submit = dir => (req, res, next) => {
  console.log('req.files', req.files)
  console.log('req.body', req.body)
  let img = req.files.photo.image
  let name = req.body.photo.name || img.name
  let path = join(dir, img.name)
  fs.rename(img.path, path, err => {
    if(err){
      return next(err)
    }
    Photo.create({
      name: name,
      path: img.name
    }, err => {
      if(err){
        return next(err)
      }
      res.redirect('/')
    })
  })
}

router.get('/', (req, res) => {
  res.render('photos/upload', {
    title: 'Photo upload'
  })
})

router.post('/', upload.none(), submit(__dirname + '/public/photos'))

module.exports = router