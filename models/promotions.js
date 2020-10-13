const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var promotionSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    image: {
        type: String,
        require: true
    },
    label: {
        type: String,
        default: ""
    },
    price: {
        type: Currency,
        require: true,
        min: 0
    },
    description: {
        type: String,
        require: true
    },
    featured: {
        type: Boolean,
        require: false
    }
})

var Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;