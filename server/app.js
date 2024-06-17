const createError = require('http-errors');
const express = require('express')
const cookieParser = require('cookie-parser');
const logger = require('./util/LogManager').getLogger('app.js');
const cors = require('cors');

const security = require('./config/Security');
const dbConfig = require('./config/DbConfig');

//For data recipe fetch
const recipeAPIRouter = require("./routes/RecipeRouter");


const config = require("./config.json");
const port = config.server.port;
const app = express();

app.listen(port, () => logger.info('Server ready on port:' + port));

app.use(cors(security.getCorsPolicy()));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

//Connect to DB before api setup
dbConfig.mongoDBConnectAndInit()
    .then(() => logger.info("Attempted DB connection"))
    .catch((err) => logger.error("Failed to connect DB", err));

//Setup API
app.use("/api", recipeAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
