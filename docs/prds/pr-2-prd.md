# PRD: Import & Library

**Feature**: Import & Library

**Version**: 1.0

**Status**: Ready for Development

**Agent**: Pete

**Target Release**: Phase 2

**Links**: [PR Brief], [TODO], [Designs], [Tracking Issue]

---

## 1. Summary

Implement video file import functionality with drag-and-drop and file picker support, extract video metadata using FFmpeg, generate thumbnails from first frames, and display imported clips in the Library panel with proper validation and error handling.

---

## 2. Problem & Goals

- **What video editing problem are we solving?** Users need to import video files into the editor to begin their editing workflow. Without import functionality, users cannot access any video editing features.
- **Why now?** This is the second foundational requirement that enables timeline editing. After PR-1 (Application Launch), users need to import videos to populate the Library panel.
- **Goals (ordered, measurable):**
  - [ ] G1 — Users can import MP4/MOV files via drag-and-drop and file picker
  - [ ] G2 — Video metadata extracted in <2 seconds per file (PERF-1 from prd-v1.md)
  - [ ] G3 — Thumbnails generated and clips displayed in Library panel with filename and duration

---

## 3. Non-Goals / Out of Scope

Call out what's intentionally excluded to avoid scope creep.

- [ ] Not implementing timeline drag-and-drop (separate PR)
- [ ] Not implementing video preview/playback (separate PR)
- [ ] Not implementing auto-save functionality (separate PR)
- [ ] Not supporting video formats other than MP4/MOV
- [ ] Not implementing video file validation beyond basic format checking
- [ ] Not implementing duplicate file detection or management

---

## 4. Success Metrics

Reference `gauntlet-03/prd-v1.md` for metric templates:
- **User-visible**: Import 3 different video files successfully, metadata extraction <2 seconds per file
- **System**: Library panel displays clips with thumbnails, filenames, and durations
- **Quality**: 0 blocking bugs, proper error handling for invalid files, no crashes during import

---

## 5. Users & Stories

- As a **video editor**, I want to drag video files into the Library panel so that I can start building my project.
- As a **content creator**, I want to see video thumbnails and durations in the Library so that I can quickly identify the clips I want to use.
- As a **macOS user**, I want to use the native file picker to import videos so that it feels integrated with my system.

---

## 6. Experience Specification (UX)

- **Entry points and flows**: 
  - Drag-and-drop: Drag video files from Finder into Library panel
  - File picker: Click "Import Videos" button to open native file picker
  - Multiple file selection enabled for both methods
- **Visual behavior**: 
  - Visual feedback when dragging files over Library panel
  - Loading indicators during metadata extraction
  - Clips display with thumbnail, filename, and duration (MM:SS format)
  - Empty state: "Drag & drop video files or click Import to get started"
- **Loading/disabled/error states**: 
  - Loading: Spinner + "Importing [filename]..." during metadata extraction
  - Error: Clear error messages for unsupported formats or corrupted files
  - Warning: "Large file - processing may take longer" for files 1GB+
  - Block: "File too large. Please use files under 4GB" for files 4GB+
- **Performance**: See targets in `gauntlet-03/prd-v1.md` - Metadata extraction <2 seconds per file

---

## 7. Functional Requirements (Must/Should)

- **MUST**: Support drag-and-drop import of MP4/MOV files into Library panel
- **MUST**: Support file picker import with multiple file selection
- **MUST**: Extract video metadata using FFmpeg (duration, resolution, framerate, codec)
- **MUST**: Generate thumbnail from first frame as JPEG
- **MUST**: Display clips in Library panel with thumbnail, filename, and duration
- **MUST**: Validate file formats and show error messages for unsupported types
- **MUST**: Handle large files with appropriate warnings and size limits
- **SHOULD**: Allow duplicate imports (same file can be added multiple times)
- **SHOULD**: Store file paths (linked files, not embedded content)

**Acceptance gates per requirement:**
- [Gate] When user drags MP4/MOV file → file appears in Library panel within 2 seconds
- [Gate] When user clicks Import → native file picker opens with multiple selection
- [Gate] When metadata extraction completes → thumbnail, filename, and duration display correctly
- [Gate] Error case: Unsupported file format shows clear error message
- [Gate] Error case: File >4GB blocked with appropriate message

---

## 8. Data Model

Describe new/changed data structures, schemas, invariants.

Reference examples in `gauntlet-03/prd-v1.md` for common patterns.

```typescript
// Video clip data structure
interface VideoClip {
  id: string; // UUID
  path: string; // File system path
  filename: string; // Display name
  duration: number; // Duration in seconds
  thumbnail: string; // Path to thumbnail image
  metadata: {
    width: number;
    height: number;
    framerate: number;
    codec: string;
    fileSize: number; // Bytes
  };
  importedAt: Date; // Timestamp
}

// Library state
interface LibraryState {
  clips: VideoClip[];
  isImporting: boolean;
  importProgress: number; // 0-100
  error: string | null;
}

// Import validation
interface ImportValidation {
  isValidFormat: boolean;
  isWithinSizeLimit: boolean;
  errorMessage?: string;
}
```

- **Validation rules**: MP4/MOV formats only, max 4GB file size, valid video metadata
- **File operations**: Read file paths, generate thumbnails in temp directory, store metadata

---

## 9. API / Service Contracts

Specify concrete Tauri command layer methods. Reference examples in `gauntlet-03/prd-v1.md`.

```typescript
// Tauri commands for video import
async function validateVideoFile(filePath: string): Promise<ImportValidation>
async function extractVideoMetadata(filePath: string): Promise<VideoMetadata>
async function generateThumbnail(filePath: string, outputPath: string): Promise<void>
async function openFilePicker(): Promise<string[]>
async function getFileSize(filePath: string): Promise<number>

// React state management
interface ImportState {
  isImporting: boolean;
  importProgress: number;
  error: string | null;
  clips: VideoClip[];
}
```

- **Pre/post-conditions**: File must exist and be readable before metadata extraction
- **Error handling strategy**: Graceful error handling with user-friendly messages
- **Parameters and types**: File paths as strings, return structured metadata objects
- **Return values**: VideoMetadata object with duration, resolution, codec info

---

## 10. UI Components to Create/Modify

List React components/files with one-line purpose each.

- `src/components/LibraryPanel.tsx` — Display imported clips with drag-and-drop support
- `src/components/VideoClipCard.tsx` — Individual clip display with thumbnail, filename, duration
- `src/components/ImportButton.tsx` — File picker trigger button
- `src/components/EmptyState.tsx` — Empty Library state with import instructions
- `src/hooks/useVideoImport.ts` — Import logic and state management
- `src/services/videoMetadata.ts` — FFmpeg integration for metadata extraction
- `src-tauri/src/commands/video.rs` — Tauri commands for file operations and FFmpeg

---

## 11. Integration Points

- **Tauri API integration**: File system operations, FFmpeg binary access
- **Local file system**: Read video files, generate thumbnails in temp directory
- **State management**: React useState for Library state, useEffect for import operations
- **Cross-platform compatibility**: macOS primary (Windows secondary for future)

---

## 12. Test Plan & Acceptance Gates

Define BEFORE implementation. Use checkboxes.

Reference testing standards from `gauntlet-03/prd-v1.md`.

- **Happy Path**
  - [ ] User drags MP4 file into Library panel
  - [ ] Gate: File appears in Library within 2 seconds with thumbnail and metadata
  - [ ] User clicks Import button and selects multiple files
  - [ ] Gate: All selected files appear in Library panel
  
- **Edge Cases**
  - [ ] User drags unsupported file format (e.g., .txt, .jpg)
  - [ ] Gate: Clear error message displayed, file not added to Library
  - [ ] User attempts to import file >4GB
  - [ ] Gate: File blocked with appropriate error message
  - [ ] User imports corrupted video file
  - [ ] Gate: Error handled gracefully with user-friendly message
  
- **Video Processing**
  - [ ] FFmpeg metadata extraction works for various MP4/MOV files
  - [ ] Gate: Duration, resolution, framerate extracted correctly
  - [ ] Thumbnail generation from first frame
  - [ ] Gate: Thumbnail image created and displayed in Library
  
- **Performance (see prd-v1.md)**
  - [ ] Metadata extraction <2 seconds per file (PERF-1)
  - [ ] Gate: Import operations complete within time limits
  - [ ] Library panel remains responsive during import
  - [ ] Gate: UI doesn't freeze during metadata extraction

---

## 13. Definition of Done

See standards in `gauntlet-03/prd-v1.md`:
- [ ] Tauri commands implemented + unit tests (Jest)
- [ ] React components with all states (loading, error, success)
- [ ] Video processing verified with real MP4/MOV files
- [ ] Drag-and-drop functionality working
- [ ] File picker integration working
- [ ] All acceptance gates pass
- [ ] Error handling tested for edge cases
- [ ] Performance targets met (<2s metadata extraction)

---

## 14. Risks & Mitigations

- **Risk**: FFmpeg binary not accessible or fails → Mitigation: Bundle ffmpeg-static, add fallback error handling
- **Risk**: Large file processing causes UI freeze → Mitigation: Async processing with progress indicators
- **Risk**: Corrupted video files crash metadata extraction → Mitigation: Try-catch error handling, graceful degradation
- **Risk**: Thumbnail generation fails for some video formats → Mitigation: Fallback to generic video icon

---

## 15. Rollout & Telemetry

- **Feature flag?** No (core functionality)
- **Metrics**: Import success rate, metadata extraction time, error frequency by file type
- **Manual validation steps**: Test with various MP4/MOV files, verify thumbnails, check error handling

---

## 16. Open Questions

- Q1: Should we implement duplicate file detection to prevent importing the same file twice?
- Q2: What should happen if thumbnail generation fails - show generic icon or retry?

---

## 17. Appendix: Out-of-Scope Backlog

Items deferred for future:
- [ ] Support for additional video formats (AVI, MKV, etc.)
- [ ] Video file preview/playback in Library
- [ ] Batch import with progress tracking
- [ ] Import from external drives with validation
- [ ] Duplicate file detection and management

---

## Preflight Questionnaire

Answer these to drive vertical slice and acceptance gates:

1. **Smallest end-to-end user outcome for this PR?** User can import video files and see them displayed in Library panel with thumbnails and metadata
2. **Primary user and critical action?** Video editor importing video files to start editing project
3. **Must-have vs nice-to-have?** Must-have: Drag-and-drop, file picker, metadata extraction, thumbnail generation. Nice-to-have: Batch import progress
4. **Video processing requirements?** FFmpeg integration for metadata extraction and thumbnail generation
5. **Performance constraints?** <2 seconds metadata extraction per file (PERF-1 from prd-v1.md)
6. **Error/edge cases to handle?** Unsupported formats, corrupted files, large files, FFmpeg failures
7. **Data model changes?** VideoClip interface, Library state management
8. **Tauri APIs required?** File system operations, FFmpeg binary access, native file picker
9. **UI entry points and states?** Drag-and-drop area, Import button, loading states, error states
10. **File system implications?** Read video files, generate thumbnails in temp directory
11. **Dependencies or blocking integrations?** FFmpeg binary, Tauri file system APIs
12. **Rollout strategy and metrics?** Direct deployment, track import success rate and performance
13. **What is explicitly out of scope?** Timeline functionality, video playback, auto-save, additional formats

---

## Authoring Notes

- Write Test Plan before coding
- Favor vertical slice that ships standalone
- Keep Tauri command layer deterministic
- React components are thin wrappers
- Test video processing thoroughly with real files
- Reference `gauntlet-03/prd-v1.md` throughout
- Focus on robust error handling for video file edge cases
