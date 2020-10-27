const jwt = require('jsonwebtoken')


const jwtVerify = (req,res,next) => {
    const token = req.body.token
    if(!token) return res.json({error : true,message :"Token not found"})
    jwt.verify(token , '123abc' , (err,data) => {
        try {
            if(err) throw err
            req.bebas = data
            req.fikri = 'fikri'
            next()
        } catch (error) {
            res.json({
                error : true,
                message : error.message,
                detail : error
            })
        }
    })
}

module.exports = jwtVerify