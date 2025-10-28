# PR-2 TODO — Import & Library

**Branch**: `feat/pr-2-import-library`  
**Source PRD**: `gauntlet-03/docs/prds/pr-2-prd.md`  
**Owner (Agent)**: Pete

---

## 0. Clarifying Questions & Assumptions

- **Questions**: 
  - Should we implement duplicate file detection to prevent importing the same file twice?
  - What should happen if thumbnail generation fails - show generic icon or retry?
- **Assumptions (confirm in PR if needed)**:
  - FFmpeg binary is accessible via ffmpeg-static npm package
  - Tauri file system APIs work correctly for reading video files
  - Native file picker integration works on macOS
  - Video files are stored locally (not streaming from network)

---

## 1. Setup

- [ ] Create branch `feat/pr-2-import-library` from develop
- [ ] Read PRD thoroughly (`gauntlet-03/docs/prds/pr-2-prd.md`)
- [ ] Read `gauntlet-03/prd-v1.md` for project context and Phase 2 requirements
- [ ] Install ffmpeg-static npm package
- [ ] Verify FFmpeg binary is accessible from Tauri backend
- [ ] Test basic file system operations in Tauri

---

## 2. Service Layer

Implement deterministic Tauri commands from PRD.

- [ ] Implement `validate_video_file` Tauri command
  - Test Gate: Unit test passes for valid/invalid MP4/MOV files
- [ ] Implement `extract_video_metadata` Tauri command
  - Test Gate: Unit test passes for various video formats
- [ ] Implement `generate_thumbnail` Tauri command
  - Test Gate: Unit test passes for thumbnail generation
- [ ] Implement `open_file_picker` Tauri command
  - Test Gate: Unit test passes for file picker integration
- [ ] Implement `get_file_size` Tauri command
  - Test Gate: Unit test passes for file size calculation
- [ ] Add FFmpeg error handling and validation
  - Test Gate: Edge cases handled correctly (corrupted files, unsupported formats)

---

## 3. Data Model & File Operations

- [ ] Define `VideoClip` interface in `src/types/AppState.ts`
  - Test Gate: TypeScript compilation succeeds
- [ ] Define `VideoMetadata` interface for FFmpeg output
  - Test Gate: Type safety for metadata structure
- [ ] Define `ImportValidation` interface for file validation
  - Test Gate: Validation rules applied correctly
- [ ] Update `LibraryState` interface in app state
  - Test Gate: Library state management works correctly
- [ ] Add file size validation (4GB limit)
  - Test Gate: Large files blocked appropriately
- [ ] Add thumbnail storage in temp directory
  - Test Gate: Thumbnails created and accessible

---

## 4. UI Components

Create/modify React components per PRD Section 10.

- [ ] Create `src/components/VideoClipCard.tsx`
  - Test Gate: Component renders thumbnail, filename, duration correctly
  - Test Gate: Zero console errors
- [ ] Create `src/components/ImportButton.tsx`
  - Test Gate: Button triggers file picker correctly
  - Test Gate: Zero console errors
- [ ] Modify `src/components/LibraryPanel.tsx` for drag-and-drop
  - Test Gate: Drag-and-drop area accepts MP4/MOV files
  - Test Gate: Visual feedback during drag operations
- [ ] Modify `src/components/EmptyState.tsx` for Library empty state
  - Test Gate: Empty state displays import instructions
  - Test Gate: Zero console errors
- [ ] Create `src/hooks/useVideoImport.ts`
  - Test Gate: Hook manages import state correctly
  - Test Gate: Import operations work asynchronously
- [ ] Add loading states during metadata extraction
  - Test Gate: Loading indicators display during import
- [ ] Add error states for invalid files
  - Test Gate: Error messages display for unsupported formats
- [ ] Add progress indicators for multiple file imports
  - Test Gate: Progress updates during batch import

---

## 5. Integration & Video Processing

Reference requirements from `gauntlet-03/prd-v1.md`.

- [ ] Tauri API integration for file operations
  - Test Gate: File system operations work correctly
- [ ] FFmpeg integration for metadata extraction
  - Test Gate: Metadata extracted correctly for MP4/MOV files
- [ ] Thumbnail generation from first frame
  - Test Gate: Thumbnails generated and displayed
- [ ] File validation (format and size checking)
  - Test Gate: Invalid files rejected with appropriate errors
- [ ] Native file picker integration
  - Test Gate: File picker opens and returns selected files
- [ ] Drag-and-drop file handling
  - Test Gate: Files dropped into Library panel are processed

---

## 6. Manual Testing

Follow manual testing protocol from `gauntlet-03/prd-v1.md`.

- [x] Manual validation with real video files
  - Test Gate: Import 3 different MP4/MOV files successfully
  - Test Gate: Thumbnails, filenames, and durations display correctly
  
- [x] Performance verification
  - Test Gate: Metadata extraction <2 seconds per file (PERF-1)
  - Test Gate: Library panel remains responsive during import
  
- [x] Cross-platform testing
  - Test Gate: Works on macOS (primary platform)
  - Test Gate: File picker integration works correctly
  
- [ ] Edge case testing
  - Test Gate: Unsupported file formats show error messages
  - Test Gate: Files >4GB blocked with appropriate message
  - Test Gate: Corrupted video files handled gracefully
  - Test Gate: Large files (1GB+) show warning messages
  
- [ ] Definition of done checklist
  - Test Gate: All items from PRD Section 13 verified

---

## 7. Performance

Verify targets from `gauntlet-03/prd-v1.md`.

- [ ] Metadata extraction <2 seconds per file (PERF-1)
  - Test Gate: Import operations complete within time limits
- [ ] Library panel responsive during import
  - Test Gate: UI doesn't freeze during metadata extraction
- [ ] Memory usage reasonable for imported clips
  - Test Gate: Memory usage doesn't grow excessively with multiple imports
- [ ] Thumbnail generation performance
  - Test Gate: Thumbnails generated quickly without blocking UI

---

## 8. Acceptance Gates

Check every gate from PRD Section 12:

- [ ] **Happy Path Gates**:
  - [ ] User drags MP4 file into Library panel
  - [ ] Gate: File appears in Library within 2 seconds with thumbnail and metadata
  - [ ] User clicks Import button and selects multiple files
  - [ ] Gate: All selected files appear in Library panel

- [ ] **Edge Case Gates**:
  - [ ] User drags unsupported file format (e.g., .txt, .jpg)
  - [ ] Gate: Clear error message displayed, file not added to Library
  - [ ] User attempts to import file >4GB
  - [ ] Gate: File blocked with appropriate error message
  - [ ] User imports corrupted video file
  - [ ] Gate: Error handled gracefully with user-friendly message

- [ ] **Video Processing Gates**:
  - [ ] FFmpeg metadata extraction works for various MP4/MOV files
  - [ ] Gate: Duration, resolution, framerate extracted correctly
  - [ ] Thumbnail generation from first frame
  - [ ] Gate: Thumbnail image created and displayed in Library

- [ ] **Performance Gates**:
  - [ ] Metadata extraction <2 seconds per file (PERF-1)
  - [ ] Gate: Import operations complete within time limits
  - [ ] Library panel remains responsive during import
  - [ ] Gate: UI doesn't freeze during metadata extraction

---

## 9. Documentation & PR

- [ ] Add inline code comments for FFmpeg integration logic
- [ ] Document video metadata structure in code comments
- [ ] Update README with import requirements
- [ ] Create PR description (use format from gauntlet-03/agents/cody-agent-template.md)
- [ ] Verify with user before creating PR
- [ ] Open PR targeting develop branch
- [ ] Link PRD and TODO in PR description

---

## Copyable Checklist (for PR description)

```markdown
- [ ] Branch created from develop
- [ ] All TODO tasks completed
- [ ] Tauri commands implemented for video import
- [ ] React components implemented with drag-and-drop and file picker
- [ ] FFmpeg integration tested for metadata extraction and thumbnails
- [ ] Manual testing complete with real MP4/MOV files
- [ ] Performance targets met (PERF-1: <2s metadata extraction)
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
- Focus on robust video file handling and error cases
- Test with various video formats and file sizes early
- Ensure FFmpeg integration is reliable and handles edge cases
- Verify drag-and-drop works smoothly across different file types
