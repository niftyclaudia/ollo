# PR-3 TODO — Library View

**Branch**: `feat/pr-3-library-view`  
**Source PRD**: `gauntlet-03/docs/prds/pr-3-prd.md`  
**Owner (Agent)**: Pete

---

## 0. Clarifying Questions & Assumptions

- **Questions**: 
  - Should thumbnails be cached permanently or regenerated each session?
  - What thumbnail size/resolution should we use for optimal performance?
- **Assumptions** (confirm in PR if needed):
  - Thumbnails will be cached in temp directory for session persistence
  - Thumbnail size will be 160x90px for optimal performance
  - Video import functionality from Phase 1 is already implemented

---

## 1. Setup

- [x] Create branch `feat/pr-3-library-view` from develop
- [x] Read PRD thoroughly
- [x] Read `gauntlet-03/prd-v1.md` for video processing patterns
- [x] Confirm environment and test runner work
- [x] Review existing video import implementation

---

## 2. Service Layer

Implement deterministic Tauri commands from PRD.

- [x] Implement `extract_video_metadata` Tauri command
  - Test Gate: Unit test passes for valid/invalid cases
- [x] Implement `generate_thumbnail` Tauri command
  - Test Gate: Unit test passes for thumbnail generation
- [x] Implement `validate_video_file` Tauri command
  - Test Gate: Edge cases handled correctly (corrupted files, unsupported formats)
- [x] Add FFmpeg integration for thumbnail generation
  - Test Gate: FFmpeg operations complete successfully

---

## 3. Data Model & File Operations

- [x] Define `VideoClip` interface in TypeScript
- [x] Update `AppState` schema to include library array
- [x] Add validation rules for file formats and sizes
  - Test Gate: Reads/writes succeed with rules applied
- [x] Implement thumbnail caching logic
  - Test Gate: Thumbnails persist across app sessions

---

## 4. UI Components

Create/modify React components per PRD Section 10.

- [x] Create `LibraryPanel.tsx` component
  - Test Gate: React component renders; zero console errors
- [x] Create `VideoClipCard.tsx` component
  - Test Gate: Component displays thumbnail, filename, duration correctly
- [x] Wire up state management with `useVideoLibrary` hook
  - Test Gate: Interaction updates state correctly
- [x] Add loading/error/empty states to LibraryPanel
  - Test Gate: All states render correctly
- [x] Implement drag-and-drop functionality
  - Test Gate: Drag operations work smoothly

---

## 5. Integration & Video Processing

Reference requirements from `gauntlet-03/prd-v1.md`.

- [x] Tauri API integration for video metadata extraction
  - Test Gate: API calls configured and working
- [x] Video processing operations (thumbnail generation)
  - Test Gate: FFmpeg operations complete successfully
- [x] Auto-save functionality for library state
  - Test Gate: Project state saves and restores correctly
- [x] File system operations (thumbnail caching, file path storage)
  - Test Gate: File operations work correctly
- [x] Integration with existing video import functionality
  - Test Gate: Imported videos appear in library automatically

---

## 6. Manual Testing

Follow manual testing protocol from `gauntlet-03/prd-v1.md`.

- [x] Manual validation with real video files
  - Test Gate: All features work with actual MP4/MOV files
  
- [x] Performance verification
  - Test Gate: Library panel responsive with 10+ clips, thumbnail generation <5 seconds
  
- [x] Cross-platform testing
  - Test Gate: Works on macOS and Windows
  
- [x] Edge case testing
  - Test Gate: Large files, corrupted files, invalid formats handled gracefully
  
- [x] Definition of done checklist
  - Test Gate: All items from prd-v1.md verified

---

## 7. Performance

Verify targets from `gauntlet-03/prd-v1.md`.

- [x] Library panel loads 10+ clips without UI lag
  - Test Gate: UI remains responsive during thumbnail generation
- [x] Drag operations respond in <50ms
  - Test Gate: Drag response time measured and verified
- [x] Memory usage <1GB with 10 clips
  - Test Gate: Memory usage monitored and within limits
- [x] Thumbnail generation completes in <5 seconds per clip
  - Test Gate: Generation time measured for various file sizes

---

## 8. Acceptance Gates

Check every gate from PRD Section 12:
- [x] All happy path gates pass (import → display → preview → drag)
- [x] All edge case gates pass (corrupted files, large files, empty library)
- [x] All video processing gates pass (thumbnail generation, metadata extraction)
- [x] All performance gates pass (UI responsiveness, memory usage)

---

## 9. Documentation & PR

- [x] Add inline code comments for complex logic (FFmpeg integration, drag-and-drop)
- [x] Update README if needed
- [x] Create PR description (use format from gauntlet-03/agents/cody-agent-template.md)
- [ ] Verify with user before creating PR
- [ ] Open PR targeting develop branch
- [ ] Link PRD and TODO in PR description

---

## Copyable Checklist (for PR description)

```markdown
- [ ] Branch created from develop
- [ ] All TODO tasks completed
- [ ] Tauri commands implemented (extract_video_metadata, generate_thumbnail, validate_video_file)
- [ ] React components implemented (LibraryPanel, VideoClipCard) with state management
- [ ] Video processing integration tested (FFmpeg thumbnail generation)
- [ ] Manual testing complete with real video files
- [ ] Performance targets met (library responsive with 10+ clips, <5s thumbnail generation)
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
- Reference `gauntlet-03/prd-v1.md` for common patterns and solutions
- Focus on thumbnail generation performance as it's critical for user experience
