import onChange from 'on-change';
import state from '../state.js';
import i18nextInstance from '../index.js';
import { renderPosts, renderFeeds, renderModal } from './render.js';

const DomElements = {
  input: document.getElementById('url-input'),
  form: document.querySelector('.rss-form'),
  feedback: document.querySelector('.feedback'),
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'data.urls':
      DomElements.feedback.textContent = i18nextInstance.t('feedback.rssAdded');
      DomElements.feedback.classList.replace('text-danger', 'text-success');
      DomElements.input.classList.remove('is-invalid');
      DomElements.form.reset();
      break;

    case 'form.error':
      if (value) {
        DomElements.feedback.textContent = i18nextInstance.t(`feedback.${value}`);
        DomElements.feedback.classList.replace('text-success', 'text-danger');
        DomElements.input.classList.add('is-invalid');
      }
      break;

    case 'data.feeds':
      renderFeeds(watchedState.data.feeds);
      break;

    case 'data.posts':
      renderPosts(watchedState.data.posts);
      break;

    case 'currentPostId':
      watchedState.data.posts.forEach((post) => {
        if (post.id === value) {
          renderModal(post);
        }
      });
      break;

    default:
      throw new Error('Неизвестная ошибка, попробуйте еще раз');
  }
});

export default watchedState;
