import { observable } from 'observable';
import { pipeline } from 'pipeline';
import { importPage } from 'ui/pages';

export const page = observable([]);

export function showError(err) {
  console.log(err);
}

/** @type {(name: string, props: {}) => Promise<void>} */
export const showPage = pipeline([
  async name => {
    try {
      const pageComponent = await importPage(name);
      return pageComponent;
    } catch (err) {
      showError(err);
    }
  },
  (name, props, pageComponent) => page.set([pageComponent, props]),
]);
