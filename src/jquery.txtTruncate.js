// txtTruncate - a jQuery plugin to truncate text
// version 1.0.1
// https://github.com/blakehaswell/txtTruncate
//
// Copyright (c) 2011-2012 Blake Haswell
// Licensed under the MIT license: http://opensource.org/licenses/MIT
(function ($) {
    
    "use strict";

    $.fn.txtTruncate = function (options) {
    
        // Default settings
        var settings = {
            end: "...",
            lines: null
        };
        
        // Iterate over matching elements
        return this.each(function () {
        
            // If we have any options then merge them with our default settings
            if (options) {
                $.extend(settings, options);
            }
            
            // Set up variables
            var $element = $(this),
                lineHeight = parseInt($element.css("line-height"), 10),
                origTxt = $element.text(),
                charsPerLine,
                currentLines,
                currTxt,
                maxHeight;
            
            // Works out how many lines the element currently takes up
            function getCurrentLines() {
                return Math.ceil($element.height() / lineHeight);
            }
            
            // Truncates the element at length characters
            function truncateElementTxt(length) {
                currTxt = origTxt.substring(0, length);
                $element.html(currTxt + settings.end);
            }
            
            // Removes characters from the element until it fits into the desired space
            function truncate() {
                
                // Put the original text back into the element
                $element.html(origTxt);
                currTxt = origTxt;
                
                // Only continue to truncate if we have more lines than we want
                if ((currentLines = getCurrentLines()) > settings.lines) {
                    
                    // If we have way more lines than we want take a guess at how much to cull
                    if (currentLines > settings.lines + 1) {
                    
                        // Work out how many characters in a 'line' and truncate text so it's only about 1 line too tall
                        charsPerLine = Math.round(origTxt.length / currentLines);
                        truncateElementTxt((settings.lines + 1) * charsPerLine);
                    
                        // If we still have way too many lines then keep removing half a line of text until we only have 1 line more than we want
                        while ((currentLines = getCurrentLines()) > settings.lines + 1) {
                            truncateElementTxt(currTxt.length - Math.round(charsPerLine / 2));
                        }
                        
                    }
                    
                    // Take off 1 character at a time until we have the number of lines we want
                    while ((currentLines = getCurrentLines()) > settings.lines) {
                        truncateElementTxt(currTxt.length - 1);
                    }
                }
            }
            
            // If a maximum number of lines hasn't been defined then we calculate it
            if (!settings.lines) {
                
                // If the element's max-height is greater than its line-height we use that to calculate the number of lines
                maxHeight = parseInt($element.css("max-height"), 10);
                if (maxHeight > lineHeight) {
                    settings.lines = Math.floor(maxHeight / lineHeight);
                }
                
                // Otherwise we'll just assume that we want to truncate to 1 line
                else {
                    settings.lines = 1;
                }
                
            }
            
            // Remove any CSS attributes influencing the height of the element
            $element.css({
                height: "auto",
                maxHeight: "none",
                minHeight: 0
            });
            
            // Trigger the truncate function on page resize
            $(window).bind("resize", truncate);
            
            // Trigger the truncate function
            truncate();
            
        });

    };
    
}(jQuery));