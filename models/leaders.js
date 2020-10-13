const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var leaderSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    image: {
        type: String,
        require: true
    },
    designation: {
        type: String,
        require: true
    },
    abbr: {
        type: String,
        require: true
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

var Leaders = mongoose.model('leader', leaderSchema);

module.exports = Leaders;