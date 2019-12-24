import 'assets/css/global.scss';
import { location } from 'session/router';
import Layer from 'ui/helpers/layer.svelte';
import { page, showPage } from 'ui/helpers/page';

const pageLayer = new Layer({ target: document.body });

page.subscribe(([component, props]) => pageLayer.$set({ component, props }));

location.subscribe(locationData => {
  if (locationData) {
    showPage(locationData.name, { locationData });
  }
});
