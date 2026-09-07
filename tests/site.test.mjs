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
  const urls = [...html.matchAll(/(?:src|href|data-src)="([^"]+)"/g)].map((match) => match[1]);
  const localUrls = urls.filter((url) => !/^(?:https?:|mailto:|tel:|#)/.test(url));

  assert.ok(localUrls.length > 10);
  for (const url of localUrls) {
    assert.equal(url.startsWith('/'), false, `${url} must be relative for GitHub project pages`);
    assert.equal(existsSync(new URL(`../${url}`, import.meta.url)), true, `${url} should exist`);
  }
});

test('image and document delivery is optimized for slow networks', () => {
  assert.match(html, /rel="preload"[^>]+iqiyi-channels\.webp/);
  assert.match(html, /imagesrcset="assets\/work\/mobile\/iqiyi-channels\.webp/);
  assert.match(html, /srcset="assets\/work\/mobile\//);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /Dong-Xin-Resume-Web\.pdf/);
  assert.match(html, /查看个人简历/);
  assert.doesNotMatch(html, /download="董鑫-视觉设计简历\.pdf"/);
  assert.doesNotMatch(html, /约 \d+(?:\.\d+)? \w+B|轻量作品集/);
  assert.match(html, /class="button button-primary portfolio-cta"[^>]*aria-label="在新页面查看完整作品集"/);
  assert.match(html, /class="button button-primary portfolio-cta"[^>]*href="docs\/Dong-Xin-Portfolio-Web\.pdf"[^>]*target="_blank"/);
  assert.match(html, /<span>打开完整作品集<\/span>/);
  assert.match(css, /a\.button\.button-primary\.portfolio-cta:[^}]*color: #fff/s);
  assert.match(css, /a\.button\.button-primary\.portfolio-cta > span \{ color: #fff; \}/);
  assert.doesNotMatch(html, /打开 63 页完整作品集/);
  assert.match(script, /hydrateImage/);
  assert.match(script, /IntersectionObserver/);
  assert.match(script, /assets\/gallery\/mobile/);
  assert.ok(readFileSync(new URL('../docs/Dong-Xin-Resume-Web.pdf', import.meta.url)).byteLength < 700_000);
  assert.ok(readFileSync(new URL('../docs/Dong-Xin-Portfolio-Web.pdf', import.meta.url)).byteLength < 6_000_000);
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

test('public page does not expose a GitHub navigation control', () => {
  assert.doesNotMatch(html, /href="https:\/\/github\.com\//);
  assert.doesNotMatch(html, />GitHub<\/a>/);
});
