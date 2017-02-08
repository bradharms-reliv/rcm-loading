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
