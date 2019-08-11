const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // first time login no cookies give cookies
  //console.log('req.body 6', req.body)
  if (!req.cookies || !req.cookies.shortlyid) {
    console.log('8')
    models.Sessions.create()
      .then((result) => {
        console.log('11')
        //console.log('result line 10',result)
        var options = {
          id: result.insertId
        };
        return models.Sessions.get(options);
      })
      .then((result) => {
        console.log('19')
        //result.hash = shortlyId cookie
        //console.log('res', res.cookies)
        req.session = result;
        // if (models.Sessions.isLoggedIn(req.session)) {
        //   req.session.user.username = result.user.username;
        //   req.session.user.userId = result.user.userId;
        //   console.log('line 23', req.session.user.userId)
        // }
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
        if (!result) {
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
            req.cookies['shortlyid'] = result.hash;
            res.cookie('shortlyid', result.hash);
            next();
          });
        } else {
          req.session = result;
          // if (result.user) {
          //   req.session.user.username = result.user.username;
          // }
          if (models.Sessions.isLoggedIn(req.session)) {
            req.session.user.username = result.user.username;
          }
          next();
        }
      });
  }
  //next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/


