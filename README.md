# ng-wedge

> Intercept $http request from the website without modifying code or installing plugins.

[![NPM][ng-wedge-icon] ][ng-wedge-url]

[![Build status][ng-wedge-ci-image] ][ng-wedge-ci-url]
[![dependencies][ng-wedge-dependencies-image] ][ng-wedge-dependencies-url]
[![devdependencies][ng-wedge-devdependencies-image] ][ng-wedge-devdependencies-url]

What happens if the server returns an error to your Angular app? Can you confirm the error
is handled on the client side? What if the data is delayed by 5 seconds? Are there race
conditions?

If you have a method on the scope that uses `$http` service to make Ajax calls, you can
intercept and return mock values without modifying the application or installing additional
plugins. Just drive this **ng-wedge** into your app from the browser console and set up
the fake `$http` for this particular scope's method. You can return different status, or
mock data or even slow down the responses by any amount.

## example

You can try this example yourself by opening `index.html` locally or by trying this example
at gh-pages branch [http://glebbahmutov.com/ng-wedge/](http://glebbahmutov.com/ng-wedge/). 
The main page has simple controller making request to non-existent endpoint */some/url*.

```js
// controller around button <button id="load" ng-click="load()">Load</button>
controller('AppController', function ($scope, $http) {
  $scope.load = function load() {
    $http.get('/some/url').then(function (data) {
      console.log('$http get /some/url returned', data);
      $scope.loadResult = data;
    }, function () {
      console.error('Could not get /some/url');
    });
  };
})
```

If we click the button, an error is displayed in the browser console.
Let us mock the response **without changing the application or even reloading it**.
You can either paste the *ng-wedge.js* into the browser console or run it as a 
Chrome DevTools [Code Snippet][snippet]. Execute the *ng-wedge* script, which makes
a new function on the window `wedge`. In this example, run the following

```js
// #load is the selector
// load is the method name on the scope
var mockHttp = wedge('#load', 'load');
// now we can mock url responses
mockHttp('get', '/some/url', 200, 'I got mock data back after 2 seconds', 2000);
```

Click the button now, and after two seconds, the scope successfully receives
mock data string.

## Related

* [Local Angular development][local ng]
* [Fake lexical scope][fake]
* [Test function purity][test purity]

### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/ng-wedge/issues) on Github

## MIT License

Copyright (c) 2014 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[ng-wedge-icon]: https://nodei.co/npm/ng-wedge.png?downloads=true
[ng-wedge-url]: https://npmjs.org/package/ng-wedge
[ng-wedge-ci-image]: https://travis-ci.org/bahmutov/ng-wedge.png?branch=master
[ng-wedge-ci-url]: https://travis-ci.org/bahmutov/ng-wedge
[ng-wedge-dependencies-image]: https://david-dm.org/bahmutov/ng-wedge.png
[ng-wedge-dependencies-url]: https://david-dm.org/bahmutov/ng-wedge
[ng-wedge-devdependencies-image]: https://david-dm.org/bahmutov/ng-wedge/dev-status.png
[ng-wedge-devdependencies-url]: https://david-dm.org/bahmutov/ng-wedge#info=devDependencies
[fake]: http://bahmutov.calepin.co/faking-lexical-scope.html
[test purity]: http://bahmutov.calepin.co/test-if-a-function-is-pure.html
[local ng]: http://bahmutov.calepin.co/local-angular-development.html
[snippet]: http://bahmutov.calepin.co/chrome-devtools-code-snippets.html
