$(document).ready(function(){
	Me.dispatch.subscribe('type-1', callback1, window, "test", {paramstest1:"test"});
	Me.dispatch.subscribe('type-1', callback2, window);

	console.log("send Event :");
	Me.dispatch.emit('type-1', {scope:'this'}, {param1:true, param2:"test", param3:{}});

	Me.dispatch.unsubscribe('type-1', callback1, window, "test", {paramstest1:"test"});

	console.log("Resend Event :");
	Me.dispatch.emit('type-1', {scope:'this'}, {param1:true, param2:"test", param3:{}});

	function callback1(e, params) {
		console.log("this is a callback 1", e, params);
	}

	function callback2(e, params) {
		console.log("this is a callback 2", e, params);
	}
});