"use strict";
describe('routeDecorator', function() {
    it('adds the back flag to the current route when going back in history', inject(function ($history, $route, $location, $rootScope) {
        $history.urlStack = [
            {},
            {}
        ];
        $history.activeIndex = 0;
        $history.previousIndex = 1;
        var newRoute = {};
        $rootScope.$emit("$routeChangeStart", newRoute);
        expect(newRoute.back).toBe(true);
    }));
    it('adds the back flag to the current route when going forward in history', inject(function ($history, $route, $location, $rootScope) {
        $history.urlStack = [
            {},
            {}
        ];
        $history.activeIndex = 1;
        $history.previousIndex = 0;
        var newRoute = {};
        $rootScope.$emit("$routeChangeStart", newRoute);
        expect(newRoute.back).toBe(false);
    }));
});