const express = require('express')
const app = express()
const path = require('path')
const PORT = 3000
const userModel = require('./appmodel')
// app.use(express.urlencoded({extended:true}))
// app.use(express.static(path.join(__dirname,"public")))

app.get('/home', (req, res) => {
    res.send("This is a boiler plate")
})

// user creation 
app.get('/create', async (req, res) => {
    let user = await userModel.create({
        name: "naman",
        age: 25,
        designation: "R2R",
        email: "namanpant.np@gmail.com",
        password: "naman@2003"
    })
    console.log(user)
    res.send(user)
})
// user updation 
app.get('/update', async (req,res,err)=>{
    try{
        let updatedUser = await userModel.findOneAndUpdate({name:"kartik"},{password:26},{new:true})
        res.send(updatedUser)
        console.log(updatedUser)
    }
    catch (err) {
        console.error(err.stack);
        res.status(500).send("something went wrong ")
    }
})

// reading all users 
app.get('/readall', async (req, res) => {
    try {
        let users = await userModel.find();
        res.send(users);
    }
    catch (err) {
        console.error(err.stack)
        res.status(500).send("user not found")
    }
})

// reading one user 
app.get('/read', async (req, res) => {
    try {
        let users = await userModel.find({ name: "kartik" });
        res.send(users);
    }
    catch (err) {
        console.error(err.stack)
        res.status(500).send("user not found")
    }
})

app.get('/delete', async (req, res) => {
    try {
        let users = await userModel.findOneAndDelete({ name: "kartik" });
        res.send(users);
    }
    catch (err) {
        console.error(err.stack)
        res.status(500).send("user not found")
    }
})

app.listen(PORT, (err) => {
    if (err) {
        console.error(err.stack)
        console.log(err)
    } else {
        console.log(`Server is running on port ${PORT}`)
    }
})