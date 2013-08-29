/**
 * @ngdoc directive
 * @name jqm.directive:jqmLiLink
 * @restrict A
 *
 * @description
 * Creates a jquery mobile list item link entry.
 *
 * Must be inside of a {@link jqm.directive:jqmListview jqmListview}
 *
 * - Add a `<img jqm-li-thumb>` inside for a thumbnail.
 * - Add a `<span jqm-li-count>` inside for a count.
 *
 * @param {string=} jqmLiLInk The link, or href, that this listitem should go to when clicked.
 * @param {string=} icon What icon to use for the link.  Default 'ui-icon-arrow-r'.
 * @param {string=} iconpos Where to put the icon. Default 'right'.
 * @param {string=} iconShadow Whether the icon should have a shadow or not. Default true.
 *
 */
jqmModule.directive('jqmLiLink', [function() {
    var isdef = angular.isDefined;
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        templateUrl: 'templates/jqmLiLink.html',
        controller: ['$scope', JqmLiController],
        scope: {
            icon: '@',
            iconpos: '@',
            iconShadow: '@',
            link: '@jqmLiLink',
            //hasThumb and hasCount set by jqmLiCount and jqmLiThumb
        },
        compile: function(element, attr) {
            attr.icon = isdef(attr.icon) ? attr.icon : 'ui-icon-arrow-r';
            attr.iconpos = isdef(attr.iconpos) ? attr.iconpos : 'right';
            attr.iconShadow = isdef(attr.iconShadow) ? attr.iconShadow : true;
        }
    };
    function JqmLiController($scope) {
        this.$scope = $scope;
    }
}]);
