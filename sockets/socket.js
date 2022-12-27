const sqlite = require('sqlite3')
const db = new sqlite.Database('./chat.db')
const jwt = require('jsonwebtoken')
const config = require('config')
var msgID

const startSocket = (io)=>{
    io.on("connection", (socket) => {
        console.log("Успешное Соеденение")

        socket.on('sendMess', function(data) {
            try{
                const cand = jwt.verify(data.token, config.get('salt'))
                let time = Date()
                db.run(`INSERT INTO messages (owner_id, content, time_mark) VALUES (${cand.id}, '${data.msg}', '${time}')`)
                db.get(`SELECT seq FROM sqlite_sequence WHERE name="messages";`, (err, row)=>{
                    msgID = row.seq
                    io.emit('addMess', {id: msgID, author: cand.nick, msg: data.msg, time: time});
                })
                
            }catch(e){
                io.emit('toLogin',{})
            }
            
        });
        socket.on('hello', (userData)=>{
            io.emit('helloMess', {mess: `К нам присоединился <b>${userData.nick}</b>`})
        })

        socket.on('disconnect', ()=>{
            console.log("Disconnected")
        });
    });
}

module.exports = {startSocket}