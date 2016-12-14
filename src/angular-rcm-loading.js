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
 * rcmGlobalLoader
 */
angular.module('RcmLoading').directive(
    'rcmGlobalLoader',
    [
        'rcmLoading',
        function (rcmLoading) {

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

                    /**
                     * show
                     * @param loadingParams
                     */
                    var show = function (loadingParams) {
                        scope.loadingPercent = '';
                        scope.loadingMessage = rcmLoading.getConfigValue(
                            'loadingMessage'
                        );
                        scope.isLoading = true;

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

                        scope.safeApply();
                    };

                    var hideTimeout = null;

                    /**
                     * onLoadingStart
                     * @param loadingParams
                     */
                    var onLoadingStart = function (loadingParams) {

                        if (showTimeout) {
                            return;
                        }

                        showTimeout = window.setTimeout(
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
                        if (showTimeout) {
                            window.clearTimeout(showTimeout);
                            showTimeout = null;
                        }

                        if (hideTimeout) {
                            window.clearTimeout(hideTimeout);
                            hideTimeout = null;
                        }

                        hideTimeout = window.setTimeout(
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
                templateUrl: url.template
            }
        }
    ]
);
