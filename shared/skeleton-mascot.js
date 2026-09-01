/**
 * 3D cartoon skeleton mascot assets.
 * - in-game: sitting pose (stitch_fskeleton)
 * - outside: standing pose (stitch_friendly_3d_cartoon_skeleton)
 */
(function (global) {
  var IN_GAME_BASE = 'mascots/in-game/skeleton-age-';
  var OUTSIDE_BASE = 'mascots/outside/skeleton-age-';

  var IN_GAME_AGES = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59];
  var OUTSIDE_AGES = [2, 5, 8, 14, 32, 35, 38, 41, 44, 50, 53, 56, 59];

  var STAGE_AGES = {
    1: 2,
    2: 5,
    3: 8,
    4: 14,
    5: 32
  };

  function closestAge(targetAge, ages) {
    var closest = ages[0];
    var diff = Math.abs(targetAge - closest);
    for (var i = 1; i < ages.length; i++) {
      var d = Math.abs(targetAge - ages[i]);
      if (d < diff) {
        diff = d;
        closest = ages[i];
      }
    }
    return closest;
  }

  function inGameFramePath(age, frame) {
    if (!frame || frame === 'idle') {
      return IN_GAME_BASE + age + '.png';
    }
    return IN_GAME_BASE + age + '-' + frame + '.png';
  }

  function inGameFrame(age, frame) {
    return inGameFramePath(age, frame);
  }

  function outsidePath(age) {
    return OUTSIDE_BASE + age + '.png';
  }

  function forInGameAge(targetAge) {
    return inGameFramePath(closestAge(targetAge, IN_GAME_AGES), 'idle');
  }

  function forOutsideAge(targetAge) {
    return outsidePath(closestAge(targetAge, OUTSIDE_AGES));
  }

  function forStage(stage, context) {
    var age = STAGE_AGES[stage] || STAGE_AGES[1];
    return context === 'in-game' ? inGameFramePath(age, 'idle') : outsidePath(age);
  }

  /** In-game feeding milestones — one age per successful calcium feed. */
  var FEED_PROGRESSION_AGES = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29];

  function forFeedCount(feedCount) {
    var index = Math.min(Math.max(feedCount, 0), FEED_PROGRESSION_AGES.length - 1);
    return inGameFramePath(FEED_PROGRESSION_AGES[index], 'idle');
  }

  function ageForFeedCount(feedCount) {
    var index = Math.min(Math.max(feedCount, 0), FEED_PROGRESSION_AGES.length - 1);
    return FEED_PROGRESSION_AGES[index];
  }

  function applyToImage(img, src) {
    if (img) img.src = src;
  }

  global.SkeletonMascot = {
    inGameAges: IN_GAME_AGES,
    outsideAges: OUTSIDE_AGES,
    stageAges: STAGE_AGES,
    inGamePath: function (age) { return inGameFramePath(age, 'idle'); },
    inGameFrame: inGameFrame,
    inGameFrames: ['idle', 'mouth-open', 'chew', 'happy', 'sad'],
    outsidePath: outsidePath,
    forInGameAge: forInGameAge,
    forOutsideAge: forOutsideAge,
    forStage: forStage,
    forFeedCount: forFeedCount,
    ageForFeedCount: ageForFeedCount,
    feedProgressionAges: FEED_PROGRESSION_AGES,
    applyToImage: applyToImage
  };
})(typeof window !== 'undefined' ? window : globalThis);
