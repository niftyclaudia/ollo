# ollo MVP - Product Requirements Document

**Version**: 1.0  
**Target Platform**: macOS (primary), Windows (secondary)  
**Tech Stack**: Tauri + React + FFmpeg

---

## Project Overview

ollo is a desktop video editor MVP. Success = importing videos, storing them in a library, arranging them on a timeline, trimming them, and exporting a final MP4.

---

## MVP Success Criteria

The MVP is complete when you can:
1. Launch the app as a native desktop application
2. Import 3 different video files (MP4/MOV) into Library
3. Drag clips from Library to Timeline
4. Reorder clips by dragging horizontally on timeline
5. Trim each clip by dragging handles
6. Preview clips and sequence with visual playhead
7. Export the final sequence as a single MP4 file
8. The exported video plays correctly with synchronized audio

---


## Out of Scope for MVP

- Screen/camera recording
- Splitting clips at playhead
- Audio effects or volume control
- Video effects, filters, or transitions
- Text overlays
- Undo/redo
- Manual project save/load (but auto-save is included)
- Custom export settings

---

## Functional Requirements

### 1. Application Launch

- App launches as native macOS application
- Window size: 1200x800px (resizable)
- App title: "ollo"
- Initial state shows empty timeline with "Drag video files here or click to import"

### 2. Video Import

**Drag & Drop**
- Drag video files from Finder into Library panel
- Supported formats: .mp4, .mov
- Visual feedback when dragging over app
- Multiple files can be dropped at once

**File Picker**
- "Import Videos" button opens native file picker
- Multiple file selection enabled
- Imported clips appear in Library panel

**Validation**
- Error message for unsupported file types
- Loading indicator while reading file metadata
- Warning message for files 1GB+ ("Large file - processing may take longer")
- Block files 4GB+ with error ("File too large. Please use files under 4GB")

### 3. Library View

**Layout**
- Left panel (20% of window width)
- Scrollable list/grid of all imported clips
- Empty state: "Drag & drop video files or click Import to get started"

**Clip Display**
- Thumbnail (first frame)
- Filename
- Duration (MM:SS format)
- Click to preview in player
- Drag to Timeline to add to sequence

**Interaction**
- Click clip in Library → plays in preview player
- Drag clip from Library to Timeline → adds to sequence
- Allow duplicate imports (same file can be added multiple times)
- Store file paths (linked files, not embedded)

### 4. Timeline Interface

**Layout**
- Bottom panel (30% of window height)
- Horizontal timeline with clips in sequence
- Left-to-right playback order
- Total duration display
- Visual playhead (red vertical line) showing current time position
- Timecode display (HH:MM:SS.mmm) above timeline

**Zoom Controls**
- Zoom slider (range: 100% to 1000%)
  - 100% = ~1 pixel per second
  - 1000% = ~10 pixels per second
- Default zoom on load: Auto-fit (entire timeline visible in viewport)
- Horizontal scroll when zoomed in
- Keyboard shortcuts: Cmd+Plus, Cmd+Minus
- Zoom indicator showing current level (e.g., "500%")

**Clip Management**
- Drag clips from Library onto Timeline
- Reorder clips by dragging horizontally
- Clips snap together (no gaps, no overlaps)
- Delete clips (right-click → Delete or Delete key)
- "Clear All" button removes all clips

**Clip Cards**
- Video thumbnail from first frame
- Filename below thumbnail
- Duration overlay (bottom-right)
- Trim handles on left and right edges
- Clip width scales with zoom level
- Trim handles become more/less precise at different zoom levels

**Selection & Deletion**
- Click to select clip (visual highlight)
- Selected clip appears in preview player
- Delete key removes selected clip
- "Clear All" button removes all clips

### 5. Video Trimming

**Trim Handles**
- Draggable handles on left (start) and right (end) edges
- Cursor changes to resize indicator on hover

**Trim Behavior**
- Drag left handle right to trim start
- Drag right handle left to trim end
- Minimum clip duration: 0.5 seconds
- Duration updates in real-time
- Thumbnail updates to show new start frame

### 6. Video Preview Player

**Layout**
- Center panel (40% of window width)
- Player positioned above timeline
- 16:9 aspect ratio maintained
- Controls: Play/Pause, progress bar, time display

**Playback**
- Click clip in Library → plays that clip only
- Click Play → plays from current playhead position through all timeline clips in sequence
- Spacebar toggles play/pause
- Progress bar is draggable (seek)
- Audio plays synchronized with video
- Drag playhead → updates preview in real-time (scrubbing)

**Performance**
- Playback at minimum 30fps (smooth motion)
- Scrubbing updates preview within 100ms

**Sequence Preview**
- "Preview Sequence" button plays all clips in order
- Smooth transitions between clips
- Playback stops at end

### 7. Video Export

**Export Process**
- "Export Video" button (disabled if timeline empty)
- Opens native file picker to choose save location
- Default filename: ollo_export_[timestamp].mp4
- Progress bar shows export progress (0-100%)

**Export Settings** (fixed preset)
- Format: MP4
- Video codec: H.264 (libx264)
- Audio codec: AAC
- Resolution: Match highest source resolution (max 1080p)
- Frame rate: Fixed 30fps
- Bitrate: ~5Mbps for 1080p (medium quality)
- Audio: AAC codec, 128kbps

**Mixed Source Handling**
- Different frame rates (30fps vs 60fps) → export at 30fps
- Different resolutions (1080p vs 720p) → export at highest (max 1080p), upscale lower-res
- Different aspect ratios → export matches first clip's aspect ratio, letterbox others

**Completion**
- Success message with file path
- "Reveal in Finder" button
- Error message if export fails

### 8. Auto-Save & Session Recovery

**Auto-Save Behavior**
- App automatically saves project state every 30 seconds
- Saves to temp file: `~/Library/Application Support/ollo/autosave.json`
- Project state includes:
  - All imported clips (file paths, not video data)
  - Trim points for each clip
  - Clip order in timeline
  - Selected clip

**Session Recovery**
- On app launch, check for autosave file
- If found and less than 24 hours old, show dialog: "Restore previous session?"
- Options: "Restore" or "Start Fresh"
- If user chooses "Restore", load clips back into timeline
- If user chooses "Start Fresh", delete autosave file

**Save Triggers**
- Every 30 seconds (if timeline has clips)
- Before export starts
- When app is closing (if possible)

**File Format** (JSON):
```json
{
  "version": "1.0",
  "timestamp": "2025-10-27T10:30:00Z",
  "library": [
    {
      "id": "uuid",
      "path": "/path/to/video.mp4",
      "filename": "video.mp4",
      "duration": 120.5,
      "thumbnail": "path/to/thumbnail.jpg",
      "metadata": { "width": 1920, "height": 1080, "framerate": 30, "codec": "h264" }
    }
  ],
  "timeline": [
    {
      "id": "uuid",
      "libraryClipId": "uuid",
      "trimStart": 0,
      "trimEnd": 120.5,
      "order": 0
    }
  ],
  "selectedClipId": "uuid",
  "currentPlayheadPosition": 0,
  "timelineZoom": 1.0,
  "timelineScrollPosition": 0
}
```

---

## User Interface

### Layout Structure

Three-panel design:
- Left: Library panel (20% width)
- Center: Preview player (40% width) 
- Bottom: Timeline (full width, 30% height)

### UI Requirements

- Minimum window size: 1280x720
- Three-panel layout (Library 20%, Preview 40%, Timeline 30%)
- Loading states for import/export operations
- Empty states for Library and Timeline
- Error dialogs with clear messages

### Performance Targets

**PERF-1**: Timeline UI remains responsive with 10+ clips  
- Clip drag operations: <50ms response time
- Zoom/scroll: 60fps smooth animation

**PERF-2**: Preview playback at 30fps minimum (1080p H.264 content)  

**PERF-3**: Export completes without crashes  
- 2-minute 1080p video: <5 minutes export time (depends on hardware)

**PERF-4**: App launch time: <5 seconds  

**PERF-5**: Memory stability  
- With 10 clips loaded (20-50min total footage): <1GB RAM
- Memory growth: <100MB variance over 15min session

**PERF-6**: File size: Exported videos maintain reasonable quality (not bloated)  
- 1080p 1min video: ~35-40MB (5Mbps bitrate)

### Cross-Platform Support

**PLATFORM-1**: Primary platform: macOS (Apple Silicon + Intel)  
**PLATFORM-2**: Secondary platform: Windows 10/11  
**PLATFORM-3**: Linux: Out of scope for MVP  

**Testing Strategy**: Develop on Mac, test on Windows before each milestone.

### UI/UX Requirements

**UI-1**: Minimum window size: 1280x720  
**UI-2**: Layout: Three-panel design
  - Left: Library panel (20% width)
  - Center: Preview player (40% width)
  - Bottom: Timeline (full width, 30% height)

**UI-3**: Loading states for:
  - File import: Spinner + "Importing [filename]..."
  - Export: Progress bar + percentage + time remaining

**UI-4**: Empty states for:
  - Library: "Drag & drop video files or click Import"
  - Timeline: "Drag clips here to start editing"

**UI-5**: Error dialogs: Clear, actionable messages (no technical jargon)

---

## Technical Architecture

### Stack Components

**Desktop Framework**: Tauri v1.5+
- Rust backend for file system and FFmpeg
- Secure, lightweight, native performance

**Frontend**: React 18+
- Functional components with hooks
- useState/useContext for state management

**Media Processing**: FFmpeg
- Use ffmpeg-static npm package (bundles FFmpeg binary)

**Video Player**: HTML5 video element

**Timeline UI**: Custom React components

### Architecture Overview

```
React Frontend (Import, Timeline, Preview Components)
                    ↓
            State Manager (useState)
                    ↓
              Tauri IPC
                    ↓
     Tauri Backend (Rust)
     - File System Operations
     - FFmpeg Commands
```

### Key Technical Decisions

**File Handling**
- Store file paths (not contents) in React state
- Video playback via blob URLs from file paths

**Metadata Extraction**
- Use FFmpeg to extract duration, resolution, framerate, codec
- Extract first frame as JPEG thumbnail
- Cache thumbnails in temp directory

**Trim Implementation**
- Store trim data as {startTime, endTime} per clip
- Apply trims during export using FFmpeg -ss and -t flags

**Export Pipeline**
1. Generate FFmpeg command for each clip (trim + convert)
2. Concatenate clips using FFmpeg concat demuxer
3. Re-encode with consistent codec settings
4. Parse FFmpeg stderr for progress updates

**State Structure**
```javascript
{
  library: [
    {
      id: string,
      path: string,
      filename: string,
      duration: number,
      thumbnail: string,
      metadata: {
        width: number,
        height: number,
        framerate: number,
        codec: string
      }
    }
  ],
  timeline: [
    {
      id: string,
      libraryClipId: string, // reference to library clip
      trimStart: number,
      trimEnd: number,
      order: number
    }
  ],
  selectedClipId: string | null,
  currentPlayheadPosition: number, // seconds
  isExporting: boolean,
  exportProgress: number,
  lastAutoSave: timestamp, // for tracking auto-save
  timelineZoom: 1.0, // 1.0 to 10.0 (100% to 1000%)
  timelineScrollPosition: 0, // pixels from left
  timelineWidth: 1200 // calculated based on zoom
}
```

**Auto-Save Implementation**
- Use setInterval to trigger save every 30 seconds
- Serialize state to JSON and write to file system via Tauri
- On app start, check for autosave file and prompt user to restore

---

## Implementation Phases

### Phase 1: Project Setup
- Initialize Tauri + React project
- Install dependencies: ffmpeg-static, uuid
- Set up basic app window and layout
- Confirm FFmpeg binary is accessible from Rust backend
- Validation: App launches with empty UI

**Prerequisites to install before starting:**
- Node.js (check with `node --version`)
- Git (check with `git --version`)
- FFmpeg (install with `brew install ffmpeg` or it will be bundled via ffmpeg-static)
- Rust and Tauri prerequisites (follow Tauri setup guide)
- Cursor editor and Cursor CLI

### Phase 2: Import & Library
- Implement drag-and-drop file import to Library
- Implement file picker import
- Extract video metadata with FFmpeg
- Generate thumbnail from first frame
- Display clips in Library panel
- Show filename and duration on each clip
- Validation: Can import 3 videos and see them in Library

### Phase 3: Timeline & Drag-to-Reorder
- Build Timeline panel with drag-and-drop from Library
- Implement horizontal drag-to-reorder on Timeline
- Add visual playhead with scrubbing
- Implement clip snapping (no gaps, no overlaps)
- Add zoom slider (100%-1000%) with auto-fit
- Validation: Can drag clips from Library to Timeline and reorder them

### Phase 4: Video Preview
- Build video player component with HTML5 video tag
- Load selected clip into player
- Implement play/pause toggle
- Add progress bar with seek functionality
- Display current time and total duration
- Implement scrubbing with playhead
- Validation: Clicking a clip plays it in preview with audio, scrubbing works smoothly

### Phase 5: Auto-Save & Session Recovery
- Implement auto-save function (serialize state to JSON)
- Set up 30-second interval to trigger auto-save
- Write autosave file to ~/Library/Application Support/ollo/
- On app launch, check for existing autosave file
- Show restore dialog if autosave exists and is recent
- Implement restore function (deserialize JSON, load clips)
- Implement "Start Fresh" function (delete autosave)
- Validation: Close app, reopen, and successfully restore session

### Phase 6: Trimming
- Add visual trim handles to clip cards
- Implement drag logic for trim handles
- Update clip state with new trim start/end times
- Prevent handles from crossing (min duration check)
- Update duration display when trimming
- Preview reflects trimmed clip in player
- Validation: Can trim start/end of clips, preview shows trimmed version

### Phase 7: Sequence Preview
- Implement "Preview Sequence" mode
- Stitch clips together for preview
- Handle transitions between clips smoothly
- Maintain audio sync across clips
- Validation: Sequence plays all clips in order with audio

### Phase 8: Export
- Build FFmpeg export command generator
- Implement trim application (per-clip -ss and -t)
- Implement clip concatenation (concat demuxer)
- Add progress tracking (parse FFmpeg stderr)
- Show progress bar during export
- Open file picker to choose save location
- Display success/error messages
- Validation: Export produces playable MP4 with all clips in sequence

### Phase 9: Polish & Testing
- Test with different video formats (MP4, MOV)
- Test with videos of different resolutions
- Test edge cases (very short clips, very long clips)
- Add loading states for async operations
- Improve error messages
- Final UI polish (spacing, colors, alignment)
- Validation: Complete end-to-end test

### Phase 10: Build & Package
- Configure Tauri build for macOS
- Bundle FFmpeg binary with app
- Create simple app icon (lowercase "ollo" text)
- Test built app (not dev mode)
- Verify exported videos work outside the app
- Validation: Native .app file launches and exports video successfully

**Testing Notes:** Use real video files throughout development, test early and often

---

## Testing Requirements

### Performance Targets
- Timeline UI: <50ms response time for drag operations
- Preview playback: 30fps minimum
- Export: <5 minutes for 2-minute 1080p video
- App launch: <5 seconds
- Memory: <1GB RAM with 10 clips, <100MB variance over 15min
- File size: ~35-40MB for 1080p 1min video (5Mbps bitrate)

### Cross-Platform Support
- Primary: macOS (Apple Silicon + Intel)
- Secondary: Windows 10/11
- Linux: Out of scope

### Integration Test
- Import 3 clips (H.264 MP4, 1080p)
- Drag to Timeline, trim to 2 minutes total
- Export and verify playback in external player

---

## Known Limitations (Acceptable for MVP)

1. No manual project save/load (only auto-save/restore)
2. Fixed export settings (30fps, max 1080p)
3. No undo/redo
4. Limited format support (MP4 and MOV only)
5. No audio mixing (original volume only)
6. Sequential timeline only (no overlapping clips)
7. Basic trim only (no ripple edits)
8. Export time varies with video size
9. Memory usage with many/large clips
10. Windows support secondary to macOS
11. Auto-save only keeps most recent session (no version history)

---

## FFmpeg Command Reference

**Extract metadata:**
```bash
ffmpeg -i input.mp4 2>&1 | grep "Duration\|Video\|Audio"
```

**Extract thumbnail:**
```bash
ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 thumbnail.jpg
```

**Trim video:**
```bash
ffmpeg -ss 00:00:10 -i input.mp4 -t 00:00:05 -c copy output.mp4
```

**Concatenate videos:**
```bash
# Create file list: list.txt
file 'clip1.mp4'
file 'clip2.mp4'
file 'clip3.mp4'

# Concatenate
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4
```


## React Code Patterns

**Video playback with trim:** Use useRef for video element, useEffect to set currentTime, handleTimeUpdate to pause at trimEnd

**Drag and drop:** Prevent default, filter files by .mp4/.mov extensions, process videoFiles array

---

## Manual Testing Protocol

**Setup:** Prepare 3 test videos (short 1080p MP4, medium 720p MOV, long 4K MP4), ensure 10GB+ free space, use built app

**Demo Script (20 minutes):**
1. **Launch & Import (5 min):** Launch app, drag 3 videos to Library, verify Library display
2. **Timeline Features (10 min):** Drag clips to Timeline, test zoom slider (100%-1000%), trim clips, drag-to-reorder, preview sequence
3. **Export & Recovery (5 min):** Export MP4, close/reopen app, restore session, verify in external player

## Definition of Done

The MVP is complete and shippable when you can demonstrate:

1. Launch the packaged desktop app (ollo.app on Mac, ollo.exe on Windows)
2. Import 3 different video files via drag-and-drop to Library
3. Drag clips from Library to Timeline
4. Reorder clips by dragging horizontally on Timeline
5. Trim the start and end of each clip
6. Preview clips and sequence with visual playhead and scrubbing
7. Export to MP4 with mixed resolution handling
8. The exported video plays correctly in external player
9. Close and reopen app - session restores successfully
10. Timeline zoom slider works smoothly (100% to 1000%)

---