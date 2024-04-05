const CONFIG = {

    JWT_SECRET: process.env.JWT_SECRET || "https://secureinbox.me",

    DATABASE: {
     
        URL: process.env.DATABASE_URL || "mongodb://localhost:27017/evoting",
    },

    ENCRYPTION: {

        AESKEY: process.env.AESKEY || "n3E^s!zwLOqHo-i",
    },

    SECURITY: {
        MAX_LOGIN_ATTEMPTS: process.env.MAX_LOGIN_ATTEMPTS || 5,
        // Session timeout duration (in seconds)
        SESSION_TIMEOUT: process.env.SESSION_TIMEOUT || 36000,
    }
};

module.exports = CONFIG;
