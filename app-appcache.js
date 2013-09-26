(function(window){
	var doc = window.document,
			$ = function(selector){
				var result = doc.querySelectorAll(selector);

				return (result.length > 1) ? result : result[0];
			},
			appCache = window.applicationCache;

	console.log(appCache.status);
	appCache.addEventListener('updateready', onUpdateReady);

	function onUpdateReady(){
		if(appCache.status === appCache.UPDATEREADY){
			appCache.swapCache();
			location.reload();
		}
	}

}(this));