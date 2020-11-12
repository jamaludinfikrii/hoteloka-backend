const db = require('./../database/mysql')
const sendNotif = require('./../helpers/sendNotif')
const redis = require('./../database/redis')
const client = require('./../database/redis')

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
                            ON SCHEDULE AT DATE_ADD(NOW(),INTERVAL 30 MINUTE)
                            DO
                                UPDATE transactions set status = 'failed' where id = ${result.insertId};
                        `, (err,response) => {
                            try {
                                if(err) throw err

                                let redisKey = 'transactions_user_id' + req.body.users_id
                                console.log(redisKey)
                                redis.del(redisKey,(err,ok) => {
                                    if(err) throw err
                                    res.send({
                                        error : false,
                                        message : "transaction created"
                                    })

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
        
    },

    paymentApproved : (req,res) => {

        let data = req.body // id_trans, token

        db.query('update transactions set status = "payment approved" where id = ? and users_id = ?',[data.id, req.bebas.id], (err,result) => {
            try {
                if(err) throw err

                db.query(`drop event auto_cancel_transaction_${data.id};`, (err,result) => {
                    try {
                        if(err) throw err

                        let dataNotif = {
                            app_id: "4d8e89c1-14ee-497e-a2a0-f6526cf4b285",
                            contents: {"en": "Transaction Approved"},
                            channel_for_external_user_ids: "push",
                            include_external_user_ids: [data.token],
                            url : "hotelokaApp://hommy/detailHotel/2"
                        }
                        sendNotif(dataNotif,res)

                    } catch (error) {
                        console.log(error)
                    }
                } )
            } catch (error) {
                console.log(error)
            }
        })
        // update transaction status
        // kill event auto cancel
        // send notification one signal
    }

    ,
    getAllTransactions : (req,res) => {
        var start = Date.now()

        redis.get('all_transactions',(err,redisData) => {
            if(err) throw err
            if(redisData){
                var end = Date.now()
                var resTime = end - start
                var redisParsed = JSON.parse(redisData)
                res.send({
                    resTime,
                    redisParsed
                })
            }else{
                db.query('select * from transactions', (err,result) => {
                    if(err) throw err
                    var end = Date.now()
                    var resultString = JSON.stringify(result)
                    redis.set('all_transactions',resultString,(err,ok) => {
                        if(err) throw err
                        var resTime = end - start
                        res.send({
                            resTime,
                            result
                        })
                    })
    
    
                    
                })
            }
        })
    }
    ,

    getTransactionsByIdUser : (req,res) => {
        let idUser = req.params.idUser
        let redisKey = 'transactions_user_id' + idUser

        client.get(redisKey,(err,redisData) => {
            if(err) throw err
            if(redisData){
                res.send({
                    redis : JSON.parse(redisData)
                })
            }else{
                db.query('select * from transactions where users_id = ?', idUser,(err,results) => {
                    if(err) throw err
                    redis.set(redisKey,JSON.stringify(results),(err,ok) => {
                        if(err) throw err
                        res.send({
                            db : results
                        })
                    })
                })
            }
        })
    }
}