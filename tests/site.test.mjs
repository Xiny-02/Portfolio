import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');

test('page contains the job-seeking narrative and primary sections', () => {
  for (const expected of [
    '寻找 2027 届校招机会',
    '让复杂内容',
    '精选作品',
    '实践经历',
    '关于我',
    '保持联系',
  ]) {
    assert.match(html, new RegExp(expected));
  }
});

test('all local src and href assets exist and project-site paths stay relative', () => {
  const urls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
  const localUrls = urls.filter((url) => !/^(?:https?:|mailto:|tel:|#)/.test(url));

  assert.ok(localUrls.length > 10);
  for (const url of localUrls) {
    assert.equal(url.startsWith('/'), false, `${url} must be relative for GitHub project pages`);
    assert.equal(existsSync(new URL(`../${url}`, import.meta.url)), true, `${url} should exist`);
  }
});

test('portfolio galleries reference existing images', () => {
  const imagePaths = [...script.matchAll(/'((?:assets\/work\/)[^']+)'/g)].map((match) => match[1]);
  assert.ok(imagePaths.length >= 15);

  for (const imagePath of imagePaths) {
    assert.equal(existsSync(new URL(`../${imagePath}`, import.meta.url)), true, `${imagePath} should exist`);
  }
});

test('responsive and reduced-motion safeguards are present', () => {
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-label="上一张作品"/);
});
