const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport');

const app = express();
app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2']
}))

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3000

app.get("/", (req, res) => {
    // res.json({message: "You are not logged in"})
    res.render('pages/auth');
})

app.get("/failed", (req, res) => {
    // res.send("Failed")
    res.render('pages/failed');
})
app.get("/success",isLoggedIn, (req, res) => {
    res.render('pages/success');
    // res.send(`Welcome ${req.user.email}`)
})

app.get('/google',
    passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
    ));

app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        res.redirect('/success')

    }
);

app.get("/logout", (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.listen(port, () => console.log("server running on port" + port))