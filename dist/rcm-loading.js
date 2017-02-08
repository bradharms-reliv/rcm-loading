/**
 * rcmLoading Module
 * @type {{defaultConfig: {}, serviceInstance: {}, getServiceInstance: Function}}
 */
var rcmLoading = {
    /**
     * defaultConfig
     */
    defaultConfig: {
        baseUrl: '/vendor/rcm-loading/dist',
        templateFolder: '/template',
        template: 'default',
        loadingMessage: '',
        loadingCompleteMessage: '',
        // For global loaders
        waitBeforeShow: 1000, // ms
        waitBeforeHide: 500  // ms
    },

    /**
     * config
     */
    config: {},

    /**
     * Event names
     */
    eventName: {
        start: 'rcmLoading.start',
        change: 'rcmLoading.change',
        complete: 'rcmLoading.complete'
    },

    /**
     *
     */
    serviceInstance: null,

    /**
     * getConfigValue
     * @param key
     * @param defaultValue
     * @returns {*}
     */
    getConfigValue: function (key, defaultValue) {

        if (typeof rcmLoading.config[key] !== 'undefined') {
            return rcmLoading.config[key]
        }

        if (typeof defaultValue !== 'undefined') {
            return defaultValue;
        }

        if (typeof rcmLoading.defaultConfig[key] !== 'undefined') {
            return rcmLoading.defaultConfig[key];
        }

        return null;
    },

    /**
     * getTemplateUrl
     * returns {string}
     */
    getTemplateUrl: function (file) {

        if (!file) {
            file = '';
        }

        var baseUrl = rcmLoading.getConfigValue('baseUrl');
        var template = rcmLoading.getConfigValue('template');
        var templateFolder = rcmLoading.getConfigValue('templateFolder');

        return baseUrl + templateFolder + '/' + template + '/' + file;
    },


    /**
     * getServiceInstance
     * @param config
     * @returns {{}|rcmLoading.serviceInstance|*}
     */
    getServiceInstance: function (config) {

        if (rcmLoading.serviceInstance) {
            return rcmLoading.serviceInstance;
        }

        rcmLoading.buildServiceInstance(config);

        return rcmLoading.serviceInstance;
    },

    /**
     * buildServiceInstance
     * @param config
     */
    buildServiceInstance: function (config) {

        if (!config) {
            config = rcmLoading.defaultConfig;
        }

        rcmLoading.serviceInstance = new rcmLoading.Service(config);
    },

    /**
     * isLoading
     * @param name Optional
     * @returns {*}
     */
    isLoading: function (name) {

        var service = rcmLoading.getServiceInstance();

        return service.tracker.isLoading(name);
    },

    /**
     * setLoading
     * @param name
     * @param amount
     * @param options
     */
    setLoading: function (name, amount, options) {

        var service = rcmLoading.getServiceInstance();

        service.setLoading(name, amount, options);
    },

    /**
     * onLoadingStart
     * Register listener, must provide unique id
     * @param method
     * @param id
     */
    onLoadingStart: function (method, id) {

        var service = rcmLoading.getServiceInstance();

        service.events.on(rcmLoading.eventName.start, method, id, true);
    },

    /**
     * onLoadingChange
     * Register listener, must provide unique id
     * @param method
     * @param id
     */
    onLoadingChange: function (method, id) {

        var service = rcmLoading.getServiceInstance();

        service.events.on(rcmLoading.eventName.change, method, id, true);
    },

    /**
     * onLoadingComplete
     * Register listener, must provide unique id
     * @param method
     * @param id
     */
    onLoadingComplete: function (method, id) {

        var service = rcmLoading.getServiceInstance();

        service.events.on(rcmLoading.eventName.complete, method, id, true);
    }
};

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

/**
 * rcmLoading.Params Standard class for loading params
 * @param options
 * @constructor
 */
rcmLoading.Params = function (options) {

    var self = this;
    self.name = null;
    self.amount = 0;
    self.startMessage = '';
    self.options = null;

    /**
     * onChange
     * @param params
     */
    self.onChange = function (params) {
    };

    /**
     * onComplete
     * @param params
     */
    self.onComplete = function (params) {
    };

    /**
     * init
     * @param options
     */
    self.init = function (options) {
        self.setOptions(options);
    };

    /**
     * setOptions
     * @param options
     */
    self.setOptions = function (options) {

        if (typeof options.name === 'string') {
            self.name = options.name;
        }
        if (typeof options.amount === 'number') {
            self.amount = options.amount;
        }
        if (typeof options.onChange === 'function') {
            self.onChange = options.onChange;
        }
        if (typeof options.onComplete === 'function') {
            self.onComplete = options.onComplete;
        }
        if (typeof options.startMessage === 'string') {
            self.startMessage = options.startMessage;
        }

        self.options = options;
    };

    /**
     * getPercent
     * @returns {number}
     */
    self.getPercent = function () {
        // null indicates complete
        if(self.amount === null){
            return 100;
        }
        return Math.round((self.amount * 100))
    };

    /**
     * isLoading
     * @returns {boolean}
     */
    self.isLoading = function () {
        return (self.amount < 1);
    };

    /**
     * init call
     */
    self.init(options);
};

/**
 * rcmLoading.Tracker - Aggregates loading events and tracks loading progress
 * @param onLoadingStart
 * @param onLoadingChange
 * @param onLoadingComplete
 * @constructor
 */
rcmLoading.Tracker = function (
    onLoadingStart,
    onLoadingChange,
    onLoadingComplete
) {

    var self = this;

    self.loadingAggregate = {};

    self.loadingAmount = 1;

    /**
     * Status message only set on start of loading
     * @type {string}
     */
    self.statusMessage = '';

    /**
     * getPercent
     * @returns {number}
     */
    self.getPercent = function () {

        return Math.round((self.loadingAmount * 100))
    };

    /**
     * Get a status message
     * @returns {string}
     */
    self.getStatusMessage = function () {

        return self.statusMessage;
    };

    /**
     * isLoading
     * @returns {boolean}
     */
    self.isLoading = function (name) {

        if (name) {
            return (self.getLoading(name) < 1 && self.has(name))
        }

        return (self.loadingAmount < 1);
    };

    /**
     * loading - Set or change loading status
     * @param name unique namespace for this loading event
     * @param amount Loading amount between 0 and 1
     * @param {object} options optional
     */
    self.setLoading = function (name, amount, options) {

        amount = Number(amount);

        var hasLoading = self.has(name);
        var currentAmount = null;

        if (hasLoading) {
            currentAmount = self.loadingAggregate[name].amount;
        }

        if (currentAmount === amount) {
            // no change so do nothing
            return;
        }

        if (!hasLoading && amount >= 1) {
            // loading is complete so do nothing
            return;
        }

        if (!hasLoading) {
            self.add(name, amount, options);
        }

        self.loadingAggregate[name].amount = amount;


        if (self.loadingAggregate[name].startMessage && amount === 0) {
            self.statusMessage = self.loadingAggregate[name].startMessage;
        }

        self.calc();
    };

    /**
     * getLoading
     * @param name
     * @returns {*}
     */
    self.getLoading = function (name) {

        if (!self.has(name)) {
            return null;
        }

        return self.loadingAggregate[name].amount;
    };

    /**
     * has
     * @param name
     * @returns {bool}
     */
    self.has = function (name) {

        return (typeof self.loadingAggregate[name] === 'object');
    };

    /**
     * add
     * @param name
     * @param amount
     * @param options
     */
    self.add = function (name, amount, options) {

        if (!options) {
            options = {};
        }

        options.name = name;
        options.amount = amount;

        var params = new rcmLoading.Params(options);

        self.loadingAggregate[name] = params;
    };

    /**
     * remove
     * @param name
     */
    self.remove = function (name) {

        self.loadingAggregate[name] = undefined;

        try {
            delete self.loadingAggregate[name];
        } catch (exception) {
            //
        }
    };

    /**
     * calc
     */
    self.calc = function () {

        if (self.loadingAmount >= 1) {
            self.onLoadingStart();
        }

        var currentLoadingAmount = self.loadingAmount;
        var currentLoading = {};
        var completeLoading = {};
        var total = 0;
        var count = 0;

        for (var index in self.loadingAggregate) {

            if (!self.has(index)) {
                continue;
            }

            if (self.loadingAggregate[index].amount === null) {
                continue;
            }

            count++;

            total = total + self.loadingAggregate[index].amount;

            currentLoading[index] = self.loadingAggregate[index];

            self.loadingAggregate[index].onChange(
                self.loadingAggregate[index]
            );

            if (self.loadingAggregate[index].amount >= 1) {

                completeLoading[index] = self.loadingAggregate[index];

                self.loadingAggregate[index].onComplete(
                    self.loadingAggregate[index]
                );

                self.loadingAggregate[index].amount = null;
            }
        }

        if (count > 0) {
            self.loadingAmount = total / count;
        } else {
            self.loadingAmount = 1;
        }

        if (currentLoadingAmount !== self.loadingAmount) {
            self.onLoadingChange(currentLoading, completeLoading);
        }

        if (self.loadingAmount >= 1) {
            self.onLoadingComplete(completeLoading);
        }
    };

    /**
     * onLoadingStart
     */
    self.onLoadingStart = function () {

        if (typeof onLoadingStart === 'function') {

            onLoadingStart({tracker: self});
        }
    };

    /**
     * onLoadingChange
     * @param currentLoading
     * @param completeLoading
     */
    self.onLoadingChange = function (currentLoading, completeLoading) {

        if (typeof onLoadingChange === 'function') {
            onLoadingChange(
                {
                    tracker: self,
                    currentLoading: currentLoading,
                    completeLoading: completeLoading
                }
            );
        }
    };

    /**
     * onLoadingComplete
     */
    self.onLoadingComplete = function (completeLoading) {

        if (typeof onLoadingComplete === 'function') {
            onLoadingComplete(
                {
                    tracker: self,
                    completeLoading: completeLoading
                }
            );
        }

        self.statusMessage = '';
        self.loadingAggregate = {};
    };
};

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