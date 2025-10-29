(function () {
  'use strict';

  // Function to focus the video player
  function focusPlayer() {
    const video = document.querySelector('video');
    if (video) {
      // Remove focus from any other element (like volume slider)
      document.activeElement?.blur();

      // Focus the video element
      video.focus();

      // Optional: Add visual feedback
      video.style.outline = '2px solid #00ff00';
      setTimeout(() => {
        video.style.outline = '';
      }, 300);

      console.log('YouTube player focused by extension');
      return true;
    }
    return false;
  }

  // Try to focus immediately
  if (!focusPlayer()) {
    // If player not ready, wait for it
    const observer = new MutationObserver((mutations, obs) => {
      if (focusPlayer()) {
        obs.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Fallback: try every 500ms for up to 10 seconds
    let attempts = 0;
    const interval = setInterval(() => {
      if (focusPlayer() || attempts++ > 20) {
        clearInterval(interval);
        observer.disconnect();
      }
    }, 500);
  }

  // Re-focus when user clicks elsewhere (e.g., volume, settings)
  document.addEventListener('click', (e) => {
    setTimeout(focusPlayer, 100); // slight delay to override YouTube's focus
  }, true);

  // Re-focus on spacebar or other keypress if focus was stolen
  document.addEventListener('keydown', (e) => {
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'f', 'k'].includes(e.key)) {
      const video = document.querySelector('video');
      if (video && document.activeElement !== video) {
        e.preventDefault();
        video.focus();
      }
    }
  });

})();