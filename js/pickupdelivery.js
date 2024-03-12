/**
 * BEGIN: Polyfills for IE11 support.
 */
/**
 * A basic polyfill for the closest() method in Internet Explorer 9 and higher.
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
 */
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		let el = this;
		
		do {
			if (Element.prototype.matches.call(el, s)) {
				return el;
			}
			el = el.parentElement || el.parentNode;
		}
		while (el !== null && el.nodeType === 1);
		return null;
	};
}

/**
 * A basic polyfill for the Array.from() method in Internet Explorer 9 and higher.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 * Production steps of ECMA-262, Edition 6, 22.1.2.1
 */
if (!Array.from) {
	Array.from = (function () {
		let toStr = Object.prototype.toString;
		let isCallable = function (fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		let toInteger = function (value) {
			let number = Number(value);
			if (isNaN(number)) {
				return 0;
			}
			if (number === 0 || !isFinite(number)) {
				return number;
			}
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		let maxSafeInteger = Math.pow(2, 53) - 1;
		let toLength = function (value) {
			let len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};
		
		return function from(arrayLike/*, mapFn, thisArg */) {
			let C = this;
			let items = Object(arrayLike);

			if (arrayLike == null) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}
			
			let mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			let T;

			if (typeof mapFn !== 'undefined') {
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}
			
			let len = toLength(items.length);
			let A = isCallable(C) ? Object(new C(len)) : new Array(len);
			let k = 0;
			let kValue;

			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				}
				else {
					A[k] = kValue;
				}
				k += 1;
			}
			A.length = len;
			return A;
		};
	}());
}

/**
 * A basic polyfill for the Array.find() method in Internet Explorer 9 and higher.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 * https://tc39.github.io/ecma262/#sec-array.prototype.find
 */
if (!Array.prototype.find) {
	Object.defineProperty(Array.prototype, 'find', {
		value: function (predicate) {
			if (this == null) {
				throw TypeError('"this" is null or not defined');
			}
			
			let o = Object(this);
			let len = o.length >>> 0;
			
			if (typeof predicate !== 'function') {
				throw TypeError('predicate must be a function');
			}
			
			let thisArg = arguments[1];
			let k = 0;
			
			while (k < len) {
				let kValue = o[k];
				
				if (predicate.call(thisArg, kValue, k, o)) {
					return kValue;
				}
				k++;
			}
			return undefined;
		},
		configurable: true,
		writable: true
	});
}

/**
 * A basic polyfill for String.prototype.padStart() adds compatibility to all Browsers supporting ES5.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
 * https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
 */
if (!String.prototype.padStart) {
	String.prototype.padStart = function padStart(targetLength, padString) {
		targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
		padString = String(typeof padString !== 'undefined' ? padString : ' ');
		if (this.length >= targetLength) {
			return String(this);
		}
		else {
			targetLength = targetLength - this.length;
			if (targetLength > padString.length) {
				padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
			}
			return padString.slice(0, targetLength) + String(this);
		}
	};
}

/**
 * A basic polyfill for the NodeList.prototype.forEach adds compatibility to all Browsers supporting ES5.
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
 */
if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

/**
 * A basic polyfill for String.prototype.includes() adds compatibility to all Browsers supporting ES5.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
 */
if (!String.prototype.includes) {
	String.prototype.includes = function (search, start) {
		'use strict';
		
		if (search instanceof RegExp) {
			throw TypeError('first argument must not be a RegExp');
		}
		if (start === undefined) {
			start = 0;
		}
		return this.indexOf(search, start) !== -1;
	};
}

/**
 * A basic polyfill for ParentNode.append() adds compatibility to all Browsers supporting ES5.
 * https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append
 * https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
 */
(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty('append')) {
			return;
		}
		Object.defineProperty(item, 'append', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function append() {
				let argArr = Array.prototype.slice.call(arguments);
				let docFrag = document.createDocumentFragment();
				
				argArr.forEach(function (argItem) {
					let isNode = argItem instanceof Node;
					
					docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
				});
				
				this.appendChild(docFrag);
			}
		});
	});
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
/**
 * END: Polyfills for IE11 support.
 */

let shippingMethodCode;
let shippingMethodType;
let shippingLocation;

(function (obj, eventType, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(eventType, fn, false);
	}
	else if (obj.attachEvent) {
		obj.attachEvent('on' + eventType, fn);
	}
})(window, 'load', function () {
	'use strict';

	const shippingMethods =  document.querySelectorAll('[name="ShippingMethod"]');
	const pickupDeliverOptions = document.querySelector('[data-pickup-delivery-options]');
	const pickupDeliverAction = document.querySelector('[data-pickup-delivery-action]');
	const pickupDeliverEdit = document.querySelector('[data-pickup-delivery-edit]');
	const location = document.querySelector('[data-pickup-delivery-location]');

	pickupDeliverAction.classList.add('is-disabled');

	if (shippingMethods[0].value.includes('pickupdelivery')) {
		const firstMethod = shippingMethods[0];

		shippingMethodCode = firstMethod.value.split(':').pop();
		Runtime_PickupDelivery_GetMethodDetails_MethodCode(shippingMethodCode, function (methodDetails) {
			if (methodDetails.success === 1) {
				shippingMethodType = methodDetails.data.type;
				shippingLocation = btoa(JSON.stringify(methodDetails.data.method_addr));

				firstMethod.setAttribute('data-shipping-type', shippingMethodType);
				firstMethod.setAttribute('data-shipping-location', shippingLocation);

				let locationDetails = methodDetails.data.method_addr;

				location.innerHTML = [
					'<strong>' + encodeentities( locationDetails.name ) + '</strong><br>',
					encodeentities( locationDetails.address ) + '<br>',
					encodeentities( locationDetails.city ) + ', ' + encodeentities( locationDetails.state ) + ' ' + encodeentities( locationDetails.zip )
				].join('');

				pickupDeliverOptions.removeAttribute('hidden');
				pickupDeliverAction.setAttribute('data-shipping-method', shippingMethodCode);
				pickupDeliverAction.setAttribute('data-shipping-type', shippingMethodType);
				pickupDeliverEdit.setAttribute('data-shipping-method', shippingMethodCode);
				pickupDeliverEdit.setAttribute('data-shipping-type', shippingMethodType);
			}
		});
		Runtime_PickupDeliverySchedule_AvailableDays_MethodCode(shippingMethodCode, function (response) {
			delivery_pickup.available_days = response.data.available_days
			pickupDeliverAction.focus();
			pickupDeliverAction.classList.remove('is-disabled');
		});
	}

	if (shippingMethods.length === 1) {
		Array.from(shippingMethods[0].options).forEach(function (method) {
			if (method.value.includes('pickupdelivery')) {
				Runtime_PickupDelivery_GetMethodDetails_MethodCode(method.value.split(':').pop(), function (details) {
					if (details.success === 1) {
						method.setAttribute('data-shipping-type', details.data.type);
						method.setAttribute('data-shipping-location', btoa(JSON.stringify(details.data.method_addr)));
					}
				});
			}
		});

		shippingMethods[0].addEventListener('change', function () {
			if (this.options[this.selectedIndex].value.includes('pickupdelivery')) {
				shippingMethodCode = this.options[this.selectedIndex].value.split(':').pop();
				shippingMethodType = this.options[this.selectedIndex].dataset.shippingType;
				shippingLocation = this.options[this.selectedIndex].dataset.shippingLocation;
				pickupDeliverOptions.removeAttribute('hidden');
				pickupDeliverAction.setAttribute('data-shipping-method', shippingMethodCode);
				pickupDeliverAction.setAttribute('data-shipping-type', shippingMethodType);
				pickupDeliverAction.focus();
				pickupDeliverEdit.setAttribute('data-shipping-method', shippingMethodCode);
				pickupDeliverEdit.setAttribute('data-shipping-type', shippingMethodType);
				Runtime_PickupDeliverySchedule_AvailableDays_MethodCode(shippingMethodCode, function (response) {
					delivery_pickup.available_days = response.data.available_days
					pickupDeliverAction.classList.remove('is-disabled');
				});
				let locationDetails = JSON.parse(atob(shippingLocation));

				location.innerHTML = [
					'<strong>' + encodeentities( locationDetails.name ) + '</strong><br>',
					encodeentities( locationDetails.address ) + '<br>',
					encodeentities( locationDetails.city ) + ', ' + encodeentities( locationDetails.state ) + ' ' + encodeentities( locationDetails.zip )
				].join('');
			}
			else {
				pickupDeliverOptions.setAttribute('hidden', '');
				pickupDeliverAction.classList.add('is-disabled');
			}
		});
	}
	else {
		shippingMethods.forEach(function (method) {
			if (method.value.includes('pickupdelivery')) {
				Runtime_PickupDelivery_GetMethodDetails_MethodCode(method.value.split(':').pop(), function (details) {
					if (details.success === 1) {
						method.setAttribute('data-shipping-type', details.data.type);
						method.setAttribute('data-shipping-location', btoa(JSON.stringify(details.data.method_addr)));
					}
				});
			}

			method.addEventListener('change', function () {
				if (this.value.includes('pickupdelivery')) {
					shippingMethodCode = this.value.split(':').pop();
					pickupDeliverOptions.removeAttribute('hidden');
					shippingMethodType = this.dataset.shippingType;
					shippingLocation = this.dataset.shippingLocation;
					pickupDeliverAction.setAttribute('data-shipping-method', shippingMethodCode);
					pickupDeliverAction.setAttribute('data-shipping-type', shippingMethodType);
					pickupDeliverAction.focus();
					pickupDeliverEdit.setAttribute('data-shipping-method', shippingMethodCode);
					pickupDeliverEdit.setAttribute('data-shipping-type', shippingMethodType);
					Runtime_PickupDeliverySchedule_AvailableDays_MethodCode(shippingMethodCode, function (response) {
						delivery_pickup.available_days = response.data.available_days
						pickupDeliverAction.classList.remove('is-disabled');
					});
					let locationDetails = JSON.parse(atob(shippingLocation));

					location.innerHTML = [
						'<strong>' + encodeentities( locationDetails.name ) + '</strong><br>',
						encodeentities( locationDetails.address ) + '<br>',
						encodeentities( locationDetails.city ) + ', ' + encodeentities( locationDetails.state ) + ' ' + encodeentities( locationDetails.zip )
					].join('');
				}
				else {
					pickupDeliverOptions.setAttribute('hidden', '');
					pickupDeliverAction.classList.add('is-disabled');
				}
			});
		});
	}
});

(function (obj, eventType, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(eventType, fn, false);
	}
	else if (obj.attachEvent) {
		obj.attachEvent('on' + eventType, fn);
	}
})(window, 'load', function () {
	'use strict';

	/**
	 * Create a dialog object, set the target element, and create a list of focusable elements.
	 * @type {{set: *[], closeTriggers: *[], focused: Element, focusable: string, el: Element, openTriggers: *[], init: function, show: function, hide: function, trap: function, getFocusable: function, getFirstFocusable: function, setInert: function, removeInert: function}}
	 */
	let dialog = {
		set: Array.from(document.querySelectorAll('[data-scheduling-dialog]')),
		openTriggers: Array.from(document.querySelectorAll('[data-scheduling-dialog-trigger]')),
		closeTriggers: Array.from(document.querySelectorAll('[data-scheduling-dialog-close]')),
		focusable: 'button:not([disabled]):not([aria-hidden]):not([tabindex="-1"])',
		el: undefined,
		focused: undefined,
		init: function () {
		},
		show: function () {
		},
		hide: function () {
		},
		trap: function () {
		},
		getFocusable: function () {
		},
		getFirstFocusable: function () {
		},
		setInert: function () {
		},
		removeInert: function () {
		}
	};
	let calendar;

	/**
	 * Initialize the dialog, find the focusable children elements, and set up the click handlers.
	 */
	dialog.init = function () {
		dialog.set.forEach(function (dialog) {
			dialog.setAttribute('aria-hidden', 'true');
		});

		dialog.openTriggers.forEach(function (trigger) {
			trigger.addEventListener('click', function (e) {
				e.preventDefault();
				let name = this.dataset.schedulingDialogTrigger;

				dialog.el = dialog.set.find(function (value) {
					return value.dataset.schedulingDialog === name;
				});
				dialog.show();
			});
		});

		dialog.closeTriggers.forEach(function (trigger) {
			trigger.addEventListener('click', function (e) {
				e.preventDefault();
				dialog.hide(dialog.focused);
			});
		});

		/**
		 * Close the open dialog when clicking on the background.
		 */
		document.addEventListener('click', function (clickEvent) {
			let clickEventTarget = clickEvent.target;

			if (dialog.el) {
				if (clickEventTarget === dialog.el.firstElementChild) {
					if (dialog.el.getAttribute('aria-hidden') === 'false') {
						clickEvent.preventDefault();
						dialog.hide(dialog.focused);
					}
				}
			}
		});

	};

	/**
	 * Capture the current focused element so that you can set focus back to it
	 * when you close the dialog.
	 * Add a class to the `body` to style for dialog.
	 * Hide the rest of the content.
	 * Set `aria-hidden` to `false`
	 * Add class to dialog.
	 * Set focus to first focusable element from list created in init function.
	 */
	dialog.show = function () {
		document.body.appendChild(dialog.el);
		dialog.setInert();

		document.body.classList.add('has-dialog');
		dialog.focused = document.activeElement;
		dialog.el.setAttribute('aria-hidden', 'false');
		calendar = new Calendar(delivery_pickup);
		document.querySelector('#pickup-delivery-title').textContent = 'Select ' + shippingMethodType.charAt(0).toUpperCase() + shippingMethodType.slice(1) + ' Date and Time';

		// Focus on focusable item in the dialog.
		dialog.el.onkeydown = function (e) {
			dialog.trap(e);
		};
	};

	/**
	 * Remove `body` classes that were added.
	 * Reset `aria-hidden` values from container.
	 * Reset `aria-hidden` values on dialog.
	 * Remove show class from dialog.
	 * Set focus to previously focused element.
	 */
	dialog.hide = function (original) {
		document.body.classList.remove('has-dialog');
		dialog.el.setAttribute('aria-hidden', 'true');
		dialog.removeInert();
		original.focus();
		calendar.reset();
	};

	/**
	 * Traps the tab key inside of the context, so the user can't accidentally get stuck behind it.
	 * Note that this does not work for VoiceOver users who are navigating with the VoiceOver commands, only for default
	 * tab actions. We would need to implement something like the inert attribute for that (https://github.com/WICG/inert).
	 *
	 * If key is `esc`, close the dialog.
	 * If key is `tab`
	 * -- Get the current focus.
	 * -- Get the total focusable items to filter through them later.
	 * -- Get the index from the focusable items list of the current focused item.
	 * If key is `shift-tab` (backwards) and you're at the first focusable item, set focus to the last focusable item.
	 * If not `shift-tab` and the current focused item is the last item, set focus to the first focusable item.
	 */
	dialog.trap = function (e) {
		if (e.which === 27) {
			dialog.hide(dialog.focused);
		}
		if (e.which === 9) {
			let currentFocus = document.activeElement;
			let focusableChildren = dialog.getFocusable();
			let totalOfFocusable = focusableChildren.length;
			let focusedIndex = focusableChildren.indexOf(currentFocus);

			if (e.shiftKey) {
				if (focusedIndex === 0) {
					e.preventDefault();
					focusableChildren[totalOfFocusable - 1].focus();
				}
			}
			else {
				if (focusedIndex === totalOfFocusable - 1) {
					e.preventDefault();
					focusableChildren[0].focus();
				}
			}
		}
	};

	/**
	 * Get all focusable elements inside of the dialog.
	 * @returns {Array} Array of focusable elements
	 */
	dialog.getFocusable = function () {
		return Array.from(dialog.el.querySelectorAll(dialog.focusable));
	};

	/**
	 * This is a helper function we will put into `window` to allow for handling of dynamically added, focusable items.
	 */
	let refocus = function () {
		dialog.getFocusable();
	};
	window && (window.refocus = refocus);
	
	/**
	 * Get the first focusable element inside of the dialog.
	 * @returns {Object} A DOM element
	 */
	dialog.getFirstFocusable = function () {
		let focusable = dialog.getFocusable();

		return focusable[0];
	};

	/**
	 * Toggles an 'inert' attribute on all direct children of the <body> that are not the element you passed in. The
	 * element you pass in needs to be a direct child of the <body>.
	 *
	 * Most useful when displaying a dialog/dialog/overlay and you need to prevent screen-reader users from escaping the
	 * dialog to content that is hidden behind the dialog.
	 *
	 * This is a basic version of the `inert` concept from WICG. It is based on an alternate idea which is presented here:
	 * https://github.com/WICG/inert/blob/master/explainer.md#wouldnt-this-be-better-as
	 * Also see https://github.com/WICG/inert for more information about the inert attribute.
	 */
	dialog.setInert = function () {
		Array.from(document.body.children).forEach(function (child) {
			if (dialog.set.indexOf(child) === -1 && child !== dialog.el && child.tagName !== 'LINK' && child.tagName !== 'SCRIPT') {
				child.classList.add('is-inert');
				child.setAttribute('inert', '');
			}
		});
	};

	dialog.removeInert = function () {
		Array.from(document.body.children).forEach(function (child) {
			if (dialog.set.indexOf(child) === -1 && child !== dialog.el && child.tagName !== 'LINK' && child.tagName !== 'SCRIPT') {
				child.classList.remove('is-inert');
				child.removeAttribute('inert');
			}
		});
	};

	/**
	 * Initialize the dialog.
	 */
	dialog.init();
});

(function (obj, eventType, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(eventType, fn, false);
	}
	else if (obj.attachEvent) {
		obj.attachEvent('on' + eventType, fn);
	}
})(window, 'load', function () {
	'use strict';
	
	function Calendar(delivery_pickup) {
		const getMonths = function () {
			let months = [];
			
			function onlyUnique(value, index, self) {
				return self.indexOf(value) === index;
			}
			
			for (let month in delivery_pickup.available_days) {
				if (delivery_pickup.available_days.hasOwnProperty(month)) {
					let monthObject = delivery_pickup.available_days[month];

					months.push(monthObject.server_month - 1);
				}
			}
			return months.filter(onlyUnique);
		};

		const getDates = function () {
			let dates = [];
			
			for (let day in delivery_pickup.available_days) {
				if (delivery_pickup.available_days.hasOwnProperty(day)) {
					let dayObject = delivery_pickup.available_days[day];
					
					dates.push({
						date: String(dayObject.server_year) + '-' + String(dayObject.server_month).padStart(2, '0') + '-' + String(dayObject.server_day).padStart(2, '0')
					});
				}
			}
			return dates;
		};

		let settings = {
			dialog: document.querySelector('[data-scheduling-dialog]'),
			selector: '[data-calendar]',
			datesFilter: true,
			pastDates: false,
			availableDates: getDates(),
			availableMonths: getMonths(),
			currentMonth: new Date().getMonth(),
			currentFullYear: new Date().getFullYear(),
			date: new Date(),
			dateToday: new Date(),
			button_prev: null,
			button_next: null,
			month: null,
			month_label: null,
			months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			shortWeekday: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			availableSlots: [],
			timeMessage: document.querySelector('[data-clock-message]'),
			times: document.querySelector('[data-clock-times]'),
			timeList: document.querySelector('[data-clock-list]'),
			submitDate: document.querySelector('[data-submit-date]')
			
		};
		let activeDates;
		let activeDatesButtons;
		let openDays = [];
		
		const calendarElement = document.querySelector(settings.selector);
		
		if (!calendarElement) {
			return;
		}
		
		const daysSinceEpoch = function (date) {
			const currentDate = new Date(date);
			const epochDate = new Date(new Date().getTime() / 1000);
			const daysSince = Math.abs(currentDate - epochDate) / 1000;
			return Math.floor(daysSince / 86400);
		};
		
		const createDay = function (date) {
			const dateElem = document.createElement('button');
			const newDayElem = document.createElement('div');
			
			dateElem.innerHTML = date.getDate();
			dateElem.setAttribute('tabindex', '-1');
			dateElem.setAttribute('data-index', daysSinceEpoch(date).toString());
			dateElem.setAttribute('data-day', date.getDay());
			dateElem.setAttribute('tabindex', '-1');
			newDayElem.className = 'm-calendar-date';
			newDayElem.setAttribute('data-calendar-date', date);
			newDayElem.setAttribute('role', 'gridcell');
			
			const available_date = settings.availableDates.filter(function (f) {
				return f.date === date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
			});
			
			if (date.getDate() === 1) {
				newDayElem.style.marginLeft = ((date.getDay()) * 14.28) + '%';
			}
			if (settings.date.getTime() <= settings.dateToday.getTime() - 1 && !settings.pastDates) {
				newDayElem.classList.add('m-calendar-date--disabled');
				dateElem.setAttribute('disabled', '');
			}
			else {
				if (settings.datesFilter) {
					if (available_date.length) {
						newDayElem.classList.add('m-calendar-date--active');
						newDayElem.setAttribute('data-calendar-data', JSON.stringify(available_date[0]));
						newDayElem.setAttribute('data-calendar-status', 'active');
					}
					else {
						newDayElem.classList.add('m-calendar-date--disabled');
						dateElem.setAttribute('disabled', '');
					}
				}
				else {
					newDayElem.classList.add('m-calendar-date--active');
					newDayElem.setAttribute('data-calendar-status', 'active');
				}
			}
			if (date.toString() === settings.dateToday.toString()) {
				newDayElem.classList.add('m-calendar-date--today');
			}
			
			newDayElem.appendChild(dateElem);
			settings.month.appendChild(newDayElem);
		};
		
		const removeActiveClass = function () {
			document.querySelectorAll('.m-calendar-date--selected').forEach(function (s) {
				s.classList.remove('m-calendar-date--selected');
				s.firstElementChild.removeAttribute('aria-selected');
			});
		};
		
		const selectDate = function () {
			activeDates = calendarElement.querySelectorAll('[data-calendar-status="active"]');
			activeDatesButtons = calendarElement.querySelectorAll('[data-calendar-status="active"] button');
			
			let firstAvailable = activeDates[0];
			
			if (firstAvailable) {
				const button = firstAvailable.querySelector('button');
				
				button.focus();
				button.setAttribute('data-selected-date', '');
				button.setAttribute('tabindex', '0');
				firstAvailable.classList.add('m-calendar-date--first-available');
			}
			
			for (let i = 0; i < activeDatesButtons.length; i++) {
				activeDatesButtons[i].index = parseInt(activeDatesButtons[i].dataset.index);
				openDays.push(activeDatesButtons[i].index);
			}
			
			activeDates.forEach(function (date) {
				date.addEventListener('click', function () {
					activeDatesButtons.forEach(function (ab) {
						ab.setAttribute('tabindex', '-1');
					});
					removeActiveClass();
					getTimes(true);
					
					let dataset = this.dataset;
					let data = {};
					
					if (dataset.calendarDate) {
						data.date = dataset.calendarDate;
					}
					if (dataset.calendarData) {
						data.data = JSON.parse(dataset.calendarData);
					}
					this.classList.add('m-calendar-date--selected');
					this.firstElementChild.setAttribute('aria-selected', 'true');
					this.firstElementChild.setAttribute('tabindex', '0');
					
					let selectedDate = data.data.date.split('-');
					let selectedYear = selectedDate[0];
					let selectedMonth = selectedDate[1];
					let selectedDay = selectedDate[2];

					Runtime_PickupDeliverySchedule_AvailableSlots_MethodCode(shippingMethodCode, selectedYear, selectedMonth, selectedDay, function (response) {
						if (response.success === 1) {
							settings.available_slots = response.data.available_slots;
							createTimeList(getTimes());
							settings.timeMessage.setAttribute('hidden', '');
							settings.times.removeAttribute('hidden');
							keyboardNavigation();
						}
					});
				}, false);
			});
		};
		
		const checkMonth = function (month) {
			return settings.availableMonths.some(function (available) {
				return month === available;
			});
		};
		
		const createMonth = function () {
			activeDates = '';
			activeDatesButtons = '';
			clearCalendar();
			
			let currentMonth = settings.date.getMonth();
			
			while (settings.date.getMonth() === currentMonth) {
				createDay(settings.date);
				settings.date.setDate(settings.date.getDate() + 1);
			}
			
			settings.date.setDate(1);
			settings.date.setMonth(settings.date.getMonth() - 1);
			settings.month_label.innerHTML = settings.months[settings.date.getMonth()] + ' ' + settings.date.getFullYear();
			selectDate();
		};
		
		const monthPrev = function () {
			if ((settings.date.getMonth() - 1 >= settings.currentMonth || settings.date.getFullYear() - 1 >= settings.currentFullYear) && !settings.pastDates) {
				settings.date.setMonth(settings.date.getMonth() - 1);
				createMonth();
			}
		};
		
		const monthNext = function () {
			if (checkMonth(settings.date.getMonth() + 1)) {
				settings.date.setMonth(settings.date.getMonth() + 1);
				createMonth();
			}
		};
		
		const clearCalendar = function () {
			settings.month.innerHTML = '';
		};
		
		const createCalendar = function () {
			document.querySelector(settings.selector).innerHTML = [
				'<div class="m-calendar-header" data-calendar-area="header">',
				'<button type="button" class="m-calendar-btn" data-calendar-toggle="previous" aria-label="Previous Month"><svg height="24" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m16.31818,0.08789l2.5315,2.82932l-8.48797,9.08361l8.48797,9.08361l-2.5315,2.82932l-11.16838,-11.91293l11.16838,-11.91293z"> </path></svg></button>',
				'<h3 class="m-calendar-header__label" data-calendar-label="month" aria-live="polite">&nbsp;</h3>',
				'<button type="button" class="m-calendar-btn" data-calendar-toggle="next" aria-label="Next Month"><svg height="24" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m7.76675,23.79134l-2.57017,-2.79695l8.46643,-8.99558l-8.46643,-8.99558l2.49457,-2.79695l11.11219,11.79253l-11.0366,11.79253z"> </path></svg></button>',
				'</div>',
				'<div class="m-calendar-week" data-calendar-area="week" role="row"></div>',
				'<div class="m-calendar-body" data-calendar-area="month" role="row"></div>'
			].join('');
		};
		
		const setWeekDayHeader = function () {
			document.querySelector('[data-calendar-area="week"]').innerHTML = [
				'<span title="' + settings.weekday[0] + '" role="columnheader">' + settings.shortWeekday[0] + '</span>',
				'<span title="' + settings.weekday[1] + '" role="columnheader">' + settings.shortWeekday[1] + '</span>',
				'<span title="' + settings.weekday[2] + '" role="columnheader">' + settings.shortWeekday[2] + '</span>',
				'<span title="' + settings.weekday[3] + '" role="columnheader">' + settings.shortWeekday[3] + '</span>',
				'<span title="' + settings.weekday[4] + '" role="columnheader">' + settings.shortWeekday[4] + '</span>',
				'<span title="' + settings.weekday[5] + '" role="columnheader">' + settings.shortWeekday[5] + '</span>',
				'<span title="' + settings.weekday[6] + '" role="columnheader">' + settings.shortWeekday[6] + '</span>'
			].join('');
		};

		const getTimes = function (reset) {
			let times = [];

			if (reset === true) {
				return;
			}
			
			for (let timeSlot in settings.available_slots) {
				if (settings.available_slots.hasOwnProperty(timeSlot)) {
					let timeObject = settings.available_slots[timeSlot];
					let hours = String(timeObject.server_hour);
					let suffix = (hours >= 12) ? 'pm' : 'am';
					hours = (hours > 12) ? hours - 12 : hours;
					hours = (hours === '00' || hours === '0') ? 12 : hours;
					let createTime = hours + ':' + String(timeObject.server_min).padStart(2, '0') + ' ' + suffix;

					times.push(
						{
							day: timeObject.server_day,
							month: timeObject.server_month - 1,
							stamp: timeObject.unix_timestamp,
							time: createTime,
							year: timeObject.server_year
						}
					);
				}
			}
			return times;
		};
		
		const createTimeList = function (times) {
			settings.timeList.innerHTML = '';
			settings.submitDate.setAttribute('data-timestamp', '');
			settings.submitDate.setAttribute('disabled', '');
			times.forEach(function (slot) {
				const timeElem = document.createElement('button');
				let dateString = String(settings.months[slot.month] + ' ' + slot.day + ', ' + slot.year);
				
				timeElem.classList.add('m-clock__time');
				timeElem.setAttribute('type', 'button');
				timeElem.setAttribute('aria-label', dateString + ' at ' + slot.time);
				timeElem.setAttribute('data-time', slot.time);
				timeElem.setAttribute('data-date', dateString);
				timeElem.setAttribute('data-timestamp', slot.stamp);
				timeElem.textContent = slot.time;
				timeElem.setAttribute('tabindex', '-1');
				
				settings.timeList.append(timeElem);
			});
			setTimeout(function () {
				settings.timeList.querySelectorAll('button:not([disabled]):not([aria-hidden])')[0].focus();
				settings.timeList.querySelectorAll('button:not([disabled]):not([aria-hidden])')[0].setAttribute('tabindex', '0');
			}, 25);
			selectTime();
		};
		
		const getSiblings = function (elem) {
			let siblings = [];
			let sibling = elem.parentNode.firstChild;
			
			while (sibling) {
				if (sibling.nodeType === 1 && sibling !== elem) {
					siblings.push(sibling);
				}
				sibling = sibling.nextSibling
			}
			
			return siblings;
		};

		const selectTime = function () {
			const availableTimes = settings.timeList.querySelectorAll('button:not([disabled]):not([aria-hidden])');
			
			availableTimes.forEach(function (time) {
				time.addEventListener('click', function () {
					getSiblings(this).forEach(function (sibling) {
						sibling.classList.remove('is-selected');
						sibling.removeAttribute('aria-selected');
						sibling.setAttribute('tabindex', '-1');
					});
					this.classList.add('is-selected');
					this.setAttribute('aria-selected', 'true');
					this.setAttribute('tabindex', '0');
					settings.submitDate.removeAttribute('disabled');
					settings.submitDate.setAttribute('data-time', time.dataset.time);
					settings.submitDate.setAttribute('data-date', time.dataset.date);
					settings.submitDate.setAttribute('data-timestamp', time.dataset.timestamp);
					settings.submitDate.focus();
				}, false);
			});
			submitSelection();
		};
		
		const submitSelection = function () {
			settings.submitDate.addEventListener('click', function () {
				const actionButton = document.querySelector('[data-pickup-delivery-action]');
				const details = document.querySelector('[data-pickup-delivery-details]');
				const detailsTitle = document.querySelector('[data-pickup-delivery-details-title]');
				const selection = document.querySelector('[data-pickup-delivery-selection]');

				settings.dialog.querySelector('[data-scheduling-dialog-close]').click();
				actionButton.setAttribute('hidden', '');
				detailsTitle.textContent = shippingMethodType.charAt(0).toUpperCase() + shippingMethodType.slice(1) + ' Date/Time';
				selection.innerHTML = [
					'<svg height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path id="calendar_inner" d="m14,1l0,3l-3,0l0,-3l-6,0l0,3l-3,0l0,-3l-2,0l0,15l16,0l0,-15l-2,0zm1,14l-14,0l0,-9l14,0l0,9z"/><path id="calendar_tab1" d="m3,0l1,0l0,3l-1,0l0,-3z"/><path id="calendar_tab2" d="m12,0l1,0l0,3l-1,0l0,-3z"/></svg>' + this.dataset.date + '<br>',
					'<svg height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path id="clock_outer" d="m7,14c-3.86,0 -7,-3.14 -7,-7s3.14,-7 7,-7s7,3.14 7,7s-3.14,7 -7,7zm0,-13c-3.309,0 -6,2.691 -6,6s2.691,6 6,6s6,-2.691 6,-6s-2.691,-6 -6,-6z"/><path id="clock_inner" d="m11,7.5l-4,0a0.5,0.5 0 0 1 -0.5,-0.5l0,-5a0.5,0.5 0 0 1 1,0l0,4.5l3.5,0a0.5,0.5 0 0 1 0,1z"/></svg>' + this.dataset.time
				].join('');
				details.removeAttribute('hidden');
				Runtime_PickupDeliverySchedule_Reserve_MethodCode(shippingMethodCode, this.dataset.timestamp, function (response) {
				});
			})
		}
		
		const keyboardNavigation = function () {
			const nearestDay = function (day) {
				return openDays.reduce(function (p, n) {
					return Math.abs(p) > Math.abs(n - day) ? n - day : p;
				}, Infinity) + day;
			};
			const findButton = function (id) {
				return settings.month.querySelector('[data-index="' + id + '"]');
			};
			const changeFocus = function (section) {
				section.querySelectorAll('button:not([disabled]):not([aria-hidden])').forEach(function (sibling) {
					sibling.setAttribute('tabindex', '-1');
				});
			};
			const availableTimes = function (currentTime, prev) {
				let currentTimeFocus = currentTime;
				let focusableTimes = Array.from(settings.timeList.querySelectorAll('button:not([disabled]):not([aria-hidden])'));
				let totalTimes = focusableTimes.length;
				let timeIndex = focusableTimes.indexOf(currentTimeFocus);
				prev = prev ? prev : false;
				
				if (timeIndex < totalTimes - 1 && prev === false) {
					changeFocus(settings.timeList);
					focusableTimes[timeIndex + 1].focus();
					focusableTimes[timeIndex + 1].setAttribute('tabindex', '0');
				}
				if (timeIndex !== 0 && prev === true) {
					changeFocus(settings.timeList);
					focusableTimes[timeIndex - 1].focus();
					focusableTimes[timeIndex - 1].setAttribute('tabindex', '0');
				}
			}
			
			
			function handleKeyboard(keyEvent) {
				let current = openDays.indexOf(keyEvent.target.index);
				
				switch (keyEvent.code) {
					case "ArrowDown":
						if (keyEvent.target.closest('[data-calendar-area="month"]')) {
							changeFocus(settings.month);
							if (findButton(keyEvent.target.index + 7)) {
								findButton(keyEvent.target.index + 7).focus();
								findButton(keyEvent.target.index + 7).setAttribute('tabindex', '0');
							}
							else if (!findButton(keyEvent.target.index + 7)) {
								monthNext();
								findButton(keyEvent.target.index + 7).focus();
								findButton(keyEvent.target.index + 7).setAttribute('tabindex', '0');
							}
							else {
								monthNext();
							}
						}
						else if (keyEvent.target.closest('[data-clock-list]')) {
							keyEvent.preventDefault();
							availableTimes(keyEvent.target);
						}
						break;
					case "ArrowUp":
						if (keyEvent.target.closest('[data-calendar-area="month"]')) {
							changeFocus(settings.month);
							if (findButton(nearestDay(keyEvent.target.index - 7))) {
								findButton(nearestDay(keyEvent.target.index - 7)).focus();
								findButton(nearestDay(keyEvent.target.index - 7)).setAttribute('tabindex', '0');
							}
							else if (!findButton(keyEvent.target.index - 7)) {
								monthPrev();
								findButton(keyEvent.target.index - 7).focus();
								findButton(keyEvent.target.index - 7).setAttribute('tabindex', '0');
							}
							else {
								monthPrev();
							}
						}
						else if (keyEvent.target.closest('[data-clock-list]')) {
							keyEvent.preventDefault();
							availableTimes(keyEvent.target, true);
						}
						break;
					case "ArrowLeft":
						if (keyEvent.target.closest(settings.selector)) {
							changeFocus(settings.month);
							if (current - 1 >= 0 && findButton(openDays[current - 1])) {
								findButton(openDays[current - 1]).focus();
								findButton(openDays[current - 1]).setAttribute('tabindex', '0');
							}
							else {
								monthPrev();
								if (findButton(openDays[current - 1])) {
									findButton(openDays[current - 1]).focus();
									findButton(openDays[current - 1]).setAttribute('tabindex', '0');
								}
							}
						}
						else if (keyEvent.target.closest('[data-clock-list]')) {
							keyEvent.preventDefault();
							availableTimes(keyEvent.target, true);
						}
						break;
					case "ArrowRight":
						if (keyEvent.target.closest(settings.selector)) {
							changeFocus(settings.month);
							if (current + 1 < openDays.length && findButton(openDays[current + 1])) {
								findButton(openDays[current + 1]).focus();
								findButton(openDays[current + 1]).setAttribute('tabindex', '0');
							}
							else {
								monthNext();
							}
						}
						else if (keyEvent.target.closest('[data-clock-list]')) {
							keyEvent.preventDefault();
							availableTimes(keyEvent.target);
						}
						break;
					case "End":
						if (keyEvent.target.closest(settings.selector)) {
							changeFocus(settings.month);
							if (findButton(keyEvent.target.index + (6 - parseInt(keyEvent.target.dataset.day)))) {
								findButton(keyEvent.target.index + (6 - parseInt(keyEvent.target.dataset.day))).focus();
								findButton(keyEvent.target.index + (6 - parseInt(keyEvent.target.dataset.day))).setAttribute('tabindex', '0');
							}
							else if (!findButton(keyEvent.target.index + (6 - parseInt(keyEvent.target.dataset.day)))) {
								monthNext();
								findButton(keyEvent.target.index + (6 - parseInt(keyEvent.target.dataset.day))).focus();
								findButton(keyEvent.target.index + (6 - parseInt(keyEvent.target.dataset.day))).setAttribute('tabindex', '0');
							}
						}
						break;
					case "PageUp":
						if (keyEvent.target.closest(settings.selector)) {
							monthPrev();
						}
						break;
					case "PageDown":
						if (keyEvent.target.closest(settings.selector)) {
							monthNext();
						}
						break;
				}
			}
	
			document.addEventListener('keydown', function (keyEvent) {
				handleKeyboard(keyEvent);
			}, false);
		};
		
		this.init = function () {
			createCalendar();
			settings.button_prev = document.querySelector('[data-calendar-toggle="previous"]');
			settings.button_next = document.querySelector('[data-calendar-toggle="next"]');
			settings.month = document.querySelector('[data-calendar-area="month"]');
			settings.month_label = document.querySelector('[data-calendar-label="month"]');
			
			settings.date.setDate(1);
			createMonth();
			setWeekDayHeader();
			settings.button_prev.addEventListener('click', monthPrev);
			settings.button_next.addEventListener('click', monthNext);
			keyboardNavigation();
			getTimes(true);
		};
		
		this.destroy = function () {
			settings.button_prev.removeEventListener('click', monthPrev);
			settings.button_next.removeEventListener('click', monthNext);
			document.removeEventListener('click', keyboardNavigation);
			clearCalendar();
			document.querySelector(settings.selector).innerHTML = '';
			settings.times.setAttribute('hidden', '');
			settings.timeMessage.removeAttribute('hidden');
		};
		
		this.reset = function () {
			this.destroy();
			this.init();
		};
		
		this.init();
	}
	
	window.Calendar = Calendar;
});