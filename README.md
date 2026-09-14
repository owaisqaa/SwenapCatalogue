# SwenapCatalogue

Swenap B.V. wholesale product catalogue with separate distributed-brand pages and a WhatsApp order-request basket.

## Run locally

The website is plain HTML, CSS and JavaScript. No build or dependency installation is required.

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000 in your browser. For static hosting, set the publish directory to `dist` and leave the build command empty. Keep all files under `dist` together, including the brand directories and assets.

## Project files

- `dist/index.html`: home-page shell, navigation, company details and wholesale notice.
- `dist/app.js`: brand pages, Exclusive badges, basket and WhatsApp message flow.
- `dist/catalogue.js`: 222 products, product codes, pack quantities and wholesale prices in euro cents.
- `dist/style.css`: desktop and mobile layout.
- `dist/assets/`: product photography and brand logos. Raster artwork is embedded in SVG containers with the original image bytes preserved; no image-generation or image-conversion step is needed to run the site.
- `dist/brands/*/index.html`: direct entrypoints for brand pages.
- `dist/basket/index.html`: direct basket entrypoint.

## Catalogue behaviour

The home page labels the brands as Distributed Brands. Exclusive tags appear on the home-page brand squares except Mama’s Bake. Prices are wholesale prices, not retail prices. Swenap’s footer includes KVK 78189896.

The current product prices apply these deductions from the supplied price lists: Hana 5%, Katakit 7%, Cherry Brand 6%, Alahlam unchanged, all other included products 10% (including Squeeze). Hamwi products are excluded. Prices are rounded to two decimal places.

## Orders

The basket and shop details stay in the customer's browser. Continuing to WhatsApp opens a prepared order request addressed to +31 6 53776637; the customer must press Send. Long orders have a copy-and-paste option. Opening WhatsApp does not clear the basket or confirm an order. Availability, VAT treatment, delivery costs and final acceptance are confirmed manually by Swenap.

## Content to confirm

- The prices are displayed in EUR; the source documents did not specify currency or VAT treatment.
- Hana item 1838 has different sizes in the catalogue and price list; the website flags the discrepancy.
- Waritex carton quantities are unspecified and flagged for confirmation.
- Mama’s Bake has a text-only brand square; 24 products have no supplied photograph.
