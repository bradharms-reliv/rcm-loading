/**
 * RcmLoadingJqueryGlobalLoader
 * @constructor
 */
var RcmLoadingJqueryGlobalLoader = function (
    window,
    jQuery,
    rcmLoading,
    RcmLoadingLoader
) {

    var self = this;

    var globalLoaderName = 'rcm-global-loader';

    var loaderElm;

    var contentElm;

    var rcmLoadingLoader;

    /**
     * url
     * @type {{template: *, css: *}}
     */
    var url = {
        template: rcmLoading.getTemplateUrl('loading.html'),
        css: rcmLoading.getTemplateUrl('loading.css')
    };

    /**
     * getLoaderElm
     * @returns {*}
     */
    var getLoaderElm = function () {

        if (loaderElm && loaderElm.length > 0) {
            return loaderElm;
        }

        loaderElm = jQuery(document).find(globalLoaderName);

        if (loaderElm.length > 0) {
            return loaderElm;
        }

        loaderElm = jQuery(document).find('[' + globalLoaderName + ']');

        return loaderElm;
    };

    /**
     * getContentElm
     * @returns {*}
     */
    var getContentElm = function () {

        if (contentElm && contentElm.length > 0) {
            return contentElm;
        }

        if (!hasLoaderElement()) {
            return null;
        }

        return loaderElm.find('.loading-content');
    };

    /**
     * hasLoaderElement
     * @returns {boolean}
     */
    var hasLoaderElement = function () {

        var loaderElm = getLoaderElm();

        return (loaderElm && loaderElm.length > 0);
    };

    /**
     * preShow
     */
    var preShow = function () {

        loaderElm.addClass('is-loading');
        loaderElm.show();
    };

    /**
     * start
     */
    var show = function () {

        loaderElm.find('.loading-message').html(
            rcmLoading.getConfigValue('loadingMessage')
        );
        loaderElm.addClass('is-loading');
        loaderElm.addClass('show-content');
        contentElm.show();
    };
    /**
     * end
     */
    var hide = function () {

        loaderElm.find('.loading-message').html(
            rcmLoading.getConfigValue('loadingCompleteMessage')
        );
        loaderElm.removeClass('is-loading');
        loaderElm.removeClass('show-content');
        loaderElm.hide();
        contentElm.hide();
    };

    /**
     * setLoadingMessage
     * @param message
     * @param percent
     */
    var setLoadingMessage = function (message, percent) {

        loaderElm.find('.loading-message').html(
            message + ' ' + percent
        );
    };

    /**
     * buildTemplate
     */
    var buildTemplate = function () {

        // remove angular interference
        loaderElm.removeAttr('ng-show');
        loaderElm.removeAttr('ng-class');

        loaderElm.find('.loading-message').html('');
        var cssElm = loaderElm.find("[type='text/css']");
        cssElm.attr('href', url.css);
        // remove angular interference
        cssElm.removeAttr('ng-href');

        loaderElm.hide();

        jQuery(document.body).append(loaderElm);

        rcmLoadingLoader.init();
    };

    /**
     * getTemplate
     */
    var getTemplate = function () {

        jQuery.get(
            url.template,
            function (data) {

                loaderElm = jQuery(data);
                contentElm = getContentElm();

                loaderElm.hide();
                contentElm.hide();

                buildTemplate();
            }
        );
    };

    /**
     * init
     */
    self.init = function () {

        if (hasLoaderElement()) {
            console.warn('RcmLoading jQuery-loader detected a loader element (' + globalLoaderName + '). Did NOT build jQuery loader.');
            return;
        }
        rcmLoadingLoader = new RcmLoadingLoader(
            rcmLoading,
            preShow,
            show,
            hide,
            setLoadingMessage
        );

        getTemplate();
    };
};

/**
 * jQuery based loader elem
 * - Adds eleme if no existing elm found
 * - Utilizes and prepares the AngularJS template
 */
jQuery(document).ready(
    function (jQuery) {
        var loader = new RcmLoadingJqueryGlobalLoader(
            window,
            jQuery,
            rcmLoading,
            RcmLoadingLoader
        );
        loader.init();
    }
);
