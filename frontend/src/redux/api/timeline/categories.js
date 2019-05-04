import request from '../../../shared/request';

export function getCategoriesList() {
  return request('/categories');
}
