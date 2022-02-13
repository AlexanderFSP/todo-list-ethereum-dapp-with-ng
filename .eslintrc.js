module.exports = {
  env: {
    es2020: true,
    browser: true,
    node: true
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'airbnb-typescript/base', // includes '@typescript-eslint', 'import' plugins
        'plugin:unicorn/recommended', // includes 'unicorn' plugin
        'plugin:@typescript-eslint/recommended', // includes '@typescript-eslint' plugin
        'plugin:@typescript-eslint/recommended-requiring-type-checking', // includes '@typescript-eslint' plugin
        'plugin:@angular-eslint/recommended', // includes '@typescript-eslint', '@angular-eslint' plugins
        'plugin:prettier/recommended', // includes 'prettier' plugin
        'prettier'
      ],
      plugins: ['simple-import-sort'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      rules: {
        'class-methods-use-this': 'off',
        'consistent-return': 'off',
        // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
        'no-prototype-builtins': 'off',
        'no-empty': [
          'error',
          {
            allowEmptyCatch: true
          }
        ],
        'no-underscore-dangle': 'off',
        'max-classes-per-file': 'off',

        // ========== '@typescript-eslint' plugin ==========
        // Makes no sense to allow type inferrence for expression parameters, but require typing the response
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true
          }
        ],
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/lines-between-class-members': 'off',
        '@typescript-eslint/unbound-method': [
          'error',
          {
            ignoreStatic: true
          }
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',

        // ========== '@angular-eslint' plugin ==========
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case'
          }
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase'
          }
        ],

        // ========== 'unicorn' plugin ==========
        // Common abbreviations are known and readable
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/no-null': 'off',
        'unicorn/prefer-add-event-listener': 'off',

        // ========== 'import' & 'simple-import-sort' plugins ==========
        // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true
          }
        ],
        'import/order': 'off',
        'simple-import-sort/imports': [
          'error',
          {
            // https://github.com/lydell/eslint-plugin-simple-import-sort/blob/main/examples/.eslintrc.js#L74
            groups: [
              // Packages
              ['^@?\\w'],
              // Side effect imports
              ['^\\u0000'],
              // Relative imports
              ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
            ]
          }
        ],
        'simple-import-sort/exports': 'error'
      }
    },
    {
      env: {
        jasmine: true
      },
      files: ['src/**/*.spec.ts'],
      extends: ['plugin:jasmine/recommended'],
      plugins: ['jasmine']
    }
  ]
};
