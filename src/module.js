/**
 * @ngdoc overview
 * @name jqm
 * @description
 *
 * 'jqm' is the one module that contains all jqm code.
 */

//Save bytes and make code more readable - these vars will be minifed. Angularjs does this
var jqmModule = angular.module("jqm", ["ngTouch", "ngRoute", "ngAnimate", "ajoslin.scrolly", "ui.bootstrap.position"]),
  noop = angular.noop,
  isDefined = angular.isDefined,
  jqLite = angular.element,
  forEach = angular.forEach,
  isString = angular.isString,
  equals = angular.equals,
  isObject = angular.isObject,
  isArray = angular.isArray,
  extend = angular.extend;
