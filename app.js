const express = require('express')
const app = express()
require ('./config/mongo.config')


const routes = require('./routes/route')

const cors = require('cors')

const PORT = process.env.PORT || 9001;

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({extended: false}))

app.use('/assets',express.static(process.cwd() + '/uploads'))

app.use("/api/v1/",routes)

// wildcard
app.use((req,res,next)=>{
    next({
        status: 404,
        msg:"Not Found"
    })
})

//handle error
app.use((error,req,res,next)=>{
    console.log('Err:',error)
    let status = error.status || 500
    let msg = error.msg || "Something went wrong. Server error"
    
    res.status(status).json({
        result: null,
        msg: msg,
        status: status
    })

})


app.listen(PORT,(err)=>{
    if(err){
        console.log("APP:",err);
        console.log('Error listening to port:',PORT);
    }else{
        console.log('Server listening to port:',PORT);
        console.log('Press Ctrl+C to quit.')
    }
})