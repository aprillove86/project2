//dependencies and links to schema and controller(routes)
const express = require('express');
const mongoose = require('mongoose')
const Restaurant = require('./model/restaurantSchema')
const restaurantSeed = require('./model/restaurants')

const PORT = process.env.PORT || 8000

//configure app
const app = express()

//configured settings for app
require('dotenv').config()

//method override for posting and deleting
const methodOverride = require('method-override')

//database connection

const DATABASE_URL = 'mongodb+srv://admin:abc1234@cluster0.n4yev.mongodb.net/restaurants?retryWrites=true&w=majority'
mongoose.connect(DATABASE_URL);

//Database connection + Callback functions for events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + " is mongo running?"))
db.on('connected', () => console.log("mongo connected"))


//middleware for body parsing
app.use(express.urlencoded({ extended: false}))
app.use(express.static('public')) //for css files
app.use(methodOverride('_method'))


//seed route to pull in/populate our data on restaurants
app.get('/restaurants/seed', (req, res) => {
    Restaurant.deleteMany({}, (error, alreadyExistingData) => {
        console.log('deleted from mongo')
    })
    Restaurant.create(restaurantSeed, (error, allPlaces) => {
        console.log('seeded products into mongo')
        res.redirect('/restaurants');
    })
});

//index route
app.get('/restaurants', (req, res) => {
    Restaurant.find({}, (error, allPlaces) => {
        res.render('index.ejs', {allPlaces});
    }) //allPlaces in the curly braces are all of the restaurants we'll be seeding
});

//new route
app.get('/restaurants/new', (req, res) => {
    res.render('new.ejs');
});

//delete route
app.delete('/restaurants/:id', (req, res) => {
    Restaurant.findByIdAndDelete(req.params.id, (error, deletedPlace) => {
        res.redirect('/restaurants');
    }); //will delete individual places and go back to the index/home page
});

//update route
app.put('/restaurants/:id', (req, res) => {
    Restaurant.findByIdAndUpdate(req.params.id,
        req.body,
        {new: true},
        (error, updatedPlace) => {
           res.redirect(`/restaurants/${req.params.id}`);
        }//req body needed for data and requires true
    )
});//will then go back and put data into index/home page items

//create route
app.post('/restaurants', (req, res) => {
    Restaurant.create(req.body, (error, createdPlace) => {
    res.redirect('/restaurants');
    });
});

//edit route
app.get('/restaurants/:id/edit', (req, res) => {
    Restaurant.findById(req.params.id, (error, singlePlace) => {
        res.render('edit.ejs', {singlePlace}) //consider {restaurant: singleRes}
    });
});

//show route
app.get('/restaurants/:id', (req, res) => {
    Restaurant.findById(req.params.id, (error, singlePlace) => {
        res.render('show.ejs', {singlePlace});
    });
});

//listener
app.listen(PORT, () => console.log(`hellelujah, holla back ${PORT}`)
);