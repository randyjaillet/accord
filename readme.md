# Accord - jQuery-dependant Accordion Plugin

Accord is a jQuery plugin for creating adjascent collapsible regions. It uses only CSS transitions, no JS/jQuery ones.

## Usage

Accord provides several instantiation options.

### Direct Instantiation With `new`

You can use the "new" keyword to create an instance of the `Accord` class:
```
new Accord($(".selector"));
```

### jQuery plugin

Accord also adds the `accord` jQuery plugin:
```
$(".selector").accord();
```

### Data Attribute

Accord will automatically instantiate any nodes possessing the `data-accord` attribute:
```
<div data-accord>
...
</div>
```

## Options

* `independentPanels`: Bool - Set to false to force closing other panels when one is activated. Default: true
* `autoScroll`: Bool - Set to false to disable automatic scrolling to activated panels. Default: true
* `itemSelector`: Str - Selector of the parent wrapper of each accordion section. Should be a full selector, ie, "ul > li". This selector will only be used within the context of the individual accordion. Note that if you customize this you will also have to ensure your CSS selectors are correct. Default: ".accord-item"
* `headingSelector`: Str - Selector of the panel heading into which the generated togglers will be injected. Should be a full selector, ie, "li > h3". This selector will only be used within the context of the individual accordion. Note that if you customize this you will also have to ensure your CSS selectors are correct. Default: ".accord-heading"
* `panelSelector`: Str - Selector of the area to be revealed/hidden. Should be a full selector, ie, "h3 + div". This selector will only be used within the context of the individual accordion. Note that if you customize this you will also have to ensure your CSS selectors are correct. Default: ".accord-panel"

### Approaches

An object of options can be passed as an argument:
```
new Accord(
	$(".selector"),
	{
		"independentPanels": false
	}
);
```
```
$(".selector").accord(
	{
		"independentPanels": false
	}
);
```

You can also set options via an HTML attribute. It should be valid JSON within the attribute string:
```
<div data-accord-options='{"independentPanels": false}'>
...
</div>
```
Options set this way will take priority over those set via the constructor to support the use case of instantiating globally on a selector with default settings and also being able to override those settings on individual elements.