import { Blaze } from 'meteor/blaze'
import { Match, check } from 'meteor/check'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Template } from 'meteor/templating'

const isDefined = (x) => typeof x !== 'undefined' && x !== null
let stateName = 'state'

/**
 * Changes the default name of the ReactiveDict, that holds the state
 * @param value
 * @returns {string}
 */
Template.stateName = (value) => {
  if (typeof value !== 'string' || value in Object) {
    throw new Error(`State name ${value} is not allowed.`)
  }

  stateName = value
  return stateName
}

/**
 * Sets the current state. Shortcut to instance.state.set
 * @param key {String} the key or object to set the reactive dict
 * @param value {*} Anything
 * @return {*}
 */
Blaze.TemplateInstance.prototype.setState = function (key, value) {
  this[stateName].set(key, value)
  return true
}

/**
 * Gets a property from the current state.
 * @param key {String} the key to the state property.
 * @return {*}
 */
Blaze.TemplateInstance.prototype.getState = function (key) {
  return this[stateName].get(key)
}

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
  return instance ? instance.setState(key, value) : false
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
  if (instance) {
    return instance.getState(key)
  }
}

Object.defineProperty(Template, 'getState', {
  value: getState,
  writable: false
});

/**
 * Hook into Template onCreated and create helpers
 */
((onCreated) => {
  Template.prototype.onCreated = function (cb) {
    this.__helpers.set('state', (key) => Template.getState(key))
    onCreated.call(this, cb)
  }
})(Template.prototype.onCreated);

/**
 * Create a new Reactive dict on every new view creation
 */
((onCreated) => {
  Blaze.View.prototype.onViewCreated = function (cb) {
    if (this.templateInstance) {
      const instance = this.templateInstance()
      instance[stateName] = instance[stateName] || new ReactiveDict()
    }
    onCreated.call(this, cb)
  }
})(Blaze.View.prototype.onViewCreated)

/**
 * Toggles a boolean variables, default state is false.
 * @param key The name of the state variable to be toggled
 * @throws Key missing error when key is undefined
 */
Blaze.TemplateInstance.prototype.toggle = function toggle (key) {
  check(key, Match.Where(isDefined))
  const currentValue = this[stateName].get(key)
  this[stateName].set(key, !currentValue)
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
