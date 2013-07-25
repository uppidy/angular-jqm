"use strict";
describe('jqmPanel', function() {
    var panelContainerEl, panelEl, scope;

    function compile(panelHtml) {
        inject(function($compile, $rootScope) {
            scope = $rootScope.$new();
            panelContainerEl = $compile('<div jqm-panel-container>'+panelHtml+'</div>')(scope);
            $rootScope.$digest();
            panelEl = panelContainerEl.children().eq(1);
        });

    }

    it('adds the right classes', function() {
        compile('<div jqm-panel position="left" display="push" jqm-theme="e"></div>');
        expect(panelEl).toHaveClass("ui-panel");
        expect(panelEl).toHaveClass("ui-panel-position-left");
        expect(panelEl).toHaveClass("ui-panel-display-push");
        expect(panelEl).toHaveClass("ui-body-e");
        expect(panelEl).toHaveClass("ui-panel-animate");
    });
    it('transcludes the content into an own div', function() {
        compile('<div jqm-panel position="left">someContent</div>');
        var children = panelEl.children();
        expect(children).toHaveClass("ui-panel-inner");
        expect(~children.text().indexOf("someContent")).toBeTruthy();
    });
});
