// 백엔드(서버)입니다. 두 가지 일을 합니다.
// 1) public/ 폴더의 화면 파일(프론트엔드)을 브라우저에 보내 줍니다.
// 2) /api/ 로 시작하는 주소(API)로 데이터를 주고받습니다. 데이터는 data/ 폴더의 파일에 저장합니다.
// 실행: npm install(처음 한 번) → npm run dev → 브라우저에서 http://localhost:3000
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SEED_FILE = path.join(__dirname, 'data', 'seed.json'); // 처음 데이터(가짜 데이터) — 저장소에 올린다
const DATA_FILE = path.join(__dirname, 'data', 'db.json'); // 실행 중에 바뀌는 데이터 — 저장소에 올리지 않는다(.gitignore)

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 저장된 데이터를 읽는다. db.json 이 없으면 seed.json 을 복사해서 시작한다.
function readItems() {
  if (!fs.existsSync(DATA_FILE)) fs.copyFileSync(SEED_FILE, DATA_FILE);
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveItems(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

// 목록 보기: GET /api/items
app.get('/api/items', (req, res) => {
  res.json(readItems());
});

// 새로 넣기: POST /api/items  보내는 데이터 예: { "name": "새 항목" }
app.post('/api/items', (req, res) => {
  const name = String((req.body && req.body.name) || '').trim();
  if (!name) {
    res.status(400).json({ error: '이름을 입력해 주세요.' });
    return;
  }
  const items = readItems();
  const item = { id: Date.now(), name: name };
  items.push(item);
  saveItems(items);
  res.status(201).json(item);
});

app.listen(PORT, () => {
  console.log(`서버가 켜졌습니다: http://localhost:${PORT}`);
});
