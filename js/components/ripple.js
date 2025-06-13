export function initGlobalRipple() {
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('span');
    const size = 40;

    ripple.style.position = 'fixed';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - size / 2}px`;
    ripple.style.top = `${e.clientY - size / 2}px`;
    ripple.style.borderRadius = '50%';
    ripple.style.border = '2px solid #3498db';
    ripple.style.backgroundColor = 'transparent';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple-follow 0.6s ease-out';

    document.body.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });
}
