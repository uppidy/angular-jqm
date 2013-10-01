/**
 * @ngdoc object
 * @name jqm.jqmConfigProvider
 *
 * @description Used to configure the default theme.
 */

jqmModule.provider('jqmConfig', function() {
  /**
   * @ngdoc method
   * @name jqm.jqmConfigProvider#primaryTheme
   * @methodOf jqm.jqmConfigProvider
   *
   * @description Sets/gets the default primary theme (used if jqm-theme is
   * not set on the element). Default: 'c'
   *
   * @param {string=} newTheme The new primary theme to set.
   * @returns {string} The current primary theme.
   */
  /**
   * @ngdoc method
   * @name jqm.jqmConfigProvider#secondaryTheme
   * @methodOf jqm.jqmConfigProvider
   * 
   * @description Sets/gets the secondary theme (used on footers, headers, etc 
   * if not theme is set on the element). Default: 'a'
   *
   * @param {string=} newTheme The new secondary theme to set.
   * @returns {string} The current secondary theme.
   */

  var _primaryTheme = 'c';
  var _secondaryTheme = 'a';
  return {
    primaryTheme: primaryTheme,
    secondaryTheme: secondaryTheme,
    $get: serviceFactory
  };

  function primaryTheme(value) {
    if (value) { _primaryTheme = value; }
    return _primaryTheme;
  }
  function secondaryTheme(value) {
    if (value) { _secondaryTheme = value; }
    return _secondaryTheme;
  }

  /**
   * @ngdoc object
   * @name jqm.jqmConfig
   * @description
   * A service used to tell the default primary and secondary theme. 
   */
  /**
   * @ngdoc property
   * @name jqm.jqmConfig#primaryTheme
   * @propertyOf jqm.jqmConfig
   *
   * @description {string} The current primary theme.  See {@link jqm.jqmConfigProvider#primaryTheme}.
   */
  /**
   * @ngdoc property
   * @name jqm.jqmConfig#secondaryTheme
   * @propertyOf jqm.jqmConfig
   *
   * @description {string} The current secondary theme.  See {@link jqm.jqmConfigProvider#secondaryTheme}.
   */
  function serviceFactory() {
    return {
      primaryTheme: _primaryTheme,
      secondaryTheme: _secondaryTheme
    };
  }

});
