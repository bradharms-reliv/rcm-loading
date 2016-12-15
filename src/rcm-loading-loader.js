/**
 * RcmLoadingLoader
 *
 * @param rcmLoading        {rcmLoading}
 * @param preShow           function
 * @param show              function
 * @param hide              function
 * @param setLoadingMessage function
 * @constructor
 */
var RcmLoadingLoader = function (
    rcmLoading,
    preShow,
    show,
    hide,
    setLoadingMessage
) {
    var self = this;

    var waitBeforeShow = rcmLoading.getConfigValue('waitBeforeShow');

    var waitBeforeHide = rcmLoading.getConfigValue('waitBeforeHide');

    var showCount = 0;

    var showTimeout = null;

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
            percentMsg = loadingParams.tracker.getPercent() + '%';
        }
        setLoadingMessage(
            rcmLoading.getConfigValue('loadingMessage'),
            percentMsg
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
     * init
     */
    self.init = function () {
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
    }
};
