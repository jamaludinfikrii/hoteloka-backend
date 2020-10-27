const mysql = require('mysql')

const db = mysql.createConnection({
    user : "root",
    password : '111111111',
    port :3306,
    database : "hoteloka"
})


module.exports = db