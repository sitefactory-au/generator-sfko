'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var chalk = require('chalk');

var ModelGenerator = yeoman.generators.NamedBase.extend({

  detectCodeLanguage: function() {
    this.usesTypeScript = fs.existsSync('src/app/startup.ts');
    this.usesTests = fs.existsSync('test/index.html');
    this.codeFileExtension = this.usesTypeScript ? '.ts' : '.js';
  },

  init: function () {
    var codeLanguage = this.usesTypeScript ? 'TypeScript' : 'JavaScript';
    console.log('Creating model \'' + this.name + '\' (' + codeLanguage + ')...');
    this.componentName = this.name;
    this.dirname = 'src/models/' + this._.dasherize(this.name) + '/';
    this.filename = this._.dasherize(this.name);
    this.modelClassName = this._.classify(this.name);
    if (this.usesTests) {
        this.dirtest = 'test/models/' + this._.dasherize(this.name) + '/';
    }
  },

  template: function () {
    var codeExtension = this.usesTypeScript ? '.ts' : '.js';
    this.copy('model' + this.codeFileExtension, this.dirname + this.filename + this.codeFileExtension);
    if(this.usesTests) {
       this.copy('model-test' + this.codeFileExtension, this.dirtest + this.filename + this.codeFileExtension);
    }
  },

  
  addRequireRegistration: function() {
   var requireFile = 'src/app/require.config.js';
	 readIfFileExists.call(this, requireFile, function(existingContents) {
        // var existingRegistrationRegex = new RegExp('\\bko\\.components\\.register\\(\s*[\'"]' + this.filename + '[\'"]');
        // if (existingRegistrationRegex.exec(existingContents)) {
        //     this.log(chalk.white(this.filename) + chalk.cyan(' is already registered in ') + chalk.white(startupFile));
        //     return;
        // }
        this.log(chalk.white('file found'));

        var token = '// [Scaffolded model and module paths will be inserted here. To retain this feature, don\'t remove this comment.]',
            regex = new RegExp('^(\\s*)(' + token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + ')', 'm'),
            modulePath = 'models/' + this.filename + '/' + this.filename,
            lineToAdd = '"' + this.name + '": "' + modulePath + '",',
            newContents = existingContents.replace(regex, '$1' + lineToAdd + '\n$&');
            fs.writeFile(requireFile, newContents);
            this.log(chalk.green('   registered ') + chalk.white(this.filename) + chalk.green(' in ') + chalk.white(requireFile));
    });

    var testFile = 'test/SpecRunner.browser' + this.codeFileExtension;
    readIfFileExists.call(this, testFile, function(existingContents) {
      var existingRegistrationRegex = new RegExp('\'models/' + this.filename + '/' + this.filename + '\',');
      if (existingRegistrationRegex.exec(existingContents)) {
        this.log(chalk.white(this.filename) + chalk.cyan(' is already registered in ') + chalk.white(testFile));
        return;
      }

      var token = '// [Scaffolded component registrations will be inserted here. To retain this feature, don\'t remove this comment.]',
        regex = new RegExp('^(\\s*)(' + token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + ')', 'm'),
        modulePath = 'models/' + this.filename + '/' + this.filename,
        lineToAdd = '\''  + modulePath + '\',',
        newContents = existingContents.replace(regex, '$1' + lineToAdd + '\n$&');
      fs.writeFile(testFile, newContents);
      this.log(chalk.green('   registered ') + chalk.white(this.filename) + chalk.green(' in ') + chalk.white(testFile));

    });
  }


});

function readIfFileExists(path, callback) {
    if (fs.existsSync(path)) {
        callback.call(this, this.readFileAsString(path));
    }
}

module.exports = ModelGenerator;
