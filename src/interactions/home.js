import { runSplit } from '../utilities';

//main elements
const homeWrap = document.querySelector('.home_wrap');
const homeScrollWrap = document.querySelector('.home_scroll_wrap');
const homeBgWrap = document.querySelector('.home_bg_wrap');
const homeBgTopWrap = document.querySelector('.home_bg_top_wrap');
//sections
const heroSection = document.querySelector('.home_hero_wrap');
const titleSection = document.querySelector('.home_title_wrap');
const detailsSection = document.querySelector('.home_details_wrap');
const artistsSection = document.querySelector('.home_artists_wrap');
const taglineSection = document.querySelector('.home_tagline_wrap');
const socialSection = document.querySelector('.home_social_wrap');
//Background Image Layers
const imgFrames = gsap.utils.toArray('.home_bg_visual');
const backgroundOverlay = document.querySelector('.home_bg_overlay');
const imgRight = document.querySelector('.home_bg_right');
const imgLeft = document.querySelector('.home_bg_left');
const imgBottom = document.querySelector('.home_bg_bottom');
const imgRightGuy = document.querySelector('.home_bg_right-guy');
const imgLeftGuy = document.querySelector('.home_bg_left-guy');
const imgLady = document.querySelector('.home_bg_lady-wrap');
const imgShoe = document.querySelector('.home_bg_shoe');

//section specific elements
const heroLogo = document.querySelector('.home_hero_logo');
const heroText = document.querySelector('.home_hero_text');
const heroScroll = document.querySelector('.home_hero_scroll');
const heroScrollArrow = document.querySelector('.home_hero_arrow');
const titleText = document.querySelector('.home_title_text');
const detailsCards = gsap.utils.toArray('.home-details_card');
const detailsHeadings = gsap.utils.toArray('.home-details_heading');
const artistItems = gsap.utils.toArray('.home_artists_item');
const taglineItems = gsap.utils.toArray('.home_tagline_text');

//global animation variables
let frameTransform;
const clipDirections = {
  left: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
  right: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
  top: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
  bottom: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
  full: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
};

export const homeScroll = function () {
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

      ////////////////////
      //Animate elements
      if (!homeWrap) {
        return;
      }
      //set artist section height
      artistsSection.style.height = `${100 * (artistItems.length + 1)}lvh`;
      ScrollTrigger.refresh();

      //calculate height of frame
      const calculateFrameTransform = function () {
        const frame1 = imgFrames[0];
        let frameHeight = frame1.offsetHeight;
        let viewportHeight = window.innerHeight;
        frameTransform = frameHeight - viewportHeight;
        // console.log(frameHeight, viewportHeight, frameTransform);
      };
      calculateFrameTransform();
      //on mobile
      if (isMobile) {
        frameTransform === '50lvh';
      }

      //home scroll arrow loop

      let scrollArrowTL = gsap
        .timeline({
          repeat: -1,
        })
        .fromTo(
          heroScrollArrow,
          {
            y: '0rem',
          },
          {
            y: '3rem;',
            duration: 0.8,
          }
        )
        .to(heroScrollArrow, {
          y: '0rem',
          duration: 0.8,
        });
      //main timeline
      let tlMain = gsap
        .timeline({
          scrollTrigger: {
            trigger: homeScrollWrap,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
          defaults: {
            duration: 1,
            ease: 'none',
          },
        })
        .fromTo(
          imgFrames,
          {
            y: '0lvh',
          },
          {
            y: frameTransform,
          }
        )
        .fromTo(
          [imgBottom, imgLeft, imgRight, imgLeftGuy],
          {
            y: '0vh',
          },
          {
            y: '-10vh',
          },
          0
        )
        .to(
          imgLeft,
          {
            x: '-20%',
          },
          0
        )
        .to(
          imgLeftGuy,
          {
            x: '-5%',
          },
          0
        )
        .to(
          imgRight,
          {
            x: '20%',
          },
          0
        );
      // .to(
      //   imgRight,
      //   {
      //     y: '-10vh',
      //
      //   },
      //   0
      // );

      // hero panel
      gsap
        .timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom 90%',
            // markers: false,
            scrub: true,
          },
          defaults: {
            duration: 1,
            ease: 'power1.out',
          },
        })
        .fromTo(heroText, { yPercent: 0 }, { yPercent: -120, duration: 0.75 })
        .fromTo(heroScroll, { opacity: 1 }, { opacity: 0, duration: 0.5 }, '<')
        .fromTo(heroLogo, { yPercent: 0 }, { yPercent: -120 });

      // title panel
      const titleSplit = runSplit(titleText, 'chars, words, lines');
      gsap
        .timeline({
          scrollTrigger: {
            trigger: titleSection,
            start: 'top bottom',
            end: 'bottom 20%',
            scrub: true,
            markers: false,
          },
          defaults: {
            duration: 1,
            ease: 'power1.out',
          },
        })
        .set(homeBgTopWrap, { opacity: 1 })
        .fromTo(
          titleSplit.chars,
          { opacity: 0, x: '1rem' },
          { opacity: 1, x: '0rem', duration: 0.5, stagger: { from: 'start', each: 0.015 } }
        )
        .fromTo(imgLady, { opacity: 0 }, { opacity: 1, duration: 0.1 }, '<.5')
        .fromTo(imgRightGuy, { opacity: 0 }, { opacity: 1, duration: 0.2 }, '<')
        .fromTo(
          imgLady,
          { rotateZ: -35, yPercent: 0, xPercent: 0 },
          { rotateZ: 15, yPercent: -10, xPercent: -25 },
          '<'
        )
        .fromTo(
          imgShoe,
          { rotateZ: 0, yPercent: 5, xPercent: 0 },
          { rotateZ: 45, yPercent: 0, xPercent: -7 },
          '<'
        )
        .fromTo(imgRightGuy, { xPercent: 50 }, { xPercent: 0, duration: 0.5 }, '<')
        .to(homeBgTopWrap, { opacity: 0, duration: 0.1 }, '<.3');

      // details panel
      const detailsTL = gsap.timeline({
        scrollTrigger: {
          trigger: detailsSection,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          markers: false,
        },
        defaults: {
          duration: 1,
          ease: 'power1.out',
        },
      });
      // move cards in from side on desktop
      if (!isMobile) {
        detailsTL
          .fromTo(detailsCards[0], { xPercent: 30 }, { xPercent: 0, duration: 1 }, '<')
          .fromTo(detailsCards[1], { xPercent: -50 }, { xPercent: 0, duration: 1 }, '<')
          .fromTo(detailsCards[2], { xPercent: 80 }, { xPercent: 0, duration: 1 }, '<');
      } else {
        detailsTL
          .fromTo(detailsCards[0], { x: '2rem' }, { x: '0rem', duration: 1 }, '<')
          .fromTo(detailsCards[1], { x: '2rem' }, { x: '0rem', duration: 1 }, '<')
          .fromTo(detailsCards[2], { x: '2rem' }, { x: '0rem', duration: 1 }, '<');
      }

      detailsTL.to(backgroundOverlay, { opacity: 0.8, duration: 0.5 }, '<.2');

      detailsHeadings.forEach((item, index) => {
        const headingSplit = runSplit(item, 'words, lines');
        gsap
          .timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              end: 'center top',
              scrub: true,
              markers: false,
            },
            defaults: {
              duration: 1,
              ease: 'none',
            },
          })
          .fromTo(
            headingSplit.words,
            { opacity: 0, yPercent: 25 },
            { opacity: 1, yPercent: 0, duration: 0.5, stagger: { from: 'start', each: 0.1 } }
          )
          .fromTo(
            headingSplit.lines,
            { opacity: 1 },
            { opacity: 0, duration: 0.5, delay: 1, stagger: { from: 'start', each: 0.1 } }
          );
      });

      const artistTL = gsap.timeline({
        scrollTrigger: {
          trigger: artistsSection,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          markers: false,
        },
        defaults: {
          duration: 1,
          ease: 'none',
        },
      });
      // .set(artistItems, { opacity: 0 });
      artistTL.set(artistItems[0], { clipPath: clipDirections.full });

      artistItems.forEach((item, index) => {
        // artistTL.set(item, { opacity: 0 });
        //for every item exept the first one
        if (index !== 0) {
          artistTL.fromTo(
            item,
            { clipPath: clipDirections.bottom },
            { clipPath: clipDirections.full },
            '<.025'
          );
        }
        if (index !== artistItems.length - 1) {
          artistTL.to(item, { clipPath: clipDirections.top, delay: index === 0 ? 0.5 : 1.5 }, '<');
        }
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: taglineSection,
          start: 'top bottom',
          end: 'bottom 40%',
          scrub: true,
          markers: false,
        },
        defaults: {
          duration: 1,
          ease: 'power1.out',
        },
      });

      taglineItems.forEach((item, index) => {
        const headingSplit = runSplit(item, 'chars, lines');
        gsap
          .timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              end: 'top top',
              scrub: true,
              markers: false,
            },
            defaults: {
              duration: 1,
              ease: 'none',
            },
          })
          .fromTo(
            headingSplit.chars,
            { opacity: 0, yPercent: 10, x: '1.5rem' },
            { opacity: 1, yPercent: 0, x: '0rem', stagger: { from: 'start', each: 0.1 } }
          )
          .fromTo(item, { opacity: 1 }, { opacity: 0, duration: 0.5, delay: 1 });
      });
    }
  );
};
