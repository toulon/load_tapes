
/*
 * GET tapelist page.
 */

exports.tapelist = function(db, last_10){
  console.log('last_10 = ' + last_10)
  return function(req, res) {
  if (last_10) {
    db.collection('mfntapes').find({}).limit(10).sort({"_id":-1}).toArray(function(err, items) {
      res.json(items);
//      console.log(items)
    })
  } else {
    db.collection('mfntapes').find({}).limit(5).sort({"_id":-1}).toArray(function(err, items) {
      res.json(items);
//      console.log(items)
    })
  }
  }
};

/*
 * POST to addtape.
 */

exports.addtape = function(db) {
  return function(req, res) {
    db.collection('mfntapes').insert(req.body, function(err, result){
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
  }
};

/*
 * PUT to updatetape
 */

exports.updatetape = function(db) {
  return function(req, res) {
    var tapeToEdit = req.params.id;
    db.collection('mfntapes').updateById(tapeToEdit, req.body, function(err, result) {
      res.send((result == 1) ? { msg: ''} : {msg:'error: ' + err});
    });
  }
};

/*
 * DELETE to deletetape
 */

exports.deletetape = function(db) {
  return function(req, res) {
    var tapeToDelete = req.params.id;
    db.collection('mfntapes').removeById(tapeToDelete, function(err, result) {
      res.send((result == 1) ? { msg: ''} : {msg:'error: ' + err});
    });
  }
};
