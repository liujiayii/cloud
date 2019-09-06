import request from '@/utils/request';

export async function fetchTable(data) {
  return request('/investment/investmentList', { data });
}

export async function handleDelete(data) {
  return request('/investment/deleteInvestment', { data });
}
