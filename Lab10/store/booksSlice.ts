import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Book } from "../types";
import { API_URL } from "../config";
import type { RootState } from "./index";

type Status = "idle" | "loading" | "succeeded" | "failed";

// TODO BT10.11a (Bonus): thunk gọi API
//   const res = await fetch(`${API_URL}/books`);
//   res.ok sai -> return rejectWithValue(`Máy chủ trả về lỗi ${res.status}`)
//   thành công -> return (await res.json()) as Book[]
//   bọc try/catch: lỗi mạng -> return rejectWithValue(`Không kết nối được tới ${API_URL}`)
export const fetchBooks = createAsyncThunk<Book[], void, { rejectValue: string }>(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    void API_URL;
    void rejectWithValue;
    return [];
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: { items: [] as Book[], status: "idle" as Status, error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    // TODO BT10.11b (Bonus): ba trường hợp của fetchBooks
    //   pending   -> status = "loading", error = null
    //   fulfilled -> status = "succeeded", items = action.payload
    //   rejected  -> status = "failed", error = action.payload ?? "Không tải được dữ liệu"
    void builder;
  },
});

export default booksSlice.reducer;

export const selectBooksState = (s: RootState) => s.books;
