import request from '@/utils/request';

export async function fetchTable(data) {
  return request('/news/showListNewsTrend', { data });
}

export async function handleUpdate(data) {
  return request(data.id ? '/news/updateNewsTrend' : '/news/insertNewsTrend', { data });
}

export async function handleUpdateStatus(data) {
  return request('/news/updateStatusById', { data });
}

export async function changeDisplayStatus(data) {
  return request('/news/updateFirstShowById', { data });
}

export async function handleDelete(data) {
  return request('/news/deleteNewsTrend', { data });
}

export async function getAllColumn() {
  return request('/column/showColumn');
}
