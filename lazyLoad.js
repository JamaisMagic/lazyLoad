/**
 * @lazyLoad    simple lazyLoad module for mobile
 * @author  Jamais
 * @email  1350756140@qq.com
 * @date   2014/12/18
 *
 */

;(function (window, document, undefined) {
    var exp = {};

    var errCount = 0;

    function isInViewPort(el) {//check the element if in viewPort
        var rect = el.getBoundingClientRect();
        return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function deBounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }
    }

    /*
     * lazyLoad
     * @params options object
     * {
     *   selector: 'selector', @require
     *   srcAttr: 'data-src', @optional
     * }
     *
     * */
    function lazyLoad(options) {

        var collection = Array.prototype.slice.call(document.querySelectorAll(options.selector));
        var srcAttr = options.srcAttr || 'data-src';

        var collectionLen = collection.length;
        var deBounceCheck = deBounce(check, 200);

        window.addEventListener('scroll', deBounceCheck, false);
        window.addEventListener('resize', deBounceCheck, false);

        function loadError(evt) {
            this.removeEventListener('load', loaded, false);
            this.removeEventListener('error', loadError, false);
            if(errCount >= 3) {
                return;
            }
            collection.push(this);
            collectionLen++;
            errCount++;
        }

        function loaded(evt) {
            this.removeAttribute(srcAttr);
            this.removeEventListener('error', loadError, false);
            this.removeEventListener('load', loaded, false);
        }

        function check(evt) {
            if (collectionLen <= 0) {
                window.removeEventListener('resize', deBounceCheck, false);
                window.removeEventListener('scroll', deBounceCheck, false);
                return;
            }
            loop();
        }

        function loop() {
            var current;
            for (var i = 0; i < collectionLen; i++) {
                current = collection[i];

                if (isInViewPort(current)) {
                    current.addEventListener('load', loaded, false);
                    current.addEventListener('error', loadError, false);

                    collection.splice(i, 1);
                    i--;
                    collectionLen--;

                    current.setAttribute('src', current.getAttribute(srcAttr));
                }
            }
        }
    }

    exp.lazyLoad = lazyLoad;

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = exp;
    } else {
        window.JamLazyLoad = exp;
    }

})(window, document);
