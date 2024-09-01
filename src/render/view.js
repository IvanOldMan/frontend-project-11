import onChange from 'on-change';
import state from '../state';
import i18nextInstance from '../index';
import { renderPosts, renderFeeds, renderModal } from './render';

const DomElements = {
  input: document.getElementById('url-input'),
  form: document.querySelector('.rss-form'),
  feedback: document.querySelector('.feedback'),
};

const render = (path, value) => {
  switch (path) {
    case 'form.IsValid':
      if (value) {
        DomElements.input.classList.remove('is-invalid');
        DomElements.form.reset();
      } else {
        DomElements.input.classList.add('is-invalid');
      }
      break;
    case 'data.urls':
      DomElements.feedback.textContent = i18nextInstance.t('feedback.rssAdded');
      DomElements.feedback.classList.replace('text-danger', 'text-success');
      break;

    case 'form.error':
      if (value) {
        DomElements.feedback.textContent = i18nextInstance.t(`feedback.${value}`);
        DomElements.feedback.classList.replace('text-success', 'text-danger');
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
  }
};
const watchedState = onChange(state, render);

export default watchedState;
