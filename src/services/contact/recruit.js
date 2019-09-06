import request from '@/utils/request';

export async function fetchTable(data) {
  return request('/employment/employmentList', { data });
}

export async function handleUpdate(data) {
  return request(data.id ? '/employment/updateEmployment' : '/employment/save', { data });
}

export async function handleDelete(data) {
  return request('/employment/deleteEmployment', { data });
}
