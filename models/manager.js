const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MangerSchema = new Schema({
    manager_name:{
        type:String
    },
    manager_password:{
        type:String
    }
});

const Manager = mongoose.model('Manager',MangerSchema,'manager');

module.exports = Manager;