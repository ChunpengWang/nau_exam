
// rem适配
function setRem() {
  const baseSize = 14;
  const scale = document.documentElement.clientWidth / 1920;
  document.getElementsByTagName('html')[0].style.fontSize = baseSize * Math.min(scale, 2) + 'px';
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  const appBgc = document.getElementById('appBgc');
  const dashboardBgc = document.getElementById('dashboardBgc');
  if (appBgc) {
    appBgc.style.width = width + 'px';
    appBgc.style.height = height + 'px';
  }
  if (dashboardBgc) {
    // dashboardBgc.style.width = width + 'px';
    // dashboardBgc.style.height = height + 55 + 'px';
    // dashboardBgc.style.paddingTop = (220 - (1080 - height)) / baseSize + 'rem';
  }
}
setRem();

window.addEventListener('load', setRem);
window.addEventListener('resize', setRem);

