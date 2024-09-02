import axios from 'axios';
import watchedState from './render/view';
import CustomError from "./errorConstructor";
import _ from "lodash";

const getRequest = async (url) => {
  return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);
}

const parse = (content) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(content, 'text/xml');

  if (data.querySelector('parsererror')) {
    throw new CustomError('ParseError');
  }

  const title = data.querySelector('title').textContent;
  const description = data.querySelector('description').textContent;
  const feedId = _.uniqueId();

  const feed = { id: feedId, title, description };

  const posts = Array.from(data.querySelectorAll('item'))
  .reduce((acc, post) => {
    const id = _.uniqueId();
    const title = post.querySelector('title').textContent;
    const description = post.querySelector('description').textContent;
    const link = post.querySelector('link').textContent;

    acc.push(
      {
        id,
        title,
        description,
        link,
        feedId,
        status: 'unread',
      },
    );
    return acc;
  }, []);

  return { feed, posts };
}

const rssUpdate = ({ feed, posts }) => {
  const currentFeeds = watchedState.data.feeds.map((item) => item.title);
  let currentFeedId = null;

  if (!currentFeeds.includes(feed.title)) {
    watchedState.data.feeds.push(feed);
    currentFeedId = feed.id;
  } else {
    currentFeedId = watchedState.data.feeds
      .reduce((acc, cur) => {
        if (cur.title === feed.title) {
          acc = cur.id;
        }
        return acc;
      }, -1);
  }
  const currentPosts = watchedState.data.posts
    .filter(({ feedId }) => currentFeedId === feedId)
    .map((post) => post.title);

  console.log(currentPosts);

  posts.forEach((post) => {
    if (!currentPosts.includes(post.title)) {
      watchedState.data.posts.push(post);
    }
  });
}

export { getRequest, parse, rssUpdate}
