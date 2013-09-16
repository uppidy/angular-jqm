"use strict";
describe('jqmPanelContainer', function() {
    //Cannot really compare markup with jqm, as we are doing it so differently
    var panelContainerEl, scope, $timeout, $sniffer;

    beforeEach(function() {
        module(function($provide) {
            $provide.value('$window', angular.mock.createMockWindow());
            return function(_$sniffer_, _$timeout_) {
                $sniffer = _$sniffer_;
                $sniffer.animations = false;
                $timeout = _$timeout_;
            };
        });
    });
    function compile(html) {
        inject(function($compile, $rootScope) {
            scope = $rootScope.$new();
            panelContainerEl = $compile(html)(scope);
            $rootScope.$digest();
        });

    }

    describe('content wrapping', function() {
        it('adds the right classes when no panel is open', function() {
            compile('<div jqm-panel-container><div class="content"></div>');
            var content = panelContainerEl.children().eq(1);
            expect(content).toHaveClass("content");
            expect(content).toHaveClass("ui-panel-content-wrap");
            expect(content).toHaveClass("ui-panel-animate");
        });
        it('adds the right classes when the left panel is open', function() {
            compile('<div jqm-panel-container="\'left\'"><div jqm-panel position="left"></div><div class="content"></div>');
            var content = panelContainerEl.children().eq(2);
            expect(content).toHaveClass("content");
            expect(content).toHaveClass(["ui-panel-content-wrap-open", "ui-panel-content-wrap-position-left", "ui-panel-content-wrap-display-reveal"]);
        });
        it('adds the right classes when the panel display is push', function() {
            compile('<div jqm-panel-container="\'left\'"><div jqm-panel position="left" display="push"></div><div class="content"></div>');
            var content = panelContainerEl.children().eq(2);
            expect(content).toHaveClass("content");
            expect(content).toHaveClass(["ui-panel-content-wrap-open", "ui-panel-content-wrap-position-left", "ui-panel-content-wrap-display-push"]);
        });
    });

    describe('closed panels', function() {
        beforeEach(function() {
            compile('<div jqm-panel-container><div jqm-panel position="left"></div>');
        });
        it('adds the right classes to the panel', function() {
            var panel = panelContainerEl.children().eq(1);
            expect(panel).toHaveClass("ui-panel");
            expect(panel).toHaveClass("ui-panel-closed");
            expect(panel).not.toHaveClass("ui-panel-open");
            expect(panel).not.toHaveClass("ui-panel-opened");
        });
        it('adds the right classes to the dismiss', function() {
            var dismiss = panelContainerEl.children().eq(0);
            expect(dismiss).toHaveClass("ui-panel-dismiss");
            expect(dismiss).not.toHaveClass("ui-panel-dismiss-open");
        });
    });

    describe('open panel', function() {
        beforeEach(function() {
            compile('<div jqm-panel-container="\'left\'"><div jqm-panel position="left"></div>');
        });
        it('adds the right classes to the panel', function() {
            var panel = panelContainerEl.children().eq(1);
            expect(panel).toHaveClass("ui-panel");
            expect(panel).toHaveClass("ui-panel-opened");
            expect(panel).not.toHaveClass("ui-panel-open");
            expect(panel).not.toHaveClass("ui-panel-closed");
        });
        it('adds the right classes to the dismiss', function() {
            var dismiss = panelContainerEl.children().eq(0);
            expect(dismiss).toHaveClass("ui-panel-dismiss");
            expect(dismiss).toHaveClass("ui-panel-dismiss-open");
        });
    });

    describe('dismiss panel', function() {
        it('closes the panels when the dismiss element is clicked', function() {
            compile('<div jqm-panel-container="openedPanel"><div jqm-panel position="left"></div>');
            var dismiss = panelContainerEl.children().eq(0);
            scope.openedPanel = "left";
            scope.$apply();
            expect(dismiss).toHaveClass(["ui-panel-dismiss-open", "ui-panel-dismiss-left"]);
            dismiss.triggerHandler("click");
            expect(dismiss).not.toHaveClass(["ui-panel-dismiss-open","ui-panel-dismiss-left","ui-panel-dismiss-right"]);
            expect(scope.openedPanel).toBe(null);
        });
    });

    describe('css transitions', function() {
        var $transitionComplete;
        beforeEach(function() {
            $transitionComplete = jasmine.createSpy('$transitionComplete');
            module(function($provide) {
                $provide.value('$transitionComplete', $transitionComplete);
                return function($sniffer) {
                    $sniffer.animations = true;
                };
            });
        });
        describe('open panels', function() {
            it('adds the right classes', function() {
                compile('<div jqm-panel-container="openedPanel"><div jqm-panel position="left"></div>');
                var panel = panelContainerEl.children().eq(1);
                expect(panel).toHaveClass("ui-panel-closed");
                scope.openedPanel = "left";
                scope.$apply();
                expect(panel).not.toHaveClass("ui-panel-closed");
                expect(panel).not.toHaveClass("ui-panel-open");
                expect(panel).not.toHaveClass("ui-panel-opened");
                $timeout.flush();
                expect(panel).toHaveClass("ui-panel-open");
                expect(panel).not.toHaveClass("ui-panel-opened");
                $transitionComplete.mostRecentCall.args[1]();
                expect(panel).toHaveClass("ui-panel-open");
                expect(panel).toHaveClass("ui-panel-opened");
            });
        });
        describe('close panels', function() {
            it('adds the right classes', function() {
                compile('<div jqm-panel-container="openedPanel"><div jqm-panel position="left"></div>');
                var panel = panelContainerEl.children().eq(1);
                expect(panel).toHaveClass("ui-panel-closed");
                scope.openedPanel = "left";
                scope.$apply();
                $timeout.flush();
                $transitionComplete.mostRecentCall.args[1]();

                expect(panel).not.toHaveClass("ui-panel-closed");
                expect(panel).toHaveClass("ui-panel-opened");

                scope.openedPanel = null;
                scope.$apply();
                expect(panel).not.toHaveClass("ui-panel-closed");
                expect(panel).not.toHaveClass("ui-panel-open");
                expect(panel).not.toHaveClass("ui-panel-opened");

                $transitionComplete.mostRecentCall.args[1]();
                expect(panel).toHaveClass("ui-panel-closed");
                expect(panel).not.toHaveClass("ui-panel-open");
                expect(panel).not.toHaveClass("ui-panel-opened");
            });
        });
    });
});
