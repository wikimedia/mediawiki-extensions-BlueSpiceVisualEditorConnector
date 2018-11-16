/*
* This is an example configuration for a BlueSpiceWikiFarm setup
* In this case 'httpd' is used as wiki webserver machine name as it is in our
* docker environment.
*/
'use strict';

exports.setup = function(parsoidConfig) {
 parsoidConfig.dynamicConfig = function(domain) {
    parsoidConfig.setMwApi({
      uri: 'http://httpd/' + domain + '/api.php',
      domain: domain
    });
  }
};
