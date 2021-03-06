import { isValidGiphyCommand, parseGiphyCommand, getGiphyResultFromKeyword, replaceHTTPwithHTTPS } from '../giphy/giphyHelpers';

global.fetch = require('node-fetch');

describe('isValidGiphyCommand', () => {
  it('is a function', () => {
    expect(typeof isValidGiphyCommand).toBe('function');
  });
  it('takes a string as an argument', () => {
    expect(isValidGiphyCommand.length).toBe(1);
  });
  it('returns a boolean', () => {
    const result = isValidGiphyCommand();
    expect(typeof result).toBe('boolean');
  });
  it('returns false if the command doesn\'t have a search term', () => {
    const result = isValidGiphyCommand('/giphy ');
    expect(result).toBe(false);
  });
  it('returns false if the string is not a giphy command', () => {
    const result = isValidGiphyCommand('some other stuff giphy/ /giphy');
    expect(result).toBe(false);
  });
  it('return true if the string is a valid giphy command', () => {
    const result = isValidGiphyCommand('/giphy cats');
    expect(result).toBe(true);
  });
});

describe('parseGiphyCommand', () => {
  it('is a function', () => {
    expect(typeof parseGiphyCommand).toBe('function');
  });
  it('takes a string as an argument', () => {
    expect(parseGiphyCommand.length).toBe(1);
  });
  it('returns a string', () => {
    const result = parseGiphyCommand('/giphy cats');
    expect(typeof result).toBe('string');
  });
  it('returns a single word if the keyword was a single word', () => {
    const result = parseGiphyCommand('/giphy cats');
    expect(result).toEqual('cats');
  });
  it('returns a string of multiple keywords if they were provided', () => {
    const result = parseGiphyCommand('/giphy random stuff here');
    expect(result).toEqual('random stuff here');
  });
});

describe('getGiphyResultFromKeyword', () => {
  it('is a function', () => {
    expect(typeof getGiphyResultFromKeyword).toBe('function');
  });
  it('accepts a keyword string', () => {
    expect(getGiphyResultFromKeyword.length).toEqual(1);
  });
  it('returns a promise', () => {
    const result = getGiphyResultFromKeyword('cats');
    expect(typeof result).toBe('object');
  });
  it('returns a giphy from the giphy API', () => {
    return getGiphyResultFromKeyword('cats').then((result) => {
      expect(result).toBeDefined();
    });
  });
});

describe('replaceHTTPwithHTTPS', () => {
  it('is a function', () => {
    expect(typeof replaceHTTPwithHTTPS).toBe('function');
  });
  it('takes a link as a parameter', () => {
    expect(replaceHTTPwithHTTPS.length).toEqual(1);
  });
  it('returns the original link if it is already HTTPS', () => {
    const url = 'https://somerandomlink';
    const result = replaceHTTPwithHTTPS(url);
    expect(result).toBe(url);
  });
  it('returns an https link if the link uses http', () => {
    const httpUrl = 'http://alink';
    const expected = 'https://alink';
    const result = replaceHTTPwithHTTPS(httpUrl);
    expect(result).toEqual(expected);
  });
});
