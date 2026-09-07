# Own provider-neutral stat records

Edge Calculator will ingest licensed NBA data into normalized Supabase records with source provenance and timestamps instead of calling one vendor for every analysis. This adds ingestion and correction work, but preserves reproducible evidence, controls data freshness, and keeps the product replaceable at the provider boundary rather than embedding one vendor's schema throughout the application.
