/*global riot */

(function(exports,riot) {
    "use strict";

    var fevicol = {
        version: "v0.0.1",
        settings: {
            viewTag: ".app-body"
        },
        eventBus:riot.observable()
    };

    var viewTag = null;

    var routes = [];

    var componentDataStore = {};

    var currentState = {
        name: "",
        state: {}
    };

    var _currentcomponent = null;

    /*============================================
        Router Logic
    ============================================*/

    fevicol.createRoute = function(stateName, urlRegex, componentToMount, preserveDateOnUnmount) {
        return {
            url: urlRegex,
            state: stateName,
            component: componentToMount,
            preserveDateOnUnmount: preserveDateOnUnmount||false
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
            if (routes.length === 1) {
                fevicol.location(fevicol.getCurrentPath());
            }

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
                    if (route.url.match(newRoute) && (currentState.name !== route.state)) {

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

    window.onpopstate = function(e) {
        evalRoute(e.state);
    };

    function evalRoute(stateObj) {
        var componentName = stateObj.component;
        var currentComponent = _currentcomponent;
        var prevState = currentState;
        var preserveComponentData = false;

        if (prevState && prevState.state && prevState.state.preserveDateOnUnmount) {
            preserveComponentData = prevState.state.preserveDateOnUnmount;
        }

        currentState.name = stateObj.state;
        currentState.state = stateObj;
        if (currentComponent) {

            currentComponent.addEventListener("webkitTransitionEnd", function() {
                unmountComponent(currentComponent, preserveComponentData);
            })
            currentComponent.addEventListener("transitionend", function() {
                unmountComponent(currentComponent, preserveComponentData);
            })
            currentComponent.classList.add("fevicol-unmount");
        }

        _currentcomponent = document.createElement(componentName);

        componentDataStore[componentName] = componentDataStore[componentName] || {};
        viewTag.appendChild(_currentcomponent);
        riot.mount("*", {});
    }



    /*============================================
        Util Functions
    ============================================*/

    function unmountComponent(component, preserveData) {
        if (!preserveData && component) {
            var tagName = component.tagName.toLowerCase();
            delete(componentDataStore[tagName]);
        }
        component.remove();
    }

    function handleAnchorClick(e) {
        var node = e.target;
        while (node != document.body) {
            if (node.tagName == "A") {
                e.preventDefault();
                fevicol.location(node.getAttribute("href"));
                break;
            }
            node = node.parentNode;
        }

    }

    fevicol.getCurrentComponentData = function() {
        var tagName = _currentcomponent.tagName.toLowerCase();
        return componentDataStore[tagName];
    }


    /*============================================
        Init Functions
    ============================================*/

    function initFevicol() {
        viewTag = document.querySelector(fevicol.settings.viewTag);
        if (routes.length > 0) {
            fevicol.location(fevicol.getCurrentPath());
        } else {
            riot.mount("*", {});
        }

        exports.fevicol = fevicol;

        document.addEventListener("click", handleAnchorClick);
    }

    initFevicol();
})(this,riot);
