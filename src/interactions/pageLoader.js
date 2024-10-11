import { attr, runSplit } from '../utilities';
import { load } from './load';
import imagesLoaded from 'imagesloaded';

export const pageLoad = function () {
  // Selectors - Load
  const LOAD_WRAP = '.load_component';
  const LOAD_LOGO = '.load_logo';
  const LOAD_LINE = '.load_line-wrap';
  const LOAD_LINE_FILL = '.load_line';
  const LOAD_BG = '.load_bg';
  const MAIN_WRAP = '.main-wrapper';

  //Get Elements
  const loadWrap = document.querySelector(LOAD_WRAP);
  const loadLogo = document.querySelector(LOAD_LOGO);
  const loadLine = document.querySelector(LOAD_LINE);
  const loadLineFill = document.querySelector(LOAD_LINE_FILL);
  const loadBackground = document.querySelector(LOAD_BG);
  const body = document.querySelector('body');
  const contentWrap = document.querySelector(MAIN_WRAP);

  if (!loadWrap || !contentWrap) {
    // load();
    return;
  }

  //Background Image Layers
  const imgRight = document.querySelector('.home_bg_right');
  const imgLeft = document.querySelector('.home_bg_left');
  const imgBottom = document.querySelector('.home_bg_bottom');
  const imgLeftGuy = document.querySelector('.home_bg_left-guy');

  const homeLoad = function () {
    const tl = gsap
      .timeline({
        paused: true,
        defaults: {
          ease: 'power2.out',
          duration: 1,
        },
      })
      .fromTo(
        [imgBottom, imgLeft, imgRight, imgLeftGuy],
        {
          scale: 1.2,
        },
        {
          scale: 1,
        }
      );
    return tl;
  };
  homeLoad();

  const pageLoadAnimation = function () {
    //prevent scrolling
    body.style.overflow = 'hidden';
    // //set up load animation timelines
    const homeHeroAnimation = homeLoad();

    //timeline while page is loading
    const tlLoading = gsap.timeline({ paused: true });
    //tweens
    tlLoading.fromTo(
      loadLineFill,
      { width: '0%' },
      {
        width: '100%',
        ease: 'linear',
        duration: 1,
      }
    );
    //timeline to show page once loaded
    const tlLoaded = gsap.timeline({
      paused: true,
      delay: 0.1,
      onStart: () => {
        //start load animation after 600ms
        setTimeout(() => {
          load();
        }, 600);

        //check to see if homepage and run homepage interaction
        const currentUrl = window.location.pathname;
        if (currentUrl === '/') {
          homeHeroAnimation.play();
        }
        ScrollTrigger.refresh();
      },
    });
    tlLoaded.fromTo(
      [loadLogo, loadLine],
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.45,
      }
    );
    tlLoaded.fromTo(
      loadBackground,
      { y: '0vh', borderRadius: '0vw' },
      {
        y: '-100vh',
        borderRadius: '20vw',
        ease: 'power1.inOut',
        duration: 1,
      },
      '<'
    );
    tlLoaded.set(loadWrap, { display: 'none' });
    tlLoaded.set('body', { overflow: 'visible' });

    //checking for images loaded
    const start = performance.now();
    const imgLoad = new imagesLoaded('body', { background: true }, onImagesLoaded);
    //get the number of images
    const numImages = imgLoad.images.length;

    //function to handle image load progress
    imgLoad.on('progress', function (instance, image) {
      var result = image.isLoaded ? 'loaded' : 'broken';
      //log the amount of images loaded
      // console.log(
      //   `image ${instance.progressedCount} out of ${numImages} is ${result}`
      // );
      const progress = instance.progressedCount / numImages;
      //update loading progress
      tlLoading.progress(progress);
    });

    //function to run when images have loaded
    function onImagesLoaded() {
      const end = performance.now();
      // Calculate remaining time to ensure loader is displayed for a minimum time
      const MIN_TIME = 800;
      const duration = end - start;
      const remainingTime = Math.max(MIN_TIME - duration, 0);

      //after remaining time play loaded animation
      setTimeout(() => {
        tlLoaded.play();
      }, remainingTime);
    }
  };
  pageLoadAnimation();
};
