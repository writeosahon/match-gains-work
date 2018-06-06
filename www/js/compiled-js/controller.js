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
    startup: function(){

        // initialise the app libraries and plugins
        ons.ready(async function () {
            // set the default handler for the app
            ons.setDefaultDeviceBackButtonListener(function(){
                // does nothing for now!!
            });

            // displaying prepping message
            $('#loader-modal-message').html("Loading App...");
            $('#loader-modal').get(0).show(); // show loader

            if(window.localStorage.getItem("utopiasoftware-matchgains-onboarding") &&
                window.localStorage.getItem("utopiasoftware-matchgains-onboarding") === "done"){ // there is a previous logged in user
                // load the login page
                $('ons-splitter').get(0).content.load("login-template");
            }
            else{ // no previous logged in user
                // load the signup page
                $('ons-splitter').get(0).content.load("onboarding-template");
            }



            // START ALL CORDOVA PLUGINS CONFIGURATIONS
            try{
                // lock the orientation of the device to 'PORTRAIT'
                screen.orientation.lock('portrait');
            }
            catch(err){}

            try { // START ALL THE CORDOVA PLUGINS CONFIGURATION WHICH REQUIRE PROMISE SYNTAX

                // prepare the inapp browser plugin
                window.open = cordova.InAppBrowser.open;

                // note: for most promises, we weill use async-wait syntax
                // var a = await Promise.all([SystemJS.import('@syncfusion/ej2-base'), SystemJS.import('@syncfusion/ej2-dropdowns')]);
            }
            catch(err){
            }
            finally{
                 // set status bar color
                 StatusBar.backgroundColorByHexString("#00B2A0");
                 navigator.splashscreen.hide(); // hide the splashscreen
                 utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // flag that app is fullyt loaded and ready
            }

        }); // end of ons.ready()

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
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            async function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#onboarding-navigator').get(0).topPage.onDeviceBackButton = function(){
                    ons.notification.confirm('Do you want to close the app?', {title: 'Exit',
                        buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'}) // Ask for confirmation
                        .then(function(index) {
                            if (index === 1) { // OK button
                                navigator.app.exitApp(); // Close the app
                            }
                        });
                };

                // initialise all the animation containers
                utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel1AnimationContainer =
                    kendo.fx($("#onboarding-page ons-carousel-item.first .utopiasoftware-animation-container"));
                utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel2AnimationContainer =
                    kendo.fx($("#onboarding-page ons-carousel-item.second .utopiasoftware-animation-container"));
                utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel3AnimationContainer =
                    kendo.fx($("#onboarding-page ons-carousel-item.third .utopiasoftware-animation-container"));

                // hide the loader
                await $('#loader-modal').get(0).hide();
                // play the fade in animation for the 1st carousel
                utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel1AnimationContainer.
                    fade('in').duration(3000).play();
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){
            // destroy the animation containers
            kendo.destroy($("#onboarding-page"));
        },

        /**
         * method is used to track changes on the carousel slides
         * @param event
         */
        carouselPostChange(event){

            // use the switch case to determine what carousel is being shown
            switch(event.originalEvent.activeIndex){
                case 0:
                    // animate/fade-in the content of the 1st carousel
                    utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel1AnimationContainer.
                    fade('in').duration(3000).play();
                    // reset the opacity of all others items to zero(0) to make all other items invisible
                    $("#onboarding-page ons-carousel-item:not(.first) .utopiasoftware-animation-container").css("opacity", "0");
                    break;

                case 1:
                    // animate/fade-in the content of the 2nd carousel
                    utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel2AnimationContainer.
                    fade('in').duration(3000).play();
                    // reset the opacity of all others items to zero(0) to make all other items invisible
                    $("#onboarding-page ons-carousel-item:not(.second) .utopiasoftware-animation-container").css("opacity", "0");
                    break;

                case 2:
                    // animate/fade-in the content of the 3rd carousel
                    utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carousel3AnimationContainer.
                    fade('in').duration(3000).play();
                    // reset the opacity of all others items to zero(0) to make all other items invisible
                    $("#onboarding-page ons-carousel-item:not(.third) .utopiasoftware-animation-container").css("opacity", "0");
                    break;
            }
        },

        /**
         * method is triggered when the "NEXT" button on the slide is clicked
         *
         */
        nextButtonClicked(){
            // move to the next carousel item
            $("#onboarding-page #onboarding-carousel").get(0).next();
        },

        /**
         * method is triggered when the "PREVIOUS" button on the slide is clicked
         *
         */
        previousButtonClicked(){
            // move to the next carousel item
            $("#onboarding-page #onboarding-carousel").get(0).prev();
        },

        /**
         * method is triggered when the "JOIN NOW" button
         */
        joinNowButtonClicked(){

            // load the login page
            $('ons-splitter').get(0).content.load("login-template");
        }

    },

    /**
     * this is the view-model/controller for the LOGIN page
     */
    loginPageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            async function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#login-navigator').get(0).topPage.onDeviceBackButton = function(){
                    ons.notification.confirm('Do you want to close the app?', {title: 'Exit',
                        buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'}) // Ask for confirmation
                        .then(function(index) {
                            if (index === 1) { // OK button
                                navigator.app.exitApp(); // Close the app
                            }
                        });
                };

                // hide the loader
                await $('#loader-modal').get(0).hide();
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // adjust the window/view-port settings for when the soft keyboard is displayed
            window.SoftInputMode.set('adjustPan'); // let the window/view-port 'pan' when the soft keyboard is displayed
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
            // adjust the window/view-port settings for when the soft keyboard is displayed
            // window.SoftInputMode.set('adjustResize'); // let the view 'resize' when the soft keyboard is displayed
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){
        },


        /**
         * method is triggered when the Sign In / Sign Up segment buttons are clicked
         *
         * @param itemIndex {Integer} zero-based index representing the carousel item to
         * display ewhen the button is clicked
         */
        segmentButtonClicked(itemIndex){
            // move to the slide item specify by the provided parameter
            $('#login-page #login-carousel').get(0).setActiveIndex(itemIndex);
        },

        /**
         * method is used to track changes on the carousel slides
         * @param event
         */
        carouselPostChange(event){

            // use the switch case to determine what carousel is being shown
            switch(event.originalEvent.activeIndex){ // get the index of the active carousel item
                case 0:

                    // reset the the segment button contained in the other carousel items to their initial state
                    $("#login-page ons-carousel-item.second .login-segment button:nth-of-type(2) input").prop("checked", true);
                    $("#login-page ons-carousel-item.second .login-segment button:nth-of-type(1) input").prop("checked", false);
                    $("#login-page ons-carousel-item.third .login-segment button input").prop("checked", false);
                    break;

                case 1:
                    // reset the the segment button contained in the other carousel items to their initial state
                    $("#login-page ons-carousel-item.first .login-segment button:nth-of-type(1) input").prop("checked", true);
                    $("#login-page ons-carousel-item.first .login-segment button:nth-of-type(2) input").prop("checked", false);
                    $("#login-page ons-carousel-item.third .login-segment button input").prop("checked", false);
                    break;

                case 2:
                    // reset the the segment button contained in the other carousel items to their initial state
                    $("#login-page ons-carousel-item.first .login-segment button:nth-of-type(1) input").prop("checked", true);
                    $("#login-page ons-carousel-item.first .login-segment button:nth-of-type(2) input").prop("checked", false);
                    $("#login-page ons-carousel-item.second .login-segment button:nth-of-type(2) input").prop("checked", true);
                    $("#login-page ons-carousel-item.second .login-segment button:nth-of-type(1) input").prop("checked", false);
                    break;
            }
        },

        /**
         * method is triggered when the Terms & Conditions button link is clicked
         */
        termsAndConditionsButtonClicked(){

            // open the terms and conditions page in the app custom browser
            window.open(window.encodeURI('https://www.matchgains.com/en/terms-of-service.php', '_blank', 'zoom=no'));
        }
    }
};


