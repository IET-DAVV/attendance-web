import API from "./config";

export async function getUser(email: string) {
  return await API.get(`/users/${email}`);
}
