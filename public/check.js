const check = ()=>{
    $.ajax({
        url: "/whoami",
        type: "POST",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        success: function(msg) {
            if(msg.status == "err"){
                window.location.href = "/auth"
            }else{
                localStorage.setItem('userData', JSON.stringify({nick: msg.nick, id: msg.id}))
            }
        }
    });
}

