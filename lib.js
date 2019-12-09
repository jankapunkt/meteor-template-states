import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { check, Match } from 'meteor/check'

const isDefined = x => typeof x !== 'undefined' && x !== null

/**
 * Shortcut for Template.instance().state.set
 * @param key The key by which the variable should be stored
 * @param value The value to be stored
 * @throws Key missing error when key is undefined
 * @returns {Boolean} Returns false if no instance or instance.state is present,
 * otherwise returns true after value has been stored.
 */

function setState (key, value) {
  check(key, Match.Where(isDefined))
  const instance = Template.instance()
  if (!instance || !instance.state) {
    return false
  }
  instance.state.set(key, value)
  return true
}

Object.defineProperty(Template, 'setState', {
  value: setState,
  writable: false
})

/**
 * Shortcut for Template.instance().state.get
 * @param key access key
 * @throws Key missing error when key is undefined
 * @returns {*|null} Returns either the value obtained by key or null
 */

function getState (key) {
  check(key, Match.Where(isDefined))
  const instance = Template.instance()
  if (instance && instance.state) {
    return instance.state.get(key)
  }
}

Object.defineProperty(Template, 'getState', {
  value: getState,
  writable: false
})

/**
 * Hook into Template onCreated and create helpers
 */

;(function (onCreated) {
  Template.prototype.onCreated = function (cb) {
    const instance = this
    instance.__helpers.set('state', function (key) {
      return Template.getState(key)
    })
    onCreated.call(instance, cb)
  }
})(Template.prototype.onCreated)


/**
 * Create a new Reactive dict on every new view creation
 */

;(function (onCreated) {
  Blaze.View.prototype.onViewCreated = function (cb) {
    const view = this
    const instance = view.templateInstance()
    instance.state = instance.state || new ReactiveDict()
    onCreated.call(view, cb)
  }
})(Blaze.View.prototype.onViewCreated)

/**
 * Toggles a boolean variables, default state is false.
 * @param key The name of the state variable to be toggled
 * @throws Key missing error when key is undefined
 */
Blaze.TemplateInstance.prototype.toggle = function toggle (key) {
  check(key, Match.Where(isDefined))
  const currentValue = this.state.get(key)
  this.state.set(key, !currentValue)
}

/**
 * Toggles a boolean variables, default state is false.
 * @param key The name of the state variable to be toggled
 * @throws Key missing error when key is undefined
 */
Template.toggle = function toggle (key) {
  const instance = Template.instance()
  if (instance) {
    instance.toggle(key)
  }
}
