const parseCookies = (req, res, next) => {
  // req.headers.Cookie = 'fdjsalfsaj';
  // var parsed = {Cookie: req.cookies};
  // req.cookies = parsed;
  var obj = {};
  //console.log('headers', req.headers)
  if (!Object.keys(req.headers).length || !req.headers.cookie) {
    req.cookies = obj;
    next();
  } else {
    var array = req.headers.cookie.split(';');
    for (var i = 0; i < array.length; i++) {
      obj[array[i].slice(0, array[i].indexOf('=')).trim()] = array[i].slice(array[i].indexOf('=') + 1);
    }
    req.cookies = obj;
    next();
  }
};

module.exports = parseCookies;