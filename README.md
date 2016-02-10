Accordionate
============

A jQuery plugin for creating collapsible accordion structures.

This is a jQuery plugin that turns a wrapper into an accordion. Accordions allow for collapsing of sections of content. Accordions are helpful for compressing a great deal of information into a small space and allowing users to focus on the topics they care about.

Usage
---------

###Includes

* Include the jQuery and accordionate scripts:

  ```
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script src="js/jquery.accordionate.js"></script>
  ```

* Initialize `accordionate()` on the parent of the accordion panels:

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

The scope of these selectors is the parent element the plugin is initialized on, so you don't have to worry about your selectors matching elements outside of the accordion.

####Active Class

The class that is applied to accordion items when their panels are activated is "active" by default. This can be customized via the `activeClass` option:

```
$(".accordion").accordionate({
    activeClass: "current"
});
```

####Toggler Class

Accordionate creates and injects the anchor tags that function as the accordion togglers if they aren't present. By default, these `<a>` tags have the class `toggler`. This can be customized with the `togglerClass` option.

```
$(".accordion").accordionate({
    togglerClass: "mrclicky"
});
```

###Interdependent panels

Disable the ability to have multiple panels open at the same time by setting the `independentPanels` option to `false`:

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