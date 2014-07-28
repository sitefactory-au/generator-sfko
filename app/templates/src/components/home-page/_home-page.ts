/// <amd-dependency path="text!./home-page.html" />
import ko = require("knockout");
export var template: string = require("text!./home-page.html");

export class viewModel {
    public message = ko.observable("Welcome to <%= longName.replace('"', '\\"') %>!");

    public doSomething() {
        this.message('You invoked doSomething() on the viewmodel.');
    }
}
