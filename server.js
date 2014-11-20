var response = require('response');
var map = require('explore-map');
var server = require('flatsheet-server')({
  site: {
    title: 'Explore.js',
    email: 'hi@seattle.io',
    url: 'http://127.0.0.1:3333',
    contact: 'Seth Vincent'
  },
  db: __dirname + '/data/db'
});

var serverViews = __dirname + '/views/server/';
server.addView('sheet-map.html', serverViews);


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
    
    return response().html(map).pipe(res);
  });
});


/*
* Start the server
*/

server.listen((process.env.PORT || 3333), function () {
  console.log('server started at 127.0.0.1:' + (process.env.PORT || 3333));
});
