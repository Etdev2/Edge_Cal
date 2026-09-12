# CI Workflow — Manual Add Required

Phase 1 includes a CI workflow `.github/workflows/ci.yml`, but it cannot be pushed automatically because the sandbox GitHub App lacks the `workflows` permission.

## To add it (1 minute):

1. On GitHub, go to `Etdev2/Edge_Cal` → **Add file** → **Create new file**
2. Path: `.github/workflows/ci.yml`
3. Paste the contents from `docs/ci.yml.content` (or copy below)
4. Commit directly to `main` or to this branch `arena/01a097bb-edge-cal`

Alternatively, mint a new fine-grained PAT with **Actions: Read and write** + **Contents: Read and write** and run:

```bash
gh auth login
git add .github/workflows/ci.yml
git commit -m "Add CI workflow"
git push
```

## File is prepared locally in this branch but unstaged:
`.github/workflows/ci.yml` is prepared in the local working tree of `arena/01a097bb-edge-cal` but must be added through GitHub UI or a credential with workflow permission, as described above.

Content is also saved at `docs/ci.yml.content` for copy-paste.
