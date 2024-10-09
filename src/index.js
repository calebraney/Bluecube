import { attr } from './utilities';
import { hoverActive } from './interactions/hoverActive';
import { scrollIn } from './interactions/scrollIn';
import { scrolling } from './interactions/scrolling';
import { parallax } from './interactions/parallax';
import { load } from './interactions/load';
import { homeAnimations } from './interactions/home';
//global exported variables

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  console.log('Local Script');
  // register gsap plugins if available
  if (gsap.ScrollTrigger !== undefined) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (gsap.Flip !== undefined) {
    gsap.registerPlugin(Flip);
  }

  //////////////////////////////
  //Global Variables

  //GSAP Selectors
  //Uses data-ix-{library}

  //Text Link
  const TXT_LINK_COMPONENT = '[text-link="component"]';
  const TXT_LINK_FRONT = '[text-link="front"]';
  const TXT_LINK_BACK = '[text-link="back"]';
  //General Variables
  const NO_SCROLL = 'no-scroll';
  const HIDE_CLASS = 'hide';
  const body = document.querySelector('body');
  let activeLightbox = false;
  let userInput;
  let password;

  //////////////////////////////
  // Functionality

  const passwordFunction = function () {
    //Selectors
    const PASSWORD_WRAP = '[pass-el="wrap"]';
    const PASSWORD_COMPONENT = '[pass-el="component"]';
    const PASSWORD_BG = '[pass-el="bg"]';
    const PASSWORD_CARD = '[pass-el="card"]';
    const PASSWORD_INPUT = '[pass-el="input"]';
    const PASSWORD_BUTTON = '[pass-el="button"]';
    const PASSWORD_ERROR = '[pass-el="error"]';
    //Elements
    const passWrap = document.querySelector(PASSWORD_WRAP);
    const passComponent = document.querySelector(PASSWORD_COMPONENT);
    const passInput = document.querySelector(PASSWORD_INPUT);
    const passButton = document.querySelector(PASSWORD_BUTTON);
    const passError = document.querySelector(PASSWORD_ERROR);
    const passBg = document.querySelector(PASSWORD_BG);
    const passCard = document.querySelector(PASSWORD_CARD);
    let passSet = false;
    const loadTL = load();

    // if no password element exists animate the header in and return the function
    if (!passComponent || !passWrap || !passInput || !passButton) {
      loadTL.play();
      return;
    }

    // function to check password an either hide modal or show
    const checkPassword = function () {
      if (userInput === password) {
        // set password cookie
        localStorage.setItem(page, 'true');
        const tl = gsap.timeline({
          onComplete: () => {
            passComponent.classList.add(HIDE_CLASS);
            body.classList.remove(NO_SCROLL);
            loadTL.play();
          },
        });
        tl.fromTo(
          passBg,
          {
            height: '100%',
          },
          {
            duration: 1,
            height: '0%',
            ease: 'power2.out',
          }
        );
        tl.fromTo(
          passCard,
          {
            opacity: 1,
          },
          {
            duration: 0.5,
            opacity: 0,
            ease: 'power2.out',
          },
          0.2
        );
        tl.fromTo(
          passCard,
          {
            scale: 1,
          },
          {
            duration: 0.7,
            scale: 0.75,
            ease: 'power2.in',
          },
          0
        );
      } else {
        passError.classList.remove(HIDE_CLASS);
      }
    };
    //manage cookies
    let visited = false;
    const page = window.location.pathname;
    // Check if item has been set before
    if (localStorage.getItem(page) !== null) {
      // item is set set visited to true
      visited = true;
    }

    // if password is set and page is not visited show password modal, prevent body from scrolling and focus input field
    if (!passWrap.classList.contains('w-condition-invisible') && visited === false) {
      //animate password in
      const tl = gsap.timeline({
        onStart: () => {
          passComponent.classList.remove(HIDE_CLASS);
          passSet = true;
          window.scrollTo(0, 0);
          body.classList.add(NO_SCROLL);
        },
        onComplete: () => {
          activatePassword();
        },
      });
      tl.fromTo(
        passBg,
        {
          opacity: '0%',
        },
        {
          duration: 1,
          opacity: '100%',
          ease: 'power2.out',
        }
      );
      tl.fromTo(
        passCard,
        {
          opacity: 0,
          scale: 0.75,
        },
        {
          duration: 0.8,
          opacity: 1,
          scale: 1,
          ease: 'power2.out',
        },
        0.2
      );
    }
    // If password is not set
    else {
      passComponent.classList.add(HIDE_CLASS);
      loadTL.play();
    }
    // functionality of password checking
    const activatePassword = function () {
      //focus on the input field
      passInput.focus();
      //get the password
      password = attr('oovra', passButton.getAttribute('pass'));
      passInput.addEventListener('input', function () {
        userInput = this.value;
        passError.classList.add(HIDE_CLASS);

        passInput.addEventListener('change', function () {
          userInput = this.value;
          passError.classList.add(HIDE_CLASS);
        });
      });

      window.addEventListener('keydown', (e) => {
        // if key is tab and the target is the password Button, focus on the password input
        if (e.key == 'Tab' && e.target === passInput) {
          e.preventDefault();
          passButton.focus({ preventScroll: true, focusVisible: true });
        }
        // if key is tab and the target is the password Button, focus on the password input
        if (e.key == 'Tab' && e.target === passButton) {
          e.preventDefault();
          passInput.focus({ preventScroll: true, focusVisible: true });
        }
        // if key is tab and the target is the password Button, focus on the password input
        if (e.key == 'Enter' && e.target === passInput) {
          e.preventDefault();
          checkPassword();
        }
      });
      passButton.addEventListener('click', function () {
        checkPassword();
      });
    };
  };

  const lightbox = function () {
    //Selectors
    const LIGHTBOX_COMPONENT = '[lightbox-el="component"]';
    const LIGHTBOX_TRIGGER = '[lightbox-el="trigger"]';
    const LIGHTBOX_CLOSE_BTN = '[lightbox-el="close"]';
    const LIGHTBOX_NEXT_BTN = '[lightbox-el="next"]';
    const LIGHTBOX_PREVIOUS_BTN = '[lightbox-el="previous"]';
    const LIGHTBOX_IMAGE = '[lightbox-el="image"]';
    const LIGHTBOX_THUMBNAIL = '[lightbox-el="thumbnail"]';
    const LIGHTBOX_VID_THUMBNAIL = '[lightbox-el="video-thumbnail"]';
    const LIGHTBOX_VID = '[lightbox-el="video"]';
    const LIGHTBOX_VID_WRAP = '[lightbox-el="video-wrap"]';
    const WORKS_ITEM = '[lightbox-el="works-item"]';
    const WORKS_LIST = '[lightbox-el="works-list"]';
    //Elements
    const worksItems = document.querySelectorAll(WORKS_ITEM);
    if (worksItems.length === 0) return;
    worksItems.forEach((item) => {
      //get the lightbox within the works item
      const lightbox = item.querySelector(LIGHTBOX_COMPONENT);
      if (!lightbox) return;
      //get other lightbox elements
      const lightboxTrigger = item.querySelector(LIGHTBOX_TRIGGER);
      const videoWrap = item.querySelector(LIGHTBOX_VID_WRAP);
      const video = item.querySelector(LIGHTBOX_VID);
      let player = false;
      if (!videoWrap.classList.contains('w-condition-invisible')) {
        player = makeVideo(video);
      }

      // process key events in the lightbox
      item.addEventListener('keydown', (e) => {
        // if key is Enter and the target is the lightbox trigger, open lightbox
        if (e.key === 'Enter' && e.target === lightboxTrigger) {
          openModal(lightbox, player);
        }
        // if escape is pressed when lightbox is open, close lightbox
        if (e.key === 'Escape' && activeLightbox !== false) {
          closeModal(lightbox, player);
        }
      });

      // process click events in the lightbox
      item.addEventListener('click', (e) => {
        // if the click target was in the lightbox trigger
        if (e.target.closest(LIGHTBOX_TRIGGER) !== null) {
          // Find the next dialog sibling and open it
          openModal(lightbox, player);
        }
        // Check if the clicked element is a close button inside a dialog
        else if (e.target.closest(LIGHTBOX_CLOSE_BTN) !== null) {
          // Find the closest dialog parent and close it
          closeModal(lightbox, player);
          if (player) {
            player.pause();
          }
        }
        // Check if the clicked element is a close button inside a dialog
        else if (e.target.closest(LIGHTBOX_NEXT_BTN) !== null) {
          const nextItem = item.nextElementSibling;
          const nextLightbox = nextItem.querySelector(LIGHTBOX_COMPONENT);
          closeModal(lightbox, player);
          if (player) {
            player.pause();
          }
          openModal(nextLightbox);
        }
        // Check if the clicked element is a close button inside a dialog
        else if (e.target.closest(LIGHTBOX_PREVIOUS_BTN) !== null) {
          const previousItem = item.previousElementSibling;
          const previousLightbox = previousItem.querySelector(LIGHTBOX_COMPONENT);
          closeModal(lightbox, player);
          if (player) {
            player.pause();
          }
          openModal(previousLightbox);
        }
      });
    });

    const openModal = function (lightbox, player) {
      if (!lightbox) return;
      lightbox.showModal();
      lightboxThumbnails(lightbox, player);
      body.classList.add(NO_SCROLL);
      activeLightbox = lightbox;
    };
    const closeModal = function (lightbox, player) {
      if (!lightbox) return;
      if (player) {
        player.pause();
      }
      lightbox.close();
      body.classList.remove(NO_SCROLL);
      activeLightbox = false;
    };

    const lightboxThumbnails = function (lightbox, player) {
      const thumbnails = lightbox.querySelectorAll(LIGHTBOX_THUMBNAIL);
      const lightboxImage = lightbox.querySelector(LIGHTBOX_IMAGE);
      const videoThumbnail = lightbox.querySelector(LIGHTBOX_VID_THUMBNAIL);
      const videoWrap = lightbox.querySelector(LIGHTBOX_VID_WRAP);

      thumbnails.forEach(function (thumbnail) {
        thumbnail.addEventListener('click', function () {
          videoWrap.classList.add(HIDE_CLASS);
          source = thumbnail.src;
          lightboxImage.src = source;
          if (player) {
            player.pause();
          }
        });
      });
      videoThumbnail.addEventListener('click', function () {
        videoWrap.classList.remove(HIDE_CLASS);
      });
    };
  };
  const makeVideo = function (video) {
    let videoPlayer = new Plyr(video, {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'fullscreen'],
      resetOnEnd: true,
    });
    return videoPlayer;
  };

  const dynamicFormInputs = function () {
    const inputWraps = gsap.utils.toArray('.form_field-wrapper');
    const FIELD = '.form_input';
    const LABEL = '.form_label';
    const DYNAMIC_CLASS = 'is-dynamic';
    const PLACEHOLDER_CLASS = 'is-placeholder';
    //guard clause
    if (inputWraps.length === 0) return;
    //for each input field
    inputWraps.forEach(function (item) {
      const field = item.querySelector(FIELD);
      const label = item.querySelector(LABEL);

      // if field and label aren't found exit the function
      if (!field || !label) return;

      // if the label is not dynamic exit the function
      if (!label.classList.contains(DYNAMIC_CLASS)) return;
      field.addEventListener('focusin', function () {
        label.classList.remove(PLACEHOLDER_CLASS);
      });

      field.addEventListener('focusout', function () {
        if (field.value.length === 0) {
          label.classList.add(PLACEHOLDER_CLASS);
        }
      });
    });
  };

  const navbarTransparent = function () {
    const NAVBAR = '[navbar-component]';
    const START_TRANSPARENT = 'navbar-start-transparent';
    const CONTROL_TRANSPARENT = 'navbar-transparent';
    const navbar = document.querySelector(NAVBAR);
    if (!navbar) return;

    const isTransparent = attr(false, navbar.getAttribute(START_TRANSPARENT));
    if (!isTransparent) return;

    // Attach the handleScroll function to the scroll event
    window.addEventListener('scroll', function (e) {
      // Check if the page is scrolled to the top
      const scrollValue = window.scrollY;
      if (scrollValue === 0) {
        // Set the attribute based on the scroll position
        navbar.setAttribute(CONTROL_TRANSPARENT, 'true');
      } else {
        navbar.setAttribute(CONTROL_TRANSPARENT, 'false');
      }
    });
  };

  //////////////////////////////
  //GSAP Animations

  const textLinks = function () {
    const items = gsap.utils.toArray(TXT_LINK_COMPONENT);
    items.forEach((item) => {
      if (!item) return;
      const front = item.querySelector(TXT_LINK_FRONT);
      const back = item.querySelector(TXT_LINK_BACK);
      if (!front || !back) return;
      const tl = gsap.timeline({
        paused: true,
        defaults: {
          duration: 0.4,
          ease: 'power1.out',
        },
      });
      tl.fromTo(
        front,
        {
          y: '200%',
          rotateZ: 6,
        },
        {
          y: '0%',
          rotateZ: 0,
        }
      );
      tl.fromTo(
        back,
        {
          y: '0%',
          rotateZ: 0,
        },
        {
          y: '-200%',
          rotateZ: -6,
        },
        0
      );
      item.addEventListener('mouseover', function () {
        tl.play();
      });
      item.addEventListener('mouseleave', function () {
        tl.reverse();
      });
    });
  };

  const linktreeAnimation = function (isMobile) {
    const cards = gsap.utils.toArray('[linktree-el="card"]');
    const bgImage = gsap.utils.toArray('[linktree-el="bg"]');
    const hideButton = document.querySelector('[linktree-el="hide"]');
    let hidden = false;
    if (cards.length === 0 || !hideButton) return;

    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'power1.inOut',
      },
    });
    //create seperate tweens on Mobile and Desktop
    if (isMobile) {
      const mobileCards = [];
      mobileCards.push(document.querySelector('[linktree-card="title"]'));
      mobileCards.push(document.querySelector('[linktree-card="form"]'));
      mobileCards.push(document.querySelector('[linktree-card="links"]'));
      mobileCards.push(document.querySelector('[linktree-card="promo"]'));

      if (mobileCards.includes(null) || mobileCards.length !== 4);
      tl.fromTo(
        mobileCards,
        {
          opacity: 0,
          y: '3rem',
        },
        {
          opacity: 1,
          y: '0rem',
          stagger: { each: 0.2, from: 'start' },
        }
      );
    } else {
      tl.fromTo(
        cards,
        {
          opacity: 0,
          y: '3rem',
        },
        {
          opacity: 1,
          y: '0rem',
          stagger: { each: 0.2, from: 'start' },
        }
      );
    }

    tl.fromTo(
      bgImage,
      {
        scale: 1,
      },
      {
        scale: 1.1,
      },
      '<'
    );
    hideButton.addEventListener('click', function () {
      if (hidden === false) {
        tl.timeScale(1.5);
        tl.reverse();
        hidden = true;
      } else {
        tl.timeScale(1.5);
        tl.play();
        hidden = false;
      }
    });
  };

  //////////////////////////////
  //Control Functions on page load

  const gsapInit = function () {
    let mm = gsap.matchMedia();
    mm.add(
      {
        //This is the conditions object
        isMobile: '(max-width: 767px)',
        isTablet: '(min-width: 768px)  and (max-width: 991px)',
        isDesktop: '(min-width: 992px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (gsapContext) => {
        let { isMobile, isTablet, isDesktop, reduceMotion } = gsapContext.conditions;
        //functional interactions
        const currentUrl = window.location.pathname;
        console.log(currentUrl);
        if (currentUrl === '/') {
          homeAnimations();
        } else {
          passwordFunction();
        }
        lightbox();
        dynamicFormInputs();

        // animation functions
        linktreeAnimation(isMobile);
        navbarTransparent();
        //conditional animations
        if (!reduceMotion) {
          scrollIn(gsapContext);
          scrolling(gsapContext);
          parallax(gsapContext);
        }
        if (isDesktop) {
          textLinks();
        }
      }
    );
  };
  gsapInit();

  //reset gsap on click of reset triggers
  const scrollReset = function () {
    //selector
    const RESET_EL = '[data-ix-reset]';
    //time option
    const RESET_TIME = 'data-ix-reset-time';
    const resetScrollTriggers = document.querySelectorAll(RESET_EL);
    resetScrollTriggers.forEach(function (item) {
      item.addEventListener('click', function (e) {
        //reset scrolltrigger
        ScrollTrigger.refresh();
        //if item has reset timer reset scrolltriggers after timer as well.
        if (item.hasAttribute(RESET_TIME)) {
          let time = attr(1000, item.getAttribute(RESET_TIME));
          //get potential timer reset
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, time);
        }
      });
    });
  };
  scrollReset();
});
