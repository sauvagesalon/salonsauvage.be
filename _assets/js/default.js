//= require js/plugins/astro.min.js
//= require js/plugins/stickynav.js
//= require js/plugins/lazysizes.min.js

// Dropdown menu
astro.init();

// Sticky navigation
var stickyNavigation = stickyNav(document.querySelector('#header'), 292, 'sticky');

// Click / touch
var clickEvent = (function() {
    if ('ontouchstart' in document === true)
        return 'touchstart';
    else
        return 'click';
});


// Form success message
var url = new URL(window.location.href);
var success = url.searchParams.get("success");
var message = document.querySelector(".success");
if(success && message) {
    if(message.classList.contains('hidden')) {
        message.classList.remove('hidden');
    }
}
