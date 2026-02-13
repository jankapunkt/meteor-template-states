/* eslint-env mocha */
import { assert } from 'chai'
import { Blaze } from 'meteor/blaze'
import { Random } from 'meteor/random'
import { Template } from 'meteor/templating'

describe('extensions/TemplateExtensions', () => {
  /*
   * Test helper to construct a view and callback onCreated
   * @param name Name of the view to be constructed
   * @param onCreated Callback to run after view has been constructed
   * @param helpers Helpers definitions
   * @return {Blaze.view} A constructed blaze Template view
   */
  const createView = ({ name, onCreated, helpers }) => {
    const template = Blaze.Template(name, () => null)

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

  describe('state property', () => {
    it('is defined on a new instance', (done) => {
      createView({
        name: 'stateTest',
        onCreated() {
          assert.isDefined(this.state)
          assert.equal(this.state.constructor.name, 'ReactiveDict')
          done()
        },
      })
    })

    it('is a new ReactiveDict instance for every new Template instance', (done) => {
      createView({
        name: 'destroyTest',
        onCreated() {
          assert.isDefined(this.state)
          assert.equal(this.state.constructor.name, 'ReactiveDict')
          this.state.set('foo', 'barbaz')

          createView({
            name: 'destroyTest',
            onCreated() {
              assert.isDefined(this.state)
              assert.equal(this.state.constructor.name, 'ReactiveDict')
              assert.isUndefined(this.state.get('foo'))
              done()
            },
          })
        },
      })
    })
  })

  describe('Spacebars', () => {
    it('has a state helper to be accessed via Spacebars', (done) => {
      const spacebarsHelperView = createView({
        name: 'spacebarsHelperView',
        onCreated: () => {},
      })
      const template = spacebarsHelperView.template
      const stateHelper = template.__helpers.get('state')
      assert.isDefined(stateHelper)
      done()
    })
  })

  describe(Template.setState.name, () => {
    it('is defined on Template', () => {
      assert.isDefined(Template.getState)
      assert.equal(typeof Template.getState, 'function')
    })

    it('returns false if no Template / instnce exists', () => {
      assert.isFalse(Template.setState(rand(), rand()))
    })

    it('throws if key is null', () => {
      assert.throws(() => {
        Template.setState(null, rand())
      })
    })

    it('throws if key is undefined', () => {
      assert.throws(() => {
        Template.setState(undefined, rand())
      })
    })

    it('returns true if Template / instance exists / key exists and value has been set', (done) => {
      createView({
        name: 'setGetTest',
        onCreated() {
          const key = rand()
          assert.isTrue(Template.setState(key, ''), 'string')
          assert.isTrue(Template.setState(key, {}), 'object')
          assert.isTrue(Template.setState(key, []), 'array')
          assert.isTrue(Template.setState(key, 0), 'int')
          assert.isTrue(Template.setState(key, 1.4), 'float')
          assert.isTrue(
            Template.setState(key, () => {}),
            'function',
          )
          done()
        },
      })
    })
  })

  describe(Template.getState.name, () => {
    it('is defined on Template', () => {
      assert.isDefined(Template.getState)
      assert.equal(typeof Template.getState, 'function')
    })

    it('returns undefined if no Template / instance exists', () => {
      const val = Template.getState(rand())
      assert.isUndefined(val)
    })

    it('throws if key is undefined', () => {
      assert.throws(() => {
        Template.getState(undefined)
      })
    })

    it('throws if key is null', () => {
      assert.throws(() => {
        Template.getState(null)
      })
    })

    it('returns true if Template / instance exists / key exists and value has been set', (done) => {
      createView({
        name: 'setGetTest',
        onCreated() {
          const expectedVar = rand()
          const expectedValue = rand()
          this.state.set(expectedVar, expectedValue)
          assert.equal(Template.getState(expectedVar), expectedValue)
          done()
        },
      })
    })
  })

  describe(Template.toggle.name, () => {
    it('toggles variables on TemplateIntance', (done) => {
      createView({
        name: 'toggleTest',
        onCreated() {
          const key = rand()
          this.state.set(key, true)
          Template.toggle(key)
          assert.isFalse(this.state.get(key))
          Template.toggle(key)
          assert.isTrue(this.state.get(key))
          done()
        },
      })
    })

    it('defaults to toggle a false value to true if no value exists by key', (done) => {
      createView({
        name: 'toggleTest',
        onCreated() {
          const key = rand()
          assert.isUndefined(this.state.get(key))
          Template.toggle(key)
          assert.isTrue(this.state.get(key))
          done()
        },
      })
    })

    it('throws if key is undefined', (done) => {
      createView({
        name: 'toggleTest',
        onCreated() {
          assert.throws(() => {
            Template.toggle(undefined)
          })
          done()
        },
      })
    })

    it('throws if key is null', (done) => {
      createView({
        name: 'toggleTest',
        onCreated() {
          assert.throws(() => {
            Template.toggle(null)
          })
          done()
        },
      })
    })
  })
})
