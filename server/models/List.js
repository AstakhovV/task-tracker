const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: String,
  color: String,
  userId: String,
  tasks: [{
    type: Schema.Types.ObjectId, ref: 'Tasks'
  }]
}, {
  timestamps: true
})

module.exports = model('List', schema)
