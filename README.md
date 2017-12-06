

# Meteor Template States

Template states for Blaze. Forked from [gwendall:template-states](https://github.com/gwendall/meteor-template-states).

## Goals and differences to gwendall:template-states

Goals are
* to provide state access across all Templates in the same easy way like the original
* let the developer decide about the helper access
* Small, clean and tested codebase

Differences are
* The state object is a directly references `ReactiveDict`, which is why access is determined by the ReactiveDict API (set/get).
* There is not a helper created for every variable, that is pushed/removed to the state. Accessing via SpaceBars acts through the `state` helper (see examples). There are some cases, where you might not directly access the variable but name a helper just like the variable but process the value before returning it (e.g. decoration, proxy object etc.).
* There is a shortcut for `Template.instance().state.<get/set>` to be accessed in helpers.


## Installation  

``` sh
meteor add jkuester:template-states
```

## Methods

### Use with TemplateInstance

##### set / get

`instance.state.set(key, value)` - Sets a template state variable by key.

`instance.state.get(key)` - Gets a template state variable by key.

##### Example

Declare your states in ```onCreated``` hooks

``` javascript
Template.post.onCreated(function() {
	const instance = this;
	instance.state.set('loading', false);
})
```

The states are then available in your templates.  

``` javascript
Template.post.events({
	'submit form': function(event, instance) {
    	instance.state.get('loading', true);
    	Meteor.call('post.create', { ... }, function(err, res) {
      		instance.state('loading', false);
      		// Do something else
    	});
 	}
})
```  

##### toggle

`instance.toggle(key)` - Toggles a boolean key between `false` and `true` (switches `value` to `!value`).

Note: if you apply this on non-boolean state variables, they become boolean.


### Use with Template

`Template.setState(key, value)` - Sets the state on the current Template's instance.

`Template.getState(key)` - Returns the state on the current Template's instance.

Note: This calls `Template.instance()` and returns the current instance's state.


##### Example

Declare your states in ```onCreated``` hooks

``` javascript
Template.post.onCreated(function() {
	const instance = this;
	instance.state.set('loading', false);
})
```

The states are then available in your helpers.

``` javascript
Template.post.helpers({
	loadComplete() {
		const loading = Template.getState('loading');
		// maybe check other things here....
		return !loading;
	}
})
```

### Use with Spacebars


Declare your states in ```onCreated``` hooks

``` javascript
Template.post.onCreated(function() {
	const instance = this;
	instance.state.set('loading', false);
})
```
Then use your state variable in your html content like this:

``` html
  <template name="post">
    {{#if (state 'loading')}}
      Loading...
    {{/if}}
  </template>
```
