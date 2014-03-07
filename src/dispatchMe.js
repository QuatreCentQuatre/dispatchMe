/*
 * dispatchMe
 * Library to dispatch and listen to event
 * */
(function($, window, document, undefined){
	var DispatchMe = function(){
		this.__construct();
	};

	var defaults = {
		debug : false
	};

	var proto = DispatchMe.prototype;

	proto.options   = null;
	proto.listeners = null;

	//--------Methods--------//
	proto.__construct = function() {
		this.options   = $.extend({}, defaults);
		this.listeners = {};
	};

	proto.setOpts = function(options) {
		this.options = $.extend({}, this.options, options);
	};

	proto.addEvent = function(type, callback, scope) {
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

		if (typeof this.listeners[type] == "undefined") {
			this.listeners[type] = [];
		}

		var addListener    = true;
		var totalListeners = this.listeners[type].length;
		for (var i = 0; i < totalListeners; i++) {
			var listener = this.listeners[type][i];
			if (listener.scope == scope && listener.callback == callback && listener.args.join(',') == args.join(',')) {
				addListener = false;
			}
		}

		if (addListener) {
			if (this.options.debug) {
				console.info("dispatchMe :: addEventListener : ", type, scope);
			}
			this.listeners[type].push({scope:scope, callback:callback, args:args});
		} else {
			console.warn("dispatchMe :: addEventListener, already register : ", type, scope);
		}

		return this;
	};

	proto.removeEvent = function(type, callback, scope) {
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
			if (this.options.debug) {
				console.info("dispatchMe :: removeEventListener : ", type, scope);
			}
		}

		return this;
	};

	proto.hasEvent = function(type, callback, scope) {
		var existListener = false;
		if(typeof this.listeners[type] != "undefined") {
			var totalListeners = this.listeners[type].length;
			for(var i = 0; i < totalListeners; i++) {
				var listener = this.listeners[type][i];
				if(listener.scope == scope && listener.callback == callback) {
					existListener = true;
				}
			}
		}

		return existListener;
	};

	proto.sendEvent = function(type, target, params) {
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
			if (this.options.debug) {
				console.group("dispatchMe :: dispatch", type, target, newparams);
			}

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

					if (this.options.debug) {
						console.log(listener, event, params);
					}
					listener.callback.call(listener.scope, {type: event.type, emitter: event.target, receiver: listener.scope}, params);
				}
			}

			if (this.options.debug) {
				console.groupEnd("dispatchMe :: dispatch", type, target, newparams);
			}
		}
	};

	if(!window.Me) {
		window.Me = {};
	}
	Me.dispatch = new DispatchMe();
}(jQuery, window, document));