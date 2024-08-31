import onChange from 'on-change';

const state = {
  rss: {
    valid: null,
    links: [],
    posts: [],
    feeds: [],
    errors: '',
    currentPostId: null,
  }
}

const render = (path, value, previousValue) => {
  if (path === 'rss.valid') {
    const input = document.getElementById('url-input');
    const form = document.querySelector('.rss-form');
    switch (value) {
      case 'invalid' :
        input.classList.add('is-invalid');
        break;
      case 'valid' :
        input.classList.remove('is-invalid');
        form.reset();
        break;
      default:
        throw new Error(`Unknown valid type: ${value}`);
    }
  }
  if (path === 'rss.errors') {
    const feedback = document.querySelector('.feedback');
    feedback.textContent = value;
  }
  if (path === 'rss.posts') {
    const divCard = document.createElement('div');
    divCard.classList.add('card', 'border-0');

    const divCardBody = document.createElement('div');
    divCardBody.classList.add('card-body');

    const h2 = document.createElement('h2');
    h2.textContent = 'Посты';
    h2.classList.add('card-title', 'h4');
    divCardBody.append(h2);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');

    watchedState.rss.posts.forEach(post => {
      const { id, title, description, link, status } = post;
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-start', 'border-0', 'border-end-0');

      const a = document.createElement('a');
      if (status === 'visited') {
        a.classList.add('fw-normal', 'link-secondary');
      } else {
        a.classList.add('fw-bold');
      }
      a.setAttribute('href', link);
      a.dataset.id = id;
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.textContent = title;

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('type', 'button');
      button.dataset.id = id;
      button.dataset.bsToggle = 'modal';
      button.dataset.bsTarget = '#modal';
      button.textContent = 'Просмотр';


      li.append(a, button);
      ul.append(li);
    });

    divCard.append(divCardBody, ul);

    const posts = document.querySelector('.posts');
    posts.replaceChildren(divCard);

  }
  if (path === 'rss.feeds') {

    const divCard = document.createElement('div');
    divCard.classList.add('card', 'border-0');

    const divCardBody = document.createElement('div');
    divCardBody.classList.add('card-body');

    const h2 = document.createElement('h2');
    h2.textContent = 'Фиды';
    h2.classList.add('card-title', 'h4');
    divCardBody.append(h2);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');

    watchedState.rss.feeds.forEach(feed => {
      const { title, description } = feed;
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');

      const h3 = document.createElement('h3');
      h3.classList.add('h6', 'm-0');
      h3.textContent = title;

      const p = document.createElement('p');
      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = description;
      li.append(h3, p);
      ul.append(li);
    });

    divCard.append(divCardBody, ul);

    const feeds = document.querySelector('.feeds');
    feeds.replaceChildren(divCard);
  }
  if (path === 'rss.currentPostId') {
    const title = document.querySelector('.modal-title');
    const body = document.querySelector('.modal-body');
    const link = document.querySelector('.modal-footer').querySelector('a');

    watchedState.rss.posts.forEach(post => {
      if (post.id === value) {
        title.textContent = post.title;
        body.textContent = post.description;
        link.setAttribute('href', post.link);
      }
    })
  }
}

const watchedState = onChange(state, render);


export { watchedState };
