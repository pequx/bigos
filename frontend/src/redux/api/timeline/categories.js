import request from '../../../shared/request';
import { routes } from '../../../constants';
const { category } = routes.timeline;

export function getCategoriesList() {
  return request(category.api + category.all, {
    method: 'GET'
  });
}
