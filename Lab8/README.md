# BookStore — Buổi 8

Đăng nhập/đăng ký · lưu phiên, giỏ hàng và yêu thích bằng AsyncStorage · đánh giá sách · giỏ hàng có tăng giảm/xóa · danh sách yêu thích.

## Chạy
```bash
npm install
npm run api          # terminal 1: json-server tại http://localhost:3000 (dữ liệu: db.json)
npx expo start       # terminal 2: bấm  w  để mở bản web, hoặc quét QR bằng Expo Go
```
- Điện thoại thật: máy tính và điện thoại cùng Wi-Fi; nếu không tự nhận được địa chỉ, đặt
  `EXPO_PUBLIC_API_URL=http://<IP-máy-tính>:3000` trước lệnh `npx expo start`.
- Kiểm tra kiểu: `npx tsc --noEmit`
- Tài khoản demo: **demo@bookstore.vn / 123456**.

## UI
Xem `docs/UI.md` và ảnh trong `docs/ui/`.

## Kiểm tra

- Chạy `npm run api` ở một terminal và `npx expo start` ở terminal khác.
- Chạy `npx tsc --noEmit` trước khi nộp.
