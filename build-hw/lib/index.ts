import { createElement } from 'react';

export { add, average, multiply } from './math';
export { capitalize, toSlug } from './string';

export function createBadge(text: string) {
  return createElement('span', { className: 'badge' }, text);
}
