import request from '../../../shared/request';
import { routes, schema } from '../../../constants';

export function getItemsList({ ...criteria }) {
  const name = criteria[schema.timeline.category.column.name];

  if (name) {
    return request(routes.timeline.item.home + routes.timeline.item.category + name, {
      method: 'GET'
    });
  }
}
