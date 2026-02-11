#!/usr/bin/env node
// Simple Puppeteer E2E to verify RBAC UI links
// Usage: install puppeteer then run: node scripts/e2e_rbac.js

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const BASE = process.env.BASE_URL || 'http://localhost:8081';

const scenarios = [
  {
    name: 'Maritime Agency (COMMUNITY)',
    user: { id: 'u1', userType: 'COMMUNITY', classification: 'agency', fullName: 'وكيل ملاحي' },
    expect: { warehouse: false, trolley: true, admin: false },
  },
  {
    name: 'Shipping Company (COMMUNITY)',
    user: { id: 'u2', userType: 'COMMUNITY', classification: 'shipping', fullName: 'شركة شحن' },
    expect: { warehouse: true, trolley: false, admin: false },
  },
  {
    name: 'Admin',
    user: { id: 'admin', userType: 'ADMIN', fullName: 'مدير النظام' },
    expect: { warehouse: true, trolley: true, admin: true },
  },
];

async function run() {
  console.log('Starting E2E RBAC checks against', BASE);
  let browser;
  try {
    // determine executablePath: from env or common install locations
    const candidates = [];
    if (process.env.CHROME_PATH) candidates.push(process.env.CHROME_PATH);
    // common Windows paths
    candidates.push(
      path.join(process.env['PROGRAMFILES'] || 'C:\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:\Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(process.env['PROGRAMFILES'] || 'C:\Program Files', 'Microsoft', 'Edge', 'Application', 'msedge.exe')
    );

    let chromePath = null;
    for (const p of candidates) {
      if (!p) continue;
      try {
        if (fs.existsSync(p)) {
          chromePath = p;
          break;
        }
      } catch (e) {}
    }

    if (!chromePath) {
      console.error('Chrome/Edge executable not found. Set CHROME_PATH environment variable to your browser path.');
      process.exit(4);
    }

    browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    const results = [];

    for (const s of scenarios) {
      console.log(`\nScenario: ${s.name}`);
      // visit root, set localStorage, reload
      await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
      await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), s.user);
      await page.reload({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
      // wait a bit for client render
      await page.waitForTimeout(800);

      const hasWarehouse = !!(await page.$('a[href="/requests/warehouse"]'));
      const hasTrolley = !!(await page.$('a[href="/requests/berthing"]'));
      const hasAdmin = !!(await page.$('a[href="/admin"]'));

      const passWarehouse = hasWarehouse === s.expect.warehouse;
      const passTrolley = hasTrolley === s.expect.trolley;
      const passAdmin = hasAdmin === s.expect.admin;

      console.log('  warehouse link:', hasWarehouse, passWarehouse ? 'OK' : 'FAIL');
      console.log('  trolley link :', hasTrolley, passTrolley ? 'OK' : 'FAIL');
      console.log('  admin link   :', hasAdmin, passAdmin ? 'OK' : 'FAIL');

      results.push({ scenario: s.name, pass: passWarehouse && passTrolley && passAdmin });
    }

    const failed = results.filter(r => !r.pass);
    if (failed.length === 0) {
      console.log('\nAll scenarios passed');
      await browser.close();
      process.exit(0);
    } else {
      console.log('\nFailed scenarios:', failed.map(f => f.scenario).join(', '));
      await browser.close();
      process.exit(2);
    }
  } catch (err) {
    console.error('E2E script error:', err);
    if (browser) await browser.close();
    process.exit(3);
  }
}

run();
