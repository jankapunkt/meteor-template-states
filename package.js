/* eslint-env meteor */
Package.describe({
  name: 'jkuester:template-states',
  summary: 'Template states for Blaze',
  git: 'https://github.com/gwendall/meteor-template-states.git',
  version: '0.3.0'
})

Package.onUse(function (api, where) {
  api.versionsFrom('1.5')
  api.use('ecmascript')
  api.use('random')
  api.use([
    'blaze@2.3.3',
    'reactive-dict@1.3.0',
    'templating@1.3.2'
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
    'blaze@2.3.2',
    'reactive-dict@1.2.0',
    'templating@1.3.2',
    'jkuester:template-states'
  ], 'client')
  api.mainModule('lib.tests.js', 'client')
})
