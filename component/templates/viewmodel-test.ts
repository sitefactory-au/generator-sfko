/// <reference path="../../../definitions/jasmine/jasmine.d.ts" />

define(["components/<%= name %>/<%= name %>"], (<%= name %>) => {
    var ViewModel = <%= name %>.viewModel;

    describe('<%= name %>  view model', () => {

        it('You should implement some tests', () => {
            expect(false).toBe(true);
        });

    });
});
