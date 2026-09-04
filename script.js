const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

toggle?.addEventListener('click', () => nav.classList.toggle('open'));

document.querySelectorAll('.nav a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});

/*
 * APEX → GOOGLE FORMS
 *
 * Le formulaire HTML conserve le design APEX et envoie les réponses
 * vers le Google Form, puis vers la feuille Google Sheets liée au formulaire.
 *
 * Les 7 questions du Google Form sont :
 * 1. Nom du parent/tuteur
 * 2. Téléphone
 * 3. Courriel
 * 4. Nom de l'enfant
 * 5. Âge
 * 6. Niveau souhaité
 * 7. Message
 *
 * Les identifiants entry.xxxxx ont été récupérés depuis le lien prérempli
 * fourni pour ce formulaire.
 */
const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdNSyE2t9qrdBcfGB_FGYOuQbgaVFAfxpiPQ1kKKnMS__Z0rw/formResponse';

const GOOGLE_ENTRIES = {
  parent: 'entry.1870076568',
  phone: 'entry.1800753352',
  email: 'entry.75536134',
  child: 'entry.270341202',
  age: 'entry.551131141',
  level: 'entry.1976883162',
  message: 'entry.312136296'
};

const registrationForm = document.querySelector('#registrationForm');
const formMessage = document.querySelector('#formMessage');

registrationForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!registrationForm.checkValidity()) {
    registrationForm.reportValidity();
    return;
  }

  const values = Object.fromEntries(new FormData(registrationForm).entries());

  const ready = Object.values(GOOGLE_ENTRIES).every(
    (value) => /^entry\.\d+$/.test(value)
  );

  if (!ready) {
    formMessage.style.color = '#b45309';
    formMessage.textContent =
      "Le formulaire APEX est prêt. Il reste à renseigner les identifiants des 7 champs Google Forms dans script.js.";
    return;
  }

  const googleData = new URLSearchParams();
  googleData.set(GOOGLE_ENTRIES.parent, values.parent);
  googleData.set(GOOGLE_ENTRIES.phone, values.phone);
  googleData.set(GOOGLE_ENTRIES.email, values.email);
  googleData.set(GOOGLE_ENTRIES.child, values.child);
  googleData.set(GOOGLE_ENTRIES.age, values.age);
  googleData.set(GOOGLE_ENTRIES.level, values.level);
  googleData.set(GOOGLE_ENTRIES.message, values.message || '');

  formMessage.style.color = '#555';
  formMessage.textContent = 'Envoi de votre demande…';

  try {
    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: googleData
    });

    formMessage.style.color = '#16803b';
    formMessage.textContent =
      "Merci ! Votre demande de réservation a été envoyée. L'équipe APEX vous contactera prochainement.";
    registrationForm.reset();
  } catch (error) {
    console.error(error);
    formMessage.style.color = '#b91c1c';
    formMessage.textContent =
      "Une erreur est survenue. Veuillez réessayer.";
  }
});
