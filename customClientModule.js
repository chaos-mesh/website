export function onRouteUpdate() {
  if (window.gsapCtx) {
    window.gsapCtx.revert()

    window.gsapCtx = null
  }
}
