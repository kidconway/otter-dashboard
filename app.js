const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session')
const validate = require('mongoose-validator')

app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static(path.join(__dirname, './static')))

app.use(session({secret: 'keyboardkitteh', name: 'session_id', saveUninitialized: true, cookie: {maxAge: 60000}}))
app.use(flash())

app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost/otter-dashboard')

// Validations for mongoose go here

let OtterSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  age: Number,
  weight: Number,
  length: Number,
  house: String
}, {timestamps: true})

mongoose.model('Otter', OtterSchema)
let Otter = mongoose.model('Otter')

app.get('/', function(req, res){
  Otter.find({}, null, {sort: {createdAt: -1}}, function(err, otters){
    if (err){
      console.log(err)
      res.render('error')
    } else {
      console.log('Loading Database Success')
      res.render('index', {otters:otters})
    }
  })
})

app.get('/otters/new', function(req, res){
  res.render('new')
})

app.post('/otters', function(req, res){
  let otter = new Otter({
    fname: req.body.fname,
    lname: req.body.lname,
    age: req.body.age,
    weight: req.body.weight,
    length: req.body.length,
    house: req.body.house
  })
  otter.save(function(err){
    if(err){
      console.log('Saving error', err)
      for(let key in err.errors){
        req.flash('Error adding', err.errors[key].message)
      }
      res.redirect('/')
    } else {
      console.log('Otter added')
      res.redirect('/')
    }
  })
})

app.get('/otters/edit/:id', function(req, res, id){

  console.log('Should be a specific otter', req.params.id)
  Otter.findById(req.params.id, function(err, otter){
    if(err){
      console.log('Otter not found', err)
      for(let key in err.errors){
        req.flash('Error fetching otter', err.errors[key].message)
      }
      res.redirect('/')
    } else {
      console.log('Otter found')
      console.log(otter)
      res.render('otter', {otter:otter})
    }
  })
})

app.post('/otters/:id', function(req, res, otter){
  Otter.findById(req.params.id, function(err, otter){
      if ( req.body.fname == false ){
        otter.fname = otter.fname
      } else {
        otter.fname = req.body.fname
      }
      if ( req.body.lname == false ){
        otter.lname = otter.lname
      } else {
        otter.lname = req.body.lname
      }
      if ( req.body.age == false ){
        otter.age = otter.age
      } else {
        otter.age = req.body.age
      }
      if ( req.body.weight == false ){
        otter.weight = otter.weight
      } else {
        otter.weight = req.body.weight
      }
      if ( req.body.length == false ){
        otter.length = otter.length
      } else {
        otter.length = req.body.length
      }
      if ( req.body.house == false ){
        otter.house = otter.house
      } else {
        otter.house = req.body.house
      }
      otter.save(function(err){
        if (err) {
          console.log('Error Updating')
        } else {
          console.log('Otter updated')
        }
      })

    res.redirect('/')
  })
})

app.post('/otters/destroy/:id', function(req, res, id){
  Otter.findByIdAndDelete(req.params.id, function(err){
    if(err){
      console.log('Error deleting', err)
    } else {
      console.log('Otter deleted')
      res.redirect('/')
    }
  })
})



app.listen(3791, function(){
  console.log('***************************')
  console.log('One Ring to Rule the Server')
  console.log('********** 3791 ***********')
})
