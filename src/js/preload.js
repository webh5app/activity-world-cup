window.onload = function() {

    setTimeout(function() {

        // reference to <head>
        var head = document.getElementsByTagName('head')[0];

        // New CSS
        var css_bootstrap = document.createElement('link');
        css_bootstrap.type = "text/css";
        css_bootstrap.rel  = "stylesheet";
        css_bootstrap.href = "bower_components/bootstrap/dist/css/bootstrap.min.css";

        var css_animate = document.createElement('link');
        css_animate.type = "text/css";
        css_animate.rel  = "stylesheet";
        css_animate.href = "bower_components/animate.css/animate.min.css";

        var css_uefa = document.createElement('link');
        css_uefa.type = "text/css";
        css_uefa.rel  = "stylesheet";
        css_uefa.href = "css/uefa.css";

        // New JS
        var js_jqurey  = document.createElement("script");
        js_jqurey.type = "text/javascript";
        js_jqurey.src  = "https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js";

        var js_bootstrap  = document.createElement("script");
        js_bootstrap.type = "text/javascript";
        js_bootstrap.src  = "bower_components/bootstrap/dist/js/bootstrap.min.js";

        var js_uefa  = document.createElement("script");
        js_uefa.type = "text/javascript";
        js_uefa.src  = "js/uefa_v2.js";

        // preload JS and CSS
        head.appendChild(css_bootstrap);
        head.appendChild(css_animate);
        head.appendChild(css_uefa);
        head.appendChild(js_jqurey);
        head.appendChild(js_bootstrap);
        head.appendChild(js_uefa);

        // preload image
        // new Image().src = "http://domain.tld/preload.png";



        // document.getElementById("preload-page").style.display = "none";
        // document.getElementById('container-wrapper').style.display = 'block';
    }, 1);

};
