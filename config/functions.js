const fs = require("fs")
const makeDirectory = (path)=>{
    let dir = process.cwd()+"/uploads/"+path
    fs.mkdir(dir,{recursive:true},(err,success)=>{
        if(err){
            console.log("Error creating directory:",err)
        }
    })
}

module.exports = {
    makeDirectory:makeDirectory
}