import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import * as yup from 'yup';
import watchedState from './render/view.js';
import ru from './locales/ru.js';
import init from './init.js';
import CustomError from './errorConstructor.js';
import { getRequest, parse, rssUpdate } from './utils.js';

const timeout = 5_000;

const i18nextInstance = i18next.createInstance();

i18nextInstance.init({
  lng: 'ru',
  debug: true,
  resources: { ru },
})
  .then((t) => init(t));

const postsContainer = document.querySelector('.posts');
postsContainer.addEventListener('click', (event) => {
  const targetElement = event.target;

  const href = targetElement.closest('a');
  const button = targetElement.closest('button');

  if (href) {
    const { id } = href.dataset;
    watchedState.data.posts.forEach((post) => {
      if (post.id === id) {
        // eslint-disable-next-line no-param-reassign
        post.status = 'visited';
      }
    });
  }
  if (button) {
    const { id } = button.dataset;
    watchedState.currentPostId = id;
    watchedState.data.posts.forEach((post) => {
      if (post.id === id) {
        // eslint-disable-next-line no-param-reassign
        post.status = 'visited';
      }
    });
  }
});

const form = document.forms[0];
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const url = formData.get('url').trim();

  const schema = yup.string().required().url();

  schema.validate(url)
    .then((link) => {
      if (!link.trim()) {
        throw new CustomError('EmptyError');
      }
      if (!watchedState.data.urls.includes(link)) {
        watchedState.form.error = null;
      } else {
        throw new CustomError('DuplicateError');
      }
      return link;
    })
    .then((url) => getRequest(url))
    .then((response) => parse(response.data.contents))
    .then((data) => {
      watchedState.data.urls.push(url);
      rssUpdate(data);
    })
    .catch((error) => {
      watchedState.form.error = error.name;
    });

  const updatePosts = () => {
    const { urls } = watchedState.data;
    const promises = urls.map((curUrl) => getRequest(curUrl));
    Promise.all(promises)
      .then((response) => response.map((element) => parse(element.data.contents)))
      .then((data) => {
        data.forEach((item) => rssUpdate(item));
      })
      .then(() => {
        setTimeout(() => {
          updatePosts();
        }, timeout);
      })
      .catch(() => {
        throw new Error('Ошибка обновления');
      });
  };
  updatePosts();
});

export default i18nextInstance;
