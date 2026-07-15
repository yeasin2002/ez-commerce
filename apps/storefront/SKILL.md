---
name: design-system-footystylehub
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# FootyStyleHub

## Mission

Deliver implementation-ready design-system guidance for FootyStyleHub that can be applied consistently across e-commerce storefront interfaces.

## Brand

- Product/brand: FootyStyleHub
- URL: https://footystylehub.com/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations

- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Instrument Sans`, `font.family.stack=Instrument Sans, sans-serif`, `font.size.base=15px`, `font.weight.base=400`, `font.lineHeight.base=25.71px`
- Typography scale: `font.size.xs=13px`, `font.size.sm=13.33px`, `font.size.md=14px`, `font.size.lg=15px`, `font.size.xl=16px`, `font.size.2xl=18px`, `font.size.3xl=20px`, `font.size.4xl=36px`
- Color palette: `color.text.primary=#444444`, `color.text.secondary=#111111`, `color.text.tertiary=#ffffff`, `color.surface.base=#000000`
- Spacing scale: `space.1=2px`, `space.2=5px`, `space.3=8px`, `space.4=10px`, `space.5=12px`, `space.6=15px`, `space.7=20px`, `space.8=25px`
- Radius/shadow/motion tokens: `radius.xs=10px`, `radius.sm=30px`, `radius.md=50px` | `motion.duration.instant=250ms`, `motion.duration.fast=300ms`, `motion.duration.normal=400ms`, `motion.duration.slow=500ms`

## Accessibility

- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone

concise, confident, implementation-focused

## Rules: Do

- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't

- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow

1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure

- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Accessibility

- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone

Concise, confident, implementation-focused.

## Rules: Do

- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't

- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Component Rule Expectations

- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates

- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

## Required Output Structure

- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations

- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (479), buttons (152), inputs (36), cards (36), lists (16), navigation (3).

## Quality Gates

- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.

## Guideline Authoring Workflow

1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

<!-- TYPEUI_SH_MANAGED_END -->
