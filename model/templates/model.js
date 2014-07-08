define(['knockout'], function(ko) {

  function <%= modelClassName %>(data) {
    var self = this;
    self.id = data.id;
    self.name = ko.observable(data.name);
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  <%= modelClassName %>.prototype.dispose = function() { };
  

  return <%= modelClassName %>;

});
