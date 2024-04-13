const bcrypt = require('bcryptjs');


async function genHash(password){
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (err) {
        console.error(err);
    }
}

async function validatePassword(password, hash){
    const match = await bcrypt.compare(password, hash);
    return match;
}


module.exports.validatePassword = validatePassword;
module.exports.genHash = genHash;


  

