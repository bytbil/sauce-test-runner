var Q = require('q');

module.exports = function(config) {
    var logger = config.logger || {
        log: function(msg) { console.log('default', msg) },
        debug: (msg) => function(msg) {'default', console.log(msg) }
    }

    var framework = (config) ? config.framework : undefined;
    var sauce = require('./tasks/saucelabs')(logger, config)

    var callbackDone = function(deferred) {
        return function(passed) {
            if (config && typeof config.onTestSuiteComplete === 'function'){
                config.onTestSuiteComplete(passed)
            }
            deferred.resolve();
        }
    }

    var callbackExcept = function(deferred) {
        return function() {
            if (config && typeof config.onException === 'function'){
                config.onException()
            }
            deferred.resolve();
        }
    }

    if(!framework) {
        throw new Error('Framework not specified.')
    }

    var deferred = Q.defer();
    sauce(framework, callbackDone(deferred), callbackExcept(deferred))

    return deferred.promise;

}
