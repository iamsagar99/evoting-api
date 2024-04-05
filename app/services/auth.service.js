const jwt =  require('jsonwebtoken');
const CONFIG = require('../../config/config');

class AuthService{
    loginValidate = (data)=>{
        let errors = {};
        if(!data.email){
            errors['email']='Email is required';
        }else{
            delete errors['email']
        }
        if(!data.password){
            errors['passowrd']='Password is required';
        }else{
            delete errors['password']
        }
        if(Object.keys(errors).length){
            console.log(errors)
            throw errors;
        }else{
            return null;
        }
    }
    registerValidate = (data,is_edit=false)=>{
        let errors = {};
        if(!data.email){
            errors['email']='Email is required';
        }
        if(!data.password){
            errors['password']='Password is required';
        }
        if(!data.name){
            errors['name']='Name is required';
        }
        if(!data.phone){
            errors['phone']='Phone is required';
        }
        if(is_edit){
            if(!data.email){
                errors['email_edit']='Email is required';
            }
        }
        if(!data.dob){
            errors['dob']='Date of Birth is required';
        }
        
        if(Object.keys(errors).length){
            return errors;
        }else{
            return null;
        }
    }
    generateToken = (data)=> {
        return jwt.sign(data, CONFIG.JWT_SECRET, { expiresIn: CONFIG.SECURITY.SESSION_TIMEOUT });
    }
}



module.exports  = AuthService;