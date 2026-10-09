// 화면 동작(프론트엔드)입니다. 서버(백엔드)의 API 에서 데이터를 받아 화면에 보여 주고, 새 항목을 서버에 보냅니다.
const list = document.getElementById('list');
const statusText = document.getElementById('status');
const form = document.getElementById('add-form');
const nameInput = document.getElementById('name');

// 서버에서 목록을 받아 화면에 그린다
async function loadItems() {
  const res = await fetch('/api/items');
  const items = await res.json();
  list.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.name; // textContent: 입력한 글자를 그대로 보여 준다(HTML 로 해석하지 않는다)
    list.appendChild(li);
  });
  statusText.textContent = `항목 ${items.length}개`;
}

// [추가]를 누르면 서버에 보내고, 목록을 다시 받아 그린다
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nameInput.value }),
  });
  if (!res.ok) {
    const body = await res.json();
    statusText.textContent = body.error;
    return;
  }
  nameInput.value = '';
  await loadItems();
});

loadItems().catch(() => {
  statusText.textContent = '서버에 연결하지 못했습니다. 터미널에서 npm run dev 로 서버를 켰는지 확인해 주세요.';
});
