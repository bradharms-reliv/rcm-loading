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
     * hasLoaderElement
     * @returns {boolean}
     */
    var hasLoaderElement = function () {

        var loaderElm = getLoaderElm();

        return (loaderElm && loaderElm.length > 0);
    };

    /**
     * start
     */
    var show = function () {
        loaderElm.find('.loading-message').html(
            rcmLoading.getConfigValue('loadingMessage')
        );
        loaderElm.show();
    };

    var showTimeout = null;

    /**
     * end
     */
    var hide = function () {
        loaderElm.find('.loading-message').html(
            rcmLoading.getConfigValue('loadingCompleteMessage')
        );
        loaderElm.hide();
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
        //loaderElm.show();
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

                loaderElm.hide();

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
