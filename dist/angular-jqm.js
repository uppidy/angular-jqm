/*! angular-jqm - v0.0.1-SNAPSHOT - 2013-05-31
 * https://github.com/opitzconsulting/angular-jqm
 * Copyright (c) 2013 OPITZ CONSULTING GmbH; Licensed MIT */
(function(angular) {
    "use strict";
var jqmModule = angular.module("jqm", []);
jqmModule.directive('jqmPage', function() {
    return {
        restrict: 'A',
        compile: function(cElement) {
            // TODO: ui-body-c: Theming should be customizable!
            cElement.addClass("ui-page ui-body-c");
        }   
    };
});})(angular);