const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const PORT = 3000
const path = require('path')
const userModel = require('./models/usermodel')
const bcrypt = require('bcrypt')

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser())

app.get('/create', (req, res) => {
    res.render('index')
})

app.get('/forget', (req, res) => {
    try {
        res.render('forget')
    } catch (err) {
        console.error(err.stack)
        res.status(500).send("Something went wrong")
    }
})


app.get('/support', (req, res) => {
    try {
        res.render('support')
    } catch (err) {
        console.error(err.stack)
        res.status(500).send("Something broke!")
    }
})
// user creation with bcrypt password hashing and JWT token
app.post('/create', async (req, res) => {
    let { username, email, password, age } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username,
                email,
                password: hash,
                age
            })
            console.log(user)
            let token = jwt.sign({ email }, "secret-key")
            res.cookie("token", token)   // set JWT in cookie
            res.redirect('/user')        // redirect to user dashboard
        })
    })
})

// show all registered users
app.get('/user', async (req, res) => {
    try {
        let users = await userModel.find()  // fetch all users from DB
        res.render('home', { users })        // pass users array to home.ejs
    } catch (err) {
        console.error(err.stack)
        res.status(500).send("Something went wrong")
    }
})


// logout — clear the cookie and redirect to login
app.post('/logout', (req, res) => {
    res.cookie("token", "")
    res.redirect('/create')
})




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})