# Trả lời câu hỏi bổ sung

1. `errors` và `valid` là giá trị được suy ra trực tiếp từ `name`, `phone` và `address`, nên tính lại khi render sẽ luôn khớp với form. Nếu dùng `useState` riêng, phải cập nhật chúng ở mọi nơi thay đổi dữ liệu; bỏ sót một lần cập nhật sẽ khiến lỗi hoặc trạng thái nút không đúng.

2. Nếu gọi `clear()` trước `await createOrder(...)`, mất mạng sẽ làm giỏ bị xoá khi đơn chưa hề được tạo. Gọi `clear()` ngay sau khi `createOrder` thành công chỉ xoá giỏ khi máy chủ đã nhận đơn.

3. `PUT /users/1` với chỉ `name` và `phone` sẽ thay toàn bộ bản ghi, làm mất các trường như email và password. `PATCH` chỉ cập nhật hai trường gửi lên, nên an toàn cho việc sửa một phần hồ sơ.

4. Nếu không hoàn lại `read: false` khi API lỗi, giao diện sẽ báo thông báo đã đọc nhưng dữ liệu trên máy chủ vẫn chưa đọc; tải lại màn hình sẽ gây mâu thuẫn. Cập nhật lạc quan phù hợp với việc đánh dấu đã đọc hoặc thả tim, nhưng không nên dùng cho thanh toán vì cần xác nhận thành công từ máy chủ.

5. Bộ lọc trạng thái có thể dùng state `status` với kiểu `"all" | OrderStatus`, sau đó truyền vào `FlatList` dữ liệu `orders.filter((order) => status === "all" || order.status === status)`. Các nút chọn có thể đặt giá trị lần lượt là Tất cả, Chờ xác nhận, Đang giao, Hoàn tất và Đã huỷ.
