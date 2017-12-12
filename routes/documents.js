var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');


var getDocumentsForProducts = function(db,req,res,err,products){
  console.log(new Date());
  if(err){
    console.log("to Array Error on Products ");
    console.log(err);
  }
  documentsCollection = db.collection('documents');
  var fromBooks = _.pluck(_.flatten(_.pluck(products,'books')),'BookID');
  fromBooks = _.map(fromBooks,function(b){return {'OriginatingBookID':b}});
  console.log(new Date());
  console.log(fromBooks.length);
  documentsCollection.find({$and:[{$or:fromBooks},{'TemplateID':req.params.documentTypeId}]}).toArray(function(err,docs){
    if(err){
      console.log("to Array Error on Documents");
      console.log(err);
    }
    //console.log(_.flatten(_.pluck(docs,'metaData')));
    console.log(new Date());
    res.send(docs);
  });
}

/* GET documents. */
router.get('/:documentTypeId/product/:productid', function(req, res, next) {
  //'mongodb://localhost:27017/AtlasCMSInt';
  var url = 'mongodb://localhost:27017/AtlasCMSInt';
  MongoClient.connect(url, function(err, db) {
    if(err){
      console.log(err);
    }
    productsCollection = db.collection('products');
    productsCollection.find({ProductID:req.params.productid}).toArray(getDocumentsForProducts.bind(null,db,req,res));
  });
});

router.get('/:documentTypeId/country/:cid/language/:lid', function(req, res, next) {
  var reqParam = req.params;
  //'mongodb://localhost:27017/AtlasCMSInt';
  var url = 'mongodb://localhost:27017/AtlasCMSInt';
  MongoClient.connect(url, function(err, db) {
    if(err){
      console.log(err);
    }
    console.log(new Date());
    productsCollection = db.collection('products');
    productsCollection.find({$and:[{'CountryID':parseInt(reqParam.cid)},{'LanguageID':parseInt(reqParam.lid)}]}).toArray(getDocumentsForProducts.bind(null,db,req,res));
  });
});

router.get('/:docid', function(req, res, next) {
  var url = 'mongodb://localhost:27017/AtlasCMSInt';
  MongoClient.connect(url, function(err, db) {
    if(err){
      console.log(err);
    }
    var documentCollection = db.collection('documents');
    documentCollection.find({'DocumentID':req.params.docid}).toArray(function(err,doc){
      if(err){
        console.log("to Array Error on Documents");
        console.log(err);
      }
      //console.log(_.flatten(_.pluck(docs,'metaData')));
      res.send(doc[0]);
    });
  });
});

router.get('/:docid/metadata', function(req, res, next) {
  var url = 'mongodb://localhost:27017/AtlasCMSInt';
  MongoClient.connect(url, function(err, db) {
    if(err){
      console.log(err);
    }
    var documentMetadataCollection = db.collection('documentMetadata');
    documentMetadataCollection.find({'DocumentID':req.params.docid}).toArray(function(err,doc){
      if(err){
        console.log("to Array Error on Documents");
        console.log(err);
      }
      console.log(doc)
      res.send(doc[0]);
    });
  });
});

module.exports = router;
