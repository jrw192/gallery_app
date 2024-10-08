const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

const port = process.env.PORT || 4000;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const userService = require('./user_service.js');
const s3Service = require('./s3_service.js');
const postcardService = require('./postcard_service.js');
const locationService = require('./location_service.js');

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
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_SITE_SOURCE);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST','PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: process.env.REACT_ENV === 'production',
    sameSite: 'None',
    maxAge: 30 * 24 * 60 * 60 * 1000 // Cookie expires after 30 days
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
app.get('/users', (req, res) => {
  userService.getUsers()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
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
  req.logIn(req.user, (err) => {
    if (err) { return next(err); }
    res.cookie('session', { sid: req.sessionID, session: req.session}, req.session.cookie);
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
      res.clearCookie('session', {
        secure: true,
        httpOnly: process.env.REACT_ENV === 'production',
        sameSite: 'None',
        maxAge: 30 * 24 * 60 * 60 * 1000 // Cookie expires after 30 days
      });
      pool.query('DELETE FROM user_sessions WHERE sid = $1', [sessionId]).then(() => {
        res.status(200);
        res.redirect('/');
      })
        .catch((err) => {
          console.log('error:', err);
          res.status(500).send(err);
        });
    }
  });
});

app.get('/session', (req, res) => {
  const sess = req.cookies.session;
  if (sess) {
    res.status(200).json({
      sessionID: sess.sid,
      session: sess.session});
  } else {
    res.status(200).send({
      sessionID: '',
      session: ''});
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

// postcard data
app.post('/savepostcard/:id', (req, res) => {
  const postcard = req.body;
  postcardService.savePostcard(postcard)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
})

app.get('/getpostcards', (req, res) => {
  postcardService.getAllPostcards()
  .then((response) => {
    res.status(200).send(response);
  })
  .catch(err => {
    res.status(500).send(err);
  });
});

app.post('/savecity', (req, res) => {
  const body = req.body;
  locationService.saveCity(body)
  .then((response) => {
    res.status(200).send(response);
  })
  .catch(err => res.status(500).send(err));
});

app.get('/getcities', (req, res) => {
  locationService.getCities()
  .then((response) => {
    res.status(200).send(response);
  })
  .catch(err => {
    res.status(500).send(err);
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
