'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var chalk = require('chalk');

var ComponentGenerator = yeoman.generators.NamedBase.extend({

  init: function () {
    console.log('Creating component \'' + this.name + '\'...');
    this.componentName = this.name;
    this.dirname = 'src/components/' + this._.dasherize(this.name) + '/';
    this.filename = this._.dasherize(this.name);
    this.viewModelClassName = this._.classify(this.name);
  },

  template: function () {
    this.copy('view.html', this.dirname + this.filename + '.html');
    this.copy('viewmodel.js', this.dirname + this.filename + '.js');
  },

  addComponentRegistration: function() {
    var startupFile = 'src/js/startup.js';
    readIfFileExists.call(this, startupFile, function(existingContents) {
        var existingRegistrationRegex = new RegExp('\\bko\\.components\\.register\\(\s*[\'"]' + this.filename + '[\'"]');
        if (existingRegistrationRegex.exec(existingContents)) {
            this.log(chalk.white(this.filename) + chalk.cyan(' is already registered in ') + chalk.white(startupFile));
            return;
        }

        var token = '// [Scaffolded component registrations will be inserted here. To retain this feature, don\'t remove this comment.]',
            regex = new RegExp('^(\\s*)(' + token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + ')', 'm'),
            modulePath = 'components/' + this.filename + '/' + this.filename,
            lineToAdd = 'ko.components.register(\'' + this.filename + '\', { require: \'' + modulePath + '\' });',
            newContents = existingContents.replace(regex, '$1' + lineToAdd + '\n$&');
        fs.writeFile(startupFile, newContents);
        this.log(chalk.green('   registered ') + chalk.white(this.filename) + chalk.green(' in ') + chalk.white(startupFile));

        if (fs.existsSync('gulpfile.js')) {
            this.log(chalk.magenta('To include in build output, reference ') + chalk.white('\'' + modulePath + '\'') + chalk.magenta(' in ') + chalk.white('gulpfile.js'));
        }
    });
  }

});

function readIfFileExists(path, callback) {
    if (fs.existsSync(path)) {
        callback.call(this, this.readFileAsString(path));
    }
}

module.exports = ComponentGenerator;