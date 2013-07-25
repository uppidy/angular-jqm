/**
 * @ngdoc directive
 * @name jqm.directive:jqmPage
 * @restrict A
 *
 * @description
 * Creates a jquery mobile page. Also adds automatic overflow scrolling for it's content.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page class="jqm-standalone-page" style="height: 100px;">
 <p>Hello world!</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 </div>
 </file>
 </example>
 */
jqmModule.directive('jqmPage', ['jqmScrollableDirective', '$rootScope', function (jqmScrollableDirectives, $rootScope) {
    return {
        restrict: 'A',
        require: 'jqmPage',
        controller: angular.noop,
        // Note: We are not using a template here by purpose,
        // so that other directives like dialog may reuse this directive in a template themselves.
        compile: function (cElement, cAttr) {
            var content = angular.element('<div class="ui-content"></div>');
            content.append(cElement.contents());
            cElement.append(content);
            cElement.addClass("ui-page");
            return function (scope, lElement, lAttr, jqmPageCtrl) {
                var content = lElement.children();
                lElement.addClass("ui-body-" + scope.$theme);
                addAndRemoveParentDependingClasses(scope, lElement, content);
                if (content.data("jqmHeader")) {
                    content.addClass('jqm-content-with-header');
                    lElement.prepend(content.data("jqmHeader"));
                }
                if (content.data("jqmFooter")) {
                    content.addClass('jqm-content-with-footer');
                    lElement.append(content.data("jqmFooter"));
                }
                // Don't use scrolly-scroll directive here by purpose,
                // as it is swallowing all mousemove events, which prevents
                // the address bar to be shown using a scroll on the page header.
                angular.forEach(jqmScrollableDirectives, function (jqmScrollableDirective) {
                    jqmScrollableDirective.link(scope, content, lAttr);
                });
            };

            function addAndRemoveParentDependingClasses(scope, lElement, content) {
                var viewContentLoadedOff = $rootScope.$on('$viewContentLoaded', function (event, pageNodes) {
                    // Note: pageNodes may contain text nodes as well as our page.
                    var pageEl;
                    angular.forEach(pageNodes, function (pageNode) {
                        if (pageNode === lElement[0]) {
                            pageEl = pageNode;
                        }
                    });
                    // Note: checking event.targetScope===scope does not work when we put a jqm-theme on the page.
                    if (pageEl) {
                        lElement.parent().addClass("ui-overlay-" + scope.$theme);
                        if (lElement.parent().data("jqmHeader")) {
                            content.addClass("jqm-content-with-header");
                        }
                        if (lElement.parent().data("jqmFooter")) {
                            content.addClass("jqm-content-with-footer");
                        }
                        lElement.parent().addClass("ui-mobile-viewport");
                    }
                });
                scope.$on('$destroy', viewContentLoadedOff);
            }
        }
    };
}]);