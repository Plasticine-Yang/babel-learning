module.exports = {
  '*.{js,ts}':
    'eslint --fix --ext=.js,.cjs,.mjs,.ts --ignore-path=.gitignore --ignore-path=.eslintignore --cache',
}
