import request from '@/utils/request';

export async function fetch(data) {
  return request('/introduce/introduce', { data });
}

export async function handleUpdate(data) {
  return request('/introduce/updateIntroduce', { data });
}
