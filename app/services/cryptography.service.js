const CryptoJS = require('crypto-js');
const CONFIG = require('../../config/config');
const { json } = require('express');

class CryptService {
    constructor() {
        this.key = CONFIG.ENCRYPTION.AESKEY;
    }

    decrypt(cipher) {
        try {
            var decryptedBytes = CryptoJS.AES.decrypt(cipher, this.key);
            var decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

            var decryptedObject = JSON.parse(decryptedString);
            // console.log("decryptoj",decryptedObject)
            return decryptedObject;

        } catch (error) {
            console.error('Error decrypting data:', error);
            return null; // or handle the error accordingly
        }
    }
    encrypt(message){
        return CryptoJS.AES.encrypt(message, this.key).toString();
    }
     customHash(input) {
        let hash = 0;
        const inp = input.toString();
        console.log("imput",input)
        console.log("op",inp)
        if (input.length == 0) return hash;
        for (let i = 0; i < inp.length; i++) {
          let char = inp.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash &= 0xffff; // Limit hash to 16 bits
        }
        console.log("hash",hash.toString(16))
        return hash.toString(16); // Convert to 16-bit hexadecimal
      }
      
      // Custom dehash function
       customDehash(hash) {
        let str = '';
        for (let i = 0; i < hash.length; i += 2) {
          const hex = hash.substr(i, 2);
          str += String.fromCharCode(parseInt(hex, 16));
        }
        return str;
      }

    
}

module.exports = CryptService;
