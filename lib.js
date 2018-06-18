import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Random } from 'meteor/random';

/**
 * Global setter
 * @param key by which the variable should be stored
 * @param value value to be stored
 * @returns {*} Returns null if no instance or instance.state is present, otherwise returns true if value has been
 *     stored.
 */
Template.setState = function (key, value) {
	const instance = Template.instance();
	if (!instance || !instance.state) return null;
	instance.state.set(key, value);
	return true;
};

/**
 * Global getter
 * @param key access key
 * @returns {null} Returns the variable by key or null;
 */
Template.getState = function (key) {
	const instance = Template.instance();
	return instance && instance.state
		? instance.state.get(key)
		: null;
};


/**
 * Hook into onCreated and create helpers
 */
(function (onCreated) {
	Template.prototype.onCreated = function (cb) {
		const instance = this;
		//instance.state = new ReactiveDict();
		//console.log("on created: ", instance.viewName, instance);
		instance.__helpers.set("state", function (key) {
			return Template.getState(key);
		});
		onCreated.call(instance, cb);
	};
})(Template.prototype.onCreated);


/**
 * Hook into template instance and create state
 */
Blaze.TemplateInstance.prototype.state = new ReactiveDict();

/**
 * Toggles a boolean variables, default state is false.
 * @param key
 */
Blaze.TemplateInstance.prototype.toggle = function (key) {
	const currentValue = this.state.get(key);
	this.state.set(key, !currentValue);
};
