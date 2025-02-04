const express = require('express');
const cors = require('cors'); // cors 패키지 가져오기
const app = express();
const port = 3000;

// CORS 설정
app.use(cors()); // 모든 도메인에 대해 CORS 허용

const partyRoutes = require('./routes/partyRoutes');
const userRoutes = require('./routes/userRoutes');
const clothRoutes = require('./routes/clothRoutes');

app.use(express.json());

// 파티 관련 라우트
app.use('/party', partyRoutes);
app.use('/user', userRoutes);
app.use('/cloth', clothRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
