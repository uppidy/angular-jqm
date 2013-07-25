jqmModule.factory('$animationComplete', ['$sniffer', function ($sniffer) {
    return function (el, callback, once) {
        var eventNames = 'animationend';
        if (!$sniffer.animations) {
            throw new Error("Browser does not support css animations.");
        }
        if ($sniffer.vendorPrefix) {
            eventNames += " " + $sniffer.vendorPrefix.toLowerCase() + "AnimationEnd";
        }
        //We have to split because unbind doesn't support multiple event names in one string
        //This will be fixed in 1.2, PR opened https://github.com/angular/angular.js/pull/3256
        angular.forEach(eventNames.split(' '), function(eventName) {
            function onceDone() {
                callback();
                el.unbind(eventName, onceDone);
            }
            el.bind(eventName, once ? onceDone : callback);
        });
    };
}]);
