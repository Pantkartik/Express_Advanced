const express = require("express")
const app = express()
const path = require('path')
const fs = require('fs')
const { log } = require("console")
const PORT = 8000
app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")));
app.get("/home", (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        console.log(files)
        res.render("index", { files: files || [] })
    })
})

app.post('/create',(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join(' ')}`)    
})
app.listen(PORT)