const express = require('express');
const app = express();
const PORT = 8000
const postModel = require('./models/posts')
const userModel = require('./models/user')
// making route 

app.get('/', (req, res) => {
    res.send("hello")
})

app.get('/create', async (req, res) => {
   let user = await userModel.create({
        username: "Kartik Pant",
        email: "kartikpant.kp69@gmail.com",
        password: "kartik@2005",
        age: 24,
    })

    res.send(user);
})
// creating a post jisme user ki id hogi or phir user ke pass post id hogi 
app.get('/post/create', async (req,res)=>{
    let post = await postModel.create({
        PostName:"hello this is a post name ",
        User:"6a4ce0a30eece36ebe08e671"
    })
    // also we need to referenced the post with the user id 
    // accesing the userModel and editing the post id in it 
    let user= await userModel.findOne({_id:"6a4ce0a30eece36ebe08e671"})
    user.posts.push(post._id)
    await user.save()
    res.send({post , user})
})

app.listen(PORT)