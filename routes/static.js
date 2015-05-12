var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('*', function(req, res, next) {
    var __rootDir=process.cwd();

    fs.exists(__rootDir+"/public"+req.path,function(exist){
        if(exist){
            res.sendFile(__rootDir+"/public"+req.path);    
        }
        else{
            res.status(404).send("Static file Not Found!!!");
        }
    });
});

module.exports = router;
