# Contributing to Listener Segmentation

Thank you for your interest in contributing to **Listener Segmentation**! We welcome contributions from the community to improve the ML clustering engine, visual topology charts, data parsers, and UI accessibility.

---

## Code of Conduct

Please help us maintain a friendly, welcoming, and inclusive environment. Be respectful and constructive in all issues, pull requests, and discussions.

---

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/listener-segmentation.git
   cd listener-segmentation
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/amazing-feature
   ```

---

## Development Workflow

- Run local dev server:
  ```bash
  npm run dev
  ```
- Make your code changes in `src/`.
- Ensure TypeScript type safety and linting passes:
  ```bash
  npm run lint
  ```
- Build the project to verify production compilation:
  ```bash
  npm run build
  ```

---

## Commit Guidelines

We recommend using [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add Deezer history parser`
- `fix: resolve canvas coordinate clipping on mobile`
- `docs: update mathematical formulation in README`
- `refactor: optimize radar polygon recalculation`
- `style: adjust bento grid spacing on tablet viewports`

---

## Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push origin feature/amazing-feature
   ```
2. Open a Pull Request from your fork against the `main` branch.
3. Fill out the Pull Request template detailing what was changed and testing steps.
4. Ensure CI checks pass.

Thank you for contributing!
