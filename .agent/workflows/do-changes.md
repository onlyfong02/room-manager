---
description: Đọc file CHANGES.md và thực hiện các yêu cầu thay đổi được liệt kê
---

# Thực hiện các yêu cầu thay đổi từ CHANGES.md

## Quy trình

1. Đọc file `CHANGES.md` ở thư mục gốc project để xem danh sách các yêu cầu thay đổi.

2. Lọc ra các mục chưa hoàn thành (đánh dấu `[ ]`).

3. Với mỗi yêu cầu chưa hoàn thành:
   - Phân tích yêu cầu và xác định các file cần thay đổi
   - Thực hiện thay đổi code
   - Kiểm tra lỗi TypeScript/lint nếu có
   - Đánh dấu `[x]` cho mục đã hoàn thành trong file CHANGES.md

4. Sau khi hoàn thành tất cả, thông báo tóm tắt các thay đổi đã thực hiện cho user.

## Lưu ý
- Nếu yêu cầu không rõ ràng, hỏi user để làm rõ trước khi thực hiện
- Ưu tiên thực hiện theo thứ tự trong file
- Cập nhật file CHANGES.md sau mỗi mục hoàn thành
