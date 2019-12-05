import { observable } from 'observable';
import { importPage } from 'ui/pages';
import { modal } from 'ui/helpers/modal';

export const page = observable();

export function showError(err) {
  console.log(err);
}

export const showPage = (() => {
  let counter = 0;
  return async name => {
    counter += 1;
    const c = counter;
    try {
      const nextPage = await importPage(name);
      if (c === counter) {
        modal.set();
        page.set(nextPage);
      }
    } catch (err) {
      showError(err);
    }
  };
})();
