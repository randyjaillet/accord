/* RJ 2.14.2014
** 
** Turns an element into an accordion with sections that hide and reveal when 
** corresponding togglers are clicked.
** 
** Element selectors are relative to the element .accordionate() is initialized on
** and will not match descendants within the panels, only direct children.
**
** .accordionate should be called on a parent container of the accordion elements.
** 
** Options are explained inline below.
** 
** Default option set expects the following markup structure:
**
**      .accordion
**          li
**              .heading
**              .panel
**          li
**              .heading
**              .panel
**
** Example with customized class names and selectors:
**
**      #expandocollapser
**          section
**              h3
**              div
**          section
**              h3
**              div
** 
**      $("#expandocollapser").accordionate({
**          itemSelector: "section",
**          headingSelector: "h3"
**          panelSelector: "h3 + div",
**      });
*/

$.fn.accordionate = function(options) {

    /* ----- Settings ----- */

    var defaultOptions = {
        independentPanels: true, // bool: Set to false to force closing other panels when one is activated.
        autoScroll: true, // bool: Set to false to disable automatic scrolling to activated panels.
        activeClass: "active", // str: The class that is applied to activated items. Not a full selector, so do not include a dot (.).
        togglerClass: "toggler", // str: The class that is applied to the generated A toggler. Not a full selector, so do not include a dot (.).
        itemSelector: "li", // str: Selector of the parent wrapper of each accordion section. Should be a full selector, ie, ".accordionItem" or "ul > li". This selector will only be used within the context of the individual accordion.
        headingSelector: ".heading", // str: Selector of the panel heading into which the generated togglers will be injected. Should be a full selector, ie, ".injectionTarget" or "li > h3". This selector will only be used within the context of the individual accordion.
        panelSelector: ".panel", // str: Selector of the area to be revealed/hidden. Should be a full selector, ie, ".collapsibleRegion" or "h3 + div". This selector will only be used within the context of the individual accordion.
    };
    var settings = $.extend({}, defaultOptions, options);

    // Initialize: hide all panels.
    $(settings.panelSelector, this).hide();



    /* ----- The magic ----- */

    return this.each(
    	function() {

			// Attach handler for the toggler clicks. We'll use event delegation since the
			// togglers may be dynamically injected; plus, with ED, we only have to do this
			// once per accordion rather than per accordion item.
		    $(this).on(
			    "click",
			    $("." + settings.togglerClass),
			    function(e) {
	                e.preventDefault();
	
	                // The parent item that wraps both the toggler and
	                // the panel. This is what we attach the active state to.
	                var $parentItem = $(e.target).closest(settings.itemSelector);
	
	                // item is active ? deactivate it : activate it.
	                if ($parentItem.hasClass(settings.activeClass)) {
	                    deactivateItems($parentItem);
	                } else {
	                    activateItems($parentItem);
	
	                    // If the independentPanels setting is set to false,
	                    // we need to close any currently open panels.
	                    if (!settings.independentPanels) {
	                        var $itemsToDeactivate = $parentItem
	                                .siblings(settings.itemSelector)
	                                .filter("." + activeClass);
	                        deactivateItems($itemsToDeactivate);
	                    }
	                }
	            }
		    );

			// Make sure every accordion item has an anchor for toggling the panel
			$(this).children(settings.itemSelector).each(
				function (i,e) {

					var existingAnchor = $(this).children(settings.headingSelector).children("a");

					// If the panel heading is already linked, go ahead and use the
					// existing anchor, adding the togglerClass if necessary.
					// Otherwise, create and inject one ourselves.
					if (existingAnchor.length) {
						if (!existingAnchor.hasClass(settings.togglerClass)) {
							existingAnchor.addClass(settings.togglerClass);
						}
					} else {
			            $(settings.headingSelector, this).wrapInner(createToggler());
				    }
				   
				}
				
			);

    	}
    );



    /* ----- Helpers  ----- */

    function activateItems ($items) {
        $items.addClass(settings.activeClass);
        var $panelsToShow = getPanelsByItems($items);
        showPanels($panelsToShow);
    }

    function deactivateItems ($items) {
        $items.removeClass(settings.activeClass);
        var $panelsToHide = getPanelsByItems($items);
        hidePanels($panelsToHide);
    }

    function showPanels ($panels) {
        $panels.slideDown(function() {
            if (settings.autoScroll) {
                scrollToPanel($panels.eq(0));
            }
        });
    };

    function hidePanels ($panels) {
        $panels.slideUp();
    };

    function createToggler() {
        return $("<a></a>", {
            href: "#",
            class: settings.togglerClass
        });
    };

    function getPanelsByItems($items) {
        return $items.find(settings.panelSelector);
    };

    function scrollToPanel($panel) {

	    // Stop the automatic scroll effect if user scrolls
	    // manually to avoid an epic battle of wills between
	    // user and scrollbar (and an upleasant stutter)
        $('html, body').on(
	        "scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove",
	        function (e) {
		        $('html, body').stop();
	        }
        );

        $('html, body').stop().animate(
	        {
	            scrollTop: $panel.offset().top - $(window).height() * .1
	        },
	        750,
	        function () {
		        $('html, body').off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
	        }
        );

    };
 
};