/* eslint-env meteor */
Package.describe({
  name: 'jkuester:template-states',
  summary: 'Template states for Blaze',
  git: 'https://github.com/gwendall/meteor-template-states.git',
  version: '0.3.0'
})

Package.onUse(function (api, where) {
  api.use([
    'ecmascript',
    'blaze@2.0.0',
    'reactive-dict@1.0.0',
    'templating@1.0.0'
  ], 'client')

  api.addFiles([
    'lib.js'
  ], 'client')
})

Package.onTest(function (api) {
  api.use([
    'random',
    'ecmascript',
    'practicalmeteor:chai',
    'cultofcoders:mocha'
  ])
  api.use([
    'blaze',
    'reactive-dict',
    'templating',
    'jkuester:template-states'
  ], 'client')
  api.mainModule('lib.tests.js', 'client')
})
