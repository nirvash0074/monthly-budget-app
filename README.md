# Monthly Budget App

This is a small single-file demo app (index.html) for tracking monthly budgets and expenses in the browser using localStorage.

Features
- Add / edit / delete expenses
- Categories with monthly allocations and global templates
- Manual "Total Budget" that is locked when allocations are present
- Amount input supports currency formatting (e.g. 1,234.56 or $1,234.56)
- Data persisted to browser localStorage
- Small UI animations and a save toast

Setup / Run
1. Clone the repository:

   git clone https://github.com/Alvin-sys1/monthly-budget-app.git
   cd monthly-budget-app

2. Open `index.html` in your browser (double-click or drag into a browser window).

   OR run a simple static server (recommended for some browsers):

   - Using Python 3:
     ```bash
     python -m http.server 8000
     # then open http://localhost:8000 in your browser
     ```

   - Using Node (http-server):
     ```bash
     npx http-server -c-1 .
     # then open the printed URL in your browser
     ```

3. The app stores data locally in your browser. It will persist across reloads for the same origin.

Optional
- To host with GitHub Pages: go to the repository Settings → Pages, and select the `main` branch and `/ (root)` folder. Save and wait a minute for the published URL.

Notes
- This app is intentionally minimal and client-side only. For multi-user or server-backed storage you would add an API and authentication.
- If you want, I can:
  - Add a small build setup (Vite/Parcel) and React rewrite,
  - Add CI and a GitHub Pages workflow,
  - Convert this into a Progressive Web App (PWA).

License
- MIT (you can change this in the repo settings)
