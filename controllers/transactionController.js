const db = require('./../database/mysql')

module.exports = {
    createTransaction : (req,res) => {
        let data = req.body  // {begin_book_date,end_book_date,rooms_id,users_id}

        db.query('insert into transactions set ?',data,(err,result) => {
            try {
                if(err) throw err

                db.query('select * from transactions where id = ?', result.insertId,(err,data) => {
                    try {
                        if(err) throw err
                        let expired_at = data[0].expired_at
                        expired_at = new Date(expired_at)
                        expired_at = `${expired_at.getFullYear()}-${expired_at.getMonth() + 1}-${expired_at.getDate()} ${expired_at.getHours()}:${expired_at.getMinutes()}:${expired_at.getSeconds()}`
                        console.log(expired_at)
                        db.query(`
                            CREATE EVENT auto_cancel_transaction_${result.insertId}
                            ON SCHEDULE AT DATE_ADD(NOW(),INTERVAL 30 SECOND)
                            DO
                                UPDATE transactions set status = 'failed' where id = ${result.insertId};
                        `, (err,response) => {
                            try {
                                if(err) throw err
                                res.send({
                                    error : false,
                                    message : "transaction created"
                                })
                            } catch (error) {
                                console.log(error)
                            }
                        })
                    } catch (error) {
                        console.log(error)
                    }
                })

            } catch (error) {
                console.log(error)
            }
        })
        
    }
}