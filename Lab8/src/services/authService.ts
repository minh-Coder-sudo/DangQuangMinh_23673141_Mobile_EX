import { api } from "../api/client";
import { User } from "../types";

interface UserRecord extends User {
  password: string;
}

const toUser = ({ password: _password, ...user }: UserRecord): User => user;

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const response = await api.get<UserRecord[]>("/users", { params: { email: email.trim() } });
  const account = response.data[0];
  if (!account || account.password !== password) throw new Error("Email hoặc mật khẩu không đúng");
  return { user: toUser(account), token: `fake-token-${account.id}` };
}

export async function register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const found = await api.get<UserRecord[]>("/users", { params: { email: normalizedEmail } });
  if (found.data.length > 0) throw new Error("Email này đã được đăng ký");
  const created = await api.post<UserRecord>("/users", { name: name.trim(), email: normalizedEmail, password });
  return { user: toUser(created.data), token: `fake-token-${created.data.id}` };
}
