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
jqmModule.directive('jqmPage', ['$scroller', function ($scroller) {
    return {
        restrict: 'A',
        require: 'jqmPage',
        controller: angular.noop,
        // Note: We are not using a template here by purpose,
        // so that other directives like dialog may reuse this directive in a template themselves.
        compile: function(cElement, cAttr) {
            var content = angular.element('<div class="ui-content"></div>');
            content.append(cElement.contents());
            cElement.append(content);
            cElement.addClass("ui-page");
            return function(scope, lElement, lAttr, jqmPageCtrl) {
                lElement.addClass("ui-body-"+scope.$theme);
                var content = lElement.children();
                if (jqmPageCtrl.header) {
                    content.addClass('jqm-content-with-header');
                    lElement.prepend(jqmPageCtrl.header);
                }
                if (jqmPageCtrl.footer) {
                    content.addClass('jqm-content-with-footer');
                    lElement.append(jqmPageCtrl.footer);
                }
                // Don't use scrolly-scroll directive here by purpose,
                // as it is swallowing all mousemove events, which prevents
                // the address bar to be shown using a scroll on the page header.
                $scroller(content);
            };
        }
    };
}]);