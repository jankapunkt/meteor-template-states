Meteor Template States
=================

Template states for Blaze

Installation  
------------

``` sh
meteor add gwendall:template-states
```

Methods
----------

**template.state(key)**  
Gets a template state  

**template.state(key, value)**  
Sets a template state  

Example
-------  

``` javascript
Template.post.created = function() {
  var tpl = this;
  tpl.state("loading", false);
}
```  

``` javascript
Template.post.events({
  "submit form": function(e, tpl) {
    var data = { ... }; // get your data
    tpl.state("loading", true);
    Meteor.call("post.create", data, function(err, res) {
      tpl.state("loading", false);
      // Do something else
    });
  }
})
```  

The state is then available in templates  

``` html
  <template name="post">
    {{#if loading}}
      Loading...
    {{/if}}
  </template>
```
