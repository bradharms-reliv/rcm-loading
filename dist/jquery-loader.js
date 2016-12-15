/**
 * RcmLoadingJqueryGlobalLoader
 * @constructor
 */
var RcmLoadingJqueryGlobalLoader = function (
    window,
    jQuery,
    rcmLoading
) {

    var self = this;

    var globalLoaderName = 'rcm-global-loader';

    var loaderElm;

    var contentElm;

    var waitBeforeShow = rcmLoading.getConfigValue('waitBeforeShow');

    var waitBeforeHide = rcmLoading.getConfigValue('waitBeforeHide');

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

        loaderElm.show();
    };

    /**
     * start
     */
    var show = function () {

        loaderElm.find('.loading-message').html(
            rcmLoading.getConfigValue('loadingMessage')
        );
        contentElm.show();
    };
    /**
     * end
     */
    var hide = function () {

        loaderElm.find('.loading-message').html(
            rcmLoading.getConfigValue('loadingCompleteMessage')
        );
        loaderElm.hide();
        contentElm.hide();
    };

    /**
     *
     * @param message
     */
    var setLoadingMessage = function (message) {
        loaderElm.find('.loading-message').html(
            message
        );
    };

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

        var percentMsg = '';
        var percent = loadingParams.tracker.getPercent();
        if (percent > 0 && rcmLoading.getConfigValue('showPercent')) {
            percentMsg = ' ' + loadingParams.tracker.getPercent() + '%';
        }
        setLoadingMessage(
            rcmLoading.getConfigValue('loadingMessage')
            + percentMsg
        );
    };

    /**
     * onLoadingComplete
     * @param loadingParams
     */
    var onLoadingComplete = function (loadingParams) {

        showCount--;

        if (showCount > 0) {
            // do nothing if we are out of sync
            return;
        }

        showCount = 0;

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

    /**
     * buildTemplate
     */
    var buildTemplate = function () {

        // remove angular interference
        loaderElm.removeAttr('ng-show');

        loaderElm.find('.loading-message').html('');
        var cssElm = loaderElm.find("[type='text/css']");
        cssElm.attr('href', url.css);
        // remove angular interference
        cssElm.removeAttr('ng-href');

        loaderElm.hide();

        jQuery(document.body).append(loaderElm);

        buildEvents();
    };

    /**
     * buildEvents
     */
    var buildEvents = function () {

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
            rcmLoading
        );
        loader.init();
    }
);
