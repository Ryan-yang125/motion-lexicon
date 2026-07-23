# Contributing to Motion Lexicon

Motion Lexicon welcomes focused contributions to definitions, accessibility, motion behavior, portable output, documentation, and tooling.

## Choose a contribution path

- Report a reproducible defect with the bug form.
- Propose a vocabulary correction with technical evidence and a concrete replacement.
- Request a recipe or related term with its user task, interaction trigger, and reduced-motion expectation.
- Improve accessibility, performance, examples, tests, or bilingual copy through a pull request.
- Discuss a new canonical workspace in an issue before implementation.

## Preserve the public contract

- Keep the 44 canonical IDs and their localized routes stable. They form the public discovery surface.
- Keep all 91 vocabulary IDs discoverable. Related terms map to an existing canonical workspace unless an accepted proposal expands the surface.
- Add a bilingual distinction whenever a related term shares a workspace with another term.
- Drive preview, parameters, Prompt, HTML, CSS, JavaScript, and reduced-motion behavior from the same motion specification.
- Omit default parameter values from shareable URLs.
- Keep interaction targets at least 44px and provide keyboard behavior for interactive motion.
- Write original definitions and examples. Include license evidence for every contributed third-party asset.

## Local workflow

1. Fork the repository and create a focused branch.
2. Install dependencies with `npm ci`.
3. Make a scoped change with tests or static checks that cover the behavior.
4. Run the relevant checks during development.
5. Run the complete quality gate before requesting review.

```bash
npm run lint
npm run typecheck
npm run test
npm run i18n:check
npm run vocabulary:check
npm run seo:check
npm run motion:check
npm run a11y:check
npm run build
npm run bundle:check
npm run crawl:dist
npm run test:visual
```

UI and routing contributions should also inspect `/zh/`, `/zh/catalog/?surface=components`, `/zh/entrances/slide-in/`, and one category route such as `/zh/sequencing/`.

## Pull request checklist

- Explain the user-visible outcome and affected routes.
- Link the issue or proposal when the change alters the catalog surface.
- Include screenshots or a short recording for visible motion changes.
- Confirm reduced-motion and keyboard behavior.
- List the checks you ran.
- Keep unrelated formatting and generated-file churn out of the pull request.

By contributing, you agree that source-code contributions are licensed under MIT, content and data contributions are licensed under CC BY 4.0, and generated-code templates are available under 0BSD as described in the root license files.
