Trả lời câu hỏi bổ sung Buổi 7

1. Cấu trúc điều hướng

BookDetail được đăng ký ở Stack để màn chi tiết phủ lên toàn bộ Bottom Tab và có nút quay lại tự động. Nếu đặt BookDetail trong Tab, nó sẽ trở thành một tab riêng, thanh tab vẫn hiển thị và người dùng không có luồng quay lại Home như màn chi tiết.

2. Redux

Redux Toolkit dùng Immer nên reducer được phép viết state.items.push(...) trên một bản nháp; Immer sẽ tạo state mới bất biến từ các thay đổi đó. Bỏ `useMemo` trong `useCart` không làm tổng hiển thị sai, nhưng phép tính sẽ chạy lại ở mỗi lần component render và có thể kém hiệu quả khi giỏ hàng lớn.

3. Promise.all

Nếu `getCategories()` lỗi nhưng `getBooks()` thành công, `Promise.all` sẽ reject và Home hiển thị trạng thái lỗi, dù sách đã tải được. Có thể dùng `Promise.allSettled` để vẫn hiển thị sách và chỉ thiếu danh mục, nhưng cần tự xử lý kết quả và lỗi cho từng request nên logic phức tạp hơn.

4. Debounce

Không nên đặt `setTimeout` thẳng trong `onChangeText` vì mỗi lần gõ sẽ tạo một timer và đều lọc dữ liệu, không đạt được hiệu ứng gộp lần gõ. Hàm dọn dẹp `clearTimeout` hủy timer cũ khi giá trị đổi hoặc component unmount, tránh cập nhật state không cần thiết.

5. Sắp xếp giá

Thêm state và áp dụng sắp xếp trên bản sao của danh sách đã lọc:

```tsx
const [sort, setSort] = useState<"asc" | "desc" | null>(null);

const visibleBooks = useMemo(() => {
  const filtered = filterBooks(books, {
    keyword: debouncedKeyword,
    categoryId,
    priceRange,
  });
  return sort === null
    ? filtered
    : [...filtered].sort((a, b) =>
        sort === "asc" ? a.price - b.price : b.price - a.price,
      );
}, [books, debouncedKeyword, categoryId, priceRange, sort]);
```
