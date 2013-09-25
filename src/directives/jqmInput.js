function jqmWrappedDirective(directiveName, templateUrl, directiveObject) {
  var actualDirectiveName = directiveName + 'Actual';
  
  jqmModule.directive(directiveName, wrapperDirective);
  jqmModule.directive(actualDirectiveName, directiveObject);

  return jqmModule;
  
  function wrapperDirective($compile, $http, $templateCache) {
    return {
      restrict: 'A',
      //We need to run *before* the other directives on this element
      priority: -Number.MAX_VALUE, 
      //Isolate scope removes side effects of linking other directives on this elm
      scope: {},
      compile: function(cElement, attr) {
        var templatePromise = $http.get(templateUrl, {cache:$templateCache})
          .then(function(response) { return response.data; });
        
        //We're going to wrap our directive, then re-compile.  
        //When we re-compile, we want to put on the *real*  directive
        attr.$set(actualDirectiveName, attr[directiveName]);
        attr.$set(directiveName, null);
        
        var clone = cElement.clone();
        
        return function postLink(scope, element, attr) {
          templatePromise.then(function(tpl) {
            var wrapper = angular.element(tpl);
            element.replaceWith(wrapper);
            
            //We want the actual directive to compile on the original element, then share
            //scope with its wrapper elements. 
            $compile(clone)(scope.$parent);
            $compile(wrapper)(clone.scope());
            wrapper.append(clone);
          });
        };
      }
    };
  }
}

jqmWrappedDirective('jqmInput', 'templates/jqmInput.html', [function() {
    return {
        scope: {
            clearBtn: '@',
            clearnBtnText: '@',
            disabled: '@ngDisabled',
            mini: '@'
        },
        template: '<input class="ui-input-text ui-body-{{$scopeAs.jqmTextinput.$theme}}" jqm-class="{\'mobile-textinput-disabled ui-disabled\': $scopeAs.jqmTextinput.disabled}">',
        replace: true,
        controller: angular.noop, //just to be required
        require: '?ngModel',
        link: function(scope, elm, attr, modelCtrl) {
            scope.$$scopeAs= 'jqmTextinput';

            scope.showClearBtn = function() {
                return modelCtrl ? modelCtrl.$viewValue : elm.val();
            };
            scope.clearBtnClicked = function() {
                elm.val('');
                if (modelCtrl) {
                    modelCtrl.$setViewValue('');
                }
            };
        }
    };
}]);
