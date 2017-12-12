var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://mongo:27017/Users';


router.get('/users', function(req,res,next){
  MongoClient.connect(mongoURL, function(err,db){
    if(err){
      console.log(err);
      res.send(err);
    }
    var users = db.collection('users');
    users.find({}).toArray(function(err,users){
      if(err){
        console.log(err);
        res.send(err);
      }
      res.send(users)
    })
  })
});


router.post('/users', function(req,res,next){
  MongoClient.connect(mongoURL, function(err,db){
    if(err){
      console.log(err);
      res.send(err);
    }
    var users = db.collection('users');
    users.insert({"name":"Docker"}).toArray(function(err,users){
      if(err){
        console.log(err);
        res.send(err);
      }
      res.send(users)
    })
  })
});




module.exports = router;
