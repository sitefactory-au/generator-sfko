/// <reference path="../../../definitions/jasmine/jasmine.d.ts" />

define(["models/<%= name %>/<%= name %>"], (<%= name %>) => {
    var Model = <%= name %>.model;

    describe('<%= name %> model', () => {

        it('You should implement some tests', () => {
            expect(false).toBe(true);
        });

    });
});
