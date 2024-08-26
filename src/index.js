import  './styles.scss';
import  'bootstrap';
import * as yup from 'yup';
import { watchedState } from './view.js';

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
      } else {
        watchedState.rss.valid = 'invalid';
        watchedState.rss.errors = 'double';
      }


    })
    .catch((err) => {
      watchedState.rss.valid = 'invalid';
      watchedState.rss.errors = err;
    });
})

