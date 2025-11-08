# Hướng dẫn Deploy lên GitHub và Domain nxcscarlet.xyz

## Bước 1: Chuẩn bị code

### 1.1. Tạo file .gitignore
Tạo file `.gitignore` để không commit các file không cần thiết:

```
# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log

# Backup files
*_backup.js
script_backup.js
```

### 1.2. Tạo file README.md (tùy chọn)
Tạo file README.md để mô tả project (nếu muốn công khai).

---

## Bước 2: Tạo GitHub Repository

1. Đăng nhập vào [GitHub](https://github.com)
2. Click nút **"New"** hoặc **"+"** → **"New repository"**
3. Đặt tên repository (ví dụ: `pokemon-mail-manager`)
4. Chọn **Public** (nếu muốn công khai) hoặc **Private**
5. **KHÔNG** tích "Initialize with README" (vì đã có code)
6. Click **"Create repository"**

---

## Bước 3: Push code lên GitHub

Mở Terminal/PowerShell trong thư mục project và chạy:

```bash
# Khởi tạo git (nếu chưa có)
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit: Pokemon Mail Manager"

# Thêm remote repository (thay YOUR_USERNAME và REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

**Lưu ý:** Thay `YOUR_USERNAME` và `REPO_NAME` bằng thông tin thực tế của bạn.

---

## Bước 4: Cấu hình GitHub Pages

### Option 1: Sử dụng GitHub Pages (Miễn phí)

1. Vào repository trên GitHub
2. Click **Settings** → **Pages**
3. Trong **Source**, chọn **Deploy from a branch**
4. Chọn branch: **main**
5. Chọn folder: **/ (root)**
6. Click **Save**
7. Đợi vài phút, GitHub sẽ tạo URL: `https://YOUR_USERNAME.github.io/REPO_NAME`

### Option 2: Sử dụng domain riêng (nxcscarlet.xyz)

1. Vào repository → **Settings** → **Pages**
2. Trong **Custom domain**, nhập: `nxcscarlet.xyz`
3. Click **Save**
4. GitHub sẽ tạo file `CNAME` trong repository

---

## Bước 5: Cấu hình DNS cho Domain

### 5.1. Thêm DNS Records

Vào nhà cung cấp domain (nơi bạn mua nxcscarlet.xyz) và thêm DNS records:

**Option A: Sử dụng GitHub Pages (Khuyến nghị)**
```
Type: A
Name: @
Value: 185.199.108.153
TTL: 3600

Type: A
Name: @
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @
Value: 185.199.111.153
TTL: 3600

Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
TTL: 3600
```

**Option B: Sử dụng Cloudflare Pages hoặc Netlify**
- Nếu dùng Cloudflare Pages: thêm CNAME record trỏ về Cloudflare
- Nếu dùng Netlify: thêm CNAME record trỏ về Netlify

### 5.2. Đợi DNS propagate
- Thường mất 5-30 phút, có thể lên đến 24-48 giờ
- Kiểm tra bằng: https://dnschecker.org

---

## Bước 6: Cập nhật Google Cloud Console

**QUAN TRỌNG:** Cần cập nhật OAuth settings để domain mới hoạt động.

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project của bạn
3. Vào **APIs & Services** → **Credentials**
4. Click vào **OAuth 2.0 Client ID** của bạn
5. Trong **Authorized JavaScript origins**, thêm:
   - `https://nxcscarlet.xyz`
   - `https://www.nxcscarlet.xyz`
   - `https://YOUR_USERNAME.github.io` (nếu dùng GitHub Pages)
6. Click **Save**

---

## Bước 7: Cập nhật code (nếu cần)

Nếu bạn muốn ẩn Client ID và API Key, có thể:
- Tạo file `config.js` và thêm vào `.gitignore`
- Hoặc sử dụng environment variables (nếu dùng Netlify/Vercel)

**Lưu ý:** Với static site, Client ID và API Key sẽ hiển thị trong source code (đây là bình thường với OAuth public clients).

---

## Bước 8: Kiểm tra

1. Truy cập: `https://nxcscarlet.xyz`
2. Kiểm tra console (F12) xem có lỗi không
3. Thử đăng nhập Gmail
4. Kiểm tra các chức năng hoạt động

---

## Troubleshooting

### Lỗi "Redirect URI mismatch"
- Kiểm tra lại **Authorized JavaScript origins** trong Google Cloud Console
- Đảm bảo URL chính xác (có https, không có trailing slash)

### DNS chưa hoạt động
- Đợi thêm thời gian (có thể đến 48h)
- Kiểm tra DNS bằng: `nslookup nxcscarlet.xyz`
- Xóa cache DNS: `ipconfig /flushdns` (Windows)

### GitHub Pages không load
- Kiểm tra file `index.html` có ở root không
- Kiểm tra Settings → Pages đã enable chưa
- Xem Actions tab để kiểm tra lỗi build

---

## Alternative: Sử dụng Netlify hoặc Vercel

Nếu không muốn dùng GitHub Pages, có thể dùng:

### Netlify:
1. Đăng ký tại [netlify.com](https://netlify.com)
2. Kết nối GitHub repository
3. Deploy tự động
4. Thêm custom domain: nxcscarlet.xyz

### Vercel:
1. Đăng ký tại [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Deploy tự động
4. Thêm custom domain: nxcscarlet.xyz

---

## Lưu ý bảo mật

1. **API Key và Client ID:** Với OAuth public clients, việc hiển thị trong code là bình thường
2. **Rate Limits:** Google API có giới hạn, nên monitor usage
3. **HTTPS:** Đảm bảo domain có SSL certificate (GitHub Pages tự động có)

---

## Checklist

- [ ] Tạo GitHub repository
- [ ] Push code lên GitHub
- [ ] Enable GitHub Pages
- [ ] Cấu hình custom domain trong GitHub
- [ ] Thêm DNS records
- [ ] Cập nhật Google Cloud Console (Authorized origins)
- [ ] Kiểm tra website hoạt động
- [ ] Test đăng nhập Gmail
- [ ] Test các chức năng

---

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
- GitHub Pages documentation: https://docs.github.com/en/pages
- Google OAuth setup: https://developers.google.com/identity/protocols/oauth2

