import { attr, checkBreakpoints, runSplit } from '../utilities';

export const homeAnimations = function () {
  const homeWrap = document.querySelector('.home_wrap');
  const homeScrollWrap = document.querySelector('.home_scroll_wrap');
  const homeBgWrap = document.querySelector('.home_bg_wrap');
  const homeBgTopWrap = document.querySelector('.home_bg_top_wrap');
  const backgroundOverlay = document.querySelector('.home_bg_overlay');
  if (!homeWrap) {
    return;
  }
  //home loading interaction
  const homeLoad = function () {};
  homeLoad();
  //home scrolling interaction
  const homeScroll = function () {};
  homeScroll();
};
