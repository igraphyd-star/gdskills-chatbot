# GDSkills Chatbots

Two bots, one repo:

1. **`gd-chatbot.js` — "GDSkills Assistant" (public):** floating help-chatbot widget for [gdskills.pk](https://gdskills.pk) — answers new students' questions about courses (prices, outlines, duration, instructors), explains the admission/buy flow and payment methods, and hands off to WhatsApp when needed.
   - Bilingual: Roman Urdu (default) + English toggle
   - No backend: pure client-side, zero cost, no data leaves the browser
   - Knowledge base: all 14 GDSkills courses with prices, outlines, durations + FAQs (payment, refund, certificate, contact)
   - Loader (WPCode HTML snippet, site-wide footer):
     `<script src="https://cdn.jsdelivr.net/gh/igraphyd-star/gdskills-chatbot@main/gd-chatbot.js" defer></script>`

2. **`gd-study-helper.js` — "GDSkills Study Helper" (paid students only):** helps enrolled students with course summaries, ~20 topic explainers (layers, SEO, makharij, pricing…), task/assignment guidance, and troubleshooting (video, login, access, receipt, certificate, quiz tips).
   - Visible ONLY to logged-in users with a paid WooCommerce order or a LearnDash enrollment (free Tajweed excluded). The PHP gating snippet (`study-helper-php-snippet.txt`, WPCode PHP snippet, site-wide footer) enforces this server-side and passes the student's enrolled course titles as `window.__gdcaMyCourses` for personalized greeting.
   - The helper hides the public bot button so paid students see only one bot.
   - Loader (printed by the PHP snippet):
     `<script src="https://cdn.jsdelivr.net/gh/igraphyd-star/gdskills-chatbot@main/gd-study-helper.js" defer></script>`

## Updating course info

Edit the `COURSES` array in both files, commit and push. To bust the CDN cache, either wait for jsDelivr's refresh or pin a new version tag and update the loader URL:

```
https://cdn.jsdelivr.net/gh/igraphyd-star/gdskills-chatbot@v1.1/gd-chatbot.js
```

## Local logic tests

```
node test-logic.js          # public bot
node test-helper-logic.js   # study helper
```
