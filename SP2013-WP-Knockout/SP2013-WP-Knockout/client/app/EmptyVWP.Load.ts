/// <reference path="../../node_modules/@types/jquery/index.d.ts"/>
/// <reference path="../../node_modules/@types/microsoft-ajax/index.d.ts"/>

import {MainModel} from './models/MainModel'

$(document).ready(async () => {
	ExecuteOrDelayUntilScriptLoaded(async () => {
		try {
			if ($("empty-web-part").length > 0) {
				var model = new MainModel();
				ko.components.register('empty-web-part', {
					template: { fromUrl: 'EmptyVWP.html', maxCacheAge: 1234 },
					viewModel: { instance: model }
				});
				ko.applyBindings();
				model.initialize();
			}
		}
		catch (e) {
			console.log(e);
		}
	}, "sp.js");
});