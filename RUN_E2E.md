E2E RBAC test (Puppeteer)

1) Install dependency (locally):

```bash
# install puppeteer-core (lighter, uses local Chrome/Edge)
npm install puppeteer-core --save-dev
```

2) Start dev server (if not running):

```bash
# in project root
npm run dev
```

3) Run the script:

```bash
# ensure dev server is running, then provide path to your Chrome/Edge if not auto-detected
CHROME_PATH="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" node scripts/e2e_rbac.js
# or on PowerShell:
$env:CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"; node scripts/e2e_rbac.js

# or rely on auto-detection (Windows common locations):
node scripts/e2e_rbac.js
```

Notes:
- The script sets `localStorage.user` to simulate logged-in users and checks presence/absence of anchor links:
  - `/requests/warehouse`
  - `/requests/berthing`
  - `/admin`
- If `npm install` fails here, run these steps locally on a machine with network access.
