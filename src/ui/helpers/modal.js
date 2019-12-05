import { observable } from 'observable';

export const modal = observable();

export const showModal = view => {
  modal.set(view);
};
