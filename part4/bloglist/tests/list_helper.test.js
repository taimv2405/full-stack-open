const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

const emptyList = [];

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
];

const listWithMultipleBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
];

const listWithFavoriteBlogTies = [
  ...listWithMultipleBlogs,
  {
    _id: '5a422b3a1b54a676234d17fa',
    title: 'Another highly liked blog',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 12,
    __v: 0,
  },
];

const listWithAuthorTies = [
  ...listWithMultipleBlogs,
  {
    _id: '5a422b3a1b54a676234d17fb',
    title: 'Another React pattern',
    author: 'Michael Chan',
    url: 'http://example.com/2',
    likes: 10,
  },
];

describe('dummy', () => {
  test('returns one', () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
  });
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList);
    assert.strictEqual(result, 0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    assert.strictEqual(result, 24);
  });
});

describe('favorite blog', () => {
  test('of empty list returns null', () => {
    const result = listHelper.favoriteBlog(emptyList);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, returns that exact blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    assert.deepStrictEqual(result, listWithOneBlog[0]);
  });

  test('of a bigger list, returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs);
    assert.deepStrictEqual(result, listWithMultipleBlogs[2]);
  });

  test('when multiple blogs have the same top likes, returns the first one encountered', () => {
    const result = listHelper.favoriteBlog(listWithFavoriteBlogTies);
    assert.deepStrictEqual(result, listWithMultipleBlogs[2]);
  });
});

describe('most blogs', () => {
  test('of empty list returns null', () => {
    const result = listHelper.mostBlogs(emptyList);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, returns the author of that blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 1 });
  });

  test('of a bigger list, returns the author who has the largest amount of blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs);
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 2 });
  });

  test('when multiple authors have the same top amount of blogs, returns one of them', () => {
    const result = listHelper.mostBlogs(listWithAuthorTies);

    assert.deepStrictEqual(result, { author: 'Michael Chan', blogs: 2 });
  });
});

describe('most likes', () => {
  test('of empty list returns null', () => {
    const result = listHelper.mostLikes(emptyList);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, returns the author and likes of that blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 5 });
  });

  test('of a bigger list, returns the author who has the largest amount of likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs);
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 });
  });

  test('when multiple authors have the same top likes, returns one of them', () => {
    const result = listHelper.mostLikes(listWithAuthorTies);

    const allowedResults = [
      { author: 'Michael Chan', likes: 17 },
      { author: 'Edsger W. Dijkstra', likes: 17 },
    ];

    const isValidResult = allowedResults.some(
      (res) => res.author === result.author && res.likes === result.likes,
    );

    assert.ok(
      isValidResult,
      `Expected result to be one of ${JSON.stringify(allowedResults)}, but got ${JSON.stringify(result)}`,
    );
  });
});
