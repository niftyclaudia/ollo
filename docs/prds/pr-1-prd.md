# PRD: Application Launch

**Feature**: Application Launch

**Version**: 1.0

**Status**: Ready for Development

**Agent**: Pete

**Target Release**: Phase 1

**Links**: [PR Brief], [TODO], [Designs], [Tracking Issue]

---

## 1. Summary

Establish the foundational desktop application launch experience for ollo video editor, ensuring the app launches as a native macOS application with proper window configuration and initial empty state UI that guides users to import their first videos.

---

## 2. Problem & Goals

- **What video editing problem are we solving?** Users need a desktop video editor that launches quickly and provides clear guidance on how to get started with their first video import.
- **Why now?** This is the foundational requirement that enables all subsequent video editing features. Without proper application launch, users cannot access any video editing functionality.
- **Goals (ordered, measurable):**
  - [ ] G1 — App launches as native macOS application in <5 seconds (PERF-4 from prd-v1.md)
  - [ ] G2 — Window displays proper layout with empty state guidance for video import
  - [ ] G3 — App title shows "ollo" and window is resizable with minimum 1280x720 size

---

## 3. Non-Goals / Out of Scope

Call out what's intentionally excluded to avoid scope creep.

- [ ] Not implementing video import functionality (separate PR)
- [ ] Not implementing session recovery/auto-save (separate PR)
- [ ] Not implementing custom app icon design (basic text-based icon only)
- [ ] Not implementing Windows-specific launch optimizations (macOS primary focus)

---

## 4. Success Metrics

Reference `gauntlet-03/prd-v1.md` for metric templates:
- **User-visible**: App launches in <5 seconds from cold start to interactive UI
- **System**: Window renders at 1200x800px (resizable), minimum 1280x720px enforced
- **Quality**: 0 blocking bugs, app launches without crashes, proper window focus

---

## 5. Users & Stories

- As a **video editor**, I want the app to launch quickly so that I can start editing videos without waiting.
- As a **content creator**, I want clear visual guidance when the app opens so that I know how to import my first video files.
- As a **macOS user**, I want the app to behave like other native applications so that it feels integrated with my system.

---

## 6. Experience Specification (UX)

- **Entry points and flows**: App launches from Applications folder, Dock, or Spotlight search
- **Visual behavior**: 
  - Window appears centered on screen at 1200x800px
  - Three-panel layout visible (Library 20%, Preview 40%, Timeline 30%)
  - Empty state message: "Drag video files here or click to import"
  - App title shows "ollo" in window title bar
- **Loading/disabled/error states**: 
  - Loading: Show splash screen or loading indicator during launch
  - Empty state: Clear call-to-action for video import
  - Error: Graceful error handling if window creation fails
- **Performance**: See targets in `gauntlet-03/prd-v1.md` - App launch <5 seconds (PERF-4)

---

## 7. Functional Requirements (Must/Should)

- **MUST**: App launches as native macOS application using Tauri framework
- **MUST**: Window size 1200x800px (resizable) with minimum 1280x720px enforced
- **MUST**: App title displays "ollo" in window title bar
- **MUST**: Three-panel layout renders correctly (Library 20%, Preview 40%, Timeline 30%)
- **MUST**: Empty state displays "Drag video files here or click to import" message
- **SHOULD**: Window appears centered on primary display
- **SHOULD**: App icon appears in Dock and Applications folder

**Acceptance gates per requirement:**
- [Gate] When app launches → window appears in <5 seconds with proper title
- [Gate] When window renders → three-panel layout displays correctly
- [Gate] When app is resized → minimum size 1280x720px enforced
- [Gate] Error case: Launch failure shows user-friendly error message

---

## 8. Data Model

Describe new/changed data structures, schemas, invariants.

Reference examples in `gauntlet-03/prd-v1.md` for common patterns.

```typescript
// Initial app state structure
interface AppState {
  // Window configuration
  windowSize: {
    width: number;  // 1200px default
    height: number; // 800px default
    minWidth: number; // 1280px
    minHeight: number; // 720px
  };
  
  // UI state
  isAppReady: boolean;
  hasError: boolean;
  errorMessage?: string;
  
  // Layout state (for future features)
  library: VideoClip[]; // Empty initially
  timeline: TimelineClip[]; // Empty initially
  selectedClipId: string | null; // null initially
}
```

- **Validation rules**: Window size constraints enforced by Tauri configuration
- **File operations**: No file operations required for launch (empty state)

---

## 9. API / Service Contracts

Specify concrete Tauri command layer methods. Reference examples in `gauntlet-03/prd-v1.md`.

```typescript
// Tauri window configuration (in tauri.conf.json)
interface WindowConfig {
  width: 1200;
  height: 800;
  minWidth: 1280;
  minHeight: 720;
  resizable: true;
  title: "ollo";
  center: true;
}

// React state management
interface AppLaunchState {
  isReady: boolean;
  windowSize: { width: number; height: number };
  error: string | null;
}
```

- **Pre/post-conditions**: App must initialize Tauri window before React renders
- **Error handling strategy**: Graceful fallback to default window size if configuration fails
- **Parameters and types**: Window configuration via tauri.conf.json
- **Return values**: App state indicating launch success/failure

---

## 10. UI Components to Create/Modify

List React components/files with one-line purpose each.

- `src/App.tsx` — Main app component with three-panel layout
- `src/components/LibraryPanel.tsx` — Left panel with empty state message
- `src/components/PreviewPanel.tsx` — Center panel placeholder for video player
- `src/components/TimelinePanel.tsx` — Bottom panel placeholder for timeline
- `src/components/EmptyState.tsx` — Reusable empty state component
- `src/hooks/useAppState.ts` — App state management hook
- `src-tauri/tauri.conf.json` — Window configuration and app metadata

---

## 11. Integration Points

- **Tauri API integration**: Window creation and configuration
- **Local file system**: No file operations required for launch
- **State management**: React useState for app state
- **Cross-platform compatibility**: macOS primary (Windows secondary for future)

---

## 12. Test Plan & Acceptance Gates

Define BEFORE implementation. Use checkboxes.

Reference testing standards from `gauntlet-03/prd-v1.md`.

- **Happy Path**
  - [ ] App launches successfully from Applications folder
  - [ ] Gate: Window appears in <5 seconds with title "ollo"
  - [ ] Gate: Three-panel layout renders correctly
  - [ ] Gate: Empty state message displays properly
  
- **Edge Cases**
  - [ ] App launches with different screen resolutions
  - [ ] Gate: Minimum window size enforced (1280x720px)
  - [ ] Gate: Window resizing works correctly
  - [ ] Gate: Multiple monitor setups handled properly
  
- **Video Processing**
  - [ ] No video processing required for launch
  - [ ] Gate: App ready for video import (empty state)
  
- **Performance (see prd-v1.md)**
  - [ ] App load <5s (PERF-4)
  - [ ] Gate: Cold start to interactive UI <5 seconds
  - [ ] Gate: Window rendering smooth without flicker

---

## 13. Definition of Done

See standards in `gauntlet-03/prd-v1.md`:
- [ ] Tauri window configuration implemented
- [ ] React components render three-panel layout
- [ ] Empty state UI displays correctly
- [ ] Window size constraints enforced
- [ ] All acceptance gates pass
- [ ] App launches without errors
- [ ] Performance target met (<5s launch time)

---

## 14. Risks & Mitigations

- **Risk**: Slow app launch on older hardware → Mitigation: Optimize Tauri bundle size, lazy load non-critical components
- **Risk**: Window rendering issues on different screen sizes → Mitigation: Test on various resolutions, responsive layout design
- **Risk**: Tauri configuration errors → Mitigation: Validate tauri.conf.json, fallback to default settings

---

## 15. Rollout & Telemetry

- **Feature flag?** No (foundational feature)
- **Metrics**: Launch time, window creation success rate, error frequency
- **Manual validation steps**: Launch app, verify window size, test resizing, check empty state

---

## 16. Open Questions

- Q1: Should we implement a splash screen during launch?
- Q2: What should the app icon look like (text-based vs graphic)?

---

## 17. Appendix: Out-of-Scope Backlog

Items deferred for future:
- [ ] Custom app icon design
- [ ] Launch animation/splash screen
- [ ] Windows-specific optimizations
- [ ] Session recovery on launch

---

## Preflight Questionnaire

Answer these to drive vertical slice and acceptance gates:

1. **Smallest end-to-end user outcome for this PR?** User can launch app and see empty video editor interface ready for import
2. **Primary user and critical action?** Video editor launching app to start editing session
3. **Must-have vs nice-to-have?** Must-have: Window creation, layout, empty state. Nice-to-have: Launch animations
4. **Video processing requirements?** None for launch (empty state)
5. **Performance constraints?** <5 second launch time (PERF-4 from prd-v1.md)
6. **Error/edge cases to handle?** Launch failures, different screen sizes, window creation errors
7. **Data model changes?** Initial app state structure for window and UI state
8. **Tauri APIs required?** Window creation and configuration APIs
9. **UI entry points and states?** App launch → window creation → layout rendering → empty state
10. **File system implications?** None for launch
11. **Dependencies or blocking integrations?** Tauri framework, React rendering
12. **Rollout strategy and metrics?** Direct deployment, track launch time and success rate
13. **What is explicitly out of scope?** Video import, session recovery, custom icons

---

## Authoring Notes

- Write Test Plan before coding
- Favor vertical slice that ships standalone
- Keep Tauri command layer deterministic
- React components are thin wrappers
- Test window creation thoroughly
- Reference `gauntlet-03/prd-v1.md` throughout
