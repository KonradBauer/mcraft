---
type: knowledge
purpose: "cross-domain IA and strategy principles"
---
# Information Architecture Principles

Cross-domain IA and strategy principles.
Used by: Strategy & IA, Review.
Applies to: all site types.

---

## Core Principles

### 1. Top Tasks Management (Prioritization)
- **Principle**: 5% of tasks account for 25% of value. These are "Top Tasks".
- **Action**: Identify the Top 3-5 tasks based on user intent (e.g., "Get a quote", "Log in").
- **Rule**: Top Tasks must be visible in the Primary Navigation or Hero. "Tiny Tasks" (Press, Bio) belong in the Footer.

### 2. Problem Space vs Solution Space (Mental Models)
- **Problem Space**: How the user thinks (e.g., "I need to fix a leak").
- **Solution Space**: How the company organizes (e.g., "Services -> Plumbing -> Emergency").
- **Rule**: Navigation labels must match the **Problem Space**.
    - *Bad*: "Our Modules"
    - *Good*: "Automate Invoicing"

### 3. The "Anti-Persona" (Exclusion Strategy)
- **Principle**: Strategy requires sacrifice. You must know who the product is NOT for.
- **Action**: Actively de-prioritize pathways for bad-fit customers to save sales team bandwidth.

### 4. Cognitive Fluency (Standard Patterns)
- **Principle**: Users prefer standard patterns.
- **Standard nav structure** (adapt per site type):
    1. **Offering** (Products/Services)
    2. **Segmentation** (Solutions/Industries)
    3. **Education** (Resources/Blog)
    4. **Trust** (About/Case Studies)
    5. **Value Exchange** (Pricing/Contact)

### 5. Buyer-Centric Design (The "You" Shift)
- **Principle**: Users don't care about the company; they care about their own problems.
- **Rule**: Shift 80% of copy from "We are..." to "You will...".
- **Navigation**: Use role-based routing (e.g., "For Marketers") instead of internal department names.

### 6. Funnel Psychology (The Journey)
Align sections to the user's mental state:
- **Awareness** ("I have a problem"): Hero, Educational Content.
- **Consideration** ("How do I solve it?"): Features, Demos, Comparison.
- **Decision** ("Is it safe?"): Case Studies, Pricing, Security/Trust.

---

## Structural IA Checklist

Use this to audit the **structure** and **navigation**.

### Principle of Objects
- [ ] **Content Types**: Do we treat content as distinct objects with specific attributes? (e.g., A "Case Study" has different attributes than a "Blog Post").
- [ ] **Consistency**: Are all objects of the same type structured consistently?

### Principle of Choices (Hick's Law)
- [ ] **Focused Menus**: Are menus limited to 5-7 items to prevent choice paralysis?
- [ ] **Meaningful Differences**: Is the difference between options obvious? (Avoid "Services" vs "Solutions" if they mean the same thing).

### Principle of Disclosure
- [ ] **Preview Info**: Do links provide enough context to predict what's next?
- [ ] **Progressive**: Is technical detail hidden behind "Learn More" or tabs to avoid overwhelming the user?

### Principle of Exemplars
- [ ] **Examples in Nav**: Do we show examples of what's in a category?
    - *Bad*: "Industries"
    - *Good*: "Industries (Healthcare, Retail, Finance...)"

### Principle of Front Doors
- [ ] **Context Everywhere**: Does every page assume it's a landing page?
- [ ] **Orientation**: Is there a "You are here" indicator (Breadcrumbs, highlighted nav)?
- [ ] **Escape Hatch**: Is there a clear path to the "Home" or parent category?

### Principle of Multiple Classification
- [ ] **Alternate Paths**: Can users find the same item via different routes?

### Principle of Focused Navigation
- [ ] **Single Purpose**: Does each menu do one thing?
- [ ] **Separation**: Are "Global Nav", "Utility Nav", and "Footer Nav" distinct in purpose?

### Principle of Growth
- [ ] **Scalability**: Can we add 10 more products without breaking the menu structure?

### Component Fidelity
- [ ] **Library Compliance**: Do all wireframed sections strictly follow the component anatomy defined in domain component files?
- [ ] **Anti-Pattern Check**: Have we avoided all anti-patterns listed in the component files?

---

## IA Pitfalls Checklist

Common mistakes to avoid when designing Information Architecture.

### Navigation Mistakes
- [ ] **The "Blind" Redesign**: Designing IA based on VP preferences instead of user task data.
- [ ] **Format-Based Resources**: Organizing by file type (Whitepapers, Videos) instead of topic (Security, Compliance).
- [ ] **Hidden Pricing**: Assuming "Enterprise" means no pricing info. Always explain the value model.
- [ ] **The "Our Modules" Trap**: Naming navigation after internal product names instead of user problems.

### Page-Level Mistakes
- [ ] **Dead End Pages**: Blog posts or case studies with no CTA or next step.
- [ ] **Buried Top Tasks**: Hiding high-value actions (Contact, Pricing, Support) under submenus.
- [ ] **Trust Too Late**: Placing logos/testimonials below the fold when trust is critical.

### Content Mistakes
- [ ] **Corporate Speak**: Using "leverage", "synergize", "best-in-class" instead of concrete outcomes.
- [ ] **Feature Dump**: Listing features without benefits or context.
- [ ] **Missing Anti-Persona**: Trying to appeal to everyone, thus resonating with no one.

### Validation Mistakes
- [ ] **Skipping Tree Testing**: Assuming the team knows what labels make sense to users.
- [ ] **No TPI Baseline**: Launching without measuring Task Performance Indicators.
