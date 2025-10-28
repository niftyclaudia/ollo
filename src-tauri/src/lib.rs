use serde::{Deserialize, Serialize};
use std::path::Path;
use std::process::Command;
use std::fs;
use uuid::Uuid;
use tauri::Emitter;

// Data structures for video import functionality
#[derive(Debug, Serialize, Deserialize)]
pub struct VideoMetadata {
    pub width: u32,
    pub height: u32,
    pub framerate: f64,
    pub codec: String,
    #[serde(rename = "fileSize")]
    pub file_size: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ImportValidation {
    #[serde(rename = "isValidFormat")]
    pub is_valid_format: bool,
    #[serde(rename = "isWithinSizeLimit")]
    pub is_within_size_limit: bool,
    #[serde(rename = "errorMessage")]
    pub error_message: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VideoClip {
    pub id: String,
    pub path: String,
    pub filename: String,
    pub duration: f64,
    pub thumbnail: String,
    pub metadata: VideoMetadata,
    #[serde(rename = "importedAt")]
    pub imported_at: String,
}

// Validate video file format and size
#[tauri::command]
async fn validate_video_file(file_path: String) -> Result<ImportValidation, String> {
    let path = Path::new(&file_path);
    
    // Check if file exists
    if !path.exists() {
        return Ok(ImportValidation {
            is_valid_format: false,
            is_within_size_limit: false,
            error_message: Some("File does not exist".to_string()),
        });
    }
    
    // Check file extension
    let extension = path.extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("")
        .to_lowercase();
    
    let is_valid_format = matches!(extension.as_str(), "mp4" | "mov");
    
    // Check file size (4GB limit)
    let file_size = fs::metadata(&file_path)
        .map_err(|e| format!("Failed to get file metadata: {}", e))?
        .len();
    
    let is_within_size_limit = file_size <= 4 * 1024 * 1024 * 1024; // 4GB
    
    let error_message = if !is_valid_format {
        Some("Unsupported file format. Please use MP4 or MOV files.".to_string())
    } else if !is_within_size_limit {
        Some("File too large. Please use files under 4GB.".to_string())
    } else {
        None
    };
    
    Ok(ImportValidation {
        is_valid_format,
        is_within_size_limit,
        error_message,
    })
}

// Extract video metadata using FFmpeg
#[tauri::command]
async fn extract_video_metadata(file_path: String) -> Result<VideoMetadata, String> {
    // Get file size
    let file_size = fs::metadata(&file_path)
        .map_err(|e| format!("Failed to get file metadata: {}", e))?
        .len();
    
    // Use FFmpeg to extract metadata
    let output = Command::new("ffprobe")
        .args([
            "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            "-show_streams",
            &file_path,
        ])
        .output()
        .map_err(|e| format!("Failed to execute ffprobe: {}", e))?;
    
    if !output.status.success() {
        return Err("Failed to extract video metadata".to_string());
    }
    
    let json_str = String::from_utf8(output.stdout)
        .map_err(|e| format!("Invalid UTF-8 in ffprobe output: {}", e))?;
    
    let json: serde_json::Value = serde_json::from_str(&json_str)
        .map_err(|e| format!("Failed to parse ffprobe JSON: {}", e))?;
    
    // Extract video stream information
    let streams = json["streams"].as_array()
        .ok_or("No streams found in video file")?;
    
    let video_stream = streams.iter()
        .find(|s| s["codec_type"] == "video")
        .ok_or("No video stream found")?;
    
    let width = video_stream["width"].as_u64()
        .ok_or("Failed to get video width")? as u32;
    
    let height = video_stream["height"].as_u64()
        .ok_or("Failed to get video height")? as u32;
    
    let framerate_str = video_stream["r_frame_rate"].as_str()
        .ok_or("Failed to get framerate")?;
    
    // Parse framerate (e.g., "30/1" -> 30.0)
    let framerate = if let Some((num, den)) = framerate_str.split_once('/') {
        let num: f64 = num.parse().map_err(|e| format!("Invalid framerate numerator: {}", e))?;
        let den: f64 = den.parse().map_err(|e| format!("Invalid framerate denominator: {}", e))?;
        if den != 0.0 { num / den } else { 30.0 }
    } else {
        30.0 // Default framerate
    };
    
    let codec = video_stream["codec_name"].as_str()
        .unwrap_or("unknown")
        .to_string();
    
    Ok(VideoMetadata {
        width,
        height,
        framerate,
        codec,
        file_size,
    })
}

// Generate thumbnail from first frame
#[tauri::command]
async fn generate_thumbnail(file_path: String, output_path: String) -> Result<(), String> {
    let output = Command::new("ffmpeg")
        .args([
            "-i", &file_path,
            "-ss", "00:00:01", // Skip first second to avoid black frames
            "-vframes", "1",
            "-q:v", "2", // High quality
            "-y", // Overwrite output file
            &output_path,
        ])
        .output()
        .map_err(|e| format!("Failed to execute ffmpeg: {}", e))?;
    
    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Failed to generate thumbnail: {}", error));
    }
    
    Ok(())
}

// Open native file picker - temporarily disabled
// #[tauri::command]
// async fn open_file_picker(app: tauri::AppHandle) -> Result<Vec<String>, String> {
//     use std::sync::mpsc;
//     use std::time::Duration;
//     
//     let (tx, rx) = mpsc::channel();
//     
//     let dialog = app.dialog();
//     dialog.file()
//         .add_filter("Video files", &["mp4", "mov"])
//         .add_filter("MP4 files", &["mp4"])
//         .add_filter("MOV files", &["mov"])
//         .pick_files(move |result| {
//             let paths = result
//                 .unwrap_or_default()
//                 .into_iter()
//                 .map(|path| path.to_string())
//                 .collect();
//             let _ = tx.send(paths);
//         });
//     
//     // Wait for the result with a timeout
//     match rx.recv_timeout(Duration::from_secs(30)) {
//         Ok(paths) => Ok(paths),
//         Err(_) => Err("File picker timed out".to_string()),
//     }
// }

// Get temporary directory path
#[tauri::command]
async fn get_temp_dir() -> Result<String, String> {
    Ok(std::env::temp_dir().to_string_lossy().to_string())
}

// Write temporary file from frontend data
#[tauri::command]
async fn write_temp_file(file_path: String, data: Vec<u8>) -> Result<(), String> {
    // Ensure parent directory exists
    if let Some(parent) = Path::new(&file_path).parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }
    
    // Write the file
    fs::write(&file_path, data)
        .map_err(|e| format!("Failed to write file: {}", e))?;
    
    Ok(())
}

// Read thumbnail file and convert to base64 data URL
#[tauri::command]
async fn get_thumbnail_data_url(thumbnail_path: String) -> Result<String, String> {
    let thumbnail_data = fs::read(&thumbnail_path)
        .map_err(|e| format!("Failed to read thumbnail: {}", e))?;
    
    use base64::{Engine as _, engine::general_purpose};
    let base64_data = general_purpose::STANDARD.encode(&thumbnail_data);
    let data_url = format!("data:image/jpeg;base64,{}", base64_data);
    
    Ok(data_url)
}

// Get video file as base64 data URL for blob creation
#[tauri::command]
async fn get_video_asset_url(video_path: String) -> Result<String, String> {
    let path = Path::new(&video_path);
    
    // Check if file exists
    if !path.exists() {
        return Err("Video file does not exist".to_string());
    }
    
    // Read the video file
    let video_data = fs::read(&video_path)
        .map_err(|e| format!("Failed to read video file: {}", e))?;
    
    // Convert to base64
    use base64::{Engine as _, engine::general_purpose};
    let base64_data = general_purpose::STANDARD.encode(&video_data);
    
    // Determine MIME type based on file extension
    let mime_type = path.extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| match ext.to_lowercase().as_str() {
            "mp4" => "video/mp4",
            "mov" => "video/quicktime",
            _ => "video/mp4", // default
        })
        .unwrap_or("video/mp4");
    
    // Create data URL
    let data_url = format!("data:{};base64,{}", mime_type, base64_data);
    Ok(data_url)
}

// Get file size
#[tauri::command]
async fn get_file_size(file_path: String) -> Result<u64, String> {
    let metadata = fs::metadata(&file_path)
        .map_err(|e| format!("Failed to get file metadata: {}", e))?;
    
    Ok(metadata.len())
}

// Create a complete VideoClip from file path
#[tauri::command]
async fn create_video_clip(file_path: String) -> Result<VideoClip, String> {
    // Validate file first
    let validation = validate_video_file(file_path.clone()).await?;
    if !validation.is_valid_format || !validation.is_within_size_limit {
        return Err(validation.error_message.unwrap_or("Invalid file".to_string()));
    }
    
    // Extract metadata
    let metadata = extract_video_metadata(file_path.clone()).await?;
    
    // Generate thumbnail
    let thumbnail_path = format!("{}/thumbnails/{}.jpg", 
        std::env::temp_dir().to_string_lossy(), 
        Uuid::new_v4()
    );
    
    // Ensure thumbnail directory exists
    if let Some(parent) = Path::new(&thumbnail_path).parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create thumbnail directory: {}", e))?;
    }
    
    generate_thumbnail(file_path.clone(), thumbnail_path.clone()).await?;
    
    // Get filename from path
    let filename = Path::new(&file_path)
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("unknown")
        .to_string();
    
    // Get duration from metadata (we'll extract this from ffprobe)
    let duration = extract_duration(&file_path).await?;
    
    Ok(VideoClip {
        id: Uuid::new_v4().to_string(),
        path: file_path,
        filename,
        duration,
        thumbnail: thumbnail_path,
        metadata,
        imported_at: chrono::Utc::now().to_rfc3339(),
    })
}

// Helper function to extract duration
async fn extract_duration(file_path: &str) -> Result<f64, String> {
    let output = Command::new("ffprobe")
        .args([
            "-v", "quiet",
            "-show_entries", "format=duration",
            "-of", "csv=p=0",
            file_path,
        ])
        .output()
        .map_err(|e| format!("Failed to execute ffprobe: {}", e))?;
    
    if !output.status.success() {
        return Err("Failed to extract duration".to_string());
    }
    
    let duration_str = String::from_utf8(output.stdout)
        .map_err(|e| format!("Invalid UTF-8 in ffprobe output: {}", e))?;
    
    duration_str.trim().parse::<f64>()
        .map_err(|e| format!("Failed to parse duration: {}", e))
}

// Keep the original greet command for compatibility
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            validate_video_file,
            extract_video_metadata,
            generate_thumbnail,
            get_file_size,
            create_video_clip,
            get_temp_dir,
            write_temp_file,
            get_thumbnail_data_url,
            get_video_asset_url
        ])
        // Tauri file drop handler - handles EXTERNAL file drops from Finder/Explorer
        // This works alongside our custom mouse-based drag for internal dragging
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::DragDrop(drag_drop_event) = event {
                match drag_drop_event {
                    tauri::DragDropEvent::Enter { paths, .. } => {
                        println!("📁 External files entered: {:?}", paths);
                    }
                    tauri::DragDropEvent::Over { position, .. } => {
                        println!("📁 External files over at position: {:?}", position);
                    }
                    tauri::DragDropEvent::Drop { paths, position } => {
                        println!("📁 External files dropped at {:?}: {:?}", position, paths);
                        
                        // Create payload with both paths and position
                        let payload = serde_json::json!({
                            "paths": paths,
                            "position": {
                                "x": position.x,
                                "y": position.y
                            }
                        });
                        
                        // Emit event to frontend with position info
                        match window.emit("file-drop-with-position", &payload) {
                            Ok(_) => println!("✅ File drop event emitted successfully"),
                            Err(e) => println!("❌ Failed to emit file drop event: {:?}", e),
                        }
                    }
                    tauri::DragDropEvent::Leave => {
                        println!("📁 External file drop left");
                    }
                    _ => {}
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
