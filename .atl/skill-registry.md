# Skill Registry — cortinatges-esteba-web

Generated: 2026-06-12
Project: cortinatges-esteba-web
Artifact store: engram

## User Skill Triggers

| Trigger | Skill Name | Path |
|---------|-----------|------|
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | ~/.claude/skills/branch-pr/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage | go-testing | ~/.claude/skills/go-testing/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | ~/.claude/skills/issue-creation/SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review" | judgment-day | ~/.claude/skills/judgment-day/SKILL.md |
| Best practices for Remotion - Video creation in React | remotion-best-practices | ~/.claude/skills/remotion/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | ~/.claude/skills/skill-creator/SKILL.md |
| Edit any video by conversation | video-use | ~/.claude/skills/video-use/SKILL.md |

## Project Conventions

No project-level CLAUDE.md, AGENTS.md, or .cursorrules detected.

## Compact Rules

### branch-pr
- Always create branch from latest main/master
- Branch name format: `type/short-description` (e.g. `feat/add-cart-persistence`)
- PR title: conventional commit format, imperative mood, under 72 chars
- PR body: Summary (bullets) + Test plan (checklist) + issue reference if any
- Never force-push to main/master
- Link PR to issue when one exists

### issue-creation
- Title: imperative mood, under 72 chars, no period
- Body: problem statement → expected behavior → reproduction steps (for bugs) or acceptance criteria (for features)
- Label issues appropriately: bug / enhancement / documentation / etc.
- Link related issues or PRs

### judgment-day
- Launch TWO independent blind judge sub-agents simultaneously (parallel, not sequential)
- Each judge reviews the same target with NO knowledge of the other's findings
- Synthesize findings: keep items both judges flag (high confidence) and single flags (medium)
- Apply fixes for CRITICAL and HIGH items
- Re-judge after fixes; escalate if still failing after 2 iterations

### skill-creator
- Frontmatter MUST include: name, description (with Trigger:), license, metadata.author, metadata.version
- Compact rules section is MANDATORY — 5-15 lines max, actionable only
- No full code examples in compact rules — one-liners only
- Skill files go in `~/.claude/skills/{skill-name}/SKILL.md`
- Trigger text must be unambiguous and context-specific
