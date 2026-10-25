const tabs = [...document.querySelectorAll('.nav-tabs a')];
function setActive(id) {
  tabs.forEach(link => {
    const active = link.hash === '#' + id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
const sections = [...document.querySelectorAll('section, .hero')];
let ticking = false;
function updateNavigation() {
  let current = sections[0].id;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= window.innerHeight * .4) current = section.id;
  }
  setActive(current);
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateNavigation); }
}, {passive:true});
updateNavigation();
document.querySelectorAll('[data-portrait]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-portrait]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    const avatar = button.dataset.portrait === 'avatar';
    const portrait = document.querySelector('.portrait');
    portrait.src = avatar ? 'avatar.png' : 'original-2.png';
    portrait.alt = avatar ? 'Arnab’s illustrated avatar with a red beanie and glasses' : 'Arnab singing into a microphone on stage';
    portrait.style.objectFit = avatar ? 'contain' : '';
    portrait.style.borderRadius = avatar ? '80px' : '';
  });
});
document.getElementById('y').textContent = new Date().getFullYear();
document.getElementById('cf').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('n').value.trim();
  const email = document.getElementById('e').value.trim();
  const type = document.getElementById('t').value;
  const message = document.getElementById('m').value.trim();
  const to = 'arnabchakraborty78405@gmail.com';
  const subject = encodeURIComponent('Booking enquiry: ' + type + ' (' + name + ')');
  const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
  if (event.submitter?.id === 'mt') window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
  else window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) + '&su=' + subject + '&body=' + body, '_blank', 'noopener');
  document.getElementById('form-status').textContent = 'Your email draft is ready. Send it from your email app to complete your enquiry.';
});
