'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var chalk = require('chalk');

var ComponentGenerator = yeoman.generators.NamedBase.extend({

  detectCodeLanguage: function() {
    this.usesTypeScript = fs.existsSync('src/app/startup.ts');
    this.usesLess = fs.existsSync('src/less/styles.less');
    this.usesTests = fs.existsSync('test/index.html');
    this.codeFileExtension = this.usesTypeScript ? '.ts' : '.js';
    this.styleExtension = this.usesLess ? '.less' : '.css';
  },

  init: function () {
    var codeLanguage = this.usesTypeScript ? 'TypeScript' : 'JavaScript';
    console.log('Creating component \'' + this.name + '\' (' + codeLanguage + ')...');
    this.componentName = this.name;
    this.dirname = 'src/components/' + this._.dasherize(this.name) + '/';
    this.filename = this._.dasherize(this.name);
    this.viewModelClassName = this._.classify(this.name);
    if (this.usesTests) {
        this.dirtest = 'test/components/' + this._.dasherize(this.name) + '/';
    }
  },

  template: function () {
    var codeExtension = this.usesTypeScript ? '.ts' : '.js';
    this.copy('view.html', this.dirname + this.filename + '.html');
    this.copy('viewmodel' + this.codeFileExtension, this.dirname + this.filename + this.codeFileExtension);
    if(this.usesTests) {
       this.copy('viewmodel-test' + this.codeFileExtension, this.dirtest + this.filename + this.codeFileExtension);
    }
  },
  
  styles: function () {
    this.copy('styles' + this.styleExtension, this.dirname + this.filename + this.styleExtension);
  },

  addComponentRegistration: function() {
    var startupFile = 'src/app/startup' + this.codeFileExtension;
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

        // if (fs.existsSync('gulpfile.js')) {
        //     this.log(chalk.magenta('To include in build output, reference ') + chalk.white('\'' + modulePath + '\'') + chalk.magenta(' in ') + chalk.white('gulpfile.js'));
        // }
    });

    readIfFileExists.call(this, 'gulpfile.js', function(existingContents) {
        // var existingRegistrationRegex = new RegExp('\\bko\\.components\\.register\\(\s*[\'"]' + this.filename + '[\'"]');
        // if (existingRegistrationRegex.exec(existingContents)) {
        //     this.log(chalk.white(this.filename) + chalk.cyan(' is already registered in ') + chalk.white(startupFile));
        //     return;
        // }

        var token = '// [Scaffolded component includes will be inserted here. To retain this feature, don\'t remove this comment.]',
            regex = new RegExp('^(\\s*)(' + token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + ')', 'm'),
            modulePath = 'components/' + this.filename + '/' + this.filename,
            lineToAdd = '\'' + modulePath + '\',',
            newContents = existingContents.replace(regex, '$1' + lineToAdd + '\n$&');
            fs.writeFile('gulpfile.js', newContents);
            this.log(chalk.green('   included ') + chalk.white(this.filename) + chalk.green(' in ') + chalk.white('gulpfile.js'));
    });

	readIfFileExists.call(this, 'src/less/components.less', function(existingContents) {
        var token = '// [Scaffolded component less files will be inserted here. To retain this feature, don\'t remove this comment.]',
            regex = new RegExp('^(\\s*)(' + token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + ')', 'm'),
            modulePath = 'components/' + this.filename + '/' + this.filename + '.less',
			lineToAdd = '@import "../' + modulePath + '";',
            newContents = existingContents.replace(regex, '$1' + lineToAdd + '\n$&');
            fs.writeFile('src/less/components.less', newContents);
            this.log(chalk.green('   included ') + chalk.white(this.filename) + chalk.green(' in ') + chalk.white('components.less'));
    });

    var testFile = 'test/SpecRunner.browser' + this.codeFileExtension;
    readIfFileExists.call(this, testFile, function(existingContents) {
      var existingRegistrationRegex = new RegExp('\'components/' + this.filename + '/' + this.filename + '\',');
      if (existingRegistrationRegex.exec(existingContents)) {
        this.log(chalk.white(this.filename) + chalk.cyan(' is already registered in ') + chalk.white(testFile));
        return;
      }

      var token = '// [Scaffolded component registrations will be inserted here. To retain this feature, don\'t remove this comment.]',
        regex = new RegExp('^(\\s*)(' + token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + ')', 'm'),
        modulePath = 'components/' + this.filename + '/' + this.filename,
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

module.exports = ComponentGenerator;
