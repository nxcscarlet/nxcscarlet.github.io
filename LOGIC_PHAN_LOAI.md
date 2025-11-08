# Giải thích Logic Phân Loại Email

## Tổng quan

Hệ thống quét email từ Gmail và phân loại dựa trên các từ khóa tiếng Nhật để xác định:
1. **Đã chuusen hay chưa**
2. **Trúng hay trượt**
3. **Đã mua hay chưa**

---

## 1. CHUUSEN (応募完了)

### Từ khóa: `応募完了` (Ứng mộ hoàn tất)

**Logic:**
- Tìm kiếm từ khóa `応募完了` trong toàn bộ nội dung email (Subject + From + To + Body)
- **Nếu CÓ** từ khóa này → `chuusen = true` (Đã chuusen)
- **Nếu KHÔNG có** → `chuusen = false` (Chưa chuusen)

**Ví dụ:**
```
Email có nội dung: "応募完了いたしました" 
→ Kết quả: Đã chuusen ✓
```

---

## 2. KẾT QUẢ (Trúng/Trượt)

### Từ khóa 1: `当選` (Đương tuyển = Trúng thưởng)
### Từ khóa 2: `落選` (Lạc tuyển = Trượt)

**Logic:**
- Tìm kiếm từ khóa `当選` trong nội dung email
  - **Nếu CÓ** → `result = 'win'` (Trúng)
- Nếu KHÔNG có `当選`, tìm kiếm từ khóa `落選`
  - **Nếu CÓ** → `result = 'lose'` (Trượt)
- **Nếu KHÔNG có cả 2** → `result = ''` (Rỗng, chưa có kết quả)

**Lưu ý:**
- Nếu email có cả `当選` và `落選`, hệ thống sẽ ưu tiên `当選` (trúng) vì check `当選` trước
- Kết quả sẽ được ghi đè nếu tìm thấy từ khóa mới

**Ví dụ:**
```
Email 1: "当選おめでとうございます"
→ Kết quả: win (Trúng) ✓

Email 2: "落選のご連絡"
→ Kết quả: lose (Trượt) ✗

Email 3: "応募完了いたしました"
→ Kết quả: '' (Chưa có kết quả)
```

---

## 3. ĐÃ MUA (注文完了)

### Từ khóa: `注文完了` (Chú văn hoàn tất = Đơn hàng hoàn tất)

**Logic:**
- Tìm kiếm từ khóa `注文完了` trong toàn bộ nội dung email
- **Nếu CÓ** từ khóa này → `bought = true` (Đã mua)
- **Nếu KHÔNG có** → `bought = false` (Chưa mua)

**Ví dụ:**
```
Email có nội dung: "注文完了のご連絡"
→ Kết quả: Đã mua ✓
```

---

## 4. CÁCH ÁNH XẠ VÀO TÀI KHOẢN

### Quy trình:

1. **Quét email từ Gmail** (tối đa 200 email trong khoảng thời gian đã chọn)

2. **Với mỗi email:**
   - Lấy toàn bộ nội dung: Subject + From + To + Body
   - Phân loại email bằng hàm `classifyByKeywords()`

3. **Ánh xạ vào tài khoản:**
   - **CHỈ đối chiếu dựa vào địa chỉ người nhận (To, Cc, Bcc)**
   - Trích xuất tất cả email từ field "To", "Cc", "Bcc"
   - Duyệt qua từng email trong danh sách tài khoản đã upload
   - So sánh email tài khoản với danh sách người nhận (không phân biệt hoa thường)
   - Nếu **TÌM THẤY** email của tài khoản trong danh sách người nhận → Áp dụng kết quả phân loại vào tài khoản đó
   - **Ví dụ:** From info@pokemoncenter-online.com to nguyenxuanchinh.01@gmail.com
     → Kết quả sẽ được cập nhật cho tài khoản nguyenxuanchinh.01@gmail.com

4. **Cập nhật kết quả:**
   - `chuusen`: Nếu email có `応募完了` → set = `true` (không ghi đè nếu đã là true)
   - `result`: 
     - Nếu có `当選` → set = `'win'`
     - Nếu có `落選` → set = `'lose'`
     - Nếu không có cả 2 → giữ nguyên giá trị cũ
   - `bought`: Nếu email có `注文完了` → set = `true` (không ghi đè nếu đã là true)
   - `time`: Lấy thời gian mới nhất (max giữa thời gian cũ và thời gian email hiện tại)

### Ví dụ cụ thể:

**Danh sách tài khoản:**
```
nguyenxuanchinh.01@gmail.com
thuyngann893@gmail.com
```

**Email Gmail 1:**
```
From: info@pokemoncenter-online.com
To: nguyenxuanchinh.01@gmail.com
Subject: 応募完了
Body: 応募完了いたしました。当選おめでとうございます。
```

**Kết quả:**
- Trích xuất email người nhận từ field "To": `nguyenxuanchinh.01@gmail.com`
- So sánh với danh sách tài khoản → Tìm thấy khớp
- Phân loại: `hasChuusen = true`, `isWin = true`, `bought = false`
- Cập nhật: `nguyenxuanchinh.01@gmail.com` → chuusen: Có, result: win, bought: Chưa mua

**Email Gmail 2:**
```
From: info@pokemoncenter-online.com
To: nguyenxuanchinh.01@gmail.com
Subject: 注文完了
Body: 注文完了のご連絡
```

**Kết quả:**
- Trích xuất email người nhận từ field "To": `nguyenxuanchinh.01@gmail.com`
- So sánh với danh sách tài khoản → Tìm thấy khớp
- Phân loại: `hasChuusen = false`, `isWin = false`, `isLose = false`, `bought = true`
- Cập nhật: `nguyenxuanchinh.01@gmail.com` → chuusen: Có (giữ nguyên), result: win (giữ nguyên), bought: Đã mua

**Email Gmail 3 (nhiều người nhận):**
```
From: info@pokemoncenter-online.com
To: nguyenxuanchinh.01@gmail.com, thuyngann893@gmail.com
Subject: 応募完了
Body: 応募完了いたしました。
```

**Kết quả:**
- Trích xuất email người nhận từ field "To": `nguyenxuanchinh.01@gmail.com`, `thuyngann893@gmail.com`
- So sánh với danh sách tài khoản → Tìm thấy cả 2 khớp
- Phân loại: `hasChuusen = true`, `isWin = false`, `isLose = false`, `bought = false`
- Cập nhật:
  - `nguyenxuanchinh.01@gmail.com` → chuusen: Có
  - `thuyngann893@gmail.com` → chuusen: Có

---

## 5. LƯU Ý QUAN TRỌNG

1. **Tìm kiếm không phân biệt hoa thường**: Hàm `includes()` tìm kiếm chính xác chuỗi, phân biệt hoa thường

2. **Ghi đè kết quả**: 
   - `result` sẽ bị ghi đè nếu tìm thấy từ khóa mới
   - `chuusen` và `bought` chỉ set = true, không ghi đè nếu đã là true

3. **Nhiều email cho cùng 1 tài khoản**: 
   - Hệ thống sẽ quét tất cả email và cập nhật kết quả
   - Thời gian sẽ lấy thời gian mới nhất

4. **Email không khớp với tài khoản**: 
   - Nếu email của tài khoản KHÔNG có trong danh sách người nhận (To/Cc/Bcc) → Không cập nhật gì
   - **Lưu ý:** Chỉ kiểm tra trong field To/Cc/Bcc, KHÔNG kiểm tra trong Subject hoặc Body

5. **Giới hạn quét**: Tối đa 200 email mỗi lần quét

---

## 6. CÁCH KIỂM TRA

Để kiểm tra logic phân loại, bạn có thể:
1. Sử dụng nút **"Test (10 mail từ pokemoncenter)"** để xem 10 email gần nhất
2. Mở Console (F12) để xem chi tiết nội dung email
3. Kiểm tra bảng kết quả sau khi quét

