/**
 * RcmLoading.Service Exposes and wires up loading and events
 * @require:
 *  RcmEventManager
 * @param rcmLoading
 * @constructor
 */
rcmLoading.Service = function () {

    var self = this;

    self.tracker = null; //;

    self.events = new RcmEventManager();

    var onLoadingStart = function (loadingParams) {
        self.events.trigger(rcmLoading.eventName.start, loadingParams);
    };
    var onLoadingChange = function (loadingParams) {
        self.events.trigger(rcmLoading.eventName.change, loadingParams);
    };
    var onLoadingComplete = function (loadingParams) {
        self.events.trigger(rcmLoading.eventName.complete, loadingParams);
    };

    /**
     * init
     */
    self.init = function () {
        self.tracker = new rcmLoading.Tracker(
            onLoadingStart,
            onLoadingChange,
            onLoadingComplete
        )
    };

    /**
     * loading - Set or change loading status
     * @param name unique namespace for this loading event
     * @param amount Loading amount between 0 and 1
     * @param {object} options optional
     */
    self.setLoading = function (name, amount, options) {
        self.tracker.setLoading(name, amount, options);
    };

    /**
     * getTracker
     * @returns {null|*}
     */
    self.getTracker = function () {

        return self.tracker;
    };

    self.init();
};
