# Share domain logic across web and mobile

Edge Calculator will start as a mobile-first Next.js PWA in a small monorepo, with the odds, settlement, evidence, and edge rules isolated in a pure TypeScript domain package and versioned API contracts. A future Expo application will share those domain rules and contracts, but not browser-specific UI, so the web experience can be validated first without creating two implementations of the product's critical calculations.
