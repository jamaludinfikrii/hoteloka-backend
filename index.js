const express = require('express');
const AuthRouter = require('./routers/authRouter')
const LoggingApi = require('./middleware/loggingApi')
const cors = require('cors');


const app = express()
app.use(express.json())
const PORT = 4000

app.use(cors())

app.get('/' , (req,res) => {
    res.send("Hello")
})


app.use(LoggingApi)
app.use('/auth',AuthRouter)

app.listen(PORT , () => console.log('API RUNNING ON PORT ' + PORT))





