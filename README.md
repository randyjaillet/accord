Accordionate
============

A jQuery plugin for creating collapsible accordion structures with options.

This is a jQuery plugin that turns a wrapper into an accordion. Accordions are groups (hereafter called "items") of sections of content (hereafter called "panels") that are individually collapsible. Accordions are helpful for compressing a great deal of information into a small space and allowing users to focus on the topics they care about.

Usage
---------

###Includes

* Include the jQuery and accordionate scripts:
  ```
  <script src="http://code.jquery.com/jquery-latest.min.js"></script>
  <script src="js/accordionate-1.21.min.js"></script>
  ```
* Initialize `accordionate()` on a common ancestor of the accordion panels:
  ```
  $(".accordion").accordionate();
  ```

###Markup Structure

The default configuration of the script assumes the following markup structure:

* .accordion
  * li
    * .heading
    * .panel
  * li
    * .heading
    * .panel
  * ...
  
For example:

```
<div class="accordion">
    <li>
        <h3 class="heading">Heading 1</h3>
        <div class="panel">Panel 1 content</div>
    </li>
    <li>
        <h3 class="heading">Heading 2</h3>
        <div class="panel">Panel 2 content</div>
    </li>
</div>
```

##Options

###Classes

The default markup structure can be customized by passing selector strings to accordionate using the `itemSelector`, `headingSelector`, and `panelSelector` options:

```
$(".collapsospander").accordionate({
    itemSelector:    "section",
    headingSelector: "section > h5",
    panelSelector:   "h5 + div"
});
```
```
<div class="collapsospander">
    <section>
        <h5>Heading 1</h5>
        <div>Panel 1 content</div>
    </section>
    <section>
        <h5>Heading 2</h5>
        <div>Panel 2 content</div>
    </section>
</div>
```

The scope of these selectors is the parent element the plugin is called upon, so you don't have to worry about your selectors matching elements outside the accordion.

####Active Class

The class that is applied to accordion items when their panels are activated is "active" by default. This can be customized via the `activeClass` option:

```
$(".accordion").accordionate({
    activeClass: "current"
});
```

####Generated Toggler Class

For the sakes of graceful degredation and progressive enhancement, the accordionate script creates and injects the anchor tags that function as the accordion togglers. By default, these `<a>` tags have the class `toggler`. This can be customized with the `generatedTogglerClass` option.

```
$(".accordion").accordionate({
    generatedTogglerClass: "mrclicky"
});
```

###Interdependent panels

Disabling users' opening multiple sibling panels simultaneously by setting the `independentPanels` option to `false`:

```
$(".accordion").accordionate({
    independentPanels: false
});
```

###Auto-scroll

Set `autoScroll` to `false` to disable the automatic scroll-to-panel effect.

```
$(".accordion").accordionate({
    autoScroll: false
});
```

###Item state indicators

Item state indicators are pieces of HTML that are injected into the generated togglers, which are (by default) injected into the accordion headings. Typically, this bit of custom HTML is used to create "state indicators" which can be styled with CSS to reflect the activated states of accordion items. By default, the item state indicators that are injected are empty span tags with the class indicator. This HTML can be customized with the itemStateIndicator option.

```
$(".accordion").accordionate({
    itemStateIndicator: "<i>\25BC</i>"
});
```
