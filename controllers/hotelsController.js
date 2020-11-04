const db = require('./../database/mysql')
const query = require('./../database/mysqlAsync')

module.exports = {
    getAllHotels : (req,res) => {
        let searchDate = req.query.date
        console.log(searchDate)
        db.query(`select h.id,h.name, min(r.price) as price,address, phone,star,hi.url from hotels h 
        join rooms r on h.id = r.hotels_id
        join hotel_images hi on hi.hotels_id = h.id 
        where h.id in(
        select hotels_id from rooms where id in(
        select get_room_id_available(?,id,room_counts) from rooms)) GROUP BY h.name;`,searchDate,(err,result) => {
            try {
                if(err) throw err
                res.send({
                    error: false,
                    message : "register success",
                    data : result
                })

                console.log(result.length)
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
        const date = req.query.date
        let queryRooms = `SELECT r.id,r.name, guest_count,price,hotels_id,room_counts, GROUP_CONCAT(DISTINCT(ri.url)) as room_image,get_count_rooms_available(?,r.id,room_counts) as room_left FROM rooms r JOIN room_images ri on r.id = ri.rooms_id WHERE hotels_id = ? GROUP BY rooms_id;`
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
            console.log(date)
            let hotelsData = await query(queryHotelsData,id)
            let facilities = await query(queryFacilities,id)
            let rooms = await query(queryRooms,[date,id])
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