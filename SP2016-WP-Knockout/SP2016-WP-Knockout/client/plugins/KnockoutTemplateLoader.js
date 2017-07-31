var templateFromUrlLoader = {
	loadTemplate: function (name, templateConfig, callback) {
		if (templateConfig.fromUrl) {
			var fullUrl = '/_layouts/15/SP2016-WP-Knockout/templates/' + templateConfig.fromUrl + '?cacheAge=' + templateConfig.maxCacheAge;
			$.get(fullUrl, function(markupString){
				ko.components.defaultLoader.loadTemplate(name, markupString, callback)
			});
		} else {
			callback(null);
		}
	}
};
ko.components.loaders.unshift(templateFromUrlLoader);