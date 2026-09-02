/**
 * In-game sitting skeleton mascot (PNG sprites from stitch_friendly_3d_cartoon_skeleton).
 * Idle sprites per age + optional mood frames (age 5 has full expression set).
 */
(function (global) {
  var FEED_PROGRESSION_AGES = [5, 8, 11, 14, 17];
  var MOOD_FRAMES = ['idle', 'mouth-open', 'chew', 'chew-2', 'happy', 'sad'];
  var EXPRESSION_AGE = 5;
  var EXPRESSION_FRAMES = ['mouth-open', 'chew', 'chew-2', 'happy', 'sad'];

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function resolveEl(el) {
    if (!el) return null;
    if (el.id) {
      var live = document.getElementById(el.id);
      if (live) return live;
    }
    return el;
  }

  function readAge(el) {
    var fromData = parseInt(el.getAttribute('data-age'), 10);
    if (!isNaN(fromData)) return fromData;
    var match = (el.getAttribute('src') || '').match(/age-(\d+)/);
    return match ? parseInt(match[1], 10) : 5;
  }

  function assetBase(el) {
    var src = el.getAttribute('src') || '';
    var match = src.match(/^(.*\/skeleton-age-)\d+(?:-[^/]+)?\.png$/);
    if (match) return match[1];
    return '../shared/mascots/in-game/skeleton-age-';
  }

  function framePath(el, age, frame) {
    var base = assetBase(el);
    frame = frame || 'idle';
    if (frame === 'idle') return base + age + '.png';
    return base + EXPRESSION_AGE + '-' + frame + '.png';
  }

  function preloadExpressions(el) {
    var base = assetBase(el);
    var i;
    for (i = 0; i < EXPRESSION_FRAMES.length; i++) {
      var img = new Image();
      img.src = base + EXPRESSION_AGE + '-' + EXPRESSION_FRAMES[i] + '.png';
    }
  }

  function clearMood(el) {
    var i;
    for (i = 0; i < MOOD_FRAMES.length; i++) {
      el.classList.remove('skelly--' + MOOD_FRAMES[i]);
      el.classList.remove('mascot-mood--' + MOOD_FRAMES[i]);
    }
  }

  function normalizeFrame(frame) {
    return frame || 'idle';
  }

  function applyFrame(el, age, frame) {
    frame = normalizeFrame(frame);
    el.setAttribute('data-frame', frame);
    el.setAttribute('data-mood', frame);
    el.src = framePath(el, age, frame);
    return el;
  }

  function setFrame(el, frame) {
    el = resolveEl(el);
    if (!el) return el;
    clearMood(el);
    frame = normalizeFrame(frame);
    el.classList.add('skelly--' + frame);
    el.classList.add('mascot-mood--' + frame);
    return applyFrame(el, readAge(el), frame);
  }

  function setAge(el, age) {
    el = resolveEl(el);
    if (!el || age == null) return el;
    age = clamp(Number(age) || 5, 2, 59);
    el.setAttribute('data-age', String(age));
    el.setAttribute('aria-label', 'Skeleton mascot, age ' + age);
    return setFrame(el, el.getAttribute('data-frame') || 'idle');
  }

  function getMouthPoint(el) {
    el = resolveEl(el) || el;
    var rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * 0.2
    };
  }

  function getHeadBounds(el) {
    el = resolveEl(el) || el;
    var rect = el.getBoundingClientRect();
    return {
      left: rect.left + rect.width * 0.12,
      right: rect.right - rect.width * 0.12,
      top: rect.top,
      bottom: rect.top + rect.height * 0.45,
      centerX: rect.left + rect.width * 0.5,
      centerY: rect.top + rect.height * 0.2
    };
  }

  function isNearHead(el, x, y, padding) {
    var head = getHeadBounds(el);
    padding = padding == null ? 72 : padding;
    return (
      x >= head.left - padding &&
      x <= head.right + padding &&
      y >= head.top - padding &&
      y <= head.bottom + padding
    );
  }

  function mount(target, opts) {
    opts = opts || {};
    if (!target) return null;

    var el = resolveEl(target);
    if (!el || el.tagName.toLowerCase() !== 'img') return el;

    var age = opts.age != null ? opts.age : readAge(el);
    var mood = opts.mood || el.getAttribute('data-frame') || 'idle';
    el.classList.add('mascot-stage__character', 'skelly', 'skelly--sit');
    el.setAttribute('data-mascot-pose', 'sit');
    preloadExpressions(el);
    setAge(el, age);
    return setFrame(el, mood);
  }

  function ageForFeedCount(feedCount) {
    var index = Math.min(Math.max(feedCount - 1, 0), FEED_PROGRESSION_AGES.length - 1);
    return FEED_PROGRESSION_AGES[index];
  }

  function forFeedCount(feedCount) {
    return 'png:age-' + ageForFeedCount(feedCount);
  }

  function autoMount() {
    var img = document.getElementById('game-skeleton');
    if (img && img.tagName && img.tagName.toLowerCase() === 'img') {
      mount(img);
    }
  }

  autoMount();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  }

  global.SkeletonMascot = {
    inGameFrames: MOOD_FRAMES,
    expressionAge: EXPRESSION_AGE,
    hasFrames: function () { return true; },
    hasChewAlt: function () { return true; },
    forFeedCount: forFeedCount,
    ageForFeedCount: ageForFeedCount,
    setAge: setAge,
    setFrame: setFrame,
    getMouthPoint: getMouthPoint,
    getHeadBounds: getHeadBounds,
    isNearHead: isNearHead,
    mount: mount
  };
})(typeof window !== 'undefined' ? window : globalThis);
