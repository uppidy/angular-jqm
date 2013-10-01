
/**
 * @ngdoc directive
 * @name jqm.directive:jqmPopupTarget
 * @restrict A
 *
 * @description
 * Marks an element as a target for a {@link jqm.directive:jqmPopup jqmPopup}, and assigns a model to toggle to show or hide that popup on the element.
 *
 * See {@link jqm.directive:jqmPopup jqmPopup} for an example.
 *
 * @param {expression} jqmPopupTarget Model of a jqmPopup that this element will be linked to.
 * @param {expression=} jqm-popup-model Assignable angular boolean expression that will say whether the popup from jqmPopupTarget is opened on this element. Default '$popup'.
 * @param {string=} jqm-popup-placement The placement for the popup to pop over this element.  Overrides jqmPopup's placement attribute.  See {@link jqm.directive:jqmPopup jqmPopup} for the available values.
 *
 * @require jqmPopup
 */
jqmModule.directive('jqmPopupTarget', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, elm, attr) {
      var jqmPopup;
      var popupModel = $parse(attr.jqmPopupModel || '$popup');

      var placement;
      attr.$observe('jqmPopupPlacement', function(p) {
        placement = p;
      });

      scope.$watch(attr.jqmPopupTarget, setPopup);
      scope.$watch(popupModel, popupModelWatch);
      scope.$on('$popupStateChanged', popupStateChanged);

      function setPopup(newPopup) {
        jqmPopup = newPopup;
        popupModelWatch( popupModel(scope) );
      }
      function popupModelWatch(isOpen) {
        if (jqmPopup) {
          if (isOpen) {
            jqmPopup.show(elm, placement);
          } else if (jqmPopup.opened) {
            jqmPopup.hideForElement(elm);
          }
        }
      }
      function popupStateChanged($e, popup) {
        //We only care if we're getting change from our popupTarget
        if (popup === jqmPopup) {
          popupModel.assign(
            scope,
            popup.opened && popup.target && popup.target[0] === elm[0]
          );
        }
      }

    }
  };
}]);
