# PRD: Library View

**Feature**: Library View

**Version**: 1.0

**Status**: Ready for Development

**Agent**: Pete

**Target Release**: MVP Phase 2

**Links**: [PR Brief], [TODO], [Designs], [Tracking Issue]

---

## 1. Summary

Implement the Library View panel that displays imported video clips with thumbnails, metadata, and drag-to-timeline functionality. This creates the foundation for video organization and timeline building in the ollo video editor.

---

## 2. Problem & Goals

- **What video editing problem are we solving?** Users need a way to organize and preview imported video files before adding them to their timeline for editing.
- **Why now?** This is Phase 2 of the MVP implementation, building on the video import functionality from Phase 1.
- **Goals (ordered, measurable):**
  - [x] G1 — Display imported video clips with thumbnails and metadata in a scrollable library panel
  - [x] G2 — Enable click-to-preview functionality for clips in the library
  - [x] G3 — Support drag-and-drop from library to timeline for sequence building

---

## 3. Non-Goals / Out of Scope

Call out what's intentionally excluded to avoid scope creep.

- [x] Not implementing timeline functionality (separate PR)
- [x] Not implementing video trimming (separate PR)
- [x] Not implementing advanced library features like search, filtering, or folders
- [x] Not implementing clip editing within the library view

---

## 4. Success Metrics

Reference `gauntlet-03/prd-v1.md` for metric templates:
- **User-visible**: Library panel loads imported clips in <2 seconds, thumbnail generation completes in <5 seconds per clip
- **System**: Timeline UI responsive with 10+ clips (<50ms response time), memory usage <1GB with 10 clips
- **Quality**: 0 blocking bugs, all gates pass, crash-free >99%

---

## 5. Users & Stories

- As a **video editor**, I want to see all my imported video clips in an organized library so that I can easily browse and select clips for my timeline.
- As a **content creator**, I want to preview video clips by clicking on them so that I can verify the content before adding to my sequence.
- As a **video editor**, I want to drag clips from the library to the timeline so that I can build my video sequence efficiently.

---

## 6. Experience Specification (UX)

- **Entry points and flows**: Library panel appears on the left side (20% width) when videos are imported via drag-and-drop or file picker
- **Visual behavior**: 
  - Scrollable grid/list of video clips with thumbnails
  - Hover effects on clips
  - Drag cursor when dragging clips
  - Empty state: "Drag & drop video files or click Import to get started"
- **Loading/disabled/error states**: 
  - Loading spinner while generating thumbnails
  - Error state for corrupted/invalid files
  - Disabled state during video processing operations
- **Performance**: See targets in `gauntlet-03/prd-v1.md` - Timeline UI responsive with 10+ clips

---

## 7. Functional Requirements (Must/Should)

- **MUST**: Display imported video clips with thumbnails, filename, and duration in MM:SS format
- **MUST**: Generate thumbnails from first frame of each video using FFmpeg
- **MUST**: Support click-to-preview functionality (plays clip in preview player)
- **MUST**: Support drag-and-drop from library to timeline
- **MUST**: Allow duplicate imports (same file can be added multiple times)
- **MUST**: Store file paths (linked files, not embedded)
- **MUST**: Auto-save library state every 30 seconds
- **SHOULD**: Show loading indicators during thumbnail generation
- **SHOULD**: Handle large files (1GB+) with warning messages

**Acceptance gates per requirement:**
- [Gate] When user imports video → thumbnail generated and displayed in <5 seconds
- [Gate] When user clicks clip in library → preview player loads and plays clip
- [Gate] When user drags clip from library → drag operation initiates successfully
- [Gate] Error case: corrupted video file shows error message; no partial processing

---

## 8. Data Model

Describe new/changed data structures, schemas, invariants.

Reference examples in `gauntlet-03/prd-v1.md` for common patterns.

```typescript
interface VideoClip {
  id: string;
  path: string;
  filename: string;
  duration: number; // seconds
  thumbnail: string; // path to thumbnail image
  metadata: {
    width: number;
    height: number;
    framerate: number;
    codec: string;
  };
}

interface AppState {
  library: VideoClip[];
  selectedClipId: string | null;
  // ... other state properties
}
```

- **Validation rules**: File format constraints (MP4, MOV only), file size limits (4GB max)
- **File operations**: Local file system storage, thumbnail caching in temp directory

---

## 9. API / Service Contracts

Specify concrete Tauri command layer methods. Reference examples in `gauntlet-03/prd-v1.md`.

```typescript
// Extract video metadata and generate thumbnail
async function extractVideoMetadata(filePath: string): Promise<VideoMetadata>

// Generate thumbnail from video file
async function generateThumbnail(filePath: string, outputPath: string): Promise<string>

// Validate video file format and size
async function validateVideoFile(filePath: string): Promise<ValidationResult>
```

- **Pre/post-conditions**: File must exist and be readable, output thumbnail path must be writable
- **Error handling strategy**: Return structured error objects, handle FFmpeg failures gracefully
- **Parameters and types**: File paths as strings, return typed objects
- **Return values**: VideoMetadata object with duration, resolution, codec info

---

## 10. UI Components to Create/Modify

List React components/files with one-line purpose each.

- `src/components/LibraryPanel.tsx` — Main library panel container with scrollable clip list
- `src/components/VideoClipCard.tsx` — Individual clip card with thumbnail, filename, duration
- `src/hooks/useVideoLibrary.ts` — State management for library operations
- `src/contexts/VideoImportContext.tsx` — Context for sharing library state across components
- `src/types/VideoClip.ts` — TypeScript interfaces for video clip data

---

## 11. Integration Points

- **Tauri API integration**: File system operations, FFmpeg thumbnail generation
- **Local file system**: Thumbnail caching, file path storage
- **State management**: React useState/useContext patterns for library state
- **Cross-platform compatibility**: macOS primary, Windows secondary file path handling

---

## 12. Test Plan & Acceptance Gates

Define BEFORE implementation. Use checkboxes.

Reference testing standards from `gauntlet-03/prd-v1.md`.

- **Happy Path**
  - [x] User imports video files → clips appear in library with thumbnails
  - [x] Gate: Thumbnail generation completes in <5 seconds per clip
  
- **Edge Cases**
  - [x] Empty library shows empty state message
  - [x] Corrupted video files show error message
  - [x] Large files (1GB+) show warning but still process
  
- **Video Processing**
  - [x] FFmpeg thumbnail generation completes successfully
  - [x] Performance targets met for thumbnail generation
  
- **Performance** (see prd-v1.md)
  - [x] Library panel loads 10+ clips without UI lag
  - [x] Drag operations respond in <50ms
  - [x] Memory usage <1GB with 10 clips

---

## 13. Definition of Done

See standards in `gauntlet-03/prd-v1.md`:
- [x] Tauri commands implemented + unit tests (Jest)
- [x] React components with all states (loading, error, empty)
- [x] Video processing verified (thumbnail generation)
- [x] Auto-save functionality tested (library state persistence)
- [x] All acceptance gates pass
- [x] Cross-platform testing complete
- [x] Documentation updated

---

## 14. Risks & Mitigations

- **Risk**: FFmpeg thumbnail generation fails → **Mitigation**: Error handling, fallback to generic video icon
- **Risk**: Large video files cause memory issues → **Mitigation**: File size validation, progress indicators
- **Risk**: Thumbnail generation is slow → **Mitigation**: Async processing, loading states, caching
- **Risk**: Cross-platform file path issues → **Mitigation**: Use Tauri path utilities, test on both platforms

---

## 15. Rollout & Telemetry

- **Feature flag?** No (core MVP functionality)
- **Metrics**: Thumbnail generation time, library load performance, error rates
- **Manual validation steps**: Import various video formats, verify thumbnail quality, test drag operations

---

## 16. Open Questions

- Q1: Should thumbnails be cached permanently or regenerated each session?
- Q2: What thumbnail size/resolution should we use for optimal performance?

---

## 17. Appendix: Out-of-Scope Backlog

Items deferred for future:
- [ ] Library search and filtering
- [ ] Folder organization within library
- [ ] Batch operations on multiple clips
- [ ] Custom thumbnail selection

---

## Preflight Questionnaire

Answer these to drive vertical slice and acceptance gates:

1. **Smallest end-to-end user outcome for this PR?** User can import videos and see them organized in a library with thumbnails
2. **Primary user and critical action?** Video editor browsing and selecting clips from library
3. **Must-have vs nice-to-have?** Must-have: thumbnail display, click preview, drag to timeline
4. **Video processing requirements?** FFmpeg thumbnail generation from first frame
5. **Performance constraints?** <5 seconds thumbnail generation, <50ms drag response
6. **Error/edge cases to handle?** Corrupted files, large files, unsupported formats
7. **Data model changes?** Add VideoClip interface, update AppState with library array
8. **Tauri APIs required?** File system operations, FFmpeg integration
9. **UI entry points and states?** Library panel, clip cards, empty state, loading states
10. **File system implications?** Thumbnail caching, file path storage
11. **Dependencies or blocking integrations?** Depends on video import functionality
12. **Rollout strategy and metrics?** Core MVP feature, no feature flag needed
13. **What is explicitly out of scope?** Timeline functionality, trimming, advanced library features

---

## Authoring Notes

- Write Test Plan before coding
- Favor vertical slice that ships standalone
- Keep Tauri command layer deterministic
- React components are thin wrappers
- Test video processing thoroughly
- Reference `gauntlet-03/prd-v1.md` throughout
