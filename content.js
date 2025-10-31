(function () {
  'use strict';

  let hasFocused = false;               // <-- remember if we already focused
  let observer   = null;                // keep a reference so we can stop it

  // -----------------------------------------------------------------
  // 1. Focus the <video> element (only once)
  // -----------------------------------------------------------------
  function tryFocusPlayer() {
    if (hasFocused) return true;        // already done → stop everything

    const video = document.querySelector('video');
    if (!video) return false;           // not ready yet

    // ---- focus ----------------------------------------------------
    document.activeElement?.blur();    // remove focus from any other UI
    video.focus();

    // optional visual cue
    video.style.outline = '2px solid #00ff00';
    setTimeout(() => video.style.outline = '', 300);

    console.log('YouTube player focused (once) by extension');
    hasFocused = true;

    // ---- clean-up -------------------------------------------------
    if (observer) observer.disconnect();
    return true;
  }

  // -----------------------------------------------------------------
  // 2. Run immediately, then watch the DOM for the player
  // -----------------------------------------------------------------
  if (!tryFocusPlayer()) {
    observer = new MutationObserver(() => {
      if (tryFocusPlayer()) observer.disconnect();
    });

    observer.observe(document.body, {
      childList: true,
      subtree:   true
    });

    // Fallback polling (max 10 s)
    let attempts = 0;
    const poll = setInterval(() => {
      if (tryFocusPlayer() || ++attempts > 20) {
        clearInterval(poll);
        if (observer) observer.disconnect();
      }
    }, 500);
  }

  // -----------------------------------------------------------------
  // 3. NO further interference
  // -----------------------------------------------------------------
  //   • No click listener
  //   • No keydown listener
  //   • Search bar, volume, settings, etc. keep their normal focus
})();