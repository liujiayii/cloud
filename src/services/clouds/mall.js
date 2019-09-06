import request from '@/utils/request';

export async function fetchTable(data) {
  return request('/mall/showMallIntroduce', { data });
}

export async function handleUpdate(data) {
  return request(data.id ? '/mall/updateMallIntroduce' : '/mall/insertMallIntroduce', { data });
}

export async function handleDelete(data) {
  return request('/news/deleteNewsTrend', { data });
}
