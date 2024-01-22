import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import { createServer } from 'node:http';
import { Server } from "socket.io";

const __dirname = fileURLToPath(path.dirname(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001; // Express 서버의 포트

// socket.io setup
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// // 정적 파일들은 빌드된 리액트 애플리케이션의 'dist' 디렉토리에서 제공
app.use(express.static(path.join(__dirname, 'dist')));

// // // 모든 요청에 대해 index.html을 반환하여 React 라우팅을 지원
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const backEndPlayers = {}

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});

// Express 서버를 시작
server.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});
