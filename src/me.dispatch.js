/**
 * DispatchMe from the MeLibs (https://github.com/QuatreCentQuatre/dispatchMe/)
 * Library that let you easily to subscribe, unsubscribe, emit events
 *
 * Licence :
 *  - GLP v2
 *
 * Version :
 *  - 1.0.3
 *
 * Dependencies :
 *  - jQuery (https://jquery.com/)
 *
 * Public Methods :
 *  - setOptions
 *  - getOptions
 *  - subscribe
 *  - unsubscribe
 *  - emit
 *  - isSubscribed
 *
 * Private Methods :
 *  -
 *
 * Updates Needed :
 *  -
 *
 */

(function($, window, document, undefined) {
    "use strict";

    /* Private Variables */
    var instanceID      = 1;
    var instanceName    = "DispatchMe";
    var defaults        = {
        debug: false
    };
    var overwriteKeys   = [
        'debug'
    ];

    /* Private Methods */
    var privatesMethods = {};

    /* Builder Method */
    var DispatchMe = function() {
        this.__construct();
    };
    var proto = DispatchMe.prototype;

    /* Private Variables */
    proto.__id          = null;
    proto.__name        = null;
    proto.__debugName   = null;

    /* Publics Variables */
    proto.debug         = null;
    proto.options       = null;
    proto.listeners     = null;

    /**
     *
     * __construct
     * the first method that will be executed.
     *
     * @param   options  all the options that you need
     * @return  object    null || scope
     * @access  private
     *
     */
    proto.__construct = function(options) {
        this.__id        = instanceID;
        this.__name      = instanceName;
        this.__debugName = this.__name + ":: ";

        this.setOptions(options);

        if (!this.__validateDependencies()) {return null;}
        if (!this.__validateArguments()) {return null;}

        instanceID ++;
        this.__initialize();

        return this;
    };

    /**
     *
     * __initialize
     * set the basics
     *
     * @return  object scope
     * @access  private
     *
     */
    proto.__initialize = function() {
        this.listeners = {};
        return this;
    };

    /**
     *
     * __validateDependencies
     * Will check if you got all the dependencies needed to use that plugins
     *
     * @return  boolean
     * @access  private
     *
     */
    proto.__validateDependencies = function() {
        var isValid = true;

        if (!window.jQuery) {
            isValid = false;
            if (this.debug) {console.warn(this.__debugName + "required jQuery (https://jquery.com/)");}
        }

        return isValid;
    };

    /**
     *
     * __validateArguments
     * Will check if you got all the required options needed to use that plugins
     *
     * @return  boolean
     * @access  private
     *
     */
    proto.__validateArguments = function() {
        var isValid = true;

        return isValid;
    };

    /**
     *
     * setOptions
     * will merge options to the plugin defaultKeys and the rest will be set as additionnal options
     *
     * @param   options
     * @return  object scope
     * @access  public
     *
     */
    proto.setOptions = function(options) {
        var scope    = this;
        var settings = (this.options) ? $.extend({}, this.options, options) : $.extend({}, defaults, options);

        $.each(settings, function(index, value) {
            if ($.inArray(index, overwriteKeys) != -1) {
                scope[index] = value;
                delete settings[index];
            }
        });

        this.options = settings;

        return this;
    };

    /**
     *
     * getOptions
     * return the additional options that left
     *
     * @return  object options
     * @access  public
     *
     */
    proto.getOptions = function() {
        return this.options;
    };

    /**
     *
     * subscribe
     * will now listen to the type youll pass till you unsubscribe it
     *
     * @return  object scope
     * @access  public
     *
     */
    proto.subscribe = function(type, callback, scope) {
        var args      = arguments;
        var finalArgs = [];

        if (args) {
            var totalArgs = args.length;

            for (var i = 0; i < totalArgs; i++) {
                if (i < 3) { continue; }
                finalArgs.push(args[i]);
            }
        }

        args = finalArgs;

        if (typeof this.listeners[type] == "undefined") {
            this.listeners[type] = [];
        }

        var newListener    = true;
        var totalListeners = this.listeners[type].length;

        for (var i = 0; i < totalListeners; i++) {
            var listener = this.listeners[type][i];

            if (listener.scope == scope && listener.callback == callback && listener.args.join(',') == args.join(',')) {
                newListener = false;
            }
        }

        if (newListener) {
            if (this.debug) {console.info(this.__debugName, "subscribe : ", type, scope);}
            this.listeners[type].push({scope:scope, callback:callback, args:args});
        } else {
            if (this.debug) {console.warn(this.__debugName, "subscribe, already done : ", type, scope);}
        }

        return this;
    };

    /**
     *
     * unsubscribe
     * will remove a subscribe that was done before
     *
     * @return  object scope
     * @access  public
     *
     */
    proto.unsubscribe = function(type, callback, scope) {
        var args      = arguments;
        var finalArgs = [];

        if(args) {
            var totalArgs = args.length;

            for (var i = 0; i < totalArgs; i++) {
                if (i < 3) { continue; }
                finalArgs.push(args[i]);
            }
        }

        args = finalArgs;

        var removeListener = false;

        if (typeof this.listeners[type] != "undefined") {
            var totalListeners = this.listeners[type].length;

            for (var i = 0; i < totalListeners; i++) {
                var listener = this.listeners[type][i];

                if(listener.scope == scope && listener.callback == callback && listener.args.join(',') == args.join(',')) {
                    removeListener = true;
                    this.listeners[type].splice(i, 1);

                    break;
                }
            }
        }

        if (removeListener) {
            if (this.debug) {console.info(this.__debugName, "unsubscribe : ", type, scope);}
        }

        return this;
    };

    /**
     *
     * emit
     * will emit the type you'll pass so all subscribers will receive it
     *
     * @return  object scope
     * @access  public
     *
     */
    proto.emit = function(type, target, params) {
        var newparams = [];

        if (params) {
            if (typeof params == "object" && typeof params.length == "undefined") {
                newparams.push(params);
            } else if (typeof params == "object") {
                newparams = params;
            } else {
                newparams.push(params);
            }
        }

        var event = {
            type:type,
            target:target,
            params: newparams
        };

        if(typeof this.listeners[type] != "undefined") {
            if (this.debug) {console.group(this.__debugName, "emit : ", type, target, newparams);}
            var totalListeners = this.listeners[type].length;

            for(var i = 0; i < totalListeners; i++) {
                var listener = this.listeners[type][i];

                if(listener && listener.callback) {
                    var sources = event.params.concat(listener.args);
                    var params = {};
                    var index = 0;
                    var totalSources = sources.length;

                    for (var a = 0; a < totalSources; a++) {
                        if (typeof sources[a] == "object" && typeof sources[a].length == "undefined") {
                            for (var b in sources[a]) {
                                params[b] = sources[a][b];
                            }
                        } else {
                            params[index] = sources[a];
                            index ++;
                        }
                    }

                    if (this.debug) {console.log(listener, event, params);}
                    listener.callback.call(listener.scope, {type: event.type, emitter: event.target, receiver: listener.scope}, params);
                }
            }

            if (this.debug) {console.groupEnd(this.__debugName, "emit : ", type, target, newparams);}
        }

        return this;
    };

    /**
     *
     * isSubscribed
     * can check if type exist or if a more precise event is subcribed
     *
     * @return  boolean
     * @access  public
     *
     */
    proto.isSubscribed = function(type, callback, scope) {
        var existListener = false;

        if(typeof this.listeners[type] != "undefined") {
            var totalListeners = this.listeners[type].length;

            if (typeof callback == "undefined" && typeof scope == "undefined") {
                existListener = (totalListeners > 0);
            } else {
                for(var i = 0; i < totalListeners; i++) {
                    var listener = this.listeners[type][i];

                    if(listener.scope == scope && listener.callback == callback) {
                        existListener = true;
                    }
                }
            }

        }

        return existListener;
    };

    proto.toString = function() {
        return "[" + this.__name + "]";
    };

    /* Create Me reference if does'nt exist */
    if (!window.Me) {window.Me = {};}

    /* Initiate to make a Singleton */
    Me.dispatch = new DispatchMe();
}(jQuery, window, document));