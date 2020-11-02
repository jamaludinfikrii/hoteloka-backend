const db = require('./../database/mysql')
const query = require('./../database/mysqlAsync')

module.exports = {
    getAllHotels : (req,res) => {

        db.query("SELECT h.id,h.`name`, min(r.price) as price,address, phone,star,hi.url FROM hotels h JOIN rooms r on h.id = r.hotels_id JOIN hotel_images hi on hi.hotels_id = h.id GROUP BY h.`name`;",(err,result) => {
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
        
    },

    getHotelDetailById : async (req,res) => {
        const id = req.params.id
        let queryRooms = 'SELECT r.id,r.`name`, guest_count,price,hotels_id,room_counts, GROUP_CONCAT(DISTINCT(ri.url)) as room_image FROM rooms r JOIN room_images ri on r.id = ri.rooms_id WHERE hotels_id = ? GROUP BY rooms_id; '
        let queryFacilities = 'SELECT facilities_id,`name`,icon FROM hotels_has_facilities h JOIN facilities f ON h.facilities_id = f.id WHERE h.hotels_id = ?;'
        let queryHotelImages = 'SELECT * FROM hotel_images WHERE hotels_id = ?;'
        let queryHotelsData = 'select * from hotels where id = ?'

        // callback hell
        // db.query(queryHotelsData , id,(err,hotelData) => {
        //     try {
        //         if(err) throw err

        //         db.query(queryFacilities , id, (err,facilities) => {
        //             try {
        //                 if(err) throw err

        //             } catch (error) {
                        
        //             }
        //         })
        //     } catch (error) {
                
        //     }
        // })

        try {
            let hotelsData = await query(queryHotelsData,id)
            let facilities = await query(queryFacilities,id)
            let rooms = await query(queryRooms,id)
            let hotelImages = await query(queryHotelImages,id)            

            res.send({
                error: false,
                hotels : hotelsData[0],
                facilities : facilities,
                rooms : rooms,
                hotelImages : hotelImages
            })
        } catch (error) {
            console.log(error)
        }
       

        
    }
}