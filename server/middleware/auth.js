const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // first time login no cookies give cookies
  //console.log('req.cookies', req.cookies)
  if (!req.cookies.shortlyid) {
    models.Sessions.create()
      .then((result) => {
        var options = {
          id: result.insertId
        };
        return models.Sessions.get(options);
      })
      .then((result) => {
        //result.hash = shortlyId cookie
        //console.log('res', res.cookies)
        req.session = result;
        res.cookie('shortlyid', result.hash);
        next();
      });
  } else {
    var options = {
      hash: req.cookies.shortlyid
    };
    models.Sessions.get(options)
      .then((result) => {
        // result = {id: 1, hash: 'fdjskal;f', userId: null , user: 1}
        req.session = result;
        if (result.user) {
          req.session.user.username = result.user.username;
        }
        next();
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

