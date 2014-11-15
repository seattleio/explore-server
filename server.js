var response = require('response');
var server = require('flatsheet-server')({
  site: {
    title: 'flatsheet',
    email: 'hi@example.com',
    url: 'http://127.0.0.1:3333',
    contact: 'your full name'
  },
  db: __dirname + '/data/db'
});


/*
* Create the root route
*/

server.route('/', function (req, res) {
  if (!res.account) {
    return response()
      .html(server.render('index', {
        account: { username: 'friend' }
      }))
      .pipe(res);
  }
  else {
    res.writeHead(302, { 'Location': '/sheet/list' });
    res.end();
  }
});


/*
* Create the sheet map route
*/

server.route('/sheet/map/:id', function (req, res, opts) {
  server.sheets.fetch(opts.params.id, function (err, sheet) {
    if (err) {
      res.writeHead(302, { 'Location': '/' });
      return res.end();
    }

    var headers = [];

    sheet.rows.forEach(function (row) {
      Object.keys(row).forEach( function (name) {
        if (headers.indexOf(name) < 0) headers.push(name);
      });
    });

    var ctx = { account: res.account, sheet: sheet, headers: headers };
    return response().html(server.render('sheet-map', ctx)).pipe(res);
  });
});


/*
* Start the server
*/

server.listen((process.env.PORT || 3333), function () {
  console.log('server started at 127.0.0.1:' + (process.env.PORT || 3333));
});
