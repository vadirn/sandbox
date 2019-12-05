import 'assets/css/global.scss';
import Layer from 'ui/helpers/layer.svelte';
import { page } from 'ui/helpers/page';
import { modal } from 'ui/helpers/modal';
import { float } from 'ui/helpers/float';
import 'session/router';

new Layer({ target: document.body, props: { component: page } });
new Layer({ target: document.body, props: { component: modal } });
new Layer({ target: document.body, props: { component: float } });
