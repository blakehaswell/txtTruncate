txtTruncate - a jQuery plugin to truncate text
==============================================

txtTruncate is a jQuery plugin which will truncate the text in elements so that it only takes up the desired number of lines. The plugin recalculates the truncation every time the window is resized, so this plugin works perfectly with liquid layouts or on mobile phones (try changing the orientation on an iPhone).

The plugin accepts an options object so you can overwrite the default behaviour. The available options are:

*	**end**

	The end option defines the string that is added to the end of the element's truncated text. You can add HTML here if you like.
	
	The default value is: **"..."**
	
*	**lines**

	The lines option defines the maximum number of lines that the element's text may take up.
	
	The default value is **null**
	
	If lines is set to null then the plugin will check to see if the element has the `max-height` CSS property defined. If it does then it will limit the number of lines so that the text fits within that `max-height`. If no `max-height` is found then the text is limited to a single line.

Examples
--------

Basic usage:

	$("#example").txtTruncate();

Defining options:

	var options = {
		end: "... <strong>Read more</strong>",
		lines: 3
	};
	$("#example").txtTruncate(options);

Dev Notes
---------

Minified version created using [Google's Closure Compiler](http://closure-compiler.appspot.com/).

Changelog
---------

### Version 1.0 - 3 June, 2011

*	Added CSS reset for min-height
*	Added README
*	Added examples of use
*	Added support for HTML in the settings.end string
*	Fixed bug with variable name currTxt being referred to as currText in truncateElementTxt function
*	Added source code (development and minified versions)