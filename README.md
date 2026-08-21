# ASAP Fence powder coat / color-finish storefront

This is a small website for **ASAP Fence & Gates** (Florida). It is only about **powder-coat / color-finish** for gates, frames, and hardware. It is not the main fence site, not FDT, not a dealer portal, not Tonneau, and not a Facebook ads account.

Main company site: [asapfenceandgate.com](https://asapfenceandgate.com)

## How to run (beginner)

You need Node.js and npm installed.

1. Open a terminal in this folder.
2. Install packages (one time, or after `package.json` changes):

```bash
npm install
```

3. Start the local site:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

Other commands:

```bash
npm test        # run automated tests
npm run build   # production build (what Vercel runs)
npm start       # serve the production build
```

Deploy: connect this GitHub repo to [Vercel](https://vercel.com). Leave `NEXT_PUBLIC_META_PIXEL_ID` and `NEXT_PUBLIC_GTM_ID` empty until ads are wired (see `.env.example`).

## Money labels — read this before quoting anyone

**Brian’s locked numbers are ASAP’s vendor COST, not what we charge customers.**

| SKU | Rate | Label | What it is |
| --- | --- | --- | --- |
| PC-GATE-STK | **$7.00 / sq ft** | **COST** (FACT, Brian, locked) | Vendor cost for a gate leaf. Envelope is width × height. Do **not** subtract picket gaps. Do **not** multiply by 2 for both faces. |
| PC-LIN-STK | **$3.00 / linear ft** | **COST** (FACT, Brian, locked) | Vendor cost for cut-list sticks whose widest side is ≤ 3.5 in. Not assembled gates. Wider profiles: call Brian. |

Do **not** show $7 or $3 on public pages as a customer price, a “starting at” price, or an ad offer. Customer coat pricing is **quote-only** until the captain locks a sell multiplier. This repo does **not** invent that markup.

**Everything else with a dollar sign is Proposed** (industry analog, not Brian, not CAT’s unpublished rates, not a customer sell price). That includes stock-hopper $0 adder, tier-1 special-order adders, color-lot, recoat blast, hardware piece ranges, PC-HW-LOT, and the lime hardware example ≈ $320. Those belong on the staff `/pricing` page, labeled **Proposed**.

Custom match / candy / two-tone: **call to confirm**. Do not invent Brian’s fee.

Staff estimator: `/pricing` (clearly labeled internal). It can price stock gate/lineal **COST** without a phone call. It never prints a customer sell price.

## Quote form

`/quote` saves submissions with a server action (local `data/quotes.json` when the disk is writable, otherwise in memory). There is no CRM webhook.
