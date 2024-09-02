import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import * as yup from 'yup';
import watchedState from './render/view';
import ru from './locales/ru';
import init from './init';
import CustomError from './errorConstructor';
import { getRequest, parse, rssUpdate } from './utils';

const timeout = 15_000;

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
        post.status = 'visited';
      }
    });
  }
  if (button) {
    const { id } = button.dataset;
    watchedState.currentPostId = id;
    watchedState.data.posts.forEach((post) => {
      if (post.id === id) {
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
    .then((url) => {
      if (!url.trim()) {
        throw new CustomError('EmptyError');
      }
      if (!watchedState.data.urls.includes(url)) {
        watchedState.form.isValid = true;
        watchedState.form.error = null;
        return url;
      } else {
        watchedState.form.IsValid = false;
        throw new CustomError('DuplicateError');
      }
    })
    .then((url) => getRequest(url))
    .then((response) => parse(response.data.contents))
    .then((data) => {
      watchedState.data.urls.push(url);
      rssUpdate(data);
    })
    .catch((error) => {
      watchedState.form.IsValid = false;
      console.log(error.message)
      watchedState.form.error = error.name;
    });

  const updatePosts = () => {
    const urls = watchedState.data.urls;
    const promises = urls.map((url) => getRequest(url));
    Promise.all(promises)
      .then((response) => {
        return response.map((element) => parse(element.data.contents))
      })
      .then((data) => {
        data.forEach((item) => rssUpdate(item));
        console.log('update')
      })
      .then(() => {
        setTimeout(() => {
          updatePosts();
        }, timeout);
      })
      .catch((error) => {
        throw new Error('Ошибка обновления');
      });
  };
  updatePosts();
});

export default i18nextInstance;
