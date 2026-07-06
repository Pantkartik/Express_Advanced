const bcrypt=require('bcrypt')
const cookieParser = require('cookie-parser');
const express=require('express');
const app=express();

app.use(cookieParser())
const PORT=8000
const hash_match="$2b$10$SK8UDM9FPLpmPaCWigBzq.R7DodRlNJt016Vpzh.FwbUaKDQtwgFO"
const plaintext="kartikpant@2005"
app.get('/login',(req,res)=>{
    res.cookie("name","kartik");
    res.send("Login_page" )
    console.log(req.cookies)
})
app.get('/bcrypt',(req,res)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash("kartikpant@2005",salt,(err,hash)=>{
            console.log(hash)
            res.send(hash)
        })
    })
})
// comparasion of hash and plain text 
app.get('/bcrypt/:check',(req,res)=>{
    bcrypt.compare(plaintext, hash_match, (err,result)=>{
        console.log(result);
        res.send(result);
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})