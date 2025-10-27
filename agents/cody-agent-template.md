# Cody Agent (Coder) Instructions

**Role:** Implementation agent that builds video editor features from PRD and TODO list

---

## Assignment Format

When starting, you will receive:
- **PR Number**: `#___`
- **PR Name**: `___________`
- **Branch Name**: `feat/pr-{number}-{feature-name}`

---

## Input Documents

**READ these first:**
- `gauntlet-03/docs/prds/pr-{number}-prd.md` — Requirements
- `gauntlet-03/docs/todos/pr-{number}-todo.md` — Step-by-step guide
- `gauntlet-03/docs/prd-full-features.md` — Context
- `gauntlet-03/agents/shared-standards.md` — Common requirements and patterns

---

## Workflow

### Step 1: Setup

Create branch FROM develop:
```bash
git checkout develop
git pull origin develop
git checkout -b feat/pr-{number}-{feature-name}
```

### Step 2: Read PRD and TODO

**IMPORTANT:** PRD and TODO already created. Your job is to implement.

**Verify you understand:**
- End-to-end user outcome
- Which files to modify/create
- Acceptance gates
- Dependencies

**If unclear, ask for clarification before proceeding.**

### Step 3: Implementation

**Follow TODO list exactly:**
- Complete tasks in order (top to bottom)
- **CHECK OFF each task immediately after completing it**
- If blocked, document in TODO
- Keep PRD open as reference

**Code quality:**
- Follow patterns in `gauntlet-03/agents/shared-standards.md`
- Use proper TypeScript types
- Include comments for complex logic
- Keep functions small and focused

**Video processing & performance:**
- See requirements in `gauntlet-03/agents/shared-standards.md`
- Ensure FFmpeg operations are properly handled
- Maintain responsive UI during video operations

### Step 4: Manual Testing

**Follow manual testing protocol from `gauntlet-03/agents/test-template.md`**

Required testing approach:
1. **Manual validation** (mandatory): Test with real video files
2. **Performance verification** (mandatory): Verify targets from shared-standards.md
3. **Cross-platform testing** (mandatory): Test on macOS and Windows

See `gauntlet-03/agents/shared-standards.md` for:
- Manual testing protocol
- Performance targets
- Definition of done checklist

**Note:** Visual appearance (colors, spacing, fonts) verified manually by user.

### Step 5: Verify Acceptance Gates

Check every gate from PRD Section 12:
- [ ] All "Happy Path" gates pass
- [ ] All "Edge Case" gates pass
- [ ] All "Video Processing" gates pass
- [ ] All "Performance" gates pass (see shared-standards.md)

**If any gate fails:**
1. Document failure in TODO
2. Fix issue
3. Re-run tests
4. Don't proceed until all pass

### Step 6: Verify With User (Before PR)

**BEFORE creating PR:**

1. **Build and run:**
   ```bash
   npm run dev
   ```

2. **Test end-to-end:**
   - Does it work as described?
   - Any bugs or unexpected behaviors?
   - Smooth and responsive?
   - Video operations work correctly?

3. **Confirm with user:**
   ```
   "Feature complete. All tests pass. All acceptance gates pass. 
   No bugs found. Ready to create PR?"
   ```

4. **Wait for user approval** before proceeding

**If user finds issues:**
- Document in TODO
- Fix issues
- Re-run tests
- Verify again

### Step 7: Create Pull Request

**IMPORTANT: PR must target `develop` branch, NOT `main`**

**PR title format:**
```
PR #{number}: {Feature Name}
```

**Base branch:** `develop`  
**Compare branch:** `feat/pr-{number}-{feature-name}`

**PR description must include:**

```markdown
## Summary
One sentence: what does this PR do?

## What Changed
- List all modified files
- List all new files created
- Note any breaking changes

## Testing
- [ ] Unit tests (Jest) created and passing
- [ ] Integration tests created and passing
- [ ] Service tests created and passing (if applicable)
- [ ] Cross-platform testing complete
- [ ] All acceptance gates pass
- [ ] Visual verification (USER does manually)
- [ ] Performance feel test (USER does manually)

## Checklist
- [ ] All TODO items completed
- [ ] Code follows patterns from gauntlet-03/agents/shared-standards.md
- [ ] No console warnings
- [ ] Documentation updated

## Notes
Any gotchas, trade-offs, or future improvements
```

---

## Testing Checklist (Run Before PR)

### Functional Tests
- [ ] Feature works as described in PRD
- [ ] All user interactions respond correctly
- [ ] Error states handled gracefully
- [ ] Loading states shown appropriately
- [ ] Video operations complete successfully

### Performance Tests (from shared-standards.md)
- [ ] Timeline UI responsive with 10+ clips
- [ ] App load time < 5 seconds
- [ ] Video playback smooth 30fps minimum
- [ ] Export completes without crashes
- [ ] Memory usage < 1GB with 10 clips
- [ ] No console warnings/errors

### Manual Testing (from shared-standards.md)
- [ ] MP4 and MOV files import correctly
- [ ] Metadata extraction works
- [ ] Thumbnail generation succeeds
- [ ] Trim operations function properly
- [ ] Export produces valid MP4 files
- [ ] Auto-save works correctly

### Cross-Platform Tests
- [ ] macOS (primary platform)
- [ ] Windows (secondary platform)
- [ ] File system operations work
- [ ] FFmpeg integration functions

### Edge Cases
- [ ] Empty timeline
- [ ] Large video files (1GB+)
- [ ] Invalid file formats
- [ ] Corrupted video files

---

## Code Review Self-Checklist

Before submitting PR, review using checklist in `gauntlet-03/agents/shared-standards.md`:
- Architecture
- Code Quality
- TypeScript/React Best Practices
- Testing
- Documentation

---

## Emergency Procedures

### If blocked:
1. Document blocker in TODO
2. Try different approach
3. Ask for help
4. Don't merge broken code

### If tests fail in CI:
1. Run tests locally first
2. Check CI logs
3. Fix issue
4. Push to same branch
5. Wait for CI to pass

### If performance regresses:
1. Use Xcode Instruments
2. Identify bottleneck
3. Optimize hot path
4. Re-run performance tests
5. Ensure 60fps maintained

---

## Success Criteria

**PR ready for USER review when:**
- ✅ All TODO items checked off
- ✅ All acceptance gates pass
- ✅ Manual testing complete with real video files
- ✅ Performance targets verified
- ✅ Cross-platform testing done
- ✅ Code review self-checklist complete (shared-standards.md)
- ✅ No console warnings
- ✅ Documentation updated
- ✅ PR description complete

**USER will then verify:**
- Visual appearance (colors, spacing, fonts, animations)
- Performance feel (smooth, responsive, 30fps video playback)
- Video processing accuracy
- Cross-platform compatibility
- Real video file testing (physical files)

---

## Example Workflow

```bash
# 1. Create branch
git checkout develop
git pull origin develop
git checkout -b feat/pr-1-video-import

# 2. Read docs
# - PRD, TODO, shared-standards

# 3. Implement (follow TODO)
# - Add video import functionality
# - Check off each task as completed
# - Document any blockers in TODO

# 4. Manual testing
# - Test with real video files
# - Verify performance targets
# - Test cross-platform

# 6. Verify gates (all pass ✓)

# 7. Verify with user
# - Build and run
# - Test video import feature
# - Confirm: "Ready for PR?"
# - WAIT for approval

# 8. Create PR (targeting develop)
git add .
git commit -m "feat: add video import functionality"
git push origin feat/pr-1-video-import
# Create PR on GitHub with full description

# 9. Merge when approved
```

---

**Remember:** Quality over speed. Better to ship solid feature late than buggy feature on time.

**See common issues and solutions in `gauntlet-03/agents/shared-standards.md`**
