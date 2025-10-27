# PR-{N} TODO — [Feature Name]

**Branch**: `feat/pr-{n}-{feature-slug}`  
**Source PRD**: `gauntlet-03/docs/prds/pr-{n}-prd.md`  
**Owner (Agent)**: [Pete/Cody]

---

## 0. Clarifying Questions & Assumptions

- Questions: [unanswered items from PRD]
- Assumptions (confirm in PR if needed):
  - [assumption 1]
  - [assumption 2]

---

## 1. Setup

- [ ] Create branch `feat/pr-{n}-{feature-slug}` from develop
- [ ] Read PRD thoroughly
- [ ] Read `gauntlet-03/agents/shared-standards.md` for patterns
- [ ] Confirm environment and test runner work

---

## 2. Service Layer

Implement deterministic Tauri commands from PRD.

- [ ] Implement [Tauri command name]
  - Test Gate: Unit test passes for valid/invalid cases
- [ ] Implement [Tauri command name]
  - Test Gate: Unit test passes
- [ ] Add validation logic
  - Test Gate: Edge cases handled correctly

---

## 3. Data Model & File Operations

- [ ] Define new types/interfaces in TypeScript
- [ ] Update project state schema (if needed)
- [ ] Add validation rules
  - Test Gate: Reads/writes succeed with rules applied

---

## 4. UI Components

Create/modify React components per PRD Section 10.

- [ ] Create/modify [Component name]
  - Test Gate: React component renders; zero console errors
- [ ] Wire up state management (useState, useEffect, etc.)
  - Test Gate: Interaction updates state correctly
- [ ] Add loading/error/empty states
  - Test Gate: All states render correctly

---

## 5. Integration & Video Processing

Reference requirements from `gauntlet-03/agents/shared-standards.md`.

- [ ] Tauri API integration
  - Test Gate: API calls configured
- [ ] Video processing operations working
  - Test Gate: FFmpeg operations complete successfully
- [ ] Auto-save functionality
  - Test Gate: Project state saves and restores correctly
- [ ] File system operations (if applicable)
  - Test Gate: File operations work correctly

---

## 6. Manual Testing

Follow manual testing protocol from `gauntlet-03/agents/shared-standards.md` and `gauntlet-03/agents/test-template.md`.

- [ ] Manual validation with real video files
  - Test Gate: All features work with actual MP4/MOV files
  
- [ ] Performance verification
  - Test Gate: Timeline UI responsive, video playback smooth
  
- [ ] Cross-platform testing
  - Test Gate: Works on macOS and Windows
  
- [ ] Edge case testing
  - Test Gate: Large files, corrupted files, invalid formats handled
  
- [ ] Definition of done checklist
  - Test Gate: All items from shared-standards.md verified

---

## 7. Performance

Verify targets from `gauntlet-03/agents/shared-standards.md`.

- [ ] App load time < 5 seconds
  - Test Gate: Cold start to interactive measured
- [ ] Timeline UI responsive
  - Test Gate: Drag operations < 50ms response time
- [ ] Video playback smooth 30fps minimum
  - Test Gate: Video operations measured

---

## 8. Acceptance Gates

Check every gate from PRD Section 12:
- [ ] All happy path gates pass
- [ ] All edge case gates pass
- [ ] All video processing gates pass
- [ ] All performance gates pass

---

## 9. Documentation & PR

- [ ] Add inline code comments for complex logic
- [ ] Update README if needed
- [ ] Create PR description (use format from gauntlet-03/agents/cody-agent-template.md)
- [ ] Verify with user before creating PR
- [ ] Open PR targeting develop branch
- [ ] Link PRD and TODO in PR description

---

## Copyable Checklist (for PR description)

```markdown
- [ ] Branch created from develop
- [ ] All TODO tasks completed
- [ ] Tauri commands implemented
- [ ] React components implemented with state management
- [ ] Video processing integration tested
- [ ] Manual testing complete with real video files
- [ ] Performance targets met (see shared-standards.md)
- [ ] All acceptance gates pass
- [ ] Code follows shared-standards.md patterns
- [ ] No console warnings
- [ ] Documentation updated
```

---

## Notes

- Break tasks into <30 min chunks
- Complete tasks sequentially
- Check off after completion
- Document blockers immediately
- Reference `gauntlet-03/agents/shared-standards.md` for common patterns and solutions