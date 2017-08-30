// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
      sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
      'html'
  ],
  // check if imports actually resolve
  'settings': {
      'import/resolver': {
          'webpack': {
              'config': 'webpack.config.js'
          }
      }
  },
  "globals": {
      "window": true,
      "document": true
  },
  // add your custom rules here
  'rules': {
      // don't require .vue extension when importing
      'import/extensions': ['error', 'always', {
          'js': 'never',
          'vue': 'never'
      }],
      // 'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      // allow debugger during development
      // 'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
      // allow paren-less arrow functions
      "arrow-parens": 0,
      //可以使用console
      "no-console": 0,
      // 警告空行缩进
      "no-trailing-spaces": 1,
      // 禁止非2个空格缩进
      "indent": [2, 2, { "SwitchCase": 1 }],
      "key-spacing": [1, { "beforeColon": false, "afterColon": true }],
      // 禁止混用空格和制表符表示缩进
      "no-mixed-spaces-and-tabs": 2,
      //换行风格
      "linebreak-style": [0, "windows"],
      // 警告为使用的变量
      "no-unused-vars": [1, { "vars": "all", "args": "none" }],
      // 建议js使用单引号包含字符串
      "quotes": [1, "single", "avoid-escape"],
      // 建议无分号
      "semi": [1, "never"],
      "space-before-blocks": [2, "always"],
      // 建议函数'{前'和'}后'没有空行
      "padded-blocks": [1, "never"],
      "eol-last": 0,
      "no-plusplus": 0,
      "consistent-return": 0,
      "no-restricted-syntax": 0,
      "no-param-reassign": 0,
      "quote-props": 0,
      "global-require": 0,
      "no-lonely-if": 0,
      "no-underscore-dangle": 0,
      "no-dynamic-require": 0,
      // disallows nested ternary expressions
      "no-nested-ternary": 0,
      // Use the spread operator instead of '.apply()' close
      "prefer-spread": 0,
      "guard-for-in": 0,
      "no-loop-func": 0,
      "prefer-template": 0,
      "no-mixed-operators": 0,
      "object-shorthand": 0,
  }
}