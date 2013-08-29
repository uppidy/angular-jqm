
jqmModule.directive('jqmLiThumb', [function() {
    return {
        restrict: 'A',
        require: '^jqmLiLink',
        link: function(scope, elm, attr, jqmLiLinkCtrl) {
            jqmLiLinkCtrl.$scope.hasThumb = true;
            elm.addClass('ui-li-thumb');
        }
    };
}]);
