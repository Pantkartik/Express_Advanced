const mongoose=require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/testingdb")

const userSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    age:Number,
    // we gona reference this post a reference id which will be referencing the user 
    // posts contains the array for the id 
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:post
    }]
})

module.exports=mongoose.model('user',userSchema)