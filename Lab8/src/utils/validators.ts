export const validateEmail = (value: string): string | null => {
  if (!value.trim()) return "Vui lòng nhập email";
  if (!/^\S+@\S+\.\S+$/.test(value.trim())) return "Email không đúng định dạng";
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value) return "Vui lòng nhập mật khẩu";
  if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
  return null;
};

export const validateRequired = (label: string) => (value: string): string | null =>
  value.trim() ? null : `Vui lòng nhập ${label}`;
