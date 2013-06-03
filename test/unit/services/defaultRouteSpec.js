"use strict";
describe('defaultRoute', function() {
    it('loads pages using their non absolute url', inject(function($location, $rootScope, $route, $httpBackend) {
        var somePageContent = 'somePageContent';
        $httpBackend.when('GET', 'somePath').respond(200, somePageContent);
        $location.path('/somePath');
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.locals.$template).toBe(somePageContent);
    }));
});