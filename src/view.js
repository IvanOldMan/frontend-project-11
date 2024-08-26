import onChange from 'on-change';

const state = {
  rss: {
    valid: 'valid',
    feeds: [],
    errors: '',
  }

}

const render = (path, value, previousValue) => {
  if (path === 'rss.valid') {
    console.log('dfsgsdgf');
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

  }
}

const watchedState = onChange(state, render);


export { watchedState };
