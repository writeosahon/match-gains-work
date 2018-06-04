'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by UTOPIA SOFTWARE on 1/6/2018.
 */

/**
 * file defines all View-Models, Controllers and Event Listeners used by the app
 *
 * The 'utopiasoftware_app_namespace' namespace variable has being defined in the base js file.
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 */

// define the controller namespace
utopiasoftware[utopiasoftware_app_namespace].controller = {

    /**
     * property holds the Map objects which will contain a reference to dynamically loaded ES modules.
     * NOTE: modules MUST BE deleted from this property i.e. the Map object when no longer need.
     * This is to enable garbage collection and prevent memory leaks.
     * NOTE: the keys used within the map will be identical to the same map value used in the SystemJS.config()
     */
    LOADED_MODULES: new Map(),
    /**
     * method contains the stratup/bootstrap code needed to initiate app logic execution
     */
    startup: function startup() {

        // initialise the app libraries and plugins
        ons.ready(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            // set the default handler for the app
                            ons.setDefaultDeviceBackButtonListener(function () {
                                // does nothing for now!!
                            });

                            // displaying prepping message
                            $('#loader-modal-message').html("Loading App...");
                            $('#loader-modal').get(0).show(); // show loader

                            if (window.localStorage.getItem("utopiasoftware-matchgains-onboarding") && window.localStorage.getItem("utopiasoftware-matchgains-onboarding") === "done") {
                                // there is a previous logged in user
                                // load the login page
                                $('ons-splitter').get(0).content.load("login-template");
                            } else {
                                // no previous logged in user
                                // load the signup page
                                $('ons-splitter').get(0).content.load("onboarding-template");
                            }

                            // START ALL CORDOVA PLUGINS CONFIGURATIONS
                            try {
                                // lock the orientation of the device to 'PORTRAIT'
                                screen.orientation.lock('portrait');
                            } catch (err) {}

                            try {// START ALL THE CORDOVA PLUGINS CONFIGURATION WHICH REQUIRE PROMISE SYNTAX

                                // note: for most promises, we weill use async-wait syntax
                                // var a = await Promise.all([SystemJS.import('@syncfusion/ej2-base'), SystemJS.import('@syncfusion/ej2-dropdowns')]);
                            } catch (err) {} finally {
                                // set status bar color
                                StatusBar.backgroundColorByHexString("#00B2A0");
                                navigator.splashscreen.hide(); // hide the splashscreen
                                utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // flag that app is fullyt loaded and ready
                            }

                        case 6:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }))); // end of ons.ready()
    },

    /**
     * this is the view-model for the onboarding page
     */
    onboardingPageViewModel: {

        /**
         * holds the animation container for the 1st carousel item
         */
        carousel1AnimationContainer: null,

        /**
         * holds the animation container for the 2nd carousel item
         */
        carousel2AnimationContainer: null,

        /**
         * holds the animation container for the 3rd carousel item
         */
        carousel3AnimationContainer: null,

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context2.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context2.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    $('#onboarding-navigator').get(0).topPage.onDeviceBackButton = function () {
                                        ons.notification.confirm('Do you want to close the app?', { title: 'Exit',
                                            buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog' }) // Ask for confirmation
                                        .then(function (index) {
                                            if (index === 1) {
                                                // OK button
                                                navigator.app.exitApp(); // Close the app
                                            }
                                        });
                                    };

                                    // initialise all the animation containers
                                    utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel1AnimationContainer = kendo.fx($("#onboarding-page ons-carousel-item.first .utopiasoftware-animation-container"));
                                    utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel2AnimationContainer = kendo.fx($("#onboarding-page ons-carousel-item.second .utopiasoftware-animation-container"));
                                    utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel3AnimationContainer = kendo.fx($("#onboarding-page ons-carousel-item.third .utopiasoftware-animation-container"));

                                    // hide the loader
                                    _context2.next = 9;
                                    return $('#loader-modal').get(0).hide();

                                case 9:
                                    // play the fade in animation for the 1st carousel
                                    utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel1AnimationContainer.fade('in').duration(3000).play();

                                case 10:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref2.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function pageHide() {},

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {
            // destroy the animation containers
            kendo.destroy($("#onboarding-page"));
        },

        /**
         * method is used to track changes on the carousel slides
         * @param event
         */
        carouselPostChange: function carouselPostChange(event) {

            // use the switch case to determine what carousel is being shown
            switch (event.originalEvent.activeIndex) {
                case 0:
                    // animate/fade-in the content of the 1st carousel
                    utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel1AnimationContainer.fade('in').duration(3000).play();
                    // reset the opacity of all others items to zero(0) to make all other items invisible
                    $("#onboarding-page ons-carousel-item:not(.first) .utopiasoftware-animation-container").css("opacity", "0");
                    break;

                case 1:
                    // animate/fade-in the content of the 2nd carousel
                    utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel2AnimationContainer.fade('in').duration(3000).play();
                    // reset the opacity of all others items to zero(0) to make all other items invisible
                    $("#onboarding-page ons-carousel-item:not(.second) .utopiasoftware-animation-container").css("opacity", "0");
                    break;

                case 2:
                    // animate/fade-in the content of the 3rd carousel
                    utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel3AnimationContainer.fade('in').duration(3000).play();
                    // reset the opacity of all others items to zero(0) to make all other items invisible
                    $("#onboarding-page ons-carousel-item:not(.third) .utopiasoftware-animation-container").css("opacity", "0");
                    break;
            }
        },


        /**
         * method is triggered when the "NEXT" button on the slide is clicked
         *
         */
        nextButtonClicked: function nextButtonClicked() {
            // move to the next carousel item
            $("#onboarding-page #onboarding-carousel").get(0).next();
        },


        /**
         * method is triggered when the "PREVIOUS" button on the slide is clicked
         *
         */
        previousButtonClicked: function previousButtonClicked() {
            // move to the next carousel item
            $("#onboarding-page #onboarding-carousel").get(0).prev();
        }
    },

    /**
     * this is the view-model/controller for the Sign Up page
     */
    signupPageViewModel: {}
};

//# sourceMappingURL=controller-compiled.js.map