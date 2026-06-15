---
type: knowledge
purpose: "UI component library and patterns for media websites"
---
Follow §Communication Rules from agent.md
# Media: Component Library

Domain knowledge for media / content publication sites.
Part of: references/domains/media/

**Source of Truth** for strict component structure and behavioral psychology.

---

## 1. Featured Article Hero
**Goal:** Display editorial judgment — the publication tells the reader "this is the most important thing right now."

### Anatomy
* **Large hero image** (16:9 or wider, high quality)
* **Headline** (H1, compelling, max 80 characters)
* **Category tag**: "Technology" / "Opinion" / "Investigation"
* **Author name + avatar**
* **Publication date + reading time**: "Mar 8, 2026 · 12 min read"
* **Brief excerpt/dek**: 1-2 sentences (optional)

### Anti-Patterns
* ❌ No visual hierarchy (featured story same size as everything else)
* ❌ Clickbait headline that doesn't deliver
* ❌ Missing publication date
* ❌ Stock photo instead of relevant editorial image

---

## 2. Article Card
**Goal:** Enable rapid headline scanning and click-decision. Must convey topic, quality, and time commitment in a glance.

### Anatomy
* **Thumbnail image** (16:9 ratio, high quality)
* **Category tag**: "Technology" / "Opinion" / "Longread"
* **Headline** (H3, max 80 characters, informative)
* **Author name + avatar** (optional)
* **Publication date + reading time**: "Feb 24, 2026 · 8 min read"
* **Brief excerpt** (1-2 sentences, optional)

### Anti-Patterns
* ❌ Missing publication date (can't assess freshness)
* ❌ No reading time estimate
* ❌ Clickbait headlines
* ❌ All articles visually identical size (no editorial hierarchy)

---

## 3. Topic Navigation Bar
**Goal:** Enable interest-based browsing and direct navigation. The primary organizing structure — equivalent to product categories in e-commerce.

### Anatomy
* **Horizontal scrollable bar** on mobile, full bar on desktop
* **Category labels**: "Latest," "Technology," "Culture," "Business," "Opinion"
* **Sticky on scroll** (remains visible while reading)
* **Active state indicator** for current category
* Optional: "Trending" or "Editor's Picks" as special category

### Anti-Patterns
* ❌ Too many categories (8+ causes decision fatigue)
* ❌ Generic labels ("Insights" instead of "Technology")
* ❌ Dropdown submenus on mobile
* ❌ Non-sticky nav that disappears on scroll

---

## 4. Trending / Most-Read Sidebar
**Goal:** Social proof through popularity — readers trust what others chose. Serves "show me what's good" intent.

### Anatomy
* **Ranked list**: "Most Read This Week" (numbered 1-5 or 1-10)
* Each: Headline + category + reading time
* **Time frame indicator**: "This week" / "Today" / "All time"
* Optional: View count per article

### Anti-Patterns
* ❌ Stale trending list (not updated regularly)
* ❌ No time frame indicator
* ❌ More than 10 items (loses "top" effect)

---

## 5. Inline Newsletter Subscribe
**Goal:** Convert readers into subscribers at the moment of highest engagement — after they've consumed content and trust the publication.

### Anatomy
* **Headline**: "Get the best of [Publication] every [frequency]"
* **Value prop**: "A curated selection of our best stories. One email, no spam."
* **Email input** + "Subscribe" button
* **Social proof**: "Join 50,000+ readers"
* **Design**: Visually distinct from article content but integrated into page flow (NOT a popup)

### Anti-Patterns
* ❌ Popup on page load (before reader has seen any content)
* ❌ No frequency indication
* ❌ No privacy assurance
* ❌ Full-screen takeover
* ❌ Asking for name + email (email only for minimum friction)

---

## 6. Author Bio Inline
**Goal:** Build credibility for the article and create author following.

### Anatomy
* **Author photo** (real, consistent across articles)
* **Name + title/beat**: "Jane Smith, Senior Technology Editor"
* **Bio**: 1 sentence ("Jane covers AI, startups, and the future of work")
* **Author archive link**: "See all articles by Jane"
* **Social links**: Twitter/X, LinkedIn

### Anti-Patterns
* ❌ No author attribution (reduces trust)
* ❌ Bio longer than 2 sentences inline
* ❌ Inconsistent author photos

---

## 7. Article Reading Experience
**Goal:** Provide clean, distraction-free reading that encourages completion and return visits.

### Anatomy
* **Content width**: 680-720px max (optimal reading line length)
* **Typography**: 18-20px body text, high contrast, generous line-height (1.6-1.8)
* **Subheadings**: Break content every 3-4 paragraphs for scannability
* **Pull quotes**: Highlight key insights, serve as scroll anchors
* **Image captions**: Always present for editorial images
* **Progress indicator** (optional): Reading progress bar at top

### Anti-Patterns
* ❌ Content wider than 720px (eye fatigue from long line lengths)
* ❌ Body text smaller than 16px
* ❌ Interstitial ads that interrupt mid-paragraph
* ❌ Content layout shifts from ad loading

---

## 8. Related Articles Section
**Goal:** Keep the session going after article completion. Turn one-article visits into multi-article sessions.

### Anatomy
* **Section title**: "Related Reading" or "You Might Also Like"
* **3-4 article cards**: Same format as homepage cards
* **Selection logic**: Same topic/category, same author, or editorially curated
* **Placement**: After article body, before comments

### Anti-Patterns
* ❌ Algorithmically generated clickbait ("You won't believe...")
* ❌ Sponsored content mixed in without clear labeling
* ❌ More than 6 related articles (overwhelming)
* ❌ Related articles from a different topic than the article just read

---

## 9. Sponsored Content Label
**Goal:** Maintain editorial trust by clearly distinguishing paid from editorial content.

### Anatomy
* **Visible label**: "Sponsored" or "Partner Content" in distinct typography
* **Sponsor name and logo**
* **Visual differentiation**: Distinct background color or border
* Same card format but with sponsor label overlay

### Anti-Patterns
* ❌ Labeling only in fine print
* ❌ Visual styling identical to editorial content
* ❌ Hiding the sponsor relationship

---

## 10. Share / Social Bar
**Goal:** Enable frictionless article sharing to drive organic distribution.

### Anatomy
* **Share buttons**: Twitter/X, LinkedIn, Facebook, Email, Copy Link
* **Position**: Sticky sidebar (desktop) or floating bottom bar (mobile)
* **Pre-populated text**: Article title + URL
* Optional: Share count per platform

### Anti-Patterns
* ❌ More than 6 share buttons (paradox of choice)
* ❌ Share bar covering content on mobile
* ❌ No copy-link option (the most versatile share method)


---

## See Also

- `shared/content-patterns.md` — long-form/ToC, FAQ accordion, help/support structure
- `shared/seo.md` — Core Web Vitals layout, internal linking, pagination
- `shared/mobile.md` — thumb zone, bottom sheets, gestures, sticky CTAs
- `shared/conversion.md` — social proof placement, pricing psychology, sticky elements
- `shared/emerging.md` — AI chat, dark mode, interactive demos, passwordless auth
