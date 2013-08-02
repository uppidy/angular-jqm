"use strict";
describe('$loadDialog', function () {
    var defaultTemplate = angular.element('<div><div class="ui-loader ui-corner-all ui-body-d ui-loader-default"> ' +
        '  <span class="ui-icon ui-icon-loading"></span>' +
        '   <h1></h1>' +
        '</div></div>');

    var $rootElement, $loadDialog, $q, $rootScope;

    beforeEach(function () {
        $rootElement = angular.element('<div></div>');

        module(function ($provide) {
            $provide.value('$rootElement', $rootElement);
        });

        inject(function ($injector) {
            $loadDialog = $injector.get('$loadDialog');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        //spyOn($loadDialog, 'hide').andCallThrough();
    });

    function clickLoader() {
        $rootElement.find('div').triggerHandler('click');
    }

    describe("show() and hide()", function () {
        it("must add 'ui-loading' class", function () {
            expect($rootElement.hasClass('ui-loading')).toBe(false);
            $loadDialog.show();
            expect($rootElement.hasClass('ui-loading')).toBe(true);
        });

        it("must remove 'ui-loading' class", function () {
            $loadDialog.show();
            $loadDialog.hide();
            expect($rootElement.hasClass('ui-loading')).toBe(false);
        });

        it("should be able to stack show calls relative to the message", function () {
            $loadDialog.show('test1');
            $loadDialog.show('test2');

            expect($rootElement.find('h1').text()).toBe('test2');
            $loadDialog.hide();
            expect($rootElement.find('h1').text()).toBe('test1');
            $loadDialog.hide();

            expect($rootElement.hasClass('ui-loading')).toBeFalsy();
        });

        it("should be able to stack show calls relative to the callbacks", function() {
            var callback1 = jasmine.createSpy();
            var callback2 = jasmine.createSpy();
            $loadDialog.show(callback1);
            $loadDialog.show(callback2);

            expect(callback1).not.toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();

            clickLoader();
            expect(callback1).not.toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();

            $loadDialog.hide();
            clickLoader();
            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });

        it("must add loader html", function () {
            $loadDialog.show();

            testutils.compareElementRecursive($rootElement, angular.element(defaultTemplate), /ui-loading/);
        });

        it("must display message if set", function () {
            $loadDialog.show('message');

            expect($rootElement.find('div').hasClass('ui-loader-verbose')).toBeTruthy();
            expect($rootElement.find('h1').text()).toBe('message');
        });

        it("must call callback function", function () {
            var expected = false;
            var callback = jasmine.createSpy();

            $loadDialog.show('message', callback);
            expect(callback).not.toHaveBeenCalled();

            clickLoader();

            expect(callback).toHaveBeenCalled();
        });
    });

    describe("waitFor", function () {
        it('should waitFor the end of promises with the given message', function () {
            var p = $q.defer();
            $loadDialog.waitFor(p.promise, 'message');
            expect($rootElement.find('div').hasClass('ui-loader-verbose')).toBeTruthy();
            expect($rootElement.find('h1').text()).toBe('message');
            expect($rootElement.hasClass('ui-loading')).toBeTruthy();

            p.resolve();
            $rootScope.$apply();
            expect($rootElement.hasClass('ui-loading')).toBeFalsy();
        });

        it('should waitFor the end of already finished promises', function () {
            var p = $q.defer();
            p.resolve();

            $loadDialog.waitFor(p.promise, 'message');
            expect($rootElement.find('div').hasClass('ui-loader-verbose')).toBeTruthy();
            expect($rootElement.hasClass('ui-loading')).toBeTruthy();

            $rootScope.$apply();
            expect($rootElement.hasClass('ui-loading')).toBeFalsy();
        });
    });

    describe("waitForWithCancel", function () {
        it('should waitFor the end of promises and cancel promises when clicked', function () {
            var p = $q.defer();
            var callback = jasmine.createSpy();
            p.promise.then(null, callback);
            var cancelRes = {test: true};
            $loadDialog.waitForWithCancel(p, cancelRes);

            expect($rootElement.hasClass('ui-loading')).toBeTruthy();

            clickLoader();

            expect($rootElement.hasClass('ui-loading')).toBeFalsy();
            expect(callback).toHaveBeenCalledWith(cancelRes);
        });

        it('should use the given message', function () {
            var p = $q.defer();
            $loadDialog.waitForWithCancel(p, null, 'message');

            expect($rootElement.find('div').hasClass('ui-loader-verbose')).toBeTruthy();
            expect($rootElement.find('h1').text()).toBe('message');
            expect($rootElement.hasClass('ui-loading')).toBeTruthy();
        });
    });

});
