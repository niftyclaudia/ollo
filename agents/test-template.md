# Testing Guidelines

Reference this when creating tests for video editor features. See also `gauntlet-03/agents/shared-standards.md` for testing standards.

---

## Testing Strategy

This project uses **manual testing with real video files** as specified in the PRD:

### Manual Testing → Primary Approach ⭐ REQUIRED
- **Focus**: End-to-end validation with real video files
- **Method**: Manual demonstration of all features working
- **Performance**: Manual verification of performance targets
- **Cross-platform**: Test on macOS (primary) and Windows (secondary)

### Validation Testing → Performance Targets
- **Timeline UI**: <50ms response time for drag operations
- **Video playback**: 30fps minimum
- **Export**: <5 minutes for 2-minute 1080p video
- **App launch**: <5 seconds
- **Memory**: <1GB RAM with 10 clips

---

## Manual Testing Protocol (from PRD)

### Setup
Prepare 3 test videos:
- Short 1080p MP4
- Medium 720p MOV  
- Long 4K MP4
- Ensure 10GB+ free space
- Use built app (not dev mode)

### Demo Script (20 minutes)

#### 1. Launch & Import (5 min)
- Launch app
- Drag 3 videos to Library
- Verify Library display
- Check thumbnails, filenames, durations

#### 2. Timeline Features (10 min)
- Drag clips to Timeline
- Test zoom slider (100%-1000%)
- Trim clips (start and end)
- Drag-to-reorder clips
- Preview sequence
- Test playhead scrubbing

#### 3. Export & Recovery (5 min)
- Export MP4
- Close/reopen app
- Restore session
- Verify exported video in external player

---

## Definition of Done Checklist

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

---

## Performance Testing Checklist

For every feature, manually verify:

### Timeline Performance
- [ ] Drag operations respond in <50ms
- [ ] Zoom slider works smoothly (100% to 1000%)
- [ ] Timeline scrolling is smooth 60fps
- [ ] UI remains responsive with 10+ clips

### Video Processing Performance
- [ ] Video playback smooth 30fps minimum
- [ ] Scrubbing updates preview within 100ms
- [ ] Export completes without crashes
- [ ] Memory usage <1GB with 10 clips

### Cross-Platform Testing
- [ ] macOS (primary platform) - Apple Silicon + Intel
- [ ] Windows (secondary platform) - Windows 10/11
- [ ] File system operations work correctly
- [ ] FFmpeg integration functions

---

## Edge Case Testing

Test with real video files:

### File Format Testing
- [ ] MP4 files (H.264 codec)
- [ ] MOV files
- [ ] Different resolutions (720p, 1080p, 4K)
- [ ] Different frame rates (30fps, 60fps)
- [ ] Different aspect ratios

### File Size Testing
- [ ] Small files (<100MB)
- [ ] Large files (1GB+)
- [ ] Very large files (4GB+ - should be blocked)
- [ ] Very short clips (<1 second)
- [ ] Very long clips (1+ hour)

### Error Handling Testing
- [ ] Corrupted video files
- [ ] Unsupported file formats
- [ ] Files that don't exist
- [ ] Permission errors
- [ ] Disk space issues

---

## Testing Best Practices

### Use Real Video Files
- ✅ **Always test with actual video files**
- ✅ **Test early and often during development**
- ✅ **Use different formats and sizes**
- ✅ **Test built app, not dev mode**

### Performance Validation
- ✅ **Measure actual performance metrics**
- ✅ **Test on target hardware**
- ✅ **Verify memory usage**
- ✅ **Check export quality**

### Cross-Platform Testing
- ✅ **Primary: macOS (Apple Silicon + Intel)**
- ✅ **Secondary: Windows 10/11**
- ✅ **Test file system operations**
- ✅ **Verify FFmpeg integration**

### Manual Verification
- ✅ **Demonstrate all features working**
- ✅ **Verify exported videos play correctly**
- ✅ **Test session recovery**
- ✅ **Check UI responsiveness**

---

## Testing Notes

**Visual appearance (colors, fonts, spacing, animations) is verified manually by user during PR review.**

Manual testing focuses on:
- Functional correctness
- User interaction flows
- Video processing accuracy
- Performance targets
- Cross-platform compatibility

See `gauntlet-03/agents/shared-standards.md` for more patterns and requirements.
