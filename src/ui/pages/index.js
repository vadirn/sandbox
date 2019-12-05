const pages = {
  a: () => import('./a.svelte'),
  b: () => import('./b.svelte'),
};

export async function importPage(name) {
  try {
    const module = await pages[name]?.();
    return module.default;
  } catch (err) {
    console.log('page could not be loaded', err);
    throw err;
  }
}
