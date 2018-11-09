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
  const createView = function ({ name, onCreated, helpers }) {
    const template = Blaze.Template(name, function () {
      return null
    })

    if (helpers) {
      template.helpers(helpers)
    }
    if (onCreated) {
      template.onCreated(onCreated)
    }

    const view = template.constructView()
    view._render()
    Blaze.render(template, global.$('<div></div>').get(0))
    return view
  }

  describe(Template.setState.name, function () {

    it('is defined on Template', function () {
      assert.isDefined(Template.getState)
      assert.equal(typeof Template.getState, 'function')
    })

    it('returns false if no Template / instnce exists', function () {
      assert.isFalse(Template.setState('test', 'test'))
    })

    it('throws if key is null', function () {
      assert.throws(function () {
        Template.setState(null, 'test')
      })
    })

    it('throws if key is undefined', function () {
      assert.throws(function () {
        Template.setState(void 0, 'test')
      })
    })

    it('returns true if Template / instance exists / key exists and value has been set', function (done) {
      createView({
        name: 'setGetTest',
        onCreated () {
          const key = 'expected'
          assert.isTrue(Template.setState(key, ''), 'string')
          assert.isTrue(Template.setState(key, {}), 'object')
          assert.isTrue(Template.setState(key, []), 'array')
          assert.isTrue(Template.setState(key, 0), 'int')
          assert.isTrue(Template.setState(key, 1.4), 'float')
          assert.isTrue(Template.setState(key, () => {}), 'function')
          done()
        }
      })
    })
  })

  describe(Template.getState.name, function () {
    it('is defined on Template', function () {
      assert.isDefined(Template.setState)
      assert.equal(typeof Template.setState, 'function')
    })

    it('returns undefined if no Template / instnce exists', function () {
      assert.isUndefined(Template.getState('test'))
    })

    it('throws if key is undefined', function () {
      assert.throws(function () {
        Template.getState(void 0)
      })
    })

    it('throws if key is null', function () {
      assert.throws(function () {
        Template.getState(null)
      })
    })

    it('returns true if Template / instance exists / key exists and value has been set', function (done) {
      createView({
        name: 'setGetTest',
        onCreated () {
          const expectedVar = 'expected'
          const expectedValue = 'value'
          this.state.set(expectedVar, expectedValue)
          assert.equal(Template.getState(expectedVar), expectedValue)
          done()
        }
      })
    })
  })

  it('toggles variables on TemplateIntance', function () {
    const setGetView = createView({ name: 'setGetTest' })
    const templateInstance = setGetView.templateInstance()
    const expectedVar = 'expected'
    const expectedValue = false
    templateInstance.state.set(expectedVar, expectedValue)
    assert.equal(templateInstance.state.get(expectedVar), expectedValue)

    templateInstance.toggle(expectedVar)
    assert.equal(templateInstance.state.get(expectedVar), !expectedValue)
  })

  it('has a state helper to be accessed via Spacebars', function (done) {
    const spacebarsHelperView = createView({
      name: 'spacebarsHelperView',
      onCreated: function () {
        // we need this to get access to the helpers Template.instance()
        // eslint-disable-next-line
        const instance = this
      }
    })
    const template = spacebarsHelperView.template
    const stateHelper = template.__helpers.get('state')
    assert.isDefined(stateHelper)
    done()
  })
})
