const express = require('express');
const app = express();
const session = require('express-session');
const cookieSession = require('cookie-session')

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const userService = require('./user_service.js');
const s3Service = require('./s3_service.js');

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: process.env.REACT_APP_DB_USER,
  host: process.env.REACT_APP_DB_HOST,
  database: process.env.REACT_APP_DB_NAME,
  password: process.env.REACT_APP_DB_PASSWORD,
  port: process.env.REACT_APP_DB_PORT,
});

app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST','PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
// app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours,
  },
  store: new pgSession({
    pool: pool,
    tableName: "user_sessions",
  }),
}));
app.use(passport.initialize());
app.use(passport.session());


// passport stuff
passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log('authenticating');
    return userService.getUserByName(username).then((user) => {
      let match = bcrypt.compareSync(password, user.password);
      if (!match) {
        console.log('not verified');
        return done(null, false)
      }
      console.log('verified');
      return done(null, user);
    })
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
  userService.getUserByName(username)
    .then(user => done(null, user))
    .catch(err => done(err));
});



// ----------- API -------------

// user api
app.get('/', (req, res) => {
  userService.getUsers()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(error);
    })
});

app.get('/names', (req, res) => {
  userService.getUserNames()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(error);
    })
});

app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  userService.getUserByName(id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(error);
    })
});

// create account
app.post('/createuser', (req, res) => {
  userService.createUser(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
});

// account session api
app.post('/login', passport.authenticate('local', {
  failureRedirect: '/home',
  failureFlash: true,
  keepSessionInfo: true
}), (req, res) => {
  req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
  req.logIn(req.user, (err) => {
    if (err) { return next(err); }
    res.status(200).send({ sid: req.sessionID, name: req.session.passport.user });
  });
});

app.get('/logout/:sid', (req, res) => {
  const sessionId = req.params.sid;
  req.logout((err) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      console.log('deleting session id: ', sessionId);
      pool.query('DELETE FROM user_sessions WHERE sid = $1', [sessionId]).then(() => {
        console.log('successfully logged out');
        res.redirect('/');
      })
        .catch((err) => {
          console.log('error:', err);
        });
    }
  });
});

app.get('/session', (req, res) => {
  if (req.session) {
    res.status(200).json({
      sessionID: req.sessionID,
      session: req.session});
  } else {
    res.status(500).send('No user logged in');
  }
});

// image api
app.get('/images', async (req, res) => {
  s3Service.getAllImages()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
});

app.post('/saveimage/:id', (req, res) => {
  const id = req.params.id;
  s3Service.saveImage(id, req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
});

app.listen(5000, () => console.log('Server running on port 5000'));