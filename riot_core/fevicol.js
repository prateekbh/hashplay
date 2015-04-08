/*global riot */

(function() {
    "use strict";

    var fevicol = {
        version: "v0.0.1",
        settings: {
            viewTag: ".app-body"
        }
    };

    var viewTag = null;

    var routes = [];

    fevicol.createRoute = function(stateName, urlRegex, componentToMount) {
        return {
            url: urlRegex,
            state: stateName,
            component: componentToMount
        };
    };

    fevicol.getCurrentPath = function() {
        var route = location.pathname.split("#")[0];
        if (route.length > 0) {
            return route[0];
        } else {
            throw new Error("Unable to process route");
        }
    };

    fevicol.addRoute = function(route) {
        if (route && route.url && route.component) {
            routes.push(route);
            fevicol.location(fevicol.getCurrentPath());
        } else {
            throw new Error("Route object should contain a URL regex and a component name");
        }
    };

    fevicol.location = function() {
        if (arguments.length === 0) {
            return fevicol.getCurrentPath();
        } else if (arguments.length == 1 && typeof(arguments[0]) == "string") {
            var newRoute = arguments[0];
            var currRoute = fevicol.getCurrentPath();
            if (history && history.pushState) {
                for (var r in routes) {
                    var route = routes[r];
                    if (route.url.match(newRoute)) {
                        history.pushState(route, "", newRoute);
                        evalRoute(route);
                        break;
                    }
                }
            } else {
                if (newRoute !== currRoute) {
                    throw new Error("full page reload logic here"); //TODO: full page reload logic here
                }
            }
        }
    };

    function fevicolAnchorBehaviour() {
        var self=this;
        fevicol.location(self.getAttribute("href"));
        return false;
    }

    function evalRoute(stateObj) {
        viewTag.innerHTML = "";
        //var currComponent = fevicol.app.currentcomponent;
        fevicol.currentcomponent = document.createElement(stateObj.component);
        viewTag.appendChild(fevicol.currentcomponent);
        riot.mount("*", {});
        var anchors = document.querySelectorAll("a");
        for (var anchorIndex = 0; anchorIndex < anchors.length; anchorIndex++) {
            var anchor = anchors[anchorIndex];
            anchor.onclick = fevicolAnchorBehaviour;
        }
    }

    window.onpopstate = function(e) {
        evalRoute(e.state);
    };

    fevicol.doAjax = function(url,data){
        
    };




    function initFevicol() {
        viewTag = document.querySelector(fevicol.settings.viewTag);
        if (routes.length > 0) {
            fevicol.location(fevicol.getCurrentPath());
        } else {
            riot.mount("*", {});
        }
        window.fevicol=fevicol;
    }

    initFevicol();
})();
