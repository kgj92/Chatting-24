const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS 설정
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

// 상태 확인용
app.get('/', (req, res) => {
  res.send('서버 실행 중입니다.');
});

// 서버 메모리에 메시지 저장 (type, content 형태로)
const messages = [];

io.on('connection', (socket) => {
  console.log('사용자 접속');

  // 기존 메시지 보내기
  messages.forEach((msg) => {
    socket.emit('chat message', msg);
  });

  // 새 메시지 수신 처리
  socket.on('chat message', (msg) => {
    if (msg && typeof msg === 'object' && msg.type && msg.content) {
      messages.push(msg);
      io.emit('chat message', msg);
    }
  });

  socket.on('disconnect', () => {
    console.log('사용자 접속 종료');
  });
});

// 포트 설정 및 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
