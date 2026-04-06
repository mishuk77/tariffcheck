# PRD: TariffCheck — US Import Tariff Calculator

## Overview

A dead-simple mobile app that calculates US import duties and tariffs for goods from any country. Users select a country of origin, pick a product category, enter a dollar value, and instantly see the total tariff cost breakdown. The app targets small business owners, Amazon/eBay resellers, Shopify sellers, and consumers trying to understand how tariffs affect prices.

**Why now:** US tariffs are the #1 economic story. Rates change monthly. Web calculators exist (Flexport, AMZ Prep) but the Google Play Store has essentially zero good mobile apps for this. First-mover advantage is wide open.

**Build target:** React Native (Expo) app for Android (Google Play) and iOS (App Store). Ship MVP in 1-2 days.

---

## Core User Flow

```
Home Screen
  → Select Country of Origin (searchable list, sorted by US import volume)
  → Select Product Category (from predefined list)
  → Enter Product Value (USD)
  → Tap "Calculate"
  → Results Screen: full duty breakdown
```

That's the entire app. Three inputs, one output.

---

## Screens

### 1. Calculator Screen (Home)

This is the main and only primary screen. Clean, single-scroll layout.

**Elements:**
- App logo/name at top: "TariffCheck"
- Tagline: "Know what you'll pay before you import"
- **Country of Origin selector** — searchable dropdown/modal with country flag emoji
  - Default: China (largest US import partner)
  - Countries sorted by US import volume (China, Mexico, Canada, Germany, Japan, South Korea, Vietnam, Taiwan, India, Ireland, etc.)
  - Include ALL countries with active tariff rates (aim for 150+)
  - Show country flag emoji next to name
- **Product Category selector** — dropdown/modal
  - Categories (see Data Model below)
  - Each category shows its base MFN duty rate range as hint text
- **Product Value input** — numeric field with $ prefix
  - Allow decimals
  - Default empty, placeholder: "e.g. 500.00"
- **"Calculate Tariff" button** — primary CTA, full width
- Below the fold: brief disclaimer text ("Estimates only. Consult a customs broker for binding determinations.")

### 2. Results Screen (or expandable results section below the button)

**Elements:**
- Summary card at top:
  - **Product Value:** $X,XXX.XX
  - **Total Estimated Duty:** $X,XXX.XX (large, bold, colored)
  - **Effective Tariff Rate:** XX.X%
  - **Total Landed Cost:** $X,XXX.XX (value + duty + fees)

- Breakdown card:
  - **Base MFN Duty Rate:** X% → $XX.XX
  - **Reciprocal Tariff (IEEPA):** X% → $XX.XX (if applicable)
  - **Section 301 Tariff:** X% → $XX.XX (China only, if applicable)
  - **Section 232 Tariff:** X% → $XX.XX (steel/aluminum/autos, if applicable)
  - **Merchandise Processing Fee (MPF):** $XX.XX (for formal entries >$2,500: 0.3464% of value, min $31.67, max $614.35)
  - **Harbor Maintenance Fee (HMF):** $XX.XX (for ocean shipments: 0.125% of value)

- Info badges/chips:
  - Trade agreement status (e.g., "USMCA Eligible — may qualify for 0% duty")
  - De minimis note (if value <$800: "May qualify for duty-free entry under de minimis")
  - De minimis exception note for China ("De minimis exemption does NOT apply to China")
  - Tariff level indicator: color-coded (green = 0-10%, yellow = 10-25%, orange = 25-50%, red = 50%+)

- **"Calculate Another"** button
- **"Share Results"** button (generates shareable text summary)

### 3. Info/About Screen

- Brief explanation of tariff types (MFN, Reciprocal, Section 301, Section 232)
- "Last updated: [date]" showing when tariff data was last refreshed
- Disclaimer about estimates vs. binding determinations
- Link to HTSUS database for advanced users
- App version

---

## Data Model

### Countries

Store as a JSON file bundled with the app. Structure:

```json
{
  "countries": [
    {
      "code": "CN",
      "name": "China",
      "flag": "🇨🇳",
      "import_rank": 1,
      "reciprocal_tariff_rate": 20,
      "section_301_applies": true,
      "section_301_rate_range": [7.5, 25],
      "de_minimis_eligible": false,
      "trade_agreement": null,
      "notes": "20% base (10% reciprocal + 10% fentanyl). Section 301 tariffs (7.5-25%) apply to many products. Will increase to 44% on Nov 10, 2026."
    },
    {
      "code": "MX",
      "name": "Mexico",
      "flag": "🇲🇽",
      "import_rank": 2,
      "reciprocal_tariff_rate": 0,
      "section_301_applies": false,
      "section_301_rate_range": null,
      "de_minimis_eligible": true,
      "trade_agreement": "USMCA",
      "notes": "0% reciprocal rate as of Oct 2025. USMCA-compliant goods enter duty-free."
    },
    {
      "code": "CA",
      "name": "Canada",
      "flag": "🇨🇦",
      "import_rank": 3,
      "reciprocal_tariff_rate": 35,
      "section_301_applies": false,
      "section_301_rate_range": null,
      "de_minimis_eligible": true,
      "trade_agreement": "USMCA",
      "notes": "35% for non-USMCA goods. USMCA-compliant goods are duty-free (0%)."
    }
  ]
}
```

**Full country list to include (top 40 by US import volume, then remaining alphabetically):**

Top trading partners with specific reciprocal tariff rates (as of early 2026):
- China: 20% (10% reciprocal + 10% fentanyl; Section 301 adds 7.5-25%)
- Mexico: 0% (USMCA)
- Canada: 35% (non-USMCA); 0% (USMCA-compliant)
- Germany: 20% (EU rate)
- Japan: 24%
- South Korea: 25%
- Vietnam: 46% (reduced via framework agreement, verify current)
- Taiwan: 32%
- India: 25%
- Ireland: 20% (EU rate)
- Italy: 20% (EU rate)
- UK: 10%
- France: 20% (EU rate)
- Switzerland: 31%
- Thailand: 36%
- Malaysia: 24%
- Indonesia: 32%
- Brazil: 10% reciprocal + 40% policy = 50% total
- Israel: 17%
- Netherlands: 20% (EU rate)
- Bangladesh: 37%
- Singapore: 10%
- Australia: 10%
- Cambodia: 49%
- Philippines: 17%
- Colombia: 10%
- Chile: 10%
- Turkey: 10%
- Pakistan: 29%
- South Africa: 30%
- Saudi Arabia: 10%
- UAE: 10%
- Nigeria: 14%
- Egypt: 10%
- All remaining countries: 10% baseline reciprocal (Section 122 Temporary Import Surcharge)

**IMPORTANT:** These rates change frequently. Build the data layer so rates can be updated by editing a single JSON file. Include a `last_updated` date field at the top level and display it in the app.

### Product Categories

```json
{
  "categories": [
    {
      "id": "electronics",
      "name": "Electronics & Computers",
      "icon": "💻",
      "base_mfn_rate": 0,
      "section_301_rate_china": 25,
      "section_232_applies": false,
      "examples": "Phones, laptops, tablets, components, semiconductors"
    },
    {
      "id": "clothing",
      "name": "Clothing & Apparel",
      "icon": "👕",
      "base_mfn_rate": 12,
      "section_301_rate_china": 7.5,
      "section_232_applies": false,
      "examples": "T-shirts, dresses, jackets, shoes"
    },
    {
      "id": "footwear",
      "name": "Footwear",
      "icon": "👟",
      "base_mfn_rate": 10,
      "section_301_rate_china": 15,
      "section_232_applies": false,
      "examples": "Sneakers, boots, sandals, athletic shoes"
    },
    {
      "id": "steel_metals",
      "name": "Steel & Metals",
      "icon": "🔩",
      "base_mfn_rate": 0,
      "section_301_rate_china": 25,
      "section_232_applies": true,
      "section_232_rate": 25,
      "examples": "Steel products, aluminum, metal parts"
    },
    {
      "id": "aluminum",
      "name": "Aluminum",
      "icon": "🪶",
      "base_mfn_rate": 0,
      "section_301_rate_china": 25,
      "section_232_applies": true,
      "section_232_rate": 25,
      "examples": "Aluminum sheets, cans, foil, extrusions"
    },
    {
      "id": "automotive",
      "name": "Automobiles & Auto Parts",
      "icon": "🚗",
      "base_mfn_rate": 2.5,
      "section_301_rate_china": 25,
      "section_232_applies": true,
      "section_232_rate": 25,
      "examples": "Cars, trucks, engines, transmissions, body parts"
    },
    {
      "id": "furniture",
      "name": "Furniture & Home Goods",
      "icon": "🛋️",
      "base_mfn_rate": 0,
      "section_301_rate_china": 25,
      "section_232_applies": false,
      "examples": "Sofas, tables, chairs, mattresses, home decor"
    },
    {
      "id": "toys",
      "name": "Toys & Games",
      "icon": "🧸",
      "base_mfn_rate": 0,
      "section_301_rate_china": 7.5,
      "section_232_applies": false,
      "examples": "Action figures, board games, dolls, puzzles"
    },
    {
      "id": "food_agriculture",
      "name": "Food & Agricultural Products",
      "icon": "🌾",
      "base_mfn_rate": 5,
      "section_301_rate_china": 25,
      "section_232_applies": false,
      "examples": "Produce, meat, seafood, grains, beverages"
    },
    {
      "id": "machinery",
      "name": "Machinery & Equipment",
      "icon": "⚙️",
      "base_mfn_rate": 0,
      "section_301_rate_china": 25,
      "section_232_applies": false,
      "examples": "Industrial machines, pumps, generators, tools"
    },
    {
      "id": "pharmaceuticals",
      "name": "Pharmaceuticals & Medical",
      "icon": "💊",
      "base_mfn_rate": 0,
      "section_301_rate_china": 25,
      "section_232_applies": false,
      "examples": "Drugs, medical devices, surgical instruments"
    },
    {
      "id": "plastics_rubber",
      "name": "Plastics & Rubber",
      "icon": "♻️",
      "base_mfn_rate": 3,
      "section_301_rate_china": 25,
      "section_232_applies": false,
      "examples": "Plastic containers, rubber products, polymers"
    },
    {
      "id": "textiles",
      "name": "Textiles & Fabrics",
      "icon": "🧵",
      "base_mfn_rate": 10,
      "section_301_rate_china": 7.5,
      "section_232_applies": false,
      "examples": "Fabric, yarn, thread, curtains, linens"
    },
    {
      "id": "chemicals",
      "name": "Chemicals",
      "icon": "🧪",
      "base_mfn_rate": 3,
      "section_301_rate_china": 25,
      "section_232_applies": false,
      "examples": "Industrial chemicals, fertilizers, paints"
    },
    {
      "id": "copper",
      "name": "Copper",
      "icon": "🔶",
      "base_mfn_rate": 0,
      "section_301_rate_china": 25,
      "section_232_applies": true,
      "section_232_rate": 50,
      "examples": "Copper wire, pipes, sheets, alloys"
    },
    {
      "id": "lumber",
      "name": "Lumber & Wood Products",
      "icon": "🪵",
      "base_mfn_rate": 0,
      "section_301_rate_china": 25,
      "section_232_applies": true,
      "section_232_rate": 10,
      "examples": "Softwood lumber, plywood, wood panels"
    },
    {
      "id": "semiconductors",
      "name": "Semiconductors & Chips",
      "icon": "🔌",
      "base_mfn_rate": 0,
      "section_301_rate_china": 25,
      "section_232_applies": true,
      "section_232_rate": 25,
      "examples": "Chips, wafers, semiconductor manufacturing equipment"
    },
    {
      "id": "jewelry",
      "name": "Jewelry & Watches",
      "icon": "💎",
      "base_mfn_rate": 6,
      "section_301_rate_china": 7.5,
      "section_232_applies": false,
      "examples": "Gold jewelry, silver, watches, gemstones"
    },
    {
      "id": "cosmetics",
      "name": "Cosmetics & Personal Care",
      "icon": "🧴",
      "base_mfn_rate": 0,
      "section_301_rate_china": 7.5,
      "section_232_applies": false,
      "examples": "Skincare, makeup, hair products, perfume"
    },
    {
      "id": "other",
      "name": "Other / General Merchandise",
      "icon": "📦",
      "base_mfn_rate": 3.5,
      "section_301_rate_china": 15,
      "section_232_applies": false,
      "examples": "Miscellaneous goods not listed above"
    }
  ]
}
```

---

## Calculation Logic

```
function calculateTariff(country, category, productValue):

  // 1. Base MFN Duty
  baseDuty = productValue * (category.base_mfn_rate / 100)

  // 2. Reciprocal Tariff (IEEPA)
  // Skip if trade agreement applies (e.g., USMCA-compliant)
  reciprocalDuty = 0
  if country.trade_agreement == "USMCA":
    reciprocalDuty = 0  // show note about USMCA eligibility
  else:
    reciprocalDuty = productValue * (country.reciprocal_tariff_rate / 100)

  // 3. Section 301 (China only)
  section301Duty = 0
  if country.code == "CN" AND category.section_301_rate_china > 0:
    section301Duty = productValue * (category.section_301_rate_china / 100)

  // 4. Section 232 (Steel, Aluminum, Autos, Copper, Lumber, Semiconductors)
  section232Duty = 0
  if category.section_232_applies:
    section232Duty = productValue * (category.section_232_rate / 100)

  // 5. Merchandise Processing Fee (MPF)
  mpf = 0
  if productValue >= 2500:
    mpf = max(31.67, min(productValue * 0.003464, 614.35))
  else:
    mpf = 5.00  // informal entry fee

  // 6. Harbor Maintenance Fee (HMF) — ocean shipments only
  // For MVP, include this with a note that it applies to ocean shipments
  hmf = productValue * 0.00125

  // 7. De Minimis Check
  deMinimisEligible = false
  if productValue <= 800 AND country.de_minimis_eligible:
    deMinimisEligible = true
    // In reality, all duties would be $0, but show the calculation
    // with a prominent note about de minimis eligibility

  // Totals
  totalDuty = baseDuty + reciprocalDuty + section301Duty + section232Duty + mpf + hmf
  effectiveRate = (totalDuty / productValue) * 100
  totalLandedCost = productValue + totalDuty

  return {
    productValue,
    baseDuty, baseDutyRate: category.base_mfn_rate,
    reciprocalDuty, reciprocalRate: country.reciprocal_tariff_rate,
    section301Duty, section301Rate: category.section_301_rate_china || 0,
    section232Duty, section232Rate: category.section_232_rate || 0,
    mpf,
    hmf,
    totalDuty,
    effectiveRate,
    totalLandedCost,
    deMinimisEligible,
    tradeAgreement: country.trade_agreement,
    countryNotes: country.notes
  }
```

**Important tariff stacking rules:**
- Reciprocal tariffs (IEEPA) stack ON TOP of base MFN duties
- Section 301 tariffs (China) stack ON TOP of both
- Section 232 tariffs stack ON TOP of everything (for applicable product categories)
- All tariff types are applied to the product value (not compounded on each other)

---

## Design System

### Visual Style
- **Theme:** Dark mode default (feels premium, modern), with light mode option
- **Primary color:** Electric blue (#2563EB) for CTAs and accents
- **Background:** #0F172A (dark) or #F8FAFC (light)
- **Cards:** Slight elevation, rounded corners (12px radius)
- **Typography:** System font (San Francisco on iOS, Roboto on Android)
- **Animations:** Subtle — numbers count up on results screen

### Design Principles
- **Zero learning curve** — someone should understand the app in 3 seconds
- **No signup required** — immediate value, no auth
- **No onboarding carousel** — straight to the calculator
- **Minimal ads** — if monetizing with ads, one small banner at bottom only. No interstitials on MVP.
- **Fast** — all calculations happen locally, no API calls needed for core functionality

---

## App Store Optimization (ASO)

### App Name
**"TariffCheck: US Import Duty Calc"** (30 char limit on Play Store title)

### Short Description (80 chars)
"Calculate US import tariffs & duties instantly. All countries. Updated 2026."

### Long Description Keywords to Target
Primary keywords (high volume, low competition):
- tariff calculator
- import duty calculator
- customs duty calculator
- US tariff 2026
- import tax calculator
- customs calculator
- tariff rate
- reciprocal tariff
- China tariff calculator
- import cost calculator

Secondary keywords:
- USMCA calculator
- Section 301 tariff
- Section 232 tariff
- landed cost calculator
- customs fees
- import duty USA
- trade tariff
- duty rate lookup
- HTS tariff
- merchandise processing fee

### Screenshots (5 required for Play Store)
1. Hero shot: Calculator screen with China selected, showing a $500 product → $290 total duty (58% effective rate) — attention-grabbing number
2. Results breakdown showing all tariff layers stacked
3. Country selector showing flags and search
4. USMCA example (Mexico, $0 duty) — shows versatility
5. "Updated for 2026" badge with list of supported tariff types

### Category
Play Store: **Finance** or **Business** (test both)
App Store: **Finance** → **Business** subcategory

---

## Monetization (Post-MVP)

### Free Tier (MVP)
- Unlimited calculations
- All countries and categories
- Full breakdown
- Small banner ad at bottom (optional — could launch fully free to maximize downloads)

### Pro Tier ($2.99/month or $19.99/year)
- Ad-free
- Save calculation history
- Export results as PDF
- Rate change alerts (push notification when tariff rates change for saved countries)
- Batch calculator (multiple products at once)
- HTS code lookup (search by product description to find specific duty rate)

---

## Tech Stack

### Recommended
- **Framework:** React Native with Expo (fastest path to both app stores)
- **State:** React Context or Zustand (overkill to use Redux for this)
- **Data:** Local JSON files bundled with the app (no backend needed for MVP)
- **Storage:** AsyncStorage for saving user's recent calculations
- **Navigation:** React Navigation (only 2-3 screens, keep it simple)
- **Styling:** NativeWind (Tailwind for React Native) or StyleSheet

### No Backend Needed for MVP
All tariff data is static and bundled. When rates change, push an app update. For Pro tier later, could add a lightweight API to push rate updates without requiring app store review.

---

## File Structure

```
/src
  /data
    countries.json        # All country tariff data
    categories.json       # All product categories and rates
  /screens
    CalculatorScreen.tsx   # Main calculator input
    ResultsScreen.tsx      # Tariff breakdown display
    InfoScreen.tsx         # About, disclaimer, tariff explainers
  /components
    CountryPicker.tsx      # Searchable country selector with flags
    CategoryPicker.tsx     # Product category selector
    ValueInput.tsx         # Dollar amount input
    ResultCard.tsx         # Individual line item in breakdown
    TariffBadge.tsx        # Color-coded severity badge
  /utils
    calculator.ts          # Core tariff calculation logic
    formatter.ts           # Currency and percentage formatting
    share.ts               # Generate shareable text summary
  /theme
    colors.ts
    typography.ts
  App.tsx
```

---

## MVP Scope (Ship This Weekend)

### In Scope
- [x] Calculator screen with country, category, value inputs
- [x] Full tariff calculation with stacking logic
- [x] Results screen with itemized breakdown
- [x] 150+ countries with current reciprocal tariff rates
- [x] 20 product categories
- [x] Section 301 (China), Section 232 (steel/aluminum/autos/copper/lumber/semiconductors)
- [x] MPF and HMF fee calculations
- [x] De minimis checks ($800 threshold)
- [x] USMCA eligibility notes
- [x] Share results as text
- [x] Info/disclaimer screen
- [x] Dark mode

### Out of Scope (V2)
- HTS code lookup/search
- Saved calculation history
- Push notifications for rate changes
- Backend API for live rate updates
- PDF export
- Batch calculations
- User accounts
- Multi-currency input
- Shipping cost integration
- Customs broker directory

---

## Launch Checklist

1. Build app with Expo / React Native
2. Generate app icon (scales/globe/dollar sign motif, blue gradient)
3. Create 5 Play Store screenshots (use a screenshot tool or Figma)
4. Write Play Store listing (title, short desc, long desc with keywords)
5. Set up Google Play Developer account ($25 one-time fee if not already set up)
6. Set up Apple Developer account ($99/year if targeting iOS)
7. Build APK/AAB and submit to Play Store
8. Submit to App Store
9. Post on Reddit (r/smallbusiness, r/FulfillmentByAmazon, r/ecommerce, r/importexport) — "I built a free tariff calculator app"

---

## Success Metrics

- **Week 1:** App live on Play Store, first 100 organic installs
- **Week 2:** 500+ installs, 4.0+ star rating
- **Month 1:** 5,000+ installs, top 10 for "tariff calculator" keyword
- **Month 3:** 25,000+ installs, launch Pro tier

---

## Data Accuracy Disclaimer

Include prominently in the app and listing:

> "TariffCheck provides estimates based on publicly available tariff schedules. Actual duties may vary based on specific HTS product classification, country of origin determinations, trade agreement eligibility, and current trade policy. This app is for informational purposes only. Consult a licensed customs broker for binding duty determinations. Tariff rates are subject to change by Executive Order or legislative action."

---

## Competitive Landscape

| Competitor | Platform | Quality | Notes |
|-----------|----------|---------|-------|
| Flexport Tariff Simulator | Web only | Excellent | No mobile app |
| AMZ Prep Calculator | Web only | Good | No mobile app |
| tariffstool.com | Web only | Good | No mobile app |
| SimplyDuty | Web + iOS | OK | Subscription-heavy, complex |
| U.S. Tariff Calculator (Play Store) | Android | Poor | Solo dev, basic, no Section 301/232 |

**Our advantage:** First clean, comprehensive, well-designed mobile app in a market where all good tools are web-only.
