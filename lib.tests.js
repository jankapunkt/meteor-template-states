/* eslint-env mocha */
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze'
import { assert } from 'meteor/practicalmeteor:chai'
import { Random } from 'meteor/random'
console.log(Blaze)
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
  
  const rand = () => Random.id()

  describe('state property', function () {
    it ('is defined on a new instance', function (done) {
      createView({
        name: 'stateTest',
        onCreated () {
          const instance = this
          console.log('test', instance)
          assert.isDefined(instance.state)
          assert.equal(instance.state.constructor.name, 'ReactiveDict')
          done()
        }
      })
    })

    it ('is a new ReactiveDict instance for every new Template instance', function (done) {
      createView({
        name: 'destroyTest',
        onCreated () {
          const instance = this
          assert.isDefined(instance.state)
          assert.equal(instance.state.constructor.name, 'ReactiveDict')
          instance.state.set('foo', 'barbaz')

          createView({
            name: 'destroyTest',
            onCreated () {
              const instance = this
              assert.isDefined(instance.state)
              assert.equal(instance.state.constructor.name, 'ReactiveDict')
              assert.isUndefined(instance.state.get('foo'))
              done()
            }
          })
        }
      })
    })
  })

  describe('Spacebars', function () {
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

  describe(Template.setState.name, function () {

    it('is defined on Template', function () {
      assert.isDefined(Template.getState)
      assert.equal(typeof Template.getState, 'function')
    })

    it('returns false if no Template / instnce exists', function () {
      assert.isFalse(Template.setState(rand(), rand()))
    })

    it('throws if key is null', function () {
      assert.throws(function () {
        Template.setState(null, rand())
      })
    })

    it('throws if key is undefined', function () {
      assert.throws(function () {
        Template.setState(void 0, rand())
      })
    })

    it('returns true if Template / instance exists / key exists and value has been set', function (done) {
      createView({
        name: 'setGetTest',
        onCreated () {
          const key = rand()
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
      assert.isUndefined(Template.getState(rand()))
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
          const expectedVar = rand()
          const expectedValue = rand()
          this.state.set(expectedVar, expectedValue)
          assert.equal(Template.getState(expectedVar), expectedValue)
          done()
        }
      })
    })
  })

  describe(Template.toggle.name, function () {
    it('toggles variables on TemplateIntance', function (done) {
      createView({
        name: 'toggleTest',
        onCreated () {
          const instance = this
          const key = rand()
          instance.state.set(key, true)
          Template.toggle(key)
          assert.isFalse(instance.state.get(key))
          Template.toggle(key)
          assert.isTrue(instance.state.get(key))
          done()
        }
      })
    })

    it('defaults to toggle a false value to true if no value exists by key', function (done) {
      createView({
        name: 'toggleTest',
        onCreated () {
          const instance = this
          const key = rand()
          assert.isUndefined(instance.state.get(key))
          Template.toggle(key)
          assert.isTrue(instance.state.get(key))
          done()
        }
      })
    })

    it('throws if key is undefined', function (done) {
      createView({
        name: 'toggleTest',
        onCreated () {
          assert.throws(function () {
            Template.toggle(void 0)
          })
          done()
        }
      })
    })

    it('throws if key is null', function (done) {
      createView({
        name: 'toggleTest',
        onCreated () {
          assert.throws(function () {
            Template.toggle(null)
          })
          done()
        }
      })
    })
  })

})
