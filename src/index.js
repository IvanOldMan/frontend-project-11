import  './styles.scss';
import  'bootstrap';
import i18next from 'i18next';
import * as yup from 'yup';
import { watchedState } from './view.js';
import ru from './locales/ru.js'
import axios from 'axios';
import parse from './parser';


i18next.init({
  lng: 'ru',
  debug: true,
  resources: { ru }
}).then(function(t) {
  document.querySelector('.display-3').textContent = t('elements.title');
  document.querySelector('.lead').textContent = t('elements.lead');
  document.getElementById('url-input').setAttribute('placeholder', t('elements.placeholder'));
  document.querySelector('label').textContent = t('elements.label');
  document.querySelector('.btn-lg').textContent = t('elements.button');
  document.querySelector('.example').textContent = t('elements.example');
});


const postsContainer = document.querySelector('.posts');
postsContainer.addEventListener('click', (event) => {
    const targetElement = event.target;

    const href = targetElement.closest('a');
    const button = targetElement.closest('button');

    if (href) {
      const id = href.dataset.id;
      watchedState.rss.posts.forEach(post => {
        if (post.id === id) {
          post.status = 'visited';
        }
      })
    }
    if (button) {
      const id = button.dataset.id;
      watchedState.rss.currentPostId = id;
      watchedState.rss.posts.forEach(post => {
        if (post.id === id) {
          post.status = 'visited';
        }
      })
    }
})


const form = document.forms[0];
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);


  const schema = yup.string().required().url();

  schema.validate(formData.get('url').trim())
    .then((url) => {
      if (!watchedState.rss.links.includes(url)) {
        watchedState.rss.links.push(url);
        watchedState.rss.valid = 'valid';
        watchedState.rss.errors = '';

        const wtf = () => {


          axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
          .then(response => {

            const content = response.data.contents;
            // handle success
            const parser = new DOMParser();
            const data = parser.parseFromString(content, 'text/xml');

            const errorNode = data.querySelector('parsererror');

            if (errorNode) {
              watchedState.rss.errors = i18next.t('errors.parse');
            } else {
              const { feed, posts } = parse(data);

              const currentFeeds = watchedState.rss.feeds
                .map(item => item.title);

              let currentFeedId = null;

              if (!currentFeeds.includes(feed.title)) {
                watchedState.rss.feeds.push(feed);
                currentFeedId = feed.id;
              } else {
                currentFeedId = watchedState.rss.feeds
                  .reduce((acc, cur) => {
                    if (cur.title === feed.title) {
                      acc = cur.id;
                    }
                    return acc;
                  }, -1)
              }


              const currentPosts = watchedState.rss.posts
                .filter(({ feedId }) => currentFeedId === feedId)
                .map(post => post.title);

              posts.forEach(post => {
                if (!currentPosts.includes(post.title)) {
                  watchedState.rss.posts.push(post);
                }
              });
            }
          })
          .catch(function (error) {
            // handle error
            console.log(error)
            watchedState.rss.errors = i18next.t('errors.handle');
          })
          .finally(() => {
            setInterval( wtf, 5_000);
          });
        }
        wtf();

      } else {
        watchedState.rss.valid = 'invalid';
        watchedState.rss.errors = i18next.t('errors.double');
      }
    })
    .catch((err) => {
      watchedState.rss.valid = 'invalid';
      watchedState.rss.errors = i18next.t('errors.validate');
    });
})

