const db = require('./../database/mysql')
module.exports = {
    getAllHotels : (req,res) => {

        db.query("SELECT h.id,h.` name`, min(r.price) as price,address, phone,star,hi.url FROM hotels h JOIN rooms r on h.id = r.hotels_id JOIN hotel_images hi on hi.hotels_id = h.id GROUP BY h.` name`;",(err,result) => {
            try {
                if(err) throw err
                res.send({
                    error: false,
                    message : "register success",
                    data : result
                })
            } catch (error) {
                res.send({
                    error: true,
                    message : error.message
                })
            }
        })
        
    }
}