const oo = n => n.toString().padStart(2, '0');

const formatDate = date => {
  const d = new Date(date);
  const month = oo(d.getMonth() + 1);
  const day = oo(d.getDate());
  const year = d.getFullYear();

  return [year, month, day].join('-');
};

const onMessage = (data, cred) => {
  const { time_mark: timeMark, id, nick, content } = data;
  const { nick: credNick } = cred;
  const msgDate = formatDate(timeMark);
  const currentDate = formatDate(new Date());
  const date = new Date(timeMark); // 2009-11-10
  const time = [date.getHours(), date.getMinutes()].map(oo).join(':');

  let Strtime;
  if (msgDate === currentDate) {
    Strtime = 'Сегодня в ' + time;
  } else {
    const month = date.toLocaleString('default', { month: 'long' });
    Strtime = `${oo(date.getDay())} ${month} ${date.getFullYear()}, в ${time}`;
  }

  $('#msg-container').append(`
      <div class="msg-box" id='${id}' class="${nick === credNick ? '' : 'not-my'}">
          <p class="author">${nick}</p>
          <p class="msg-text">${content}</p>
          <span class="time">${Strtime}</span>
      </div>
  `);
};

$(document).ready(() => {
  check();
  const socket = io();
  const cred = JSON.parse(localStorage.getItem('userData'));
  $.ajax({
    url: '/getmessage',
    type: 'POST',
    success({ status, msg, data }) {
      if (status === 'err') {
        return new Notification('Ошибка', { body: msg });
      }
      data.forEach(message => onMessage(message, cred));
      $('#all_mess').scrollTop($('#msg-container').height());
    },
  });

  socket.emit('hello', { nick: cred.nick });

  $('#messForm').submit(e => {
    e.preventDefault();
    const msg = $('#message').val();
    if (msg) {
      socket.emit('sendMess', { token: localStorage.getItem('token'), msg });
      $('#message').val('');
    }
  });

  socket.on('addMess', data => {
    onMessage(data, cred);
    $('#all_mess').scrollTop($('#msg-container').height());
  });

  socket.on('toLogin', () => {
    window.location.href = '/auth';
  });

  socket.on('helloMess', str => {
    $('#msg-container').append(`<span class="hello">${str.mess}</span>`);
    $('#all_mess').scrollTop($('#msg-container').height());
  });
});

function hideEl() {
  $('.hello').hide();
}