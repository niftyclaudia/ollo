import { useRef } from 'react';

interface ImportButtonProps {
  onImport: (files: FileList) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * ImportButton - File picker trigger button
 * Opens HTML5 file picker for video import
 */
export const ImportButton = ({ onImport, disabled = false, className = "" }: ImportButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImport(files);
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,.mp4,.mov"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`import-button ${className}`}
        style={{
          padding: '12px 24px',
          backgroundColor: disabled ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = '#007bff';
          }
        }}
      >
        <span>📁</span>
        Import Videos
      </button>
    </>
  );
};
