const VoteModel = require('../models/vote.model');
const CryptoJS = require('crypto-js');
const CONFIG = require('../../config/config');
const bcrypt = require('bcrypt');





const Key = CONFIG.ENCRYPTION.AESKEY;
const  decrypt = (cipher)=> {
    try {
        var decryptedBytes = CryptoJS.AES.decrypt(cipher, Key);
        var decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

        var decryptedObject = JSON.parse(decryptedString);
        // console.log("decryptoj",decryptedObject)
        return decryptedObject;

    } catch (error) {
        console.error('Error decrypting data:', error);
        return null; // or handle the error accordingly
    }
}




const encrypt = (message)=> {
    return CryptoJS.AES.encrypt(message, Key).toString();
}



const validVote = async (req, res, next) => {

    const data = req.body;
    const decode =  decrypt(data.cipher)
  
        
        req.body = decode;
        console.log("else here")
        next();
    

}

module.exports = validVote;