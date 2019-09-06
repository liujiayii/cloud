import request from '@/utils/request';

export async function fetchTable(data) {
  return request('/brand/pageListAll', { data });
}

export async function handleUpdate(data) {
  return request(data.id ? '/brand/update' : '/brand/insert', { data });
}

export async function handleDelete(data) {
  return request('/brand/delete', { data });
}

export async function handleUpdateProduct(data) {
  return request(data.id ? '/product/update' : '/product/insert', { data });
}

export async function handleDeleteProduct(data) {
  return request('/product/delete', { data });
}

export async function getBrandList() {
  return request('/brand/findAll');
}
