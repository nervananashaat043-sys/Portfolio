/* 1. Live clock for Cairo */
const clock = document.getElementById('clock');
function tick() {
  clock.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Cairo' });
}
tick();
setInterval(tick, 30000);

/* 2. Typing effect for the role */
const roles = ['Web Developer', 'Front-end Developer', 'Responsive Designer'];
const roleEl = document.getElementById('role');
let ri = 0, ci = 0, deleting = false;
function typeRole() {
  const word = roles[ri];
  roleEl.textContent = word.slice(0, ci);
  if (!deleting && ci === word.length) { deleting = true; return setTimeout(typeRole, 1500); }
  if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  ci += deleting ? -1 : 1;
  setTimeout(typeRole, deleting ? 40 : 80);
}
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { ci = 0; typeRole(); }

/* 3. Highlight the current section in the dock */
const dockLinks = document.querySelectorAll('.dock a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      dockLinks.forEach(a => {
        const on = a.getAttribute('href') === '#' + e.target.id;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(s => observer.observe(s));

/* 4. Project details dialog */
const dlg = document.getElementById('dlg');
document.querySelectorAll('.project').forEach(card => card.addEventListener('click', () => {
  document.getElementById('dlgTitle').textContent = card.dataset.title;
  document.getElementById('dlgTags').textContent = card.dataset.tags;
  document.getElementById('dlgText').textContent = card.dataset.text;
  document.getElementById('dlgDemo').href = card.dataset.demo;
  document.getElementById('dlgRepo').href = card.dataset.repo;
  dlg.showModal();
}));
document.getElementById('dlgClose').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

/* 5. Contact form: validate, then send */
const RECEIVER_EMAIL = 'you@example.com'; // change to your email
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

function setError(id, msg) {
  const input = document.getElementById(id);
  document.getElementById(id + 'Error').textContent = msg;
  input.closest('.field').classList.toggle('invalid', Boolean(msg));
  input.setAttribute('aria-invalid', Boolean(msg));
  return !msg;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const ok = [
    setError('name', name.length >= 2 ? '' : 'Enter your name (at least 2 letters).'),
    setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email, like name@example.com.'),
    setError('message', message.length >= 10 ? '' : 'Write at least 10 characters.')
  ].every(Boolean);
  if (!ok) {
    statusEl.textContent = '';
    form.querySelector('.invalid input, .invalid textarea')?.focus();
    return;
  }
  /* Opens the visitor's email app with the message ready.
     To send without an email app, use fetch() with a form service like Formspree (see README). */
  const subject = encodeURIComponent('Portfolio message from ' + name);
  const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');
  window.location.href = 'mailto:' + RECEIVER_EMAIL + '?subject=' + subject + '&body=' + body;
  statusEl.textContent = 'Thanks, ' + name + '. Your email app should open with the message ready to send.';
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
