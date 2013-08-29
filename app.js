var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/track');
var Tracker = mongoose.model('Tracker', {
  name: String,
  date: String,
  no: Number
});

/*Tracker.remove({},function(){
  console.log(arguments);
})*/

app.get('/_.gif', function(req, res) {
  var name = req.query.name;
  now = new Date(),
  hour = now.getHours(),
  year = now.getFullYear(),
  month = now.getMonth() + 1,
  date = now.getDate(),
  dateKey = year + '-' + month + '-' + date + ' ' + hour + ':00:00';
  var one = new Tracker({
    name: name,
    date: dateKey,
    no: 1
  });
  // 查找是否已经有记录
  Tracker.find({
    name: name,
    date: dateKey,
  }).exec(function(err, data) {
    if (data.length) {
      // 更新记录
      console.log('更新数据::', name);
      Tracker.update({
        name: name,
        date: dateKey
      }, {
        no: data[0].no + 1
      }, function(err, numberAffected, raw) {
        if (err) console.log('更新出错鸟');
      });
    } else {
      // 插入记录
      one.save(function(err) {
        if (err) {
          console.log('err found');
        } // ...
        console.log('成功记录::', name);
      });
    };
  });
  res.type('png');
  res.send(204);
});

// 数据接口
app.get('/api/data.json', function(req, res) {
  var name = req.query.name;
  Tracker.find({
    name: decodeURI(name)
  }).exec(function(err, data) {
    res.send({
      error: 0,
      filter:name,
      rows: data
    });
  });
});

app.listen(8002);
console.log('server is running at port 8002');