import request from '../../../shared/request';
import { routes } from '../../../constants';
const { item } = routes.timeline;

export function getItemsList() {
  return request(item.api + item.all, {
    method: 'GET'
  });
}
