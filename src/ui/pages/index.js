const pages = {
  index: () => import('./index.svelte'),
  playground: () => import('./playground.svelte'),
  'playground-component': () => import('./playground.svelte'),
};

export async function importPage(name) {
  const module = await pages[name]?.();
  return module.default;
}
