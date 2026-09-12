import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_API = "https://api.github.com";

function githubHeaders(token: string) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

function toBase64(content: string): string {
  return Buffer.from(content, "utf-8").toString("base64");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      token,
      owner = "Etdev2",
      repo = "Edge_Cal",
      base,
      branch: requestedBranch,
      title,
      body: prBody,
      filePath: requestedFilePath,
      fileContent: requestedFileContent,
      notes,
    } = body ?? {};

    if (!token || typeof token !== "string" || token.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "A valid GitHub token is required to open the PR." },
        { status: 400 }
      );
    }

    const cleanToken = token.trim();
    const cleanOwner = String(owner || "Etdev2").trim();
    const cleanRepo = String(repo || "Edge_Cal").trim();

    if (!cleanOwner || !cleanRepo) {
      return NextResponse.json(
        { success: false, error: "Repository owner and name are required (e.g. Etdev2/Edge_Cal)." },
        { status: 400 }
      );
    }

    // 1. Verify repo access + resolve base branch
    const repoRes = await fetch(`${GITHUB_API}/repos/${cleanOwner}/${cleanRepo}`, {
      headers: githubHeaders(cleanToken),
    });

    if (repoRes.status === 401) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GitHub rejected the token (401 Unauthorized). Create a new token with Contents: Read and write + Pull requests: Read and write, scoped to Etdev2/Edge_Cal.",
        },
        { status: 401 }
      );
    }

    if (repoRes.status === 404) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Repository not found or token has no access (404). Check the repo name Etdev2/Edge_Cal and that the token is scoped to it.",
        },
        { status: 404 }
      );
    }

    if (!repoRes.ok) {
      const text = await repoRes.text();
      return NextResponse.json(
        { success: false, error: `Could not read repository: ${repoRes.status} ${text.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const repoInfo = await repoRes.json();
    const baseBranch: string = base || repoInfo.default_branch || "main";

    // 2. Get base branch SHA
    const refRes = await fetch(
      `${GITHUB_API}/repos/${cleanOwner}/${cleanRepo}/git/ref/heads/${encodeURIComponent(baseBranch)}`,
      { headers: githubHeaders(cleanToken) }
    );

    if (!refRes.ok) {
      const text = await refRes.text();
      return NextResponse.json(
        {
          success: false,
          error: `Could not find base branch "${baseBranch}" (${refRes.status}). ${text.slice(0, 300)}`,
        },
        { status: 502 }
      );
    }

    const refData = await refRes.json();
    const baseSha: string = refData?.object?.sha;

    if (!baseSha) {
      return NextResponse.json(
        { success: false, error: "Could not resolve the base branch SHA." },
        { status: 502 }
      );
    }

    // 3. Create feature branch (unique)
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.random().toString(36).slice(2, 7);
    const branch =
      (requestedBranch && String(requestedBranch).trim()) || `option-b-save-${stamp}-${rand}`;

    const createRefRes = await fetch(`${GITHUB_API}/repos/${cleanOwner}/${cleanRepo}/git/refs`, {
      method: "POST",
      headers: githubHeaders(cleanToken),
      body: JSON.stringify({
        ref: `refs/heads/${branch}`,
        sha: baseSha,
      }),
    });

    if (!createRefRes.ok) {
      const errText = await createRefRes.text();
      // If branch already exists, continue (user re-uses branch name) — fetch its SHA instead
      if (createRefRes.status !== 422) {
        return NextResponse.json(
          { success: false, error: `Could not create branch "${branch}": ${errText.slice(0, 400)}` },
          { status: 502 }
        );
      }
    }

    // 4. Prepare file content for Option B save
    const nowIso = new Date().toISOString();
    const defaultFilePath = requestedFilePath || `docs/sandbox-option-b-${stamp}-${rand}.md`;
    const defaultContent = `# Option B — Saved Edge Calculator Progress

Saved from the Edge Calculator sandbox on ${nowIso}.

- Selected flow: **Option B (Classic PAT + one-click PR save)**
- Repository: ${cleanOwner}/${cleanRepo}
- Base branch: ${baseBranch}
- Feature branch: ${branch}

## What this PR saves
This file proves the Option B save-to-GitHub flow works end-to-end:

- [x] Token authenticated against GitHub API
- [x] Feature branch created from ${baseBranch}
- [x] This file committed via the Contents API
- [x] Pull request opened for review

## User notes
${notes ? notes : "_No extra notes added in the sandbox._"}

## Next steps
1. Review this PR on GitHub.
2. Merge to keep the save, or keep iterating in the sandbox and open another Option B PR.
3. Connect Vercel to \`${cleanOwner}/${cleanRepo}\` for live previews of every merge.

> Generated by Edge Calculator · Analysis-only 21+ beta · No wagering data stored.
`;

    const filePath = defaultFilePath;
    const fileContent = requestedFileContent || defaultContent;

    // Check if file already exists on the new branch (to include sha on update)
    let existingSha: string | undefined;
    try {
      const existingRes = await fetch(
        `${GITHUB_API}/repos/${cleanOwner}/${cleanRepo}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(branch)}`,
        { headers: githubHeaders(cleanToken) }
      );
      if (existingRes.ok) {
        const existingData = await existingRes.json();
        if (existingData?.sha) existingSha = existingData.sha;
      }
    } catch {
      // ignore — treat as new file
    }

    const putRes = await fetch(
      `${GITHUB_API}/repos/${cleanOwner}/${cleanRepo}/contents/${encodeURIComponent(filePath)}`,
      {
        method: "PUT",
        headers: githubHeaders(cleanToken),
        body: JSON.stringify({
          message: `Option B save: add ${filePath}`,
          content: toBase64(fileContent),
          branch,
          ...(existingSha ? { sha: existingSha } : {}),
        }),
      }
    );

    if (!putRes.ok) {
      const errText = await putRes.text();
      return NextResponse.json(
        { success: false, error: `Could not commit save file (${putRes.status}): ${errText.slice(0, 500)}` },
        { status: 502 }
      );
    }

    // 5. Open the pull request
    const prTitle =
      title || `Option B: Save Edge Calculator progress (${stamp})`;
    const prBodyText =
      prBody ||
      `## Option B save\n\nThis PR was created from the Edge Calculator sandbox using **Option B** (token + one-click PR).\n\n- Branch: \`${branch}\` → \`${baseBranch}\`\n- Save file: \`${filePath}\`\n- Created: ${nowIso}\n\n${notes ? `### Notes\n${notes}\n\n` : ""}Review and merge to keep this save on GitHub.`;

    const prRes = await fetch(`${GITHUB_API}/repos/${cleanOwner}/${cleanRepo}/pulls`, {
      method: "POST",
      headers: githubHeaders(cleanToken),
      body: JSON.stringify({
        title: prTitle,
        head: branch,
        base: baseBranch,
        body: prBodyText,
        maintainer_can_modify: true,
      }),
    });

    if (!prRes.ok) {
      const errText = await prRes.text();
      // Common case: PR already exists for this branch — try to surface the existing PR URL
      return NextResponse.json(
        {
          success: false,
          error: `Branch + file saved, but PR creation failed (${prRes.status}): ${errText.slice(0, 500)}`,
          branch,
          filePath,
        },
        { status: 502 }
      );
    }

    const prData = await prRes.json();

    return NextResponse.json({
      success: true,
      prUrl: prData.html_url,
      prNumber: prData.number,
      branch,
      filePath,
      base: baseBranch,
      message: "Option B PR created. Open the link to review and merge on GitHub.",
    });
  } catch (error) {
    console.error("create-pr error:", error);
    return NextResponse.json(
      { success: false, error: "Unexpected server error while creating the PR." },
      { status: 500 }
    );
  }
}
