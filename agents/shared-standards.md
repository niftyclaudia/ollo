# Shared Standards & Requirements

This document contains common standards referenced by all agent templates for the ollo video editor project.

---

## Performance Requirements

All features MUST maintain these targets:

- **App load time**: < 5 seconds (cold start to interactive UI)
- **Timeline UI responsiveness**: < 50ms response time for drag operations
- **Video playback**: Smooth 30fps minimum (1080p H.264 content)
- **Timeline scrolling**: Smooth 60fps with 10+ clips
- **Export performance**: < 5 minutes for 2-minute 1080p video
- **Memory usage**: < 1GB RAM with 10 clips, < 100MB variance over 15min
- **No UI blocking**: Keep main thread responsive during video operations

---

## Video Processing Requirements

Every feature involving video operations MUST address:

- **File handling**: Support MP4 and MOV formats only
- **Metadata extraction**: Use FFmpeg to extract duration, resolution, framerate
- **Thumbnail generation**: Extract first frame as JPEG
- **Trim operations**: Store trim data as {startTime, endTime} per clip
- **Export pipeline**: Use FFmpeg for concatenation and re-encoding
- **Auto-save**: Save project state every 30 seconds to local file system

---

## Code Quality Standards

### TypeScript/React Best Practices
- ✅ Use proper TypeScript types (avoid `any`)
- ✅ All function parameters and return types explicitly typed
- ✅ Interfaces/Types properly defined for models
- ✅ Proper use of `useState`, `useEffect`, `useContext`, `useReducer`
- ✅ Components broken into small, reusable pieces
- ✅ Keep functions small and focused
- ✅ Meaningful variable names

### Architecture
- ✅ Service layer methods are deterministic
- ✅ React components are thin wrappers around services
- ✅ No business logic in UI components
- ✅ State management follows React patterns

### Documentation
- ✅ Complex logic has comments
- ✅ Public APIs have documentation comments
- ✅ No commented-out code
- ✅ No hardcoded values (use constants)
- ✅ No magic numbers
- ✅ No TODO comments without tickets

---

## Testing Standards

### Testing Strategy

This project uses **manual testing with real video files** as specified in the PRD:

**Manual Testing → Primary Approach ⭐ REQUIRED**
- **Focus**: End-to-end validation with real video files
- **Method**: Manual demonstration of all features working
- **Performance**: Manual verification of performance targets
- **Cross-platform**: Test on macOS (primary) and Windows (secondary)

**Validation Testing → Performance Targets**
- **Timeline UI**: <50ms response time for drag operations
- **Video playback**: 30fps minimum
- **Export**: <5 minutes for 2-minute 1080p video
- **App launch**: <5 seconds
- **Memory**: <1GB RAM with 10 clips

### Manual Testing Protocol (from PRD)

**Setup:** Prepare 3 test videos (short 1080p MP4, medium 720p MOV, long 4K MP4), ensure 10GB+ free space, use built app

**Demo Script (20 minutes):**
1. **Launch & Import (5 min):** Launch app, drag 3 videos to Library, verify Library display
2. **Timeline Features (10 min):** Drag clips to Timeline, test zoom slider (100%-1000%), trim clips, drag-to-reorder, preview sequence
3. **Export & Recovery (5 min):** Export MP4, close/reopen app, restore session, verify in external player

### Definition of Done Checklist

The MVP is complete when you can demonstrate:
- [ ] Launch the packaged desktop app (ollo.app on Mac, ollo.exe on Windows)
- [ ] Import 3 different video files via drag-and-drop to Library
- [ ] Drag clips from Library to Timeline
- [ ] Reorder clips by dragging horizontally on Timeline
- [ ] Trim the start and end of each clip
- [ ] Preview clips and sequence with visual playhead and scrubbing
- [ ] Export to MP4 with mixed resolution handling
- [ ] The exported video plays correctly in external player
- [ ] Close and reopen app - session restores successfully
- [ ] Timeline zoom slider works smoothly (100% to 1000%)

### Testing Notes

- **Use real video files throughout development, test early and often**
- **Test with different video formats (MP4, MOV)**
- **Test with videos of different resolutions**
- **Test edge cases (very short clips, very long clips)**
- **Test built app (not dev mode)**

---

## Data Model Examples

### Video Clip Document
```typescript
interface VideoClip {
  id: string
  path: string
  filename: string
  duration: number
  thumbnail: string
  metadata: {
    width: number
    height: number
    framerate: number
    codec: string
  }
}
```

### Timeline Clip Document
```typescript
interface TimelineClip {
  id: string
  libraryClipId: string // reference to library clip
  trimStart: number
  trimEnd: number
  order: number
}
```

### Project State Document
```typescript
interface ProjectState {
  version: string
  timestamp: string
  library: VideoClip[]
  timeline: TimelineClip[]
  selectedClipId: string | null
  currentPlayheadPosition: number
  timelineZoom: number
  timelineScrollPosition: number
}
```

---

## Service Contract Examples

```typescript
// Video operations
async function extractMetadata(filePath: string): Promise<VideoMetadata>
async function generateThumbnail(filePath: string): Promise<string>
async function trimVideo(inputPath: string, startTime: number, endTime: number): Promise<string>

// Timeline operations
async function addClipToTimeline(clipId: string, order: number): Promise<string>
async function updateClipTrim(clipId: string, trimStart: number, trimEnd: number): Promise<void>
async function reorderClips(clipIds: string[]): Promise<void>

// Export operations
async function exportVideo(timelineClips: TimelineClip[], outputPath: string): Promise<void>
async function getExportProgress(): Promise<number>

// File operations
async function openFileDialog(): Promise<string[]>
async function saveFileDialog(defaultName: string): Promise<string>
async function readAutoSave(): Promise<ProjectState | null>
async function writeAutoSave(state: ProjectState): Promise<void>
```

---

## Git Branch Strategy

**Base Branch**: Always branch from `develop`  
**Branch Naming**: `feat/pr-{number}-{feature-name}`  
**PR Target**: Always target `develop`, NEVER `main`

Example:
```bash
git checkout develop
git pull origin develop
git checkout -b feat/pr-1-message-send
```

---

## Success Metrics Template

- **User-visible**: Time to complete video editing task, number of clicks, export completion
- **System**: Video processing time, app load time, timeline responsiveness
- **Quality**: 0 blocking bugs, all acceptance gates pass, crash-free rate >99%

---

## Common Issues & Solutions

### Issue: Video files not loading
**Solution:** Check file format and FFmpeg integration
```typescript
// ❌ Wrong - assuming all files work
const video = document.createElement('video')
video.src = filePath

// ✅ Correct - validate format first
if (filePath.endsWith('.mp4') || filePath.endsWith('.mov')) {
  const metadata = await videoService.extractMetadata(filePath)
  if (metadata.isValid) {
    const video = document.createElement('video')
    video.src = filePath
  }
}
```

### Issue: Timeline performance slow with many clips
**Solution:** Use virtualization for large timelines
```typescript
import { FixedSizeList as List } from 'react-window'

<List
  height={300}
  itemCount={timelineClips.length}
  itemSize={80}
  itemData={timelineClips}
>
  {({ index, style, data }) => (
    <div style={style}>
      <TimelineClip clip={data[index]} />
    </div>
  )}
</List>
```

### Issue: FFmpeg operations failing
**Check:**
1. FFmpeg binary accessible from Tauri backend
2. File paths are absolute and valid
3. Output directory has write permissions
4. Video files are not corrupted

### Issue: Auto-save not working
**Solution:**
1. Check file system permissions
2. Ensure Tauri commands are properly configured
3. Verify JSON serialization of project state
4. Test with actual video files
