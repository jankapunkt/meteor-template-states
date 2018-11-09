import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

/**
 * Shortcut for Template.instance().state.set
 * @param key The key by which the variable should be stored
 * @param value The value to be stored
 * @returns {Boolean} Returns false if no instance or instance.state is present,
 * otherwise returns true after value has been stored.
 */
Template.setState = function setState (key, value) {
  const instance = Template.instance()
  if (!instance || !instance.state) return null
  instance.state.set(key, value)
  return true
}

/**
 * Shortcut for Template.instance().state.get
 * @param key access key
 * @returns {*|null} Returns either the value obtained by key or null
 */
Template.getState = function getState (key) {
  const instance = Template.instance()
  return (instance && instance.state)
    ? instance.state.get(key)
    : null
};

/**
 * Hook into onCreated and create helpers
 */
(function (onCreated) {
  Template.prototype.onCreated = function (cb) {
    const instance = this
    // instance.state = new ReactiveDict();
    // console.log("on created: ", instance.viewName, instance);
    instance.__helpers.set('state', function (key) {
      return Template.getState(key)
    })
    onCreated.call(instance, cb)
  }
})(Template.prototype.onCreated)

/**
 * Current instance's internal state as ReactiveDict.
 * @type {ReactiveDict}
 */
Blaze.TemplateInstance.prototype.state = new ReactiveDict()

/**
 * Toggles a boolean variables, default state is false.
 * @param key The name of the state variable to be toggled
 */
Blaze.TemplateInstance.prototype.toggle = function toggle (key) {
  const currentValue = this.state.get(key)
  this.state.set(key, !currentValue)
}
