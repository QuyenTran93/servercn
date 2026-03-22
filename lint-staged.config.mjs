// Used with `lint-staged --config` so template package.json hooks are ignored.
export default {
  '*.{ts,tsx,js,jsx}': ['npx eslint --fix'],
  '*.{json,css}': ['npx prettier --write'],
};
