const express = require('express');
const Mongoose  = require('mongoose');
const router = express.Router();
var crypto = require('crypto');
var assert = require('assert');

var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'mysalt';
let cipher = crypto.createCipher(algorithm, key);  
let decipher = crypto.createDecipher(algorithm, key);


const url = require('url');
const querystring = require('querystring');

const User = require('./models/user');
const Note = require('./models/note');

router.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello! App is running'
    });
});

router.post('/app/user', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    let user = new User({
        username: username,
        password: password
    })
    user.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.send({
                'status': 'Account Created'
            })
        }
    })
})

router.post('/app/sites', function (req, res) {
    let userId = req.query.user;
    let encrypted = cipher.update(req.body.note, 'utf8', 'hex') + cipher.final('hex');
    User.findOne({ _id: Mongoose.Types.ObjectId(userId) })
        .then(user => {
            if (user) {
                let note = new Note({
                    author: Mongoose.Types.ObjectId(userId),
                    note: req.body.note
                })
                return note;
            } else {
                res.send("Error - User not found in database")
            }
        }).then(note => {
            note.save(function(err) {
                if(err) {
                    console.log(err);
                } else {
                    res.send({
                        "status": "SUCCESS"
                    })
                }
            })
        }).catch(err => {
            res.send("Error Failed dbquery to find user")
        })

})

router.get('/app/sites/list', function(req, res) {
    let userId = req.query.user;
    Note.find({author: Mongoose.Types.ObjectId(userId)})
        .then(notes => {
            let listNotes = notes.reduce((acc, curr ) => {
                //let decrypted = decipher.update(curr.note, 'hex', 'utf8') + decipher.final('utf8');
                //acc.push(decrypted);
                acc.push(curr.note);
                return acc;
            }, []);
            res.send(listNotes);
        })
        .catch(err => {
            console.log("Error while fetching notes - ", err);
            res.send("Error while fetching notes", err);
        })
})

module.exports = router;