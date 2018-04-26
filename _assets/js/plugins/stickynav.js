// Sticky Navigation
var stickyNav = function(nav, y, c) {

    // vars
    var nav = nav, y = y, c = c;
    var sticky = 0;

    // handler
    var eventHandler = function() {
        if (document.documentElement.scrollTop > y) {
            if (sticky === 0) {
                nav.classList.add(c);
                sticky = 1;
            }
        }
        else {
            nav.classList.remove(c);
            sticky = 0;
        }
    }

    // init
    stickyNav.init = function() {
        eventHandler();
        window.addEventListener('scroll', eventHandler, false);
    }

    return stickyNav.init();
}
