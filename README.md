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

**Everything else with a dollar sign is Proposed** (industry analog, not Brian, not a customer sell price). That includes stock-hopper $0 adder, tier-1 special-order adders, color-lot, recoat blast, hardware piece ranges, PC-HW-LOT, and the lime hardware example ≈ $320. Those belong on the staff `/pricing` page, labeled **Proposed**.

Custom / candy / two-tone: staff calls Brian to confirm. Do not invent Brian’s fee. Do not show a co-brand for the coating vendor on this storefront.

Staff estimator: `/pricing` (clearly labeled internal). It can price stock gate/lineal **COST** without a phone call.

**Proposed SELL (staff `/pricing` only, not locked):**

| Package | Proposed SELL |
| --- | --- |
| Hardware accent set (4 hinges + drop + 2 handles, custom color) | **$695** (floor $495) |
| Frame accent | **$18 / lf**, min **$350** (floor $12 / lf, min $250) |
| Full gate custom color | **$22 / sq ft**, min **$1,250 / leaf** (floor $16, min $850) — discourage; quote path |
| Hardware each | hinge $60, drop $55, handle $45, latch $45, color lot $150 |
| Optional stock (if shown) | gate **$14 / sq ft**, lineal **$12 / lf** |

Do **not** put these numbers on `/`, `/hinges`, `/drop-rods`, `/handles`, `/frames`, or `/quote`. They are not locked.

## Brand (sourced)

- Identity: **ASAP Fence & Gates**. Wordmark: **ASAP SIGNATURE FENCE**.
- Phone: **(941) 417-8992** only.
- Hours: Mon–Fri 8–5, Sat by appointment.
- Locations: 2219 63rd Avenue East, Bradenton; 2215 Griffin Rd, Leesburg.
- Voice: “Your fence. Built fast. Built to last.”
- Reviews (if shown): 4.8 · 460+ Google Reviews. Do not invent a third rating.
- Financing (if mentioned): **12 months 0% — Wells Fargo & WiseStack** (on the main site). Do not invent other terms.
- Official aluminum colors: **black, bronze, white**. Lime is an **example custom accent only**, not a stocked catalog.
- Visual: dark `#171D24` + lime accent. No HOA navy. No coating-vendor branding.
- Workmanship: 1 year. Not a lifetime powder warranty. ASAP does not operate a powder plant.

## Quote form

`/quote` saves submissions with a server action (local `data/quotes.json` when the disk is writable, otherwise in memory). There is no CRM webhook.
