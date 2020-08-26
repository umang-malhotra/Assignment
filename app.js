const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');

console.log(config.database);
mongoose.connect('mongodb://localhost/workindia');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to Mongodb');
})

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
//    cookie: { secure: true }
}));

const routes = require('./routes');
app.use('/', routes);

//start the server
var port = 3000;
app.listen(port, function () {
    console.log('server started on port ' + port);
});
