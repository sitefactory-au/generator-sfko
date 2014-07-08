/// <reference path="../../../definitions/jasmine/jasmine.d.ts" />

define(["modules/<%= name %>/<%= name %>"], (<%= name %>) => {
    var Module = <%= name %>.module;

    describe('<%= name %> module', () => {

        it('You should implement some tests', () => {
            expect(false).toBe(true);
        });

    });
});
