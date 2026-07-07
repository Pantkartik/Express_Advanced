// jwt authentication 

// it contain 3 parts each segregatted by .
//  and the middle part consist of the payload which is encrypted and
//  stored and when user wants to login this payload is compared 
// and than further actions are done

const express=require('express');
const app=express();
const jwt=require('jsonwebtoken')
const PORT=8000
app.get('/jwt-login',(req,res)=>{
    var token=jwt.sign({email:"kartikpant.kp69@gmail.com"},"secret@123") 
    // this secret should be kept in the .env file 
    // and should be hashed and not preffereed to use plain text 
    // here used only for developement not prod.
    res.send({ message: 'This is the jwt login page', token })
    console.log(token)
})
app.get('/read',(req,res)=>{
    let data=jwt.verify(req.cookies.token,"secret@123")
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})