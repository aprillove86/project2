const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {type: String, required: true },
    cuisine: {type: String, required: true },
    chef: {type: String, required: true },
    img: {type: String},
 
})

module.exports = mongoose.model("Restaurant", restaurantSchema)

