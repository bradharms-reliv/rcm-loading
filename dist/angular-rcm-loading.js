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
    'rcmLoadingLoader',
    function () {

        return rcmLoadingLoader;
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
        function (
            $window,
            rcmLoading
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

                    var showCount = 0;

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

                    var showTimeout = null;

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

                    var hideTimeout = null;

                    /**
                     * onLoadingStart
                     * @param loadingParams
                     */
                    var onLoadingStart = function (loadingParams) {

                        showCount++;

                        preShow();

                        if (hideTimeout) {
                            window.clearTimeout(hideTimeout);
                            hideTimeout = null;
                        }

                        if (showTimeout) {
                            return;
                        }

                        showTimeout = $window.setTimeout(
                            show,
                            waitBeforeShow
                        );
                    };

                    /**
                     * onLoadingChange
                     * @param loadingParams
                     */
                    var onLoadingChange = function (loadingParams) {

                        scope.loadingPercent = '';

                        var percent = loadingParams.tracker.getPercent();

                        if (percent > 0 && rcmLoading.getConfigValue('showPercent')) {
                            scope.loadingPercent = ' ' + loadingParams.tracker.getPercent() + '%';
                        }

                        scope.loadingMessage = rcmLoading.getConfigValue(
                            'loadingMessage'
                        );

                        scope.safeApply();
                    };

                    /**
                     * onLoadingComplete
                     * @param loadingParams
                     */
                    var onLoadingComplete = function (loadingParams) {

                        showCount--;

                        if(showCount > 0) {
                            // do nothing if we are out of sync
                            return;
                        }

                        showCount = 0;

                        if (showTimeout) {
                            $window.clearTimeout(showTimeout);
                            showTimeout = null;
                        }

                        if (hideTimeout) {
                            $window.clearTimeout(hideTimeout);
                            hideTimeout = null;
                        }

                        hideTimeout = $window.setTimeout(
                            hide,
                            waitBeforeHide
                        );
                    };


                    rcmLoading.onLoadingStart(
                        onLoadingStart,
                        'rcmGlobalLoader'
                    );

                    rcmLoading.onLoadingChange(
                        onLoadingChange,
                        'rcmGlobalLoader'
                    );

                    rcmLoading.onLoadingComplete(
                        onLoadingComplete,
                        'rcmGlobalLoader'
                    );
                };
            };

            return {
                compile: compile,
                scope: [],
                //template: '<%= inlineTemplate("template/default/loading.html") %>'
                templateUrl: url.template
            }
        }
    ]
);
