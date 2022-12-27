$(document).ready(()=>{

    if(Notification.permission == "denied" || Notification.permission == "default"){
        Notification.requestPermission()
    }

    $('#toreg').on('click', ()=>{
        $('#login-form').hide()
        $('#reg-form').css('display', "flex")
    })
    $('#tolog').on('click',()=>{
        $('#reg-form').hide()
        $('#login-form').css('display', "flex")
    })

    $('#reg').submit((e)=>{
        e.preventDefault()

        const nick = $("#nickname").val()
        const pass = $("#password").val()

        if(!nick || !pass){
            new Notification('ОШИБКА', {body: "Не заполнены поля Логин или Пароль"})
        }else{
            const data = {nick: nick, pass: pass}
            $.ajax({
                type: "POST",
                url: '/registration',
                cache: false,
                contentType: "application/json",
                data: JSON.stringify(data),
                beforeSend:function (){
                    $('#submit-reg').prop('disabled', true)
                },
                success: function(msg){
                    if(msg.status != "err"){
                        $('#reg-form').hide()
                        $('#login-form').show()
                        return new Notification("Операция выполнена успешно", {body: msg.msg})
                    }else{
                        $('#submit-reg').prop('disabled', false)
                        return new Notification("Произошла ошибка", {body: msg.msg})
                    }
                    
                }
            })

        }
    })
    $('#login').submit((e)=>{
        e.preventDefault()

        const nick = $("#nick").val()
        const pass = $("#pass").val()

        if(!nick || !pass){
            new Notification('ОШИБКА', {body: "Не заполнены поля Логин или Пароль"})
        }else{
            const data = {nick: nick, pass: pass}
            $.ajax({
                type: "POST",
                url: '/login',
                cache: false,
                contentType: "application/json",
                data: JSON.stringify(data),
                beforeSend:function (){
                    $('#submit-login').prop('disabled', true)
                },
                success: function(msg){
                    if(msg.status != "err"){
                        localStorage.setItem('token', msg.token)
                        window.location.href = "/"
                    }else{
                        $('#submit-login').prop('disabled', false)
                        return new Notification("Произошла ошибка", {body: msg.msg})
                    }
                    
                }
            })

        }
    })
})

