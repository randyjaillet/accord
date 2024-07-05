
/* Keep track of our instantiated Accords in case
we need to manipulate them later */
window.accords = [];

class Accord {
	settings; 	// Parsed options
	i; 			// Index of this instance

	a;          // The scope element
	items;
	headings;
	panels;

	// SECTION Constructor

	constructor($a, options) {

		//
		// ANCHOR Settings
		//

		/* If there are no options, create an empty object
		so we can still use it in the extend code below. */
		options = options || {};

		/* If options is a string (as it is when taken from
		an HTML attribute), parse it into an object. */
	 	typeof options == "string" && (options = JSON.parse(options));

		/* Settings can be set here as defaults or at
		instantiation by passing an object of the
		values you wish to set as the second
		argument. Any options set at instantiation
		in this manner will overwrite these
		defaults for the instantiated Accord. */
		this.settings = $.extend(
			{
				independentPanels: true, // bool: Set to false to force closing other panels when one is activated.
				autoScroll: true, // bool: Set to false to disable automatic scrolling to activated panels.
				itemSelector: ".accord-item", // str: Selector of the parent wrapper of each accordion section. Should be a full selector, ie, ".accordionItem" or "ul > li". This selector will only be used within the context of the individual accordion.
				headingSelector: ".accord-heading", // str: Selector of the panel heading into which the generated togglers will be injected. Should be a full selector, ie, ".injectionTarget" or "li > h3". This selector will only be used within the context of the individual accordion.
				panelSelector: ".accord-panel" // str: Selector of the area to be revealed/hidden. Should be a full selector, ie, ".collapsibleRegion" or "h3 + div". This selector will only be used within the context of the individual accordion.
			},
			options
		);


		//
		// ANCHOR Storage array
		//

		/* If this select is already instantiated as
		an Accord, destroy the old one and
		reinstantiate. The new instance will
		replace the old one in its location in
		the window's accords array.
		Otherwise, push it as a new one onto the
		end of the array. */
		let alreadyInstantiatedIndex = -1;

		$.each(
			window.accords,
			(_i, v) => {
				v && v.$a.is(self.$a) && (alreadyInstantiatedIndex = $.inArray(v, window.accords));
			}
		);

		if (alreadyInstantiatedIndex >= 0) {
			window.accords[alreadyInstantiatedIndex].destroy(true);
			window.accords[alreadyInstantiatedIndex] = this;
		} else {
			const firstUndefinedIndex = window.accords.findIndex(element => element === undefined);
			if (firstUndefinedIndex >= 0) {
				window.accords[firstUndefinedIndex] = this;
			} else {
				window.accords.push(this);
			}
		}


		//
		// ANCHOR Global properties
		//

		this.a = $a;
		this.i = $(window.accords).index(this);
		this.items = this.a.find(this.settings.itemSelector);
		this.headings = this.a.find(this.settings.headingSelector);
		this.panels = this.a.find(this.settings.panelSelector);


		//
		// ANCHOR Markup
		//

		// Why are we measuring again after one second? Custom fonts popping in
		// can change the length of text and thus the height of the panels.
		// REVIEW More elegant way to do this?
		this.#measurePanels(this.panels);
		setTimeout(
			() => {
				this.#measurePanels(this.panels);
			}, 1000
		);

		Accord.#injectChevrons(this.headings);
		this.headings.attr("tabindex", "0");


		//
		// ANCHOR Event Handling
		//

		this.a.on(
			"click",
			this.settings.headingSelector,
			e => {
				const $panel = $(e.target.closest(this.settings.headingSelector)).next(this.settings.panelSelector);
				this.togglePanel($panel);
			}
		);

		$(window).on(
			"resize",
			$.throttle(
				500,
				() => {
					this.#measurePanels(this.panels);
				}
			)
		);

		this.a.on(
			"keydown",
			this.settings.headingSelector,
			e => {

				/* SPACE */
				if (e.which == 32 || e.which == 13) {
					e.preventDefault();
					this.togglePanel($(e.target).nextAll(this.settings.panelSelector));
				}

			}
		);


	} // !SECTION



	// SECTION Methods


	togglePanel ($panel) {
		$panel.hasClass("revealed") ? this.hidePanels($panel) : this.showPanels($panel);
	}


	showPanels ($panels, instantly = false) {

		$panels.each(
			(_ix, panel) => {
				const
					$panel = $(panel),
					toHeight = $panel.data("actual-height")
				;

				if (!instantly) {

					if (!this.settings.independentPanels) {
						this.hidePanels(this.panels.filter(".revealed"));
					}

					$panel.css(
						{
							"height": toHeight
						}
					);

					// Force redraw so browsers don't skip the transition
					window.getComputedStyle($panel.get(0)).top;

					$panel.removeClass("concealed");
					$panel.addClass("revealed");

					$panel.on(
						"transitionend",
						e => {
							if (e.originalEvent.propertyName == "opacity") {
								$panel.off("transitionend");
								$panel.removeAttr("style");
							}
						}
					);

				} else {
					const $item = $panel.closest(this.settings.itemSelector);
					$item.addClass("insta-trans");
					$panel.removeClass("concealed");
					// Force redraw so browsers don't skip the transition
					window.getComputedStyle($panel.get(0)).top;
					$panel.addClass("revealed");
					// Force redraw so browsers don't skip the transition
					window.getComputedStyle($panel.get(0)).top;
					$item.removeClass("insta-trans");
				}

			}
		)



	};


	hidePanels ($panels, instantly = false) {

		$panels.each(
			(_ix, panel) => {

				const
					$panel = $(panel),
					fromHeight = $panel.data("actual-height")
				;

				if (!instantly) {

					$panel.removeClass("revealed");

					// Force redraw so browsers don't skip the transition
					window.getComputedStyle($panel.get(0)).top;

					$panel.css(
						{
							"height": fromHeight
						}
					);

					// Force redraw so browsers don't skip the transition
					window.getComputedStyle($panel.get(0)).top;

					$panel.addClass("concealed");

					// Force redraw so browsers don't skip the transition
					window.getComputedStyle($panel.get(0)).top;

					$panel.on(
						"transitionend",
						e => {
							if (e.originalEvent.propertyName == "height") {
								$panel.off("transitionend");
								$panel.removeAttr("style");
							}
						}
					);

				} else {
					const $item = $panel.closest(this.settings.itemSelector);
					$item.addClass("insta-trans");
					// Force redraw so browsers don't skip the transition
					window.getComputedStyle($panel.get(0)).top;
					$panel.removeClass("revealed");
					// Force redraw so browsers don't skip the transition
					window.getComputedStyle($panel.get(0)).top;
					$panel.addClass("concealed");
					// Force redraw so browsers don't skip the transition
					window.getComputedStyle($panel.get(0)).top;
					$item.removeClass("insta-trans");
				}

			}
		);

	};


	scrollToPanel($panel) {

		 // Stop the automatic scroll effect if user scrolls
		 // manually to avoid an epic battle of wills between
		 // user and scrollbar (and an upleasant stutter)
		$('html, body').on(
			 "scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove",
			 () => {
				  $('html, body').stop();
			 }
		);

		$('html, body').stop().animate(
			 {
				 scrollTop: $panel.offset().top - $(window).height() * .1
			 },
			 500,
			 () => {
				  $('html, body').off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
			 }
		);

	};


	static #injectChevrons($headings) {
		$headings.append($(`<svg class="accord-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`));
	}


	#measurePanels($panels) {
		$panels.each(
			(_ix, panel) => {
				const
					$panel = $(panel),
					wasRevealed = $panel.hasClass("revealed")
				;
				!wasRevealed && this.showPanels($panel, true);
				$panel.data("actual-height", $panel.outerHeight());
				!wasRevealed && this.hidePanels($panel, true);
			}
		)
	}
	
	
	// !SECTION

}







//
// Instantiation
//

/* Plugin for ease of instantiation.
Priority is on options passed in
argument followed by those in HTML
attribute. */
$.fn.accord = function (options) {

    return this.each(
    	function() {

			const
				attrSetts = $(this).data("accord-options"),
				attrSettsAsJSON = attrSetts && typeof attrSetts == "string" ? JSON.parse(attrSetts) : attrSetts,
				extendedSetts = $.extend(attrSettsAsJSON, options)
			;

			new Accord($(this), extendedSetts);

		}
	);

};


/* Auto-instantiation based on HTML
attributes */
$(
	function () {
		$("[data-accord]").each(
			function () {
				$(this).accord();
			}
		);		
	}
);