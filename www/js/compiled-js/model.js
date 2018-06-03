/**
 * Created by UTOPIA SOFTWARE on 1/6/2018.
 */



// define the model namespace
utopiasoftware[utopiasoftware_app_namespace].model = {

    /**
     * property acts as a flag that indicates that all hybrid plugins and DOM content
     * have been successfully loaded. It relies on the ons.ready() method
     *
     * @type {boolean} flag for if the hybrid plugins and DOM content are ready for execution
     */
    isAppReady: false

};

// call the method to startup the app
utopiasoftware[utopiasoftware_app_namespace].controller.startup();

// listen for the initialisation of the ONBOARDING page
$(document).on("init", "#onboarding-page", utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.pageInit);

// listen for when the ONBOARDING page is shown
$(document).on("show", "#onboarding-page", utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.pageShow);

// listen for when the ONBOARDING page is hidden
$(document).on("hide", "#onboarding-page", utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.pageHide);

// listen for when the ONBOARDING page is destroyed
$(document).on("destroy", "#onboarding-page", utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.pageDestroy);

// used to listen for 'onboarding-carousel' carousel items/slides changes on the onboarding page
$(document).on("postchange", "#onboarding-carousel", utopiasoftware[utopiasoftware_app_namespace].controller.onboardingPageViewModel.carouselPostChange);
