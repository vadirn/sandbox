import { observable } from 'observable';

export const float = observable();

export function showFloat(view) {
  float.set(view);
}
