const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//book schema definition
// 定义schema
let BookSchema = new Schema(
  {
    title: { type: String, required: true },//标题
    author: { type: String, required: true },//作者
    year: { type: Number, required: true },//年
    pages: { type: Number, required: true, min: 1 },// required
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false
  }
);

// Sets the createdAt parameter equal to the current time
// 设置createdAt等于当前时间
BookSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('book', BookSchema);
