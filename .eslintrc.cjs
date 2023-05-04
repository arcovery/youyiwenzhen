/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // 要求组件名称总是多个单词:关闭
        'vue/multi-word-component-names': 0,
        // 禁止修改prop
        // 'vue/no-mutating-props': 0,
        // 不允许对props解构:关闭
        'vue/no-setup-props-destructure': 0
      }
    }
  ]
}
