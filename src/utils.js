import axios from 'axios';
import parse from './parser';
import watchedState from './render/view';

export default async function utils(url) {
  return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      const content = response.data.contents;
      const { feed, posts } = parse(content);

      watchedState.data.urls.push(url);

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

      posts.forEach((post) => {
        if (!currentPosts.includes(post.title)) {
          watchedState.data.posts.push(post);
        }
      });
    });
}
