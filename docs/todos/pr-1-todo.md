# PR-1 TODO — Application Launch

**Branch**: `feat/pr-1-application-launch`  
**Source PRD**: `gauntlet-03/docs/prds/pr-1-prd.md`  
**Owner (Agent)**: Pete

---

## 0. Clarifying Questions & Assumptions

- **Questions**: 
  - Should we implement a splash screen during launch?
  - What should the app icon look like (text-based vs graphic)?
- **Assumptions (confirm in PR if needed)**:
  - Tauri framework is properly configured and working
  - React 18+ is installed and configured
  - macOS development environment is set up
  - Window creation will use Tauri's built-in window management

---

## 1. Setup

- [ ] Create branch `feat/pr-1-application-launch` from develop
- [ ] Read PRD thoroughly (`gauntlet-03/docs/prds/pr-1-prd.md`)
- [ ] Read `gauntlet-03/prd-v1.md` for project context
- [ ] Confirm Tauri development environment works
- [ ] Verify React development server starts correctly
- [ ] Test basic Tauri window creation

---

## 2. Service Layer

Implement Tauri window configuration and app state management.

- [ ] Configure `src-tauri/tauri.conf.json` for window settings
  - Test Gate: Window launches with correct size (1200x800px)
  - Test Gate: Minimum size constraint enforced (1280x720px)
- [ ] Set app metadata (title: "ollo", icon, etc.)
  - Test Gate: App title displays "ollo" in window title bar
- [ ] Implement window centering and resizing behavior
  - Test Gate: Window appears centered on primary display
  - Test Gate: Window resizing works correctly
- [ ] Add error handling for window creation failures
  - Test Gate: Graceful fallback to default settings if configuration fails

---

## 3. Data Model & File Operations

Define initial app state structure for launch and UI state.

- [ ] Create `src/types/AppState.ts` with initial state interface
  - Test Gate: TypeScript compilation succeeds
- [ ] Define window configuration types
  - Test Gate: Type safety for window size constraints
- [ ] Create app state management hook `src/hooks/useAppState.ts`
  - Test Gate: Hook initializes with correct default values
- [ ] Add error state management
  - Test Gate: Error states handled correctly

---

## 4. UI Components

Create/modify React components per PRD Section 10.

- [ ] Create `src/components/LibraryPanel.tsx` (left panel, 20% width)
  - Test Gate: Component renders with empty state message
  - Test Gate: Zero console errors
- [ ] Create `src/components/PreviewPanel.tsx` (center panel, 40% width)
  - Test Gate: Component renders placeholder for video player
  - Test Gate: Zero console errors
- [ ] Create `src/components/TimelinePanel.tsx` (bottom panel, 30% height)
  - Test Gate: Component renders placeholder for timeline
  - Test Gate: Zero console errors
- [ ] Create `src/components/EmptyState.tsx` (reusable empty state)
  - Test Gate: Component displays "Drag video files here or click to import"
  - Test Gate: Zero console errors
- [ ] Modify `src/App.tsx` to implement three-panel layout
  - Test Gate: Three-panel layout renders correctly
  - Test Gate: Layout proportions match requirements (20%, 40%, 30%)
- [ ] Wire up state management with `useAppState` hook
  - Test Gate: App state initializes correctly
  - Test Gate: State updates work properly
- [ ] Add loading state during app initialization
  - Test Gate: Loading state displays during launch
- [ ] Add error state handling
  - Test Gate: Error states render correctly with user-friendly messages

---

## 5. Integration & Video Processing

Reference requirements from `gauntlet-03/prd-v1.md`.

- [ ] Tauri API integration for window management
  - Test Gate: Window creation API calls configured
- [ ] Verify Tauri window configuration works
  - Test Gate: Window launches with specified parameters
- [ ] Test window resizing constraints
  - Test Gate: Minimum size enforcement works
- [ ] No video processing required for launch (empty state)
  - Test Gate: App ready for future video import features

---

## 6. Manual Testing

Follow manual testing protocol from `gauntlet-03/prd-v1.md`.

- [ ] Manual validation of app launch
  - Test Gate: App launches successfully from Applications folder
  - Test Gate: App launches from Dock
  - Test Gate: App launches from Spotlight search
  
- [ ] Performance verification
  - Test Gate: App launch time <5 seconds (PERF-4 from prd-v1.md)
  - Test Gate: Window rendering smooth without flicker
  
- [ ] Cross-platform testing
  - Test Gate: Works on macOS (primary platform)
  - Test Gate: Window creation works on different screen resolutions
  
- [ ] Edge case testing
  - Test Gate: Launch with different screen sizes
  - Test Gate: Multiple monitor setups handled properly
  - Test Gate: Window creation errors handled gracefully
  
- [ ] Definition of done checklist
  - Test Gate: All items from PRD Section 13 verified

---

## 7. Performance

Verify targets from `gauntlet-03/prd-v1.md`.

- [ ] App load time < 5 seconds (PERF-4)
  - Test Gate: Cold start to interactive UI measured and <5s
- [ ] Window creation performance
  - Test Gate: Window appears quickly without delay
- [ ] UI rendering performance
  - Test Gate: Three-panel layout renders smoothly
- [ ] Memory usage during launch
  - Test Gate: Memory usage reasonable for empty app state

---

## 8. Acceptance Gates

Check every gate from PRD Section 12:

- [ ] **Happy Path Gates**:
  - [ ] App launches successfully from Applications folder
  - [ ] Window appears in <5 seconds with title "ollo"
  - [ ] Three-panel layout renders correctly
  - [ ] Empty state message displays properly

- [ ] **Edge Case Gates**:
  - [ ] App launches with different screen resolutions
  - [ ] Minimum window size enforced (1280x720px)
  - [ ] Window resizing works correctly
  - [ ] Multiple monitor setups handled properly

- [ ] **Video Processing Gates**:
  - [ ] No video processing required for launch (empty state)
  - [ ] App ready for video import (empty state)

- [ ] **Performance Gates**:
  - [ ] Cold start to interactive UI <5 seconds
  - [ ] Window rendering smooth without flicker

---

## 9. Documentation & PR

- [ ] Add inline code comments for window configuration logic
- [ ] Document app state structure in code comments
- [ ] Update README with launch requirements
- [ ] Create PR description (use format from gauntlet-03/agents/cody-agent-template.md)
- [ ] Verify with user before creating PR
- [ ] Open PR targeting develop branch
- [ ] Link PRD and TODO in PR description

---

## Copyable Checklist (for PR description)

```markdown
- [ ] Branch created from develop
- [ ] All TODO tasks completed
- [ ] Tauri window configuration implemented
- [ ] React components implemented with three-panel layout
- [ ] App state management implemented
- [ ] Manual testing complete with app launch verification
- [ ] Performance targets met (PERF-4: <5s launch time)
- [ ] All acceptance gates pass
- [ ] Code follows prd-v1.md patterns
- [ ] No console warnings
- [ ] Documentation updated
```

---

## Notes

- Break tasks into <30 min chunks
- Complete tasks sequentially
- Check off after completion
- Document blockers immediately
- Reference `gauntlet-03/prd-v1.md` for project requirements
- Focus on foundational launch experience that enables all future features
- Ensure window configuration is robust and handles edge cases
- Test launch performance early and often
- Verify three-panel layout renders correctly before proceeding to next features
