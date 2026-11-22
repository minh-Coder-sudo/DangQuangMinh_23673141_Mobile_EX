# Trả lời câu hỏi bổ sung Lab 10

## Câu 1

Khi `numColumns` đổi, `FlatList` phải có `key` mới để React hủy cây danh sách cũ và dựng lại theo số cột mới. Nếu không đổi `key`, danh sách có thể giữ layout cũ, sắp xếp sai ô hoặc hiển thị lỗi khi chuyển giữa 1 và 2 cột.

## Câu 2

`useState` phù hợp với trạng thái chỉ dùng trong một màn như `keyword`, `category`, `isTile`, `loading`. Redux phù hợp với dữ liệu dùng ở nhiều màn như giỏ hàng và danh sách yêu thích, vì Home, Detail, Cart và Favorites đều có thể đọc hoặc cập nhật chúng.

## Câu 3

Reducer của `createSlice` dùng Immer. Immer tạo bản sao an toàn phía sau nên có thể viết `push` hoặc tăng `quantity` trực tiếp; kết quả cuối vẫn là state bất biến. Trong component, state React phải được thay bằng setter như `setState`.

## Câu 4

`selectIsFavorite(id)` là selector có tham số: nó nhận `id` trước, rồi trả về hàm nhận `state` để `useSelector` gọi. Chỉ lưu `id` giúp Redux nhẹ hơn, tránh trùng dữ liệu sách; khi hiển thị chỉ cần lọc `BOOKS` theo các id đó.

## Câu 5

`React.memo` chỉ bỏ render lại khi props không đổi theo so sánh nông. Nếu bỏ `useCallback`, `onSelect` là hàm mới sau mỗi lần Home render nên prop đổi và `BookCard` vẫn render lại. `useCallback` giữ cùng tham chiếu hàm khi dependency không đổi.
