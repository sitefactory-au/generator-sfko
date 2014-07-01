(function() {
  // Reference your test modules here
  var testModules = [
    // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]


    'components/home-page/home-page'
  ];

  // After the 'jasmine-boot' module creates the Jasmine environment, load all test modules then run them
  require(['jasmine-boot'], function () {
  	var modulesCorrectedPaths = testModules.map(function(m) { return '../test/' + m; });
    require(modulesCorrectedPaths, window.onload);
  });
})();
