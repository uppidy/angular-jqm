jqmModule.provider('jqmConfig', function() {
    var _defaultTheme = 'c';
    return {
        defaultTheme: defaultTheme,
        $get: serviceFactory
    };

    function defaultTheme(value) {
        if (value) {
            _defaultTheme = value;
        }
        return _defaultTheme;
    }

    function serviceFactory() {
        return {
            defaultTheme: _defaultTheme
        };
    }

});
