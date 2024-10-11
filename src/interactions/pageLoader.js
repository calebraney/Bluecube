import { attr, runSplit } from '../utilities';
import { homeLoad } from './home';
import { load } from './load';
import imagesLoaded from 'imagesloaded';

export const pageLoad = function () {
  // Selectors - Load
  const LOAD_WRAP = '.load_component';
  const LOAD_LOGO = '.load_logo';
  const LOAD_LINE = '.load_line-wrap';
  const LOAD_LINE_FILL = '.load_line';
  const LOAD_BG = '.load_bg';

  //Selectors - Page Elements
  const MAIN_WRAP = '.main-wrapper';
  // hero animation attribute
  const ATTRIBUTE = 'data-ix-load';
  // hero animation selectors
  const TITLE = 'title';
  const ITEM = 'item';
  const FADE = 'fade';
  const STAGGER = 'stagger';

  //Options

  //Get Elements
  const loadWrap = document.querySelector(LOAD_WRAP);
  const loadLogo = document.querySelector(LOAD_LOGO);
  const loadLine = document.querySelector(LOAD_LINE);
  const loadLineFill = document.querySelector(LOAD_LINE_FILL);
  const loadBackground = document.querySelector(LOAD_BG);
  const body = document.querySelector('body');
  const contentWrap = document.querySelector(MAIN_WRAP);

  if (!loadWrap || !contentWrap) {
    load();
    return;
  }

  //animation once page has loaded
  // const headerLoadInAnimation = function () {
  //   const items = document.querySelectorAll(`[${ATTRIBUTE}="${ITEM}"]`);
  //   const fades = document.querySelectorAll(`[${ATTRIBUTE}="${FADE}"]`);
  //   const staggers = document.querySelectorAll(`[${ATTRIBUTE}="${STAGGER}"]`);
  //   const title = document.querySelector(`[${ATTRIBUTE}="${TITLE}"]`);
  //   if (!title || items.length === 0) return;

  //   const splitText = runSplit(title, 'lines, words, chars');
  //   if (!splitText) return;

  //   const tl = gsap.timeline({
  //     paused: false,
  //     delay: 0.8,
  //     defaults: {
  //       ease: 'power1.out',
  //       duration: 0.6,
  //     },
  //   });
  //   tl.set(title, { opacity: 1 });
  //   tl.fromTo(title, { scale: 1.2 }, { scale: 1 });
  //   tl.fromTo(
  //     splitText.words,
  //     { opacity: 0 },
  //     { opacity: 1, stagger: { each: 0.1, from: 'random' } },
  //     '<'
  //   );
  //   if (items.length !== 0) {
  //     tl.fromTo(
  //       items,
  //       { opacity: 0, y: '2rem' },
  //       { opacity: 1, y: '0rem', stagger: { each: 0.2, from: 'start' } },
  //       0.3
  //     );
  //   }
  //   if (fades.length !== 0) {
  //     tl.fromTo(
  //       fades,
  //       { opacity: 0 },
  //       { opacity: 1, duration: 0.8, stagger: { each: 0.2, from: 'start' } },
  //       0.3
  //     );
  //   }
  //   if (staggers.length !== 0) {
  //     const staggerChildren = [];
  //     staggers.forEach((item) => {
  //       const children = gsap.utils.toArray(item.children);
  //       staggerChildren.push(...children);
  //     });
  //     tl.fromTo(
  //       staggerChildren,
  //       { opacity: 0, y: '2rem' },
  //       { opacity: 1, y: '0rem', stagger: { each: 0.2, from: 'start' } },
  //       0.3
  //     );
  //   }
  //   return tl;
  // };
  // //set up load animation timelines
  const homeHeroAnimation = homeLoad();

  const pageLoadAnimation = function () {
    //prevent scrolling
    body.style.overflow = 'hidden';

    //timeline while page is loading
    const tlLoading = gsap.timeline({ paused: true });
    //tweens
    // tlLoading.set(loadWrap, { display: 'flex' });
    // tlLoading.set(loadLogoWrap, { display: 'flex' });
    // tlLoading.set(loadBackground, { display: 'flex' });
    // tlLoading.set(loadLogoFront, { opacity: 1 });
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
