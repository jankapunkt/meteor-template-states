/* eslint-env mocha */
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze'
import { assert } from 'meteor/practicalmeteor:chai'

describe('extensions/TemplateExtensions', function () {
  /**
   * Testhelper to construct a view and callback onCreated
   * @param name Name of the view to be constructed
   * @param onCreated Callback to run after view has been constructed
   * @param helpers Helpers definitions
   * @return {Blaze.view} A constructed blaze Template view
   */
  const createView = function (name, onCreated, helpers) {
    const myTemplate = Blaze.Template(name, function () {
      return true
    })

    if (helpers) myTemplate.helpers(helpers)
    if (onCreated) myTemplate.onCreated(onCreated)

    const view = Template.prototype.constructView.call(myTemplate)
    const template = view.template

    if (onCreated) {
      const created = template._callbacks.created
      for (let cb of created) {
        cb.call(myTemplate)
      }
    }

    return view
  }

  it('has attached getState and setState to Template', function () {
    assert.isDefined(Template.getState)
    assert.equal(typeof Template.getState, 'function')
    assert.isDefined(Template.setState)
    assert.equal(typeof Template.setState, 'function')
  })

  it('has returned null on getState and setState when no Template instance exists', function () {
    assert.isNull(Template.setState('test', 'test'))
    assert.isNull(Template.getState('test'))
  })

  it('sets and gets variables on TemplateIntance', function () {
    const setGetView = createView('setGetTest')
    const templateInstance = setGetView.templateInstance()
    const expectedVar = 'expected'
    const expectedValue = 'value'
    templateInstance.state.set(expectedVar, expectedValue)
    assert.equal(templateInstance.state.get(expectedVar), expectedValue)
  })

  it('toggles variables on TemplateIntance', function () {
    const setGetView = createView('setGetTest')
    const templateInstance = setGetView.templateInstance()
    const expectedVar = 'expected'
    const expectedValue = false
    templateInstance.state.set(expectedVar, expectedValue)
    assert.equal(templateInstance.state.get(expectedVar), expectedValue)

    templateInstance.toggle(expectedVar)
    assert.equal(templateInstance.state.get(expectedVar), !expectedValue)
  })

  it('has a state helper to be accessed via Spacebars', function (done) {
    const spacebarsHelperView = createView('spacebarsHelperView', function () {
      // instance is required here
      // eslint-disable-next-line
      const instance = this
    }, {
      set: function set (key, value) {
        Template.setState(key, value)
      }
    })

    console.log('view:', spacebarsHelperView, spacebarsHelperView.templateInstance())

    const template = spacebarsHelperView.template
    const setHelper = template.__helpers.get('set')
    const stateHelper = template.__helpers.get('state')
    assert.isDefined(setHelper)
    assert.isDefined(stateHelper)
    done()
  })
})
