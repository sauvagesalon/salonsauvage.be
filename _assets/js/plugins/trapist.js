(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.trappist = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

    'use strict';

    //
    // Variables
    //

    var trappist = {}; // Object for public APIs
    var supports = 'querySelector' in document && 'fetch' in window && 'addEventListener' in root && 'classList' in document.createElement('_'); // Feature test
    var settings;

    // Default settings
    var defaults = {
        selector: 'nav a',
        containerSelector: 'main',
        activeClass: 'active',
        initClass: 'js-trappist',
        callback: function () {}
    };


    //
    // Methods
    //

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    var extend = function () {

        // Variables
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for ( var prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = buoy.extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;

    };

    /**
     * Get the closest matching element up the DOM tree.
     * @private
     * @param  {Element} elem     Starting element
     * @param  {String}  selector Selector to match against
     * @return {Boolean|Element}  Returns null if not match found
     */
    var getClosest = function ( elem, selector ) {

        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }

        // Get closest match
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( elem.matches( selector ) ) return elem;
        }

        return null;

    };

    /**
     * Fetch and show a html page
     * @public
     * @param  {String} path
     */
    trappist.changePage = function (link) {

        var main = document.querySelector(settings.containerSelector);
        var title = document.querySelector('title');

        fetch(link.href)
        .then((res) => {
            return res.text();
        })
        .then((data) => {
            return trappist.getPageData(data);
        })
        .then((page) => {
            title.innerHTML = page.title;
            main.innerHTML = '';
            main.appendChild(page.main);
            history.pushState({ url: link.href }, page.title, link.href);
            document.querySelector(settings.selector + '.' + settings.activeClass).classList.remove(settings.activeClass);
            link.classList.add(settings.activeClass);
        });
    }


    trappist.getPageData = function (html) {
         var page = document.implementation.createHTMLDocument("page");
         page.documentElement.innerHTML = html;

        return {
            main: page.querySelector('main'),
            title: page.title
        }

    }


    /**
     * Handle click event methods
     * @private
     */
    var eventHandler = function (event) {
        var link= getClosest(event.target, settings.selector);
        if ( link ) {
            // Prevent default click event
            if ( link.tagName.toLowerCase() === 'a') {
                event.preventDefault();
            }
            // Change path
            trappist.changePage(link);
        }
    };

    /**
     * Destroy the current initialization.
     * @public
     */
    trappist.destroy = function () {
        if ( !settings ) return;
        document.documentElement.classList.remove( settings.initClass );
        document.removeEventListener('click', eventHandler, false);
        settings = null;
    };

    /**
     * Initialize Trappist
     * @public
     * @param {Object} options User settings
     */
    trappist.init = function ( options ) {

        // feature test
        if ( !supports ) return;

        // Destroy any existing initializations
        trappist.destroy();

        // Selectors and variables
        settings = extend( defaults, options || {} ); // Merge user options with defaults

        // Listeners and methods
        document.documentElement.classList.add( settings.initClass ); // Add class to HTML element to activate conditional CSS
        document.addEventListener('click', eventHandler, false); // Listen for click events and run event handler

    };


    //
    // Public APIs
    //

    return trappist;

});
