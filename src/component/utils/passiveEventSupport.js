// try to handle passive events
let passiveEventSupported = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      passiveEventSupported = true;
    }
  });
  window.addEventListener('test', null, opts);
}
catch (e) { }
// if they are supported, setup the optional params
// IMPORTANT: FALSE doubles as the default CAPTURE value!

export const passiveEvent = passiveEventSupported ? { capture: false, passive: true } : false;
