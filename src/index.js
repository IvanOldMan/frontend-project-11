import  './styles.scss';
import  'bootstrap';
import i18next from 'i18next';
import * as yup from 'yup';
import { watchedState } from './view.js';
import ru from './locales/ru.js'


i18next.init({
  lng: 'ru',
  debug: true,
  resources: { ru }
}).then(function(t) {
  document.querySelector('.display-3').textContent = t('elements.title');
  document.querySelector('.lead').textContent = t('elements.lead');
  document.getElementById('url-input').setAttribute('placeholder', t('elements.placeholder'));
  document.querySelector('label').textContent = t('elements.label');
  document.querySelector('.btn-primary').textContent = t('elements.button');
  document.querySelector('.example').textContent = t('elements.example');
});



const form = document.forms[0];
form.addEventListener('submit', (event) => {
  console.log(watchedState);
  event.preventDefault();
  const formData = new FormData(form);

  const schema = yup.string().required().url();

  schema.validate(formData.get('url').trim())
    .then((url) => {
      if (!watchedState.rss.feeds.includes(url)) {
        watchedState.rss.feeds.push(url);
        watchedState.rss.valid = 'valid';
        watchedState.rss.errors = '';
      } else {
        watchedState.rss.valid = 'invalid';
        watchedState.rss.errors = i18next.t('errors.double');
      }
    })
    .catch((err) => {
      watchedState.rss.valid = 'invalid';
      watchedState.rss.errors = i18next.t('errors.validate');
      console.log(err.errors)
    });
})

