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
