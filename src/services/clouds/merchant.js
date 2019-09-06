import request from '@/utils/request';

export async function fetchTable(data) {
  return request('/merchant/showMerchant', { data });
}

export async function handleUpdate(data) {
  return request(data.id ? '/merchant/updateMerchant' : '/merchant/insertMerchant', { data });
}

export async function handleUpdateStatus(data) {
  return request('/merchant/updateMerStatus', { data });
}

export async function changeDisplayStatus(data) {
  return request('/merchant/updateFirstShow', { data });
}

export async function handleDelete(data) {
  return request('/merchant/deleteMerchant', { data });
}
