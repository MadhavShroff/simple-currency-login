var password = require('password-hash-and-salt');
const redis = require("redis");
const client = redis.createClient(6379, "34.71.143.101")
 
// var myuser = [];
 
// Creating hash and salt

ha = ''
password('mysecret').hash(function(error, hash) {
    if(error)
    throw new Error('Something went wrong!');
    ha = hash;
        // Store hash (incl. algorithm, iterations, and salt)
});


setTimeout(() => {
    password('mysecret').verifyAgainst(ha, function(error, verified) {
        if(error)
            throw new Error('Something went wrong!');
        if(!verified) {
            console.log("Don't try! We got you!");
        } else {
            console.log("The secret is...");
        }
    });
}, 2000)

// setInterval(() => {
//     // console.log(client.hset("madhavshroff99", "name", "Madhav Shroff"));
//     // console.log(client.hget("madhavshroff99", "name"));
//     client.hget("qowboqwgr", "name", (err, reply) => {
//         console.log(reply === null);
//     });
// }, 2000);

    
