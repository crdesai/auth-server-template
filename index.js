const express = require('express'),
      http = require('http'),
      bodyParser = require('body-parser'),
      morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

// DB setup
mongoose.connect('mongodb://localhost:auth/authdb');

// App setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type: '*/*'}));
router(app);

// Server setup
const port = process.env.port || 3090;
const server = http.createServer(app);
server.listen(port);

console.log("srver listening on " + port);
