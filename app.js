var createError = require('http-errors');
var express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

global.__base = __dirname + '/';
global.__path_app = __base + 'app/';
global.__path_json = __path_app + 'db-json/';
global.__path_public = __path_app + 'public/';
global.__path_util = __path_app + 'util/';
global.__path_action = __path_app + 'action/';
global.__path_routers = __path_app + 'routes/';
global.__path_configs = __path_app +'configs/';
global.__path_script = __path_app + 'script/';
global.__path_browser = __path_app + 'browser/';

global.__API_GPM = 'http://127.0.0.1:19995/v2/';



// Class browser
global.__Start_Browser = require(__path_browser + 'browser_dev');
global.__Gpm_Browser = require(__path_browser + 'initBrowser');

const systemConfig = require(__path_configs + 'system');
// Local variable
app.locals.systemConfig = systemConfig;

app.use(cors());
// Setup Router
app.use('/api/v1', require(__path_routers));
app.get('/', (req, res) => {
	res.json('tool-social');
});
// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};
   
   res.status(err.status || 500);
   res.end('Error App');
});

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => console.log(`Serve running on port ${PORT}`));
// module.exports = app;