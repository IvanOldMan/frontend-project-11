import _ from 'lodash';
import CustomError from './app';

export default function parse(content) {
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
