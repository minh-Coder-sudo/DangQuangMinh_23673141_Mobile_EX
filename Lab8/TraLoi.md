# Trả lời câu hỏi bổ sung Buổi 8

## 1. Cờ ready

Lần render đầu tiên, store giỏ hàng vẫn là mảng rỗng trước khi AsyncStorage đọc xong. Nếu `useAutoPersist` ghi ngay, mảng rỗng sẽ đè dữ liệu đã lưu; sau đó dữ liệu cũ không thể khôi phục. Cờ `ready` chỉ bật sau khi nạp dữ liệu nên ngăn lần ghi quá sớm này.

## 2. Token giả

Mật khẩu được lưu trong `db.json` và bị kiểm tra ở phía ứng dụng nên người khác có thể đọc hoặc sửa nó. Token tự tạo cũng có thể bị giả mạo. Hệ thống thật phải để server kiểm tra mật khẩu đã băm và cấp token có thời hạn; ứng dụng di động lưu token trong SecureStore (Keychain/Keystore), không phải AsyncStorage dạng thô.

## 3. Hai effect trong CartItemRow

Nếu xóa effect `setQty(item.quantity)`, số lượng cục bộ sẽ không cập nhật khi store thay đổi từ nơi khác. Ví dụ, lúc app vừa nạp giỏ từ AsyncStorage hoặc khi một sản phẩm bị xóa rồi thêm lại, số hiển thị ở nút có thể khác với số trong store.

## 4. Một nguồn state

Nếu mỗi `HeartButton` có `useState` riêng, bấm tim ở lưới sẽ không làm tim ở trang chi tiết đổi theo, và ngược lại. Store wishlist là nguồn dữ liệu duy nhất; mọi component đều đọc cùng `ids` và dispatch cùng hành động `toggle`, vì vậy trạng thái luôn đồng bộ.

## 5. Hiện và ẩn mật khẩu

Màn Đăng nhập dùng state `showPassword`. Khi bấm biểu tượng 👁, state đổi giá trị và prop `secureTextEntry` nhận `!showPassword`, nên ô Mật khẩu chuyển giữa ẩn và hiện nội dung.
