ko.options.deferUpdates = true;

ko.bindingHandlers.renderUser = {
    propertyNames: ["PreferredName", "PictureURL", "AccountName", "Title", "WorkEmail", "SipAddress"],
    context: null,
    peopleManager: null,
    callbacks: null,
    timeout: null,
    init: function (element, valueAccessor) {
		var value = ko.utils.unwrapObservable(valueAccessor());
        var userName = value;

        if (value.userName)
            userName = value.userName;

        var ru = ko.bindingHandlers.renderUser;
        if (ru.context == null) {
            ru.context = clientContext = SP.ClientContext.get_current();
            ru.peopleManager = new SP.UserProfiles.PeopleManager(ru.context);
        }
        if (ru.callbacks == null)
            ru.callbacks = new Array();

        var userProfilePropertiesForUser = new SP.UserProfiles.UserProfilePropertiesForUser(ru.context, userName, ru.propertyNames);
        var userProfileProperties = ru.peopleManager.getUserProfilePropertiesFor(userProfilePropertiesForUser);
        clientContext.load(userProfilePropertiesForUser);
        ru.callbacks[ru.callbacks.length] = function () {
            userProfileProperties.LoginName = userName;
            userProfileProperties.Role = "";
            for (var i = 0; i < ru.propertyNames.length; i++) {
                userProfileProperties[ru.propertyNames[i]] = userProfileProperties[i];
            }
            if (!userProfileProperties.AccountName)
                userProfileProperties.AccountName = userName;
            element.innerHTML = ru.renderPresence(userProfileProperties, value.schemaOverride);
        };
        clearTimeout(ru.timeout);
        ru.timeout = setTimeout(function () {
            ru.context.executeQueryAsync(function () {
                for (var x = 0; x < ru.callbacks.length; x++) {
                    ru.callbacks[x]();
                }
                ru.context = null;
                ru.callbacks = null;
                ru.timeout = null;
                ProcessImn();
            }, function () {
                //handle errors
            });
        }, 1);
    },
    renderPresence: function (user, fieldSchemaOverride) {
        var renderCtx = new ContextInfo();
        renderCtx.Templates = {};
        renderCtx.Templates["Fields"] = {};

        var fieldSchemaData = fieldSchemaOverride;
        if (!fieldSchemaData)
            fieldSchemaData = { "WithPictureDetail": "1", "PictureSize": "Size_36px" };
        var listSchema = { "EffectivePresenceEnabled": "1", "PresenceAlt": "User Presence" };
        var userData = {
            "id": user.AccountName, "department": user.Role, "jobTitle": user.Title,
            "title": user.PreferredName, "email": user.WorkEmail, "picture": user.PictureURL, "sip": user.SipAddress
        };
        return RenderUserFieldWorker(renderCtx, fieldSchemaData, userData, listSchema);
    }
};

ko.bindingHandlers.user = {
	init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element = $(element);
		var elementId = $(element).attr("id") || "imn_" + (++ko.bindingHandlers.user.counter) + ",type=sip";

		$element.attr("id", elementId);
		var value = typeof valueAccessor() === 'function' ? valueAccessor()() : valueAccessor();
		$element.createpresence(value, { type: "default", redirectToProfile: true });
    },
	counter: 0
};

ko.bindingHandlers.clientPeoplePicker = {
    currentId: 0,
    init: function (element, valueAccessor) {
        var obs = valueAccessor();
        if (!ko.isObservable(obs)) {
            throw "clientPeoplePicker binding requires an observable";
        }

        var currentId = ko.bindingHandlers.clientPeoplePicker.currentId++;
        var currentElemId = "ClientPeoplePicker" + currentId;
        element.setAttribute("id", currentElemId);
        obs._peoplePickerId = currentElemId + "_TopSpan";

        ko.bindingHandlers.clientPeoplePicker.initPeoplePicker(currentElemId).done(function (picker) {
            picker.OnValueChangedClientScript = function (elementId, userInfo) {
				if (userInfo.length > 0) {
					obs(userInfo[0].Key);
				}
				return false;
            };
            ko.bindingHandlers.clientPeoplePicker.update(element, valueAccessor);
        });
    },
    update: function (element, valueAccessor) {
        
        var obs = valueAccessor();

        if (!ko.isObservable(obs)) {
            throw "clientPeoplePicker binding requires an observable";
        }
        if (typeof SPClientPeoplePicker === 'undefined') {
            return;
        }

        var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[obs._peoplePickerId];
        if (peoplePicker) {
            if (typeof obs() !== 'undefined' && obs() !== null && obs() !== "")
            {
                var usersobject = peoplePicker.GetAllUserInfo();
                usersobject.forEach(function (index) {
                    peoplePicker.DeleteProcessedUser(usersobject[index]);
                });

                peoplePicker.AddUserKeys(obs());
                peoplePicker.ResolveAllUsers();
            }
        }
    },
    initPeoplePicker: function (elementId) {
		var dfd = jQuery.Deferred();
        SPSODAction(["sp.js", "clienttemplates.js", "clientforms.js", "clientpeoplepicker.js", "autofill.js"], function () {
            SPClientPeoplePicker_InitStandaloneControlWrapper(elementId, null, {
				PrincipalAccountType: 'User',
				SearchPrincipalSource: 15,
				ResolvePrincipalSource: 15,
				AllowMultipleValues: false,
				MaximumEntitySuggestions: 50,
				Width: '100%'
			});
            dfd.resolve(SPClientPeoplePicker.SPClientPeoplePickerDict[elementId + "_TopSpan"]);
        });
        return dfd.promise();
    }
};

ko.bindingHandlers.submitOnEnter = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var allBindings = allBindingsAccessor();
        jQuery(element).keypress(function (event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                allBindings.submitOnEnter.call(viewModel);
                return false;
            }
            return true;
        });
    },
    update: function () { }
};

function SPSODAction(sodScripts, onLoadAction) {
    if (SP.SOD.loadMultiple) {
        for (var x = 0; x < sodScripts.length; x++) {
            if (!_v_dictSod[sodScripts[x]]) {
                SP.SOD.registerSod(sodScripts[x], '/_layouts/15/' + sodScripts[x]);
            }
        }
        SP.SOD.loadMultiple(sodScripts, onLoadAction);
    } else {
		ExecuteOrDelayUntilScriptLoaded(onLoadAction, sodScripts[0]);
	}
}

ko.bindingHandlers.spDatePicker = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		var initializeDatePicker = function ($element) {
			var calendarOptions = [];
			calendarOptions.push(_spPageContextInfo.webServerRelativeUrl + "/" + _spPageContextInfo.layoutsUrl + '/iframe.aspx?');
			calendarOptions.push('&cal=1');
			calendarOptions.push('&lcid=1060');
			calendarOptions.push('&langid=1060');
			calendarOptions.push('&tz=-08:00:00.0002046');
			calendarOptions.push('&ww=0111110');
			calendarOptions.push('&fdow=0');
			calendarOptions.push('&fwoy=0');
			calendarOptions.push('&hj=0');
			calendarOptions.push('&swn=false');
			calendarOptions.push('&minjday=109207');
			calendarOptions.push('&maxjday=2666269');
			calendarOptions.push('&date=');

			var id = $element.attr('id');

			$element.after('<iframe id="' + id + 'DatePickerFrame" title="Izberite datum." style="display:none; position:absolute; width:200px; z-index:101;" src="/_layouts/15/images/blank.gif?rev=23"></iframe>');
			$element.after('<a href="#" style="vertical-align:top; width:100px;"><img style="vertical-align:bottom" id="' + id + 'DatePickerImage" border="0" alt="Izberite datum." src="/_layouts/15/images/calendar_25.gif?rev=23"></a>');
			$element.next('a').attr('onclick', 'clickDatePicker("' + id + '", "' + calendarOptions.join('') + '", "", event); return false;');
		};

        var $elem = $(element);
		var elementId = $(element).attr("id") || ko.bindingHandlers.spDatePicker.prefix + (++ko.bindingHandlers.spDatePicker.counter);
		$elem.attr("id", elementId);
		initializeDatePicker($elem);

		ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
			var currentDate = moment($(element).val(), 'D.M.YYYY');
			if (currentDate.isValid()) {
				observable(currentDate.toDate());
			}
			else {
				observable(null);
			}
        });
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());
		if (value == null) {
			$(element).val("");
		}
        else {
			$(element).val(moment(value).format('D.M.YYYY'));
		}
    },
	prefix: "dateTimePicker-",
	counter: 0
};

ko.bindingHandlers.date = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		var value = valueAccessor();
		if (typeof value() === 'undefined' || value() == null || value() == "" || isNaN(value().getTime())) {
			$(element).html("");
		}
		else {
			$(element).html(moment(value()).format('D.M.YYYY'));
		}

    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
		if (typeof value() === 'undefined' || value() == null || value() == "" || isNaN(value().getTime())) {
			$(element).html("");
		}
		else {
			$(element).html(moment(value()).format('D.M.YYYY'));
		}
    }
};


ko.bindingHandlers.mOxie = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		var observableCollection = valueAccessor();
		observableCollection.loaded = false;

		var fileInput = new mOxie.FileInput({
			browse_button: element,
			multiple: false,
			swf_url: "/_layouts/15/Xnet.SP.Actual/flash/Moxie.swf"
		});

		var reader = new mOxie.FileReader();

		reader.onloadend = function() {
			//console.log(reader.result);
			var n = reader.result.indexOf(";base64,") + 8;
			var file = observableCollection()[observableCollection().length - 1];
			file().bytes(reader.result.substring(n));
            file().loaded(true);
			observableCollection.loaded = true;
		};

		reader.onerror = function() {
			//reject(reader.error);
			console.log(reader.error)
		};

		fileInput.onchange = function(e) {
			$.each(fileInput.files, function(index, file) {
				observableCollection.push(ko.observable({
					id: ko.observable(file.uid),
					name: ko.observable(file.name),
					bytes: ko.observable(""),
                    loaded: ko.observable(false)
				}));
				reader.readAsDataURL(file);
			});
		};
		fileInput.init();
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};