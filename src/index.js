import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import ru from './locales/ru';
import { watchedState, validateUrl, getRequest, rssUpdate } from './app';
import parse from './utils/parser';

const domElements = {
  title: document.querySelector('.display-3'),
  lead: document.querySelector('.lead'),
  input: document.getElementById('url-input'),
  form: document.forms[0],
  label: document.querySelector('label'),
  button: document.querySelector('form').querySelector('.btn'),
  example: document.querySelector('.example'),
  modal: {
    readButton: document.querySelector('.modal-footer').querySelector('a'),
    closeButton: document.querySelector('.modal-footer').querySelector('button'),
  },
  posts: document.querySelector('.posts'),
};

const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: true,
  resources: { ru },
})
  .then((t) => {
    domElements.title.textContent = t('elements.title');
    domElements.lead.textContent = t('elements.lead');
    domElements.input.setAttribute('placeholder', t('elements.placeholder'));
    domElements.label.textContent = t('elements.label');
    domElements.button.textContent = t('elements.button');
    domElements.example.textContent = t('elements.example');
    domElements.modal.readButton.textContent = t('elements.modal.readButton');
    domElements.modal.closeButton.textContent = t('elements.modal.closeButton');
  });

domElements.posts.addEventListener('click', (event) => {
  const targetElement = event.target;
  const href = targetElement.closest('a');
  const button = targetElement.closest('button');

  const id = href ? href.dataset.id : button.dataset.id;
  watchedState.currentPostId = id;
});

domElements.form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(domElements.form);
  const url = formData.get('url').trim();

  validateUrl(url)
    .then((validUrl) => getRequest(validUrl))
    .then((response) => response.data.contents)
    .then((data) => parse(data))
    .then(({ feed, posts }) => {
      watchedState.form.error = null;
      watchedState.data.urls.push(url);

      const { newFeeds, newPosts } = rssUpdate(feed, posts);
      newFeeds.forEach((feed) => watchedState.data.feeds.push(feed));
      newPosts.forEach((post) => watchedState.data.posts.push(post));
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
        data.forEach(({ feed, posts }) => {
          const { newFeeds, newPosts } = rssUpdate(feed, posts);
          newFeeds.forEach((feed) => watchedState.data.feeds.push(feed));
          newPosts.forEach((post) => watchedState.data.posts.push(post));
        });
      })
      .then(() => {
        setTimeout(() => {
          updatePosts();
        }, 5_000);
      })
      .catch(() => {
        throw new Error('Ошибка обновления');
      });
  };
  updatePosts();
});

export default i18nextInstance;
