'use strict';

window.onload = function () {

    setTimeout(function () {

        // reference to <head>
        var head = document.getElementsByTagName('head')[0];

        // New CSS
        var css_bootstrap = document.createElement('link');
        css_bootstrap.type = "text/css";
        css_bootstrap.rel = "stylesheet";
        css_bootstrap.href = "bower_components/bootstrap/dist/css/bootstrap.min.css";

        var css_animate = document.createElement('link');
        css_animate.type = "text/css";
        css_animate.rel = "stylesheet";
        css_animate.href = "bower_components/animate.css/animate.min.css";

        var css_uefa = document.createElement('link');
        css_uefa.type = "text/css";
        css_uefa.rel = "stylesheet";
        css_uefa.href = "css/uefa.css";

        // New JS
        var js_jqurey = document.createElement("script");
        js_jqurey.type = "text/javascript";
        js_jqurey.src = "https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js";

        var js_bootstrap = document.createElement("script");
        js_bootstrap.type = "text/javascript";
        js_bootstrap.src = "bower_components/bootstrap/dist/js/bootstrap.min.js";

        var js_uefa = document.createElement("script");
        js_uefa.type = "text/javascript";
        js_uefa.src = "js/uefa_v2.js";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLE1BQVAsR0FBZ0IsWUFBVzs7QUFFdkIsZUFBVyxZQUFXOzs7QUFHbEIsWUFBSSxPQUFPLFNBQVMsb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsQ0FBWDs7O0FBR0EsWUFBSSxnQkFBZ0IsU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQXBCO0FBQ0Esc0JBQWMsSUFBZCxHQUFxQixVQUFyQjtBQUNBLHNCQUFjLEdBQWQsR0FBcUIsWUFBckI7QUFDQSxzQkFBYyxJQUFkLEdBQXFCLHVEQUFyQjs7QUFFQSxZQUFJLGNBQWMsU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQWxCO0FBQ0Esb0JBQVksSUFBWixHQUFtQixVQUFuQjtBQUNBLG9CQUFZLEdBQVosR0FBbUIsWUFBbkI7QUFDQSxvQkFBWSxJQUFaLEdBQW1CLDhDQUFuQjs7QUFFQSxZQUFJLFdBQVcsU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQWY7QUFDQSxpQkFBUyxJQUFULEdBQWdCLFVBQWhCO0FBQ0EsaUJBQVMsR0FBVCxHQUFnQixZQUFoQjtBQUNBLGlCQUFTLElBQVQsR0FBZ0IsY0FBaEI7OztBQUdBLFlBQUksWUFBYSxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBakI7QUFDQSxrQkFBVSxJQUFWLEdBQWlCLGlCQUFqQjtBQUNBLGtCQUFVLEdBQVYsR0FBaUIsb0RBQWpCOztBQUVBLFlBQUksZUFBZ0IsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQXBCO0FBQ0EscUJBQWEsSUFBYixHQUFvQixpQkFBcEI7QUFDQSxxQkFBYSxHQUFiLEdBQW9CLHFEQUFwQjs7QUFFQSxZQUFJLFVBQVcsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWY7QUFDQSxnQkFBUSxJQUFSLEdBQWUsaUJBQWY7QUFDQSxnQkFBUSxHQUFSLEdBQWUsZUFBZjs7O0FBR0EsYUFBSyxXQUFMLENBQWlCLGFBQWpCO0FBQ0EsYUFBSyxXQUFMLENBQWlCLFdBQWpCO0FBQ0EsYUFBSyxXQUFMLENBQWlCLFFBQWpCO0FBQ0EsYUFBSyxXQUFMLENBQWlCLFNBQWpCO0FBQ0EsYUFBSyxXQUFMLENBQWlCLFlBQWpCO0FBQ0EsYUFBSyxXQUFMLENBQWlCLE9BQWpCOzs7Ozs7O0FBU0gsS0FqREQsRUFpREcsQ0FqREg7QUFtREgsQ0FyREQiLCJmaWxlIjoicHJlbG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gcmVmZXJlbmNlIHRvIDxoZWFkPlxuICAgICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG5cbiAgICAgICAgLy8gTmV3IENTU1xuICAgICAgICB2YXIgY3NzX2Jvb3RzdHJhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgICAgY3NzX2Jvb3RzdHJhcC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgICAgICBjc3NfYm9vdHN0cmFwLnJlbCAgPSBcInN0eWxlc2hlZXRcIjtcbiAgICAgICAgY3NzX2Jvb3RzdHJhcC5ocmVmID0gXCJib3dlcl9jb21wb25lbnRzL2Jvb3RzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiO1xuXG4gICAgICAgIHZhciBjc3NfYW5pbWF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgICAgY3NzX2FuaW1hdGUudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgICAgICAgY3NzX2FuaW1hdGUucmVsICA9IFwic3R5bGVzaGVldFwiO1xuICAgICAgICBjc3NfYW5pbWF0ZS5ocmVmID0gXCJib3dlcl9jb21wb25lbnRzL2FuaW1hdGUuY3NzL2FuaW1hdGUubWluLmNzc1wiO1xuXG4gICAgICAgIHZhciBjc3NfdWVmYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgICAgY3NzX3VlZmEudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgICAgICAgY3NzX3VlZmEucmVsICA9IFwic3R5bGVzaGVldFwiO1xuICAgICAgICBjc3NfdWVmYS5ocmVmID0gXCJjc3MvdWVmYS5jc3NcIjtcblxuICAgICAgICAvLyBOZXcgSlNcbiAgICAgICAgdmFyIGpzX2pxdXJleSAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICBqc19qcXVyZXkudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4gICAgICAgIGpzX2pxdXJleS5zcmMgID0gXCJodHRwczovL2Nkbi5ib290Y3NzLmNvbS9qcXVlcnkvMi4yLjQvanF1ZXJ5Lm1pbi5qc1wiO1xuXG4gICAgICAgIHZhciBqc19ib290c3RyYXAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAganNfYm9vdHN0cmFwLnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgICAgICBqc19ib290c3RyYXAuc3JjICA9IFwiYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAvZGlzdC9qcy9ib290c3RyYXAubWluLmpzXCI7XG5cbiAgICAgICAgdmFyIGpzX3VlZmEgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAganNfdWVmYS50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICAgICAganNfdWVmYS5zcmMgID0gXCJqcy91ZWZhX3YyLmpzXCI7XG5cbiAgICAgICAgLy8gcHJlbG9hZCBKUyBhbmQgQ1NTXG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoY3NzX2Jvb3RzdHJhcCk7XG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoY3NzX2FuaW1hdGUpO1xuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKGNzc191ZWZhKTtcbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChqc19qcXVyZXkpO1xuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKGpzX2Jvb3RzdHJhcCk7XG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoanNfdWVmYSk7XG5cbiAgICAgICAgLy8gcHJlbG9hZCBpbWFnZVxuICAgICAgICAvLyBuZXcgSW1hZ2UoKS5zcmMgPSBcImh0dHA6Ly9kb21haW4udGxkL3ByZWxvYWQucG5nXCI7XG5cblxuXG4gICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJlbG9hZC1wYWdlXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lci13cmFwcGVyJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfSwgMSk7XG5cbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
