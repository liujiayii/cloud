import request from '@/utils/request';

export async function fakeAccountLogin(data) {
  return request('/login/login', { data });
}
export async function handleUpdatePassword(data) {
  return request('/login/updatePassword', { data });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
