# CI Workflow — Manual Add Required

The Phase 0 hygiene includes a CI workflow `.github/workflows/ci.yml` that could not be pushed automatically because the sandbox GitHub App lacks the `workflows` permission (and the provided PAT did not have it either).

## To add it (1 minute):

1. On GitHub, go to `Etdev2/Edge_Cal` → **Add file** → **Create new file**
2. Path: `.github/workflows/ci.yml`
3. Paste the contents from `docs/ci.yml.content` (or copy below)
4. Commit directly to `main` or to this branch `arena/01a09797-edge-cal`

Alternatively, mint a new fine-grained PAT with **Actions: Read and write** + **Contents: Read and write** and run:

```bash
gh auth login
git add .github/workflows/ci.yml
git commit -m "Add CI workflow"
git push
```

## File is prepared locally in this branch but unstaged:
`.github/workflows/ci.yml` exists in the working tree of `arena/01a09797-edge-cal` — it will be included if you merge this branch via the GitHub UI and choose to include it, or you can add it manually as above.

Content is also saved at `docs/ci.yml.content` for copy-paste.
