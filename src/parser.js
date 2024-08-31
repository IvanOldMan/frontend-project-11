import _ from "lodash";

export default function (content) {
  const title = content.querySelector('title').textContent;
  const description = content.querySelector('description').textContent;
  const feedId = _.uniqueId();

  const feed = { id: feedId, title, description};

  const posts = Array.from(content.querySelectorAll('item'))
    .reduce((acc, post) => {
      const id = _.uniqueId();
      const title = post.querySelector('title').textContent;
      const description = post.querySelector('description').textContent;
      const link = post.querySelector('link').textContent;

      acc.push({ id, title, description, link, feedId, status: 'unread' });
      return acc;
    }, []);


  return { feed, posts };
}
