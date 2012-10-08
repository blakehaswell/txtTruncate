// txtTruncate - a jQuery plugin to truncate text
// version 1.1.0
// https://github.com/blakehaswell/txtTruncate
//
// Copyright (c) 2011-2012 Blake Haswell
// Licensed under the MIT license: http://opensource.org/licenses/MIT
(function ($) {

    "use strict";


    // Constructor
    function Truncator(elem, options) {

        this.$elem      = $(elem);
        this.lineHeight = this._getLineHeight();
        this.origHeight = this.$elem.height();
        this.origTxt    = this.$elem.text();

        // Override default settings with passed options (if any)
        this.settings   = $.extend({}, this._defaults, options || {});

        this._setLines();

        this.truncate();

        // Text should be truncated whenever the window is resized so that it
        // works as expected on fluid layouts
        // FIXME: This is disabled as it leads to infinite firing and thus lag on IE. It should be timeout bound anyway.
        // $(window).bind("resize", $.proxy(this.truncate, this));
    }


    Truncator.prototype = {

        /**
         * If the element doesn't fit in the specified number of lines then we
         * collapse the element to the desired height and truncate the text.
         */
        hide: function () {
            if (this._getCurrentLines() > this.settings.lines) {
                this.$elem.animate({
                    height: this.lineHeight * this.settings.lines
                }, $.proxy(this.truncate, this));
            }
        },

        /**
         * Restores the element's original text and expands the element to take
         * up the required space.
         */
        show: function () {

            // Set the element's height to the current height to stop it from
            // getting bigger when we restore the original text
            this.$elem.height(this.$elem.height());

            this._restoreOrigTxt();
            this.$elem.animate({
                height: this.origHeight
            });

        },

        /**
         * Removes characters from the element until it fits in the specified
         * number of lines.
         */
        truncate: function () {

            // Prepare the element before calculating the lines
            this._prepareElem();

            var currTxt      = this._restoreOrigTxt(),
                origTxtLines = this._getCurrentLines(),
                charsPerLine = Math.round(currTxt.length / origTxtLines),
                charsPerHalfLine = Math.round(charsPerLine / 2);

            // Only continue to truncate if we have more lines than we want
            if (origTxtLines > this.settings.lines) {

                // If we have way more lines than we want take a guess at how
                // much to cull
                if (origTxtLines > this.settings.lines + 1) {

                    // Given our charsPerLine value, truncate text so it's about
                    // 1 line too tall
                    currTxt = this._truncateElementTxt((this.settings.lines + 1) * charsPerLine);

                    // If we still have way too many lines then keep removing
                    // half a line of text until we only have 1 line more than
                    // we want
                    while (this._getCurrentLines() > this.settings.lines + 1) {
                        currTxt = this._truncateElementTxt(currTxt.length - charsPerHalfLine);
                    }

                }

                // Take off 1 character at a time until we have the number of
                // lines we want.
                while (this._getCurrentLines() > this.settings.lines) {

                    // Due to potential weirdness where height() and lineHeight produce different values even for one line, we need to stop infinite loops.
                    // If we're down to half a line and still truncating, something has gone wrong.
                    if (currTxt.length == charsPerHalfLine) {
                        this._recoverFromLoop(currTxt);
                        break;
                    }

                    // Otherwise, truncate.
                    currTxt = this._truncateElementTxt(currTxt.length - 1);
                }
            }

            this._restoreElem();

        },

        /**
         * The default settings to use if no `options` argument is provided when
         * instantiating the Truncator.
         */
        _defaults: {
            end   : "…",
            lines : null
        },

        /**
         * Get the line height, if we're in IE and there's no unit of measurement convert it to a %
         * so jQuery can calculate the right px value and IE doesn't explode.
         */
        _getLineHeight : function () {
            var ieVal = null;

            // check if IE's 'currentStyle' is available
            if (document.body.currentStyle) {

                // get the line height as IE reports it - note % are converted to pt
                ieVal = this.$elem.get(0).currentStyle.lineHeight;

                // if there's no unit of measurement
                if (!ieVal.match(/px|PX|pt|PT|em|EM/)) {

                    // set the lineHeight to an equivalent % so that IE reports a value
                    // jQuery can work with
                    this.$elem.css("line-height", (ieVal * 100) + "%");
                }
            }

            return parseInt(this.$elem.css("line-height"), 10);
        },

        /**
         * Determines how many "lines" the element takes up (based on
         * its height).
         */
        _getCurrentLines: function () {
            return Math.round(this.$elem.height() / this.lineHeight);
        },

        /**
         * Prepares the element to be manipulated by the truncate method by
         * removing CSS properties which influence height.
         *
         * TODO Call at the start of the truncate method and reset properties to their original value at the end?
         */
        _prepareElem: function () {

            // Store the original CSS values so we can restore them later
            this.css = {
                height    : $.style(this.$elem, "height") || "auto",
                maxHeight : this.$elem.css("max-height"),
                minHeight : this.$elem.css("min-height")
            };

            // Remove CSS values which influence the height of the element
            this.$elem.css({
                height    : "auto",
                maxHeight : "none",
                minHeight : 0
            });
        },

        /**
         * Helps recover from infinite loops brought on by stupid discrepancies between height and line-height.
         * @param string currTxt The currently displayed text.
         */
        _recoverFromLoop: function(currTxt){

            // Grab the current height of the element (which should be the 'ideal' height).
            var height = this.$elem.height();
            var maxLength = this.origTxt.length;

            // Now keep adding characters back until the height changes, or alternatively, we've restored all the characters.
            while (height == this.$elem.height() && currTxt.length < maxLength) {
                currTxt = this._truncateElementTxt(currTxt.length + 1);
            }

            // If the height actually changed, take off the last character we added.
            if (this.$elem.height() != height) {
                this._truncateElementTxt(currTxt.length - 1);
            }

            // If we wound up displaying everything, drop the ...
            if (currTxt.length == maxLength) {
                this._restoreOrigTxt();
            }
        },

        /**
         * Restores the element's original styles.
         */
        _restoreElem: function () {
            this.$elem.css(this.css);
        },

        /**
         * Restores the element's original text. Return value is the
         * original text.
         */
        _restoreOrigTxt: function () {
            this.$elem.text(this.origTxt);
            return this.origTxt;
        },

        /**
         * If a number of lines hasn't been defined in the settings then we set
         * the lines based on the element's `max-height` or, failing that,
         * default to 1 line.
         */
        _setLines: function () {

            // If a maximum number of lines hasn't been defined then we
            // calculate it
            if (!this.settings.lines) {

                // If the element's max-height is greater than its line-height
                // we use that to calculate the number of lines
                var maxHeight = parseInt(this.$elem.css("max-height"), 10);

                if (maxHeight > this.lineHeight) {
                    this.settings.lines = Math.floor(maxHeight / this.lineHeight);
                }

                // Otherwise we'll just assume that we want to truncate to
                // 1 line
                else {
                    this.settings.lines = 1;
                }

            }

        },

        /**
         * Given a `length`, this method truncates the element's text to that
         * length and adds the prepends the `end` string.
         *
         * Returns the truncated text (not including the `end` string).
         */
        _truncateElementTxt: function (length) {
            var txt = this.origTxt.substring(0, length);
            this.$elem.text(txt + this.settings.end);
            return txt;
        }

    };


    // jQuery plugin
    $.fn.txtTruncate = function (options) {
        return this.each(function () {
            $(this).data("truncator", new Truncator(this, options));
        });
    };


}(jQuery));