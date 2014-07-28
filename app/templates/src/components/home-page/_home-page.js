define(["knockout", "text!./home-page.html"], function(ko, homeTemplate) {

  function HomePage(route) {
    this.message = ko.observable('Welcome to <%= longName.replace("'", "\\'") %>!');
  }

  HomePage.prototype.doSomething = function() {
    this.message('You invoked doSomething() on the viewmodel.');
  };

  return { viewModel: HomePage, template: homeTemplate };

});
