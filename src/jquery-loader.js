/**
 * jQuery based loader elem
 * - Adds eleme if no existing elm found
 * - Utilizes and prepares the AngularJS template
 */
jQuery(document).ready(
    function () {

        var globalLoaderName = 'rcm-global-loader';
        /**
         * url
         * @type {{template: *, css: *}}
         */
        var url = {
            template: rcmLoading.getTemplateUrl('loading.html'),
            css: rcmLoading.getTemplateUrl('loading.css')
        };

        /**
         * hasLoaderElement
         * @returns {boolean}
         */
        var hasLoaderElement = function () {
            var loaderElm = jQuery(document).find(globalLoaderName);

            if (loaderElm.length > 0) {
                return true;
            }

            loaderElm = jQuery(document).find('[' + globalLoaderName + ']');

            return (loaderElm.length > 0);
        };

        /**
         * buildTemplate
         * @param loaderElm
         */
        var buildTemplate = function (loaderElm) {

            // remove angular interference
            loaderElm.removeAttr('ng-show');

            loaderElm.find('.loading-message').html('');
            var cssElm = loaderElm.find("[type='text/css']");
            cssElm.attr('href', url.css);
            // remove angular interference
            cssElm.removeAttr('ng-href');

            loaderElm.hide();

            jQuery(document.body).append(loaderElm);

            rcmLoading.onLoadingStart(
                function (loadingParams) {
                    loaderElm.find('.loading-message').html(
                        rcmLoading.getConfigValue('loadingMessage')
                    );
                    loaderElm.show();
                },
                'rcmGlobalLoader'
            );

            rcmLoading.onLoadingChange(
                function (loadingParams) {
                    var percentMsg = '';
                    var percent = loadingParams.tracker.getPercent();
                    if (percent > 0 && rcmLoading.getConfigValue('showPercent')) {
                        percentMsg = ' ' + loadingParams.tracker.getPercent() + '%';
                    }
                    loaderElm.find('.loading-message').html(
                        //'-' +
                        rcmLoading.getConfigValue('loadingMessage')
                        + percentMsg
                        //+ '-'
                    );
                    loaderElm.show();
                },
                'rcmGlobalLoader'
            );

            rcmLoading.onLoadingComplete(
                function (loadingParams) {
                    loaderElm.find('.loading-message').html(
                        rcmLoading.getConfigValue('loadingCompleteMessage')
                    );
                    loaderElm.hide();
                },
                'rcmGlobalLoader'
            );
        };

        /**
         * getTemplate
         */
        var getTemplate = function () {

            jQuery.get(
                url.template,
                function (data) {

                    var loaderElm = jQuery(data);

                    loaderElm.hide();

                    buildTemplate(loaderElm);
                }
            );
        };

        /**
         * init
         */
        var init = function () {

            if (hasLoaderElement()) {
                console.warn('RcmLoading jQuery-loader detected a loader element (' + globalLoaderName + '). Did NOT build jQuery loader.');
                return;
            }
            getTemplate();
        };

        init();
    }
);
