# Hướng dẫn chạy Local Server

## Vấn đề
Google APIs không hoạt động với `file://` protocol. Bạn cần chạy qua HTTP server.

## Cách 1: Dùng Python (Khuyến nghị)

### Python 3:
```bash
cd "c:\Users\user\Pictures\Project\index.html\pokemon_mail_manager_v4"
python -m http.server 8000
```

### Python 2:
```bash
cd "c:\Users\user\Pictures\Project\index.html\pokemon_mail_manager_v4"
python -m SimpleHTTPServer 8000
```

Sau đó mở trình duyệt: `http://localhost:8000`

## Cách 2: Dùng Node.js (nếu đã cài)

```bash
cd "c:\Users\user\Pictures\Project\index.html\pokemon_mail_manager_v4"
npx http-server -p 8000
```

Sau đó mở trình duyệt: `http://localhost:8000`

## Cách 3: Dùng VS Code Live Server Extension

1. Cài extension "Live Server" trong VS Code
2. Click chuột phải vào `index.html`
3. Chọn "Open with Live Server"

## Cách 4: Dùng PHP (nếu đã cài)

```bash
cd "c:\Users\user\Pictures\Project\index.html\pokemon_mail_manager_v4"
php -S localhost:8000
```

## Lưu ý quan trọng

Khi chạy qua local server, bạn cần cập nhật **Authorized JavaScript origins** trong Google Cloud Console:

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Click vào OAuth 2.0 Client ID của bạn
4. Thêm vào **Authorized JavaScript origins**:
   - `http://localhost:8000` (hoặc port bạn dùng)
   - `http://127.0.0.1:8000`

Sau đó reload trang và thử lại!

