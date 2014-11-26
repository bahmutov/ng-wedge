(function ngWedge(root, angular, document) {
  if (typeof angular === 'undefined') {
    throw new Error('missing angular');
  }
  if (typeof document === 'undefined') {
    throw new Error('missing document');
  }

  root.wedge = function wedge(selector, scopeMethodName) {
    var el = angular.element(document.querySelector(selector));
    var scope = el.scope() || el.isolateScope();
    var originalMethod = scope[scopeMethodName];
    if (!angular.isFunction(originalMethod)) {
      throw new Error('Cannot find ' + scopeMethodName + ' on scope for ' + selector);
    }
    if (originalMethod.__wedged) {
      return;
    }

    var injector = el.injector();

    // fake lexical scope from original method, see
    // http://bahmutov.calepin.co/faking-lexical-scope.html
    var $scope = scope;
    var $timeout = injector.get('$timeout');
    var _$http = injector.get('$http');
    var $q = injector.get('$q');

    var mockMethods = {
      get: {},
      post: {}
    };

    var $http = {
      get: function (url) {
        if (mockMethods.get[url]) {
          var mock = mockMethods.get[url];
          return {
            success: function (cb) {
              var wrappedCb = angular.bind(null, cb, mock.status, mock.data);
              return $timeout(wrappedCb, mock.timeout || 0);
            }
          };
        }
        return _$http.get.apply(_$http, arguments);
      },
      post: function (url) {
        if (mockMethods.post[url]) {
          var mock = mockMethods.post[url];
          return {
            then: function (cb) {
              var wrappedCb = angular.bind(null, cb, mock.data);
              return $timeout(wrappedCb, mock.timeout || 0);
            }
          };
        }
        return _$http.post.apply(_$http, arguments);
      }
    };
    /* jshint -W061 */
    var originalMethodString = eval('(' + originalMethod.toString() + ')');

    scope[scopeMethodName] = function replacedLoad() {
      console.log('replaced load started, eval original load');
      // TODO retry the function if there is reference error and load variable from injector
      // TODO or we could try parsing the scope / invoke queue to see which variables are injected
      // see http://bahmutov.calepin.co/building-runtime-tree-of-angular-modules.html
      originalMethodString();
    };
    scope[scopeMethodName].__wedged = true;

    function clearWedges() {
      mockMethods = {
        get: {},
        post: {}
      };
      console.log('cleared wedges');
    }

    return function wedger(method, url, status, data, timeoutMs) {
      if (!arguments.length) {
        return clearWedges();
      }
      console.log('wedging', method, url, 'to return', status, data);
      console.assert(method === 'get' || method === 'post', 'invalid method ' + method);
      // allow regular expression for url
      mockMethods[method][url] = {
        status: status,
        data: data,
        timeout: timeoutMs
      };
    };
  };
}(this, this.angular, this.document));
