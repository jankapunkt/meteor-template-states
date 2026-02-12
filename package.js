/* eslint-env meteor */
Package.describe({
  name: 'jkuester:template-states',
  summary: 'Template states for Blaze',
  git: 'https://github.com/gwendall/meteor-template-states.git',
  version: '1.0.0'
})

Package.onUse((api, where) => {
  api.versionsFrom(['3.0.1', '3.4'])
  api.use(
    ['ecmascript', 'blaze@3.0.0', 'reactive-dict', 'templating@1.4.4'],
    'client'
  )

  api.addFiles(['lib.js'], 'client')
})

Package.onTest((api) => {
  api.versionsFrom(['3.0.1', '3.4'])
  api.use([
    'random',
    'ecmascript',
    'practicalmeteor:chai',
    'cultofcoders:mocha'
  ])
  api.use(
    ['blaze', 'reactive-dict', 'templating', 'jkuester:template-states'],
    'client'
  )
  api.mainModule('lib.tests.js', 'client')
})
