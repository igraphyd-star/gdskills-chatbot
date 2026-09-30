# GDSkills Chat Assistant

Floating help-chatbot widget for [gdskills.pk](https://gdskills.pk) — answers new students' questions about courses (prices, outlines, duration, instructors), explains the admission/buy flow and payment methods, and hands off to WhatsApp when needed.

- **Bilingual:** Roman Urdu (default) + English toggle
- **No backend:** pure client-side, zero cost, no data leaves the browser
- **Knowledge base:** all 14 GDSkills courses with prices, outlines, durations + FAQs (payment, refund, certificate, contact)

## Usage on the site

A tiny loader snippet (WPCode, site-wide footer) loads this file via CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/igraphyd-star/gdskills-chatbot@main/gd-chatbot.js" defer></script>
```

## Updating course info

Edit `gd-chatbot.js` (the `COURSES` array), commit and push. To bust the CDN cache, either wait for jsDelivr's refresh or pin a new version tag and update the loader URL:

```
https://cdn.jsdelivr.net/gh/igraphyd-star/gdskills-chatbot@v1.1/gd-chatbot.js
```

## Local logic test

```
node test-logic.js
```
