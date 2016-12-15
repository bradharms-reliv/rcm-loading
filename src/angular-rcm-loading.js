/**
 * Angular JS module for creating UI for rcm-loading
 * @require:
 *  AngularJS
 */
angular.module('RcmLoading', []);

/**
 * rcmLoading
 */
angular.module('RcmLoading').factory(
    'rcmLoading',
    function () {

        return rcmLoading;
    }
);

/**
 * rcmLoadingLoader
 */
angular.module('RcmLoading').factory(
    'RcmLoadingLoader',
    function () {

        return RcmLoadingLoader;
    }
);

/**
 * rcmGlobalLoader
 */
angular.module('RcmLoading').directive(
    'rcmGlobalLoader',
    [
        '$window',
        'rcmLoading',
        'RcmLoadingLoader',
        function (
            $window,
            rcmLoading,
            RcmLoadingLoader
        ) {

            var url = {
                template: rcmLoading.getTemplateUrl('loading.html'),
                css: rcmLoading.getTemplateUrl('loading.css')
            };

            var waitBeforeShow = rcmLoading.getConfigValue('waitBeforeShow');

            var waitBeforeHide = rcmLoading.getConfigValue('waitBeforeHide');

            var compile = function (tElm, tAttr) {

                return function (scope, element, attrs) {

                    /**
                     * safeApply
                     * @param fn
                     */
                    scope.safeApply = function (fn) {
                        var phase = this.$root.$$phase;
                        if (phase == '$apply' || phase == '$digest')
                            this.$eval(fn);
                        else
                            this.$apply(fn);
                    };

                    scope.cssUrl = url.css;

                    scope.isLoading = false;

                    scope.showContent = false;

                    /**
                     * preShow
                     */
                    var preShow = function () {

                        scope.isLoading = true;
                        scope.safeApply();
                    };

                    /**
                     * show
                     * @param loadingParams
                     */
                    var show = function (loadingParams) {

                        scope.loadingPercent = '';
                        scope.loadingMessage = rcmLoading.getConfigValue(
                            'loadingMessage'
                        );

                        scope.showContent = true;
                        scope.safeApply();
                    };

                    /**
                     * hide
                     * @param loadingParams
                     */
                    var hide = function (loadingParams) {

                        scope.loadingPercent = '';
                        scope.loadingMessage = rcmLoading.getConfigValue(
                            'loadingCompleteMessage'
                        );
                        scope.isLoading = false;
                        scope.showContent = false;

                        scope.safeApply();
                    };

                    /**
                     * setLoadingMessage
                     * @param message
                     * @param percent
                     */
                    var setLoadingMessage = function (message, percent) {

                        scope.loadingMessage = message;
                        scope.loadingPercent = percent;

                        scope.safeApply();
                    };

                    /**
                     * RcmLoadingLoader
                     * @type {RcmLoadingLoader}
                     */
                    var rcmLoadingLoader = new RcmLoadingLoader(
                        rcmLoading,
                        preShow,
                        show,
                        hide,
                        setLoadingMessage
                    );

                    rcmLoadingLoader.init();
                };
            };

            return {
                compile: compile,
                scope: [],
                templateUrl: url.template
            }
        }
    ]
);
