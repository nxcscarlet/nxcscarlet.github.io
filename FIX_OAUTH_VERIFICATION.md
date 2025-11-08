# Hướng dẫn sửa lỗi "Chưa hoàn tất quy trình xác minh của Google"

## Vấn đề
Google chặn OAuth vì ứng dụng chưa được xác minh. Đây là bảo mật bình thường của Google.

## Giải pháp: Thêm Test Users

### Bước 1: Vào OAuth Consent Screen
1. Mở [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project của bạn
3. Vào **APIs & Services** → **OAuth consent screen**

### Bước 2: Kiểm tra Publishing status
- Nếu thấy **"Testing"** → Đây là chế độ đúng cho development
- Nếu thấy **"In production"** → Cần chuyển về Testing hoặc xác minh app

### Bước 3: Thêm Test Users
1. Scroll xuống phần **"Test users"**
2. Click **"+ ADD USERS"**
3. Thêm **email Gmail của bạn** (email bạn muốn dùng để đăng nhập)
4. Click **"ADD"**
5. **Lưu ý:** Có thể thêm tối đa 100 test users

### Bước 4: Lưu và thử lại
1. Scroll lên và click **"SAVE AND CONTINUE"** (nếu có)
2. Quay lại ứng dụng của bạn
3. Reload trang và thử đăng nhập lại

## Lưu ý quan trọng

### Nếu bạn muốn dùng cho nhiều người:
- **Option 1:** Giữ ở chế độ Testing và thêm tất cả email vào Test users (tối đa 100)
- **Option 2:** Submit app để Google xác minh (quy trình phức tạp, cần privacy policy, terms of service, etc.)

### Nếu chỉ dùng cho cá nhân:
- Chỉ cần thêm email của bạn vào Test users là đủ

## Kiểm tra lại

Sau khi thêm test user:
1. Đảm bảo bạn đã **logout** khỏi Google trong trình duyệt (nếu đã đăng nhập)
2. Hoặc dùng **Incognito/Private window** để test
3. Thử đăng nhập lại

## Nếu vẫn lỗi

1. Kiểm tra email bạn thêm có đúng không
2. Đảm bảo OAuth consent screen đã được **SAVE**
3. Đợi vài phút để Google cập nhật (có thể mất 1-2 phút)
4. Thử logout và login lại

