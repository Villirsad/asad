const express = require('express')
const router = express.Router()
const config = require('config')
const jwt = require('jsonwebtoken')

router.post('/whoami', (req, res)=>{
    const token = req.headers.authorization
    try{
        const decoded = jwt.verify(token, config.get('salt'))
        return res.status(200).json({
            status: "ok",
            id: decoded.id,
            nick: decoded.nick
        })
    }catch(e){
        return res.status(200).json({status: "err"})
    }
})

module.exports = router