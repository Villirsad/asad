const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sql = require('sqlite3')
const config = require("config")

const db = new sql.Database('./chat.db')

router.post('/login', (req, res)=>{
    db.get(`SELECT * FROM users WHERE nick = '${req.body.nick}';`, (err, row)=>{
        if(!row){
            return res.status(200).json({status: "err", msg: "Пользователь не найден"})
        }
        if(bcrypt.compareSync(req.body.pass, row.pass)){
            const token = jwt.sign({id: row.id, nick: row.nick}, config.get('salt'), {expiresIn: "1h"})
            return res.status(200).json({status: "ok", token: token})
        }else{
            return res.status(200).json({status: "err", msg: "Пользователь не найден"})
        }
    })
})

router.post('/registration', (req, res)=>{
    db.all(`SELECT * FROM users WHERE nick = '${req.body.nick}';`, (err, rows)=>{
        if(rows.length != 0){
            return res.status(200).json({status: "err", msg: "Такой пользователь уже есть"})
        }

        const crypt = bcrypt.hashSync(req.body.pass, 12);
        try {
            db.run(`INSERT INTO users (nick, pass) VALUES ('${req.body.nick}', '${crypt}');`)
            return res.status(200).json({status: "ok", msg: "Пользователь добавлен"})
        } catch (error) {
            return res.status(500).json({status: "err", msg: "Database server error"})
        }
    })    
})

router.post('/getmessage', (req, res)=>{
    try {
        db.all(`SELECT messages.id, content, time_mark, nick FROM messages INNER JOIN users ON messages.owner_id = users.id;`, (err, rows)=>{
            console.log(rows)
            return res.status(200).json({status: "ok", data: rows})
        })
    } catch (error) {
        return res.status(200).json({status: "err", msg: "Ошибка запроса к базе данных"})
    }
    
})

module.exports = router