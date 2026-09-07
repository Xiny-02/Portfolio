import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');

test('page contains the job-seeking narrative and primary sections', () => {
  for (const expected of [
    '寻找 2027 届校招机会',
    '好的设计会温和地引导人',
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
  const expectedCounts = { iqiyi: 6, muchun: 22, posters: 13, illustration: 15 };
  for (const [gallery, expectedCount] of Object.entries(expectedCounts)) {
    const galleryUrl = new URL(`../assets/gallery/${gallery}/`, import.meta.url);
    assert.equal(existsSync(galleryUrl), true, `${gallery} gallery should exist`);
    assert.equal(readdirSync(galleryUrl).filter((file) => file.endsWith('.webp')).length, expectedCount);
  }
});

test('project gallery supports continuous vertical scrolling', () => {
  assert.match(html, /data-gallery-scroll/);
  assert.match(html, /data-gallery-pages/);
  assert.match(css, /\.gallery-scroll \{[^}]*overflow-y: auto/s);
  assert.match(script, /createPages\('muchun', 4, 25/);
  assert.match(script, /galleryScroll\?\.addEventListener\('scroll'/);
});

test('about section includes the interactive five-photo carousel', () => {
  assert.match(html, /好的设计会温和地引导人/);
  assert.equal((html.match(/data-life-slide/g) || []).length, 5);
  assert.equal((html.match(/data-life-dot=/g) || []).length, 5);
  assert.match(script, /showLifeSlide/);
  assert.match(script, /touchstart/);
  for (let index = 1; index <= 5; index += 1) {
    assert.equal(existsSync(new URL(`../assets/life/life-${index}.webp`, import.meta.url)), true);
  }
});

test('responsive and reduced-motion safeguards are present', () => {
  assert.match(css, /@media \(max-width: 520px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-label="上一张作品"/);
});
