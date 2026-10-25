# Lab 06 — Navigation

Ứng dụng Expo SDK 57, React Native và TypeScript, gồm menu mở đủ 5 bài.
Điều hướng dùng Expo Router theo AGENTS.md, với Stack, Bottom Tabs và Drawer.

## Chạy ứng dụng

```sh
npm install
npm start
```

Chọn Android/iOS hoặc chạy `npm run web`. Môi trường native cần bản Expo Go
tương thích SDK 57 hoặc development build hỗ trợ các module đã cài.

## Nội dung

1. **Select Phone:** sản phẩm ban đầu màu xanh; chọn màu, xem thông tin thay đổi,
   bấm XONG để trả màu qua route params. CHỌN MUA hiển thị xác nhận sản phẩm.
2. **API:** loading, kiểm tra dữ liệu, timeout 15 giây, báo lỗi và thử lại.
   Khi chưa đặt URL, dùng dữ liệu mẫu offline và ghi rõ trên màn hình.
3. **Bottom Tab:** Trang chủ, Tìm kiếm không phân biệt hoa thường, Cá nhân.
4. **Stack + Tab:** Sản phẩm / Yêu thích; mở chi tiết bằng id; thêm và bỏ yêu thích
   đồng bộ qua Context. ID không hợp lệ có thông báo riêng.
5. **Drawer:** Trang chủ / Cá nhân / Cài đặt; hai Switch và trạng thái tức thời.
   Giao diện tối áp dụng cho toàn bộ ba màn Drawer.

Yêu thích và cài đặt được giữ trong phiên chạy ứng dụng bằng Context.

## Cấu hình MockAPI

Tạo resource `phones` trên mockapi.io với các trường tương ứng trong
`mockapi_phones_50.json`. Nhập 50 bản ghi từ file đó vào resource.
File này cũng là nguồn dữ liệu chung cho Bài 1, Bài 3 và Bài 4; cập nhật một
chỗ sẽ đồng bộ tên, giá, màu và danh sách yêu thích của các bài.
Sao chép `.env.example` thành `.env` rồi đặt URL cơ sở (không thêm `/phones`):

```dotenv
EXPO_PUBLIC_API_URL=https://6add70fafa5e73d4ab2df81c.mockapi.io
```

Chạy `npx expo start --clear`. Bài 2 gọi `GET <URL>/phones/1`.
Hai màn sản phẩm và chọn màu dùng chung một lần tải trong mỗi phiên mở bài.
Điều này giữ nguyên thông tin API khi chọn màu; thoát về menu rồi mở lại sẽ
tải dữ liệu mới. Lỗi dữ liệu nêu rõ trường cần sửa trên MockAPI.
Sửa tên/giá trên MockAPI rồi thoát và mở lại Bài 2 để lấy dữ liệu mới.
Để thử lỗi, đặt URL sai rồi khởi động lại; kiểm tra thông báo và nút THỬ LẠI.
Biến EXPO_PUBLIC là công khai, không chứa mật khẩu hoặc khóa bí mật.

## Kiểm tra

```sh
npm run lint
npm run typecheck
npm test
npx expo export --platform web
```

- Bài 1: xanh → chọn màu → đỏ → XONG → ảnh đỏ và “4 MÀU-CHỌN LOẠI”.
- Bài 3: danh sách có 50 sản phẩm; tìm `aris pro` có một kết quả;
  `zzz` hiển thị trạng thái không có kết quả. Với bộ 50 sản phẩm, `aris`
  trả cả Vsmart Aris và Aris Pro.
- Bài 4: Live 4 có giá 3.990.000 đ; thêm/bỏ yêu thích và kiểm tra tab Yêu thích.
- Bài 5: mở bằng ☰ hoặc vuốt cạnh trái trên native; bật/tắt hai Switch.

## Hình ảnh thiết kế

Figma trong tài liệu không cấp quyền truy cập cho phiên làm việc này.
`src/components/PhoneImage.tsx` hiện dùng hình điện thoại minh họa cục bộ,
chưa phải ảnh sản phẩm gốc. Khi có bốn ảnh gốc, thay component này bằng Image
với các asset trong `assets/phones/` để hoàn thiện độ khớp thiết kế.
