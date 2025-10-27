# Alice's Memory Bank

I am Alice, an expert software engineer with a unique characteristic: my memory resets completely between sessions. This isn't a limitation - it's what drives me to maintain perfect documentation. After each reset, I rely ENTIRELY on my Memory Bank to understand the project and continue work effectively. I MUST read ALL memory bank files at the start of EVERY task - this is not optional.

## Memory Bank Structure

The Memory Bank consists of core files and optional context files, all in Markdown format. Files build upon each other in a clear hierarchy:

### Core

**Answer in one sentence**
1. Brief
   - Foundation document that shapes all other files
   - Created at project start if it doesn't exist
   - Defines core requirements and goals
   - Source of truth for project scope

2. Context
   - Why this project exists
   - Problems it solves
   - How it should work
   - User experience goals

3. Active Context
   - Current work focus
   - Recent changes
   - Next steps
   - Active decisions and considerations
   - Important patterns and preferences
   - Learnings and project insights

4. System Patterns
   - System architecture
   - Key technical decisions
   - Design patterns in use
   - Component relationships
   - Critical implementation paths

5. Tech Context
   - Technologies used
   - Development setup
   - Technical constraints
   - Dependencies
   - Tool usage patterns

6. Progress (skip because not currently in development)
   - What works
   - What's left to build
   - Current status
   - Known issues
   - Evolution of project decisions

---

## 1. Brief

**Project:** ollo — Desktop Video Editor MVP

**Tagline:** Import, Edit, Export - Simple Desktop Video Editing

**What It Is:** A native desktop video editor MVP built with Tauri + React + FFmpeg. Users can import videos, arrange them on a timeline, trim clips, and export a final MP4. Success = importing videos, storing them in a library, arranging them on a timeline, trimming them, and exporting a final MP4.

**Core Requirements (8 MVP Success Criteria):**
1. Launch the app as a native desktop application
2. Import 3 different video files (MP4/MOV) into Library
3. Drag clips from Library to Timeline
4. Reorder clips by dragging horizontally on timeline
5. Trim each clip by dragging handles
6. Preview clips and sequence with visual playhead
7. Export the final sequence as a single MP4 file
8. The exported video plays correctly with synchronized audio

**Success Criteria (Must Have - P0 MVP):**
- ✅ App launches as native macOS application (1200x800px window)
- ✅ Import videos via drag-and-drop or file picker (MP4/MOV formats)
- ✅ Library panel displays imported clips with thumbnails and duration
- ✅ Drag clips from Library to Timeline for sequencing
- ✅ Reorder clips by dragging horizontally on timeline
- ✅ Trim clips using draggable handles (min 0.5s duration)
- ✅ Preview clips and sequences with HTML5 video player
- ✅ Export final sequence as MP4 with H.264/AAC codecs
- ✅ Auto-save project state every 30 seconds
- ✅ Session recovery on app restart

---

## 2. Context

**Why This Project Exists:**
- Building a simple, reliable desktop video editor for content creators
- Demonstrating expertise in desktop app development with Tauri + React + FFmpeg
- Creating a focused MVP that delivers core video editing functionality

**Problems It Solves:**
- Need for simple desktop video editing without complex professional tools
- Quick video trimming and sequencing for content creators
- Cross-platform video editing solution (macOS primary, Windows secondary)
- Lightweight alternative to heavy video editing software

**How It Should Work:**
- Intuitive three-panel layout (Library, Preview, Timeline)
- Drag-and-drop video import with immediate thumbnail generation
- Visual timeline with zoom controls (100%-1000%)
- Real-time preview with scrubbing and playhead
- One-click export with progress tracking
- Automatic session recovery

**User Experience Goals:**
- Seamless video import via drag-and-drop
- Intuitive timeline editing with visual feedback
- Smooth preview playback at 30fps minimum
- Fast export with progress indication
- Reliable auto-save and session recovery

---

## 3. Active Context

**Current Work Focus:**
- Project is in planning/design phase
- Memory bank documentation is being completed
- Ready to begin implementation following the 10-phase milestone plan
- Agent templates and project structure established

**Recent Changes:**
- Created comprehensive PRD with technical specifications
- Defined Tauri + React + FFmpeg architecture
- Established implementation phases and testing requirements
- Set up agent workflow (Brad for briefs, Pete for planning, Cody for implementation)
- Updated .cursorrules with project-specific guidelines

**Next Steps:**
- Phase 1: Project Setup
  - Initialize Tauri + React project
  - Install dependencies: ffmpeg-static, uuid
  - Set up basic app window and layout
  - Confirm FFmpeg binary is accessible from Rust backend

**Active Decisions and Considerations:**
- Tauri chosen for secure, lightweight desktop app development
- React selected for rapid UI development and component reusability
- FFmpeg for robust video processing capabilities
- Three-panel layout for optimal user workflow
- Auto-save every 30 seconds for data protection
- Brad-Pete-Cody agent workflow for clear separation of concerns

**Important Patterns and Preferences:**
- Store file paths (not contents) in React state
- Video playback via blob URLs from file paths
- Background processing for heavy FFmpeg operations
- Optimistic UI updates for immediate user feedback
- Cross-platform compatibility (macOS primary, Windows secondary)

**Learnings and Project Insights:**
- FFmpeg provides comprehensive video processing capabilities
- Tauri offers secure file system access with native performance
- React's component model is ideal for timeline UI development
- Auto-save is crucial for desktop video editing workflows
- Performance targets are critical for smooth video editing experience
- Specialized agents (Brad-Pete-Cody) provide better quality than general agents

---

## 4. System Patterns

**System Architecture:**
- **Frontend:** React 18+ with functional components and hooks
- **Backend:** Tauri (Rust) for file system and FFmpeg operations
- **Media Processing:** FFmpeg via ffmpeg-static npm package
- **Video Player:** HTML5 video element
- **State Management:** useState/useContext for React state
- **File Storage:** Local file system with auto-save JSON

**Key Technical Decisions:**
- **Tauri over Electron:** Better security, smaller bundle size, native performance
- **React over Vue/Angular:** Faster development, better ecosystem, component reusability
- **FFmpeg over WebCodecs:** Comprehensive format support, proven reliability
- **Local file paths over embedded data:** Memory efficiency, faster loading

**Design Patterns in Use:**
- **Component Architecture:** React functional components with hooks
- **IPC Pattern:** Tauri commands for backend communication
- **Observer Pattern:** React state updates for real-time UI
- **Command Pattern:** FFmpeg operations as discrete commands
- **Auto-Save Pattern:** Periodic state persistence

**Component Relationships:**
- **Library Panel:** Video import, thumbnail display, drag-to-timeline
- **Preview Player:** Video playback, scrubbing, sequence preview
- **Timeline Panel:** Clip arrangement, trimming, zoom controls
- **Tauri Backend:** File operations, FFmpeg processing, auto-save

**Critical Implementation Paths:**
1. **Import Flow:** File drop → FFmpeg metadata → Thumbnail generation → Library display
2. **Timeline Flow:** Drag from Library → Timeline placement → Trim handles → State update
3. **Preview Flow:** Clip selection → Video load → Playback controls → Scrubbing
4. **Export Flow:** Timeline data → FFmpeg commands → Progress tracking → File output

---

## 5. Tech Context

**Technologies Used:**
- **Frontend:** React 18+, TypeScript, HTML5 Video API
- **Backend:** Tauri v1.5+, Rust
- **Media Processing:** FFmpeg (via ffmpeg-static)
- **Build Tools:** Vite, npm/yarn
- **Platform:** Desktop (macOS primary, Windows secondary)

**Development Setup:**
- **Platform:** Desktop development with Tauri
- **Minimum Target:** macOS 10.15+, Windows 10+
- **IDE:** Cursor editor with Cursor CLI
- **Language:** TypeScript (frontend), Rust (backend)
- **Framework:** React with hooks

**Technical Constraints:**
- macOS 10.15+ minimum deployment target
- Windows 10+ secondary support
- FFmpeg binary bundling required
- File size limits: 4GB max per video file
- Memory usage: <1GB RAM with 10 clips

**Dependencies:**
- Tauri CLI and Rust toolchain
- React 18+ and TypeScript
- ffmpeg-static npm package
- uuid for unique identifiers
- Node.js for development

**Tool Usage Patterns:**
- **Tauri Dev:** `npm run tauri dev` for development
- **Tauri Build:** `npm run tauri build` for production
- **FFmpeg Commands:** Metadata extraction, thumbnail generation, video export
- **File System:** Tauri commands for secure file operations

**State Structure (TypeScript):**
```typescript
interface AppState {
  library: VideoClip[];
  timeline: TimelineClip[];
  selectedClipId: string | null;
  currentPlayheadPosition: number;
  isExporting: boolean;
  exportProgress: number;
  timelineZoom: number;
  timelineScrollPosition: number;
}

interface VideoClip {
  id: string;
  path: string;
  filename: string;
  duration: number;
  thumbnail: string;
  metadata: {
    width: number;
    height: number;
    framerate: number;
    codec: string;
  };
}

interface TimelineClip {
  id: string;
  libraryClipId: string;
  trimStart: number;
  trimEnd: number;
  order: number;
}
```

**Implementation Phases:**
- **Phase 1:** Project Setup (Tauri + React initialization)
- **Phase 2:** Import & Library (drag-drop, metadata extraction)
- **Phase 3:** Timeline & Drag-to-Reorder (timeline UI, clip management)
- **Phase 4:** Video Preview (HTML5 player, playback controls)
- **Phase 5:** Auto-Save & Session Recovery (state persistence)
- **Phase 6:** Trimming (trim handles, duration updates)
- **Phase 7:** Sequence Preview (multi-clip playback)
- **Phase 8:** Export (FFmpeg pipeline, progress tracking)
- **Phase 9:** Polish & Testing (UI polish, edge cases)
- **Phase 10:** Build & Package (native app creation)