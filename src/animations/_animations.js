/**
 * @ngdoc overview
 * @name Create Your Own Animations
 * @description
 *
 * You can add your own animations. Here's how we would add our own animation called 'banana', which fades in an element from 0.5 opacity to 1 opacity.
 *
 * <pre>
 * @keyframes bananain {
 *   from { opacity: 0.5; }
 *   to { opacity: 1.0; }
 * }
 * @keyframes bananaout {
 *   from { opacity: 1.0; }
 *   to { opacity: 0.5; }
 * }
 * .banana.in,
 * .banana.out.reverse {
 *   animation: bananain 350ms;
 *  }
 * .banana.out,
 * .banana.in.reverse {
 *   animation: bananaout 350ms;
 *  }
 * </pre>
 * 
 * And then, with the CSS included, you just need to tell angular-jqm that we have a new animation
 * class to register.
 *
 * <pre>
 * JQM_ANIMATIONS.push('banana');
 * </pre>
 */
var JQM_ANIMATIONS = [
  'slide',
  'fade',
  'pop',
  'slidefade',
  'slidedown',
  'slideup',
  'flip',
  'turn',
  'flow',
  'modal'
];
