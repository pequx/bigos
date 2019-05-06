import request from '../../../shared/request';
import { routes, schema } from '../../../constants';

const { item } = routes.timeline;

export function getItemsList(action) {
  const { criteria } = action;
  const path = criteria
    ? `${item.api + item.category}/${criteria[schema.timeline.category.column.name]}`
    : item.api + item.all;
  return request(path, {
    method: 'GET'
  });
}
