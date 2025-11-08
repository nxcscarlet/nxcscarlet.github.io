// v4 - final demo
const KEY_PRODUCTS = 'pm_products_v4';
const KEY_ACCOUNTS = 'pm_accounts_v4';
const KEY_RESULTS = 'pm_results_v4'; // structure: { productId: { account: {chuusen:bool, result:'win'|'lose'|'', bought:bool, cancelled:bool, time:timestamp} } }

// Helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function saveProducts(p) { localStorage.setItem(KEY_PRODUCTS, JSON.stringify(p)); }
function loadProducts() { const s = localStorage.getItem(KEY_PRODUCTS); return s ? JSON.parse(s) : []; }
function saveAccounts(a) { localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(a)); }
function loadAccounts() { const s = localStorage.getItem(KEY_ACCOUNTS); return s ? JSON.parse(s) : []; }
function saveResults(r) { localStorage.setItem(KEY_RESULTS, JSON.stringify(r)); }
function loadResults() { const s = localStorage.getItem(KEY_RESULTS); return s ? JSON.parse(s) : {}; }

// State
let products = loadProducts();
let accounts = loadAccounts();
let results = loadResults();

// --- Product modal ---
const modal = $('#modal');
if (modal) modal.style.display = 'none';
const prodName = $('#prodName');
const prodId = $('#prodId');
const saveProduct = $('#saveProduct');
const cancelProduct = $('#cancelProduct');

const editProductsModal = $('#editProductsModal');
const editProductsBtn = $('#editProductsBtn');
const addProductInEditModal = $('#addProductInEditModal');
const closeEditProductsModal = $('#closeEditProductsModal');

cancelProduct.addEventListener('click', closeModal);

function closeModal() {
  modal.style.display = 'none'; // Ẩn modal khi nhấn "Hủy"
  modal.setAttribute('aria-hidden', 'true');
}

saveProduct.addEventListener('click', () => {
  const name = prodName.value.trim();
  const id = prodId.value.trim();
  if (!name || !id) {
    alert('Vui lòng nhập ID và tên sản phẩm');
    return;
  }

  // Tránh trùng ID
  if (products.find(p => p.id === id)) {
    if (!confirm('ID này đã tồn tại. Tiếp tục thêm?')) return;
  }

  // Thêm sản phẩm vào danh sách
  products.push({ id, name });
  saveProducts(products);

  // Cập nhật lại giao diện
  renderProductSelect();
  renderProductsListInModal();

  // Đóng modal
  closeModal();
});

function closeModal() {
  if (modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
}

function closeEditProductsModalFunc() {
  if (editProductsModal) {
    editProductsModal.style.display = 'none';
    editProductsModal.setAttribute('aria-hidden', 'true');
  }
}

if (cancelProduct) cancelProduct.addEventListener('click', closeModal);

// Mở modal quản lý sản phẩm
if (editProductsBtn) {
  editProductsBtn.addEventListener('click', () => {
    renderProductsListInModal();
    if (editProductsModal) {
      editProductsModal.style.display = 'grid';
      editProductsModal.setAttribute('aria-hidden', 'false');
    }
  });
}

if (closeEditProductsModal) {
  closeEditProductsModal.addEventListener('click', closeEditProductsModalFunc);
}

if (addProductInEditModal) {
  addProductInEditModal.addEventListener('click', () => {
    if (prodName) prodName.value = '';
    if (prodId) prodId.value = '';
    if (modal) {
      modal.style.display = 'grid';
      modal.setAttribute('aria-hidden', 'false');
      if (prodName) prodName.focus();
    }
  });
}

// Render danh sách sản phẩm trong modal
function renderProductsListInModal() {
  const tbody = $('#productsListBody');
  if (!tbody) return;
  
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="padding:12px;text-align:center;color:var(--muted);">Chưa có sản phẩm nào</td></tr>';
    return;
  }
  
  tbody.innerHTML = products.map((p) => {
    return `<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
      <td style="padding:8px;text-align:left;">${p.name}</td>
      <td style="padding:8px;">${p.id}</td>
      <td style="padding:8px;text-align:center;">
        <button class="btn ghost" onclick="deleteProduct('${p.id}')" style="padding:4px 8px;font-size:12px;">Xóa</button>
      </td>
    </tr>`;
  }).join('');
}

window.deleteProduct = function(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  if (!confirm(`Xóa sản phẩm "${prod.name}"?`)) return;
  
  products = products.filter(p => p.id !== productId);
  saveProducts(products);
  
  if (results[productId]) {
    delete results[productId];
    saveResults(results);
  }
  
  renderProductSelect();
  renderProductsListInModal();
  renderTable();
};

// ---- Rendering helpers ----
function renderProductSelect() {
  const select = $('#productSelect');
  if (!select) return;
  const current = select.value;
  select.innerHTML = '<option value="">-- Chưa có sản phẩm --</option>' +
    products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  if (current && products.some(p => p.id === current)) {
    select.value = current;
  }
}

function updateAccountCount() {
  const el = $('#accountCount');
  if (!el) return;
  el.textContent = accounts.length ? `${accounts.length} tài khoản` : 'Chưa có tài khoản';
}

function setEmptyVisible(isEmpty) {
  const empty = $('#empty');
  if (!empty) return;
  empty.style.display = isEmpty ? 'block' : 'none';
}

function renderTable() {
  const tbody = $('#resultTable tbody');
  const select = $('#productSelect');
  if (!tbody || !select) return;
  const productId = select.value;
  tbody.innerHTML = '';
  
  if (!accounts.length) {
    setEmptyVisible(true);
    return;
  }
  
  const productResults = productId ? (results[productId] || {}) : {};
  const rows = accounts.map((acc, idx) => {
    const r = productResults[acc];
    
    // Hiển thị: ✓ cho có, - cho chưa có, X cho trượt
    let chuusenText = '';
    let resultText = '';
    let boughtText = '';
    let cancelledText = '';
    
    if (r) {
      chuusenText = r.chuusen ? '✓' : '-';
      if (r.result === 'win') resultText = '✓';
      else if (r.result === 'lose') resultText = 'X';
      else resultText = '-';
      boughtText = r.bought ? '✓' : '-';
      cancelledText = r.cancelled ? '✓' : '-';
    } else {
      chuusenText = '-';
      resultText = '-';
      boughtText = '-';
      cancelledText = '-';
    }
    
    return `<tr><td>${idx + 1}</td><td>${acc}</td><td>${chuusenText}</td><td>${resultText}</td><td>${boughtText}</td><td>${cancelledText}</td></tr>`;
  }).join('');
  tbody.innerHTML = rows;
  setEmptyVisible(false);
}

// ---- Event handlers ----
const productSelect = $('#productSelect');
const fileInput = $('#fileInput');
const clearAccountsBtn = $('#clearAccounts');
const exportCsvBtn = $('#exportCsv');

if (productSelect) {
  productSelect.addEventListener('change', () => {
    renderTable();
  });
}

if (fileInput) {
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);
    accounts = Array.from(new Set(lines));
    saveAccounts(accounts);
    updateAccountCount();
    renderTable();
    e.target.value = '';
  });
}

if (clearAccountsBtn) {
  clearAccountsBtn.addEventListener('click', () => {
    if (!accounts.length) return;
    if (!confirm('Xóa toàn bộ danh sách tài khoản?')) return;
    accounts = [];
    saveAccounts(accounts);
    updateAccountCount();
    renderTable();
  });
}

function exportCsvData() {
  const pid = productSelect ? productSelect.value : '';
  if (!pid) {
    alert('Hãy chọn sản phẩm để export CSV');
    return;
  }
  if (!accounts.length) {
    alert('Chưa có tài khoản');
    return;
  }
  const productResults = results[pid] || {};
  const header = ['STT', 'TaiKhoan', 'UngTuyen', 'KetQua', 'Mua', 'BiHuy', 'Time'];
  const rows = accounts.map((acc, idx) => {
    const r = productResults[acc] || {};
    return [
      idx + 1,
      acc,
      r.chuusen ? '1' : '0',
      r.result || '',
      r.bought ? '1' : '0',
      r.cancelled ? '1' : '0',
      r.time ? new Date(r.time).toISOString() : ''
    ];
  });
  const csv = [header, ...rows]
    .map(arr => arr.map(v => {
      const s = String(v);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replaceAll('"', '""') + '"';
      }
      return s;
    }).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `results_${pid}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

if (exportCsvBtn) {
  exportCsvBtn.addEventListener('click', exportCsvData);
}

function setDefaultDateRange() {
  const dateFromInput = $('#dateFrom');
  const dateToInput = $('#dateTo');
  
  if (!dateFromInput || !dateToInput) return;
  
  // Chỉ set mặc định nếu chưa có giá trị
  if (!dateFromInput.value || !dateToInput.value) {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    // Format: YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    dateFromInput.value = formatDate(sevenDaysAgo);
    dateToInput.value = formatDate(today);
  }
}

function boot() {
  renderProductSelect();
  renderProductsListInModal();
  updateAccountCount();
  renderTable();
  setDefaultDateRange();
}

document.addEventListener('DOMContentLoaded', boot);

// ================= Gmail Integration =================
// NOTE: Cần điền CLIENT_ID và API_KEY từ Google Cloud Console
const GOOGLE_CLIENT_ID = '874623567859-j3gc7ev60ir4jnhd9jjfsbpngm79b2fv.apps.googleusercontent.com';
const GMAIL_API_KEY = 'AIzaSyADJ4dkBPW43IFwOLmOeEpaeiUmm3YEdDg';
const GMAIL_SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

let googleTokenClient = null;
let gapiInited = false;
let gisInited = false;
let gapiLoading = false;

function gapiLoaded() {
  if (gapiLoading || gapiInited) return;
  if (!window.gapi || !window.gapi.load) return;
  gapiLoading = true;
  gapi.load('client', {
    callback: function() {
      initGapiClient();
      gapiLoading = false;
    },
    onerror: function() {
      gapiLoading = false;
    },
    timeout: 10000,
    ontimeout: function() {
      gapiLoading = false;
    }
  });
}

async function initGapiClient() {
  try {
    if (!gapi.client) throw new Error('gapi.client is not available');
    await gapi.client.init({
      apiKey: GMAIL_API_KEY,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest']
    });
    gapiInited = true;
    updateGmailAccountDisplay();
  } catch (e) {
    console.error('Gmail API init error:', e);
  }
}

function gisLoaded() {
  try {
    googleTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GMAIL_SCOPES,
      callback: ''
    });
    gisInited = true;
  } catch (e) {
    console.error('GIS init error:', e);
  }
}

window.gapiLoaded = gapiLoaded;
window.gisLoaded = gisLoaded;

async function updateGmailAccountDisplay() {
  const accountInfoEl = $('#gmailAccountInfo');
  if (!accountInfoEl) return;
  const token = gapi.client ? gapi.client.getToken() : null;
  if (!token) {
    accountInfoEl.innerHTML = '<button id="gmailSignInBtnHeader" class="btn">Đăng nhập Gmail</button>';
    const btn = $('#gmailSignInBtnHeader');
    if (btn) btn.addEventListener('click', handleGmailSignIn);
    return;
  }
  try {
    const profile = await gapi.client.gmail.users.getProfile({ userId: 'me' });
    const email = profile.result.emailAddress || '';
    if (email) {
      accountInfoEl.innerHTML = `<div style="color:var(--muted);font-size:14px;">Tài khoản: ${email}</div>`;
    }
  } catch (e) {
    accountInfoEl.innerHTML = '<button id="gmailSignInBtnHeader" class="btn">Đăng nhập Gmail</button>';
    const btn = $('#gmailSignInBtnHeader');
    if (btn) btn.addEventListener('click', handleGmailSignIn);
  }
}

async function handleGmailSignIn() {
  const ok = await ensureGmailAuth();
  if (ok) await updateGmailAccountDisplay();
}

async function ensureGmailAuth() {
  if (!gapiInited || !gisInited) {
    alert('Gmail chưa sẵn sàng. Vui lòng đợi scripts tải xong.');
    return false;
  }
  const token = gapi.client.getToken();
  if (token) {
    await updateGmailAccountDisplay();
    return true;
  }
  return new Promise((resolve) => {
    googleTokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        alert('Xác thực Gmail thất bại: ' + (resp.error || 'Unknown error'));
        resolve(false);
        return;
      }
      await updateGmailAccountDisplay();
      resolve(true);
    };
    googleTokenClient.requestAccessToken({ prompt: '' });
  });
}

function classifyByKeywords(text) {
  const hasChuusen = text.includes('応募完了');
  const isWin = text.includes('当選');
  const isLose = text.includes('落選');
  const bought = text.includes('注文完了');
  const cancelled = text.includes('キャンセル');
  return { hasChuusen, isWin, isLose, bought, cancelled };
}

function extractEmailsFromField(fieldValue) {
  if (!fieldValue) return [];
  const emails = [];
  const parts = fieldValue.split(',');
  parts.forEach(part => {
    part = part.trim();
    const match = part.match(/<([^>]+)>/);
    if (match) {
      emails.push(match[1].trim().toLowerCase());
    } else if (part.includes('@')) {
      emails.push(part.trim().toLowerCase());
    }
  });
  return emails;
}

function extractTextFromPayload(payload) {
  let texts = [];
  function walk(part) {
    if (!part) return;
    if (part.mimeType === 'text/plain' && part.body && part.body.data) {
      texts.push(atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/')));
    } else if (part.mimeType === 'text/html' && part.body && part.body.data) {
      const html = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      texts.push(tmp.textContent || tmp.innerText || '');
    }
    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(walk);
    }
  }
  walk(payload);
  return texts.join('\n');
}

function headersToObject(headersArray) {
  const obj = {};
  (headersArray || []).forEach(h => { obj[h.name.toLowerCase()] = h.value; });
  return obj;
}

function buildGmailQuery(dateFrom, dateTo) {
  const tokens = [];
  // Chỉ quét email từ info@pokemoncenter-online.com
  tokens.push('from:info@pokemoncenter-online.com');
  // Chỉ quét email trong Hộp thư chính (Inbox), bỏ qua thư rác và quảng cáo
  tokens.push('in:inbox');
  // Loại trừ thư rác và quảng cáo để chắc chắn
  tokens.push('-in:spam');
  tokens.push('-in:promotions');
  if (dateFrom) tokens.push(`after:${dateFrom.replaceAll('-', '/')}`);
  if (dateTo) tokens.push(`before:${dateTo.replaceAll('-', '/')}`);
  return tokens.join(' ');
}

function updateScanProgress(current, total) {
  const progressEl = $('#scanProgress');
  if (!progressEl) return;
  if (current === 0 && total === 0) {
    progressEl.classList.add('hidden');
    return;
  }
  progressEl.classList.remove('hidden');
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  progressEl.textContent = `Đang quét: ${current}/${total} email (${percent}%)`;
}

async function gmailListMessageIds(query, maxResults = 200) {
  const ids = [];
  let pageToken = undefined;
  do {
    const res = await gapi.client.gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: Math.min(500, maxResults),
      pageToken
    });
    const messages = res.result.messages || [];
    ids.push(...messages.map(m => m.id));
    pageToken = res.result.nextPageToken;
  } while (pageToken && ids.length < maxResults);
  return ids;
}

async function gmailGetMessage(id) {
  const res = await gapi.client.gmail.users.messages.get({ userId: 'me', id });
  return res.result;
}

async function scanGmailAndApplyResults() {
  const pid = productSelect ? productSelect.value : '';
  if (!pid) {
    alert('Hãy chọn sản phẩm trước khi quét Gmail');
    return;
  }
  if (!accounts.length) {
    alert('Chưa có tài khoản (email) để đối chiếu.');
    return;
  }
  
  // Lấy thông tin sản phẩm để kiểm tra (ID và tên)
  const product = products.find(p => p.id === pid);
  if (!product) {
    alert('Không tìm thấy sản phẩm');
    return;
  }
  const productId = product.id;
  const productName = product.name;
  
  const ok = await ensureGmailAuth();
  if (!ok) return;

  const dateFrom = ($('#dateFrom') && $('#dateFrom').value) || '';
  const dateTo = ($('#dateTo') && $('#dateTo').value) || '';
  const query = buildGmailQuery(dateFrom, dateTo);

  let messageIds = [];
  try {
    const progressEl = $('#scanProgress');
    if (progressEl) {
      progressEl.classList.remove('hidden');
      progressEl.textContent = 'Đang lấy danh sách email...';
    }
    messageIds = await gmailListMessageIds(query, 200);
  } catch (e) {
    console.error(e);
    updateScanProgress(0, 0);
    alert('Không thể lấy danh sách thư.');
    return;
  }
  
  if (messageIds.length === 0) {
    updateScanProgress(0, 0);
    alert('Không tìm thấy email nào trong khoảng thời gian đã chọn.');
    return;
  }
  
  if (!results[pid]) results[pid] = {};

  for (let i = 0; i < messageIds.length; i++) {
    try {
      updateScanProgress(i + 1, messageIds.length);
      const msg = await gmailGetMessage(messageIds[i]);
      const headersObj = headersToObject(msg.payload && msg.payload.headers);
      const bodyText = extractTextFromPayload(msg.payload || {});
      const joined = [headersObj.subject || '', headersObj.from || '', headersObj.to || '', bodyText].join('\n');
      
      /**
       * QUAN TRỌNG: Chỉ phân loại nếu email có chứa ID HOẶC tên sản phẩm
       * Chỉ cần có 1 trong 2 cái trùng khớp thì đều xét là đúng sản phẩm đang quét
       */
      if (!joined.includes(productId) && !joined.includes(productName)) {
        continue; // Bỏ qua email không có ID hoặc tên sản phẩm
      }
      
      const cls = classifyByKeywords(joined);
      
      const toEmails = extractEmailsFromField(headersObj.to || '');
      const ccEmails = extractEmailsFromField(headersObj.cc || '');
      const bccEmails = extractEmailsFromField(headersObj.bcc || '');
      const recipientEmails = [...toEmails, ...ccEmails, ...bccEmails];
      
      accounts.forEach(acc => {
        if (!acc) return;
        const accEmailLower = acc.trim().toLowerCase();
        if (recipientEmails.includes(accEmailLower)) {
          const prev = results[pid][acc] || { chuusen: false, result: '', bought: false, cancelled: false, time: 0 };
          const next = { ...prev };
          if (cls.hasChuusen) next.chuusen = true;
          if (cls.isWin) next.result = 'win';
          else if (cls.isLose) next.result = 'lose';
          if (cls.bought) next.bought = true;
          if (cls.cancelled) next.cancelled = true;
          next.time = Math.max(prev.time || 0, (msg.internalDate ? Number(msg.internalDate) : Date.now()));
          results[pid][acc] = next;
        }
      });
    } catch (e) {
      console.warn('Lỗi đọc thư', e);
    }
  }
  
  updateScanProgress(0, 0);
  saveResults(results);
  renderTable();
  alert(`Quét xong ${messageIds.length} email trong khoảng thời gian đã chọn.`);
}

const gmailScanBtn = $('#gmailScanBtn');
if (gmailScanBtn) {
  gmailScanBtn.addEventListener('click', scanGmailAndApplyResults);
}

// Kiểm tra định kỳ để init Gmail
setInterval(() => {
  if (window.gapi && window.gapi.load && !gapiInited && !gapiLoading) {
    gapiLoaded();
  }
  if (window.google && window.google.accounts && window.google.accounts.oauth2 && !gisInited) {
    gisLoaded();
  }
}, 1000);
