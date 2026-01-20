import React, { useState, useRef } from 'react';
import styled from 'styled-components';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export function ImageUploader({ onUpload, isUploading }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, GIF, or WebP images.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit.';
    }
    return null;
  };

  const handleFile = (file: File) => {
    setError(null);
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setUploadProgress(0);
      onUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  React.useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else if (uploadProgress > 0) {
      setUploadProgress(100);
      setTimeout(() => {
        setPreviewUrl(null);
        setUploadProgress(0);
      }, 1000);
    }
  }, [isUploading, uploadProgress]);

  return (
    <Container>
      <DropZone
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        $isDragging={isDragging}
        $hasPreview={!!previewUrl}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          data-testid="file-input"
        />

        {previewUrl ? (
          <PreviewContainer>
            <PreviewImage src={previewUrl} alt="Upload preview" />
            {isUploading && (
              <ProgressOverlay>
                <ProgressBar>
                  <ProgressFill style={{ width: `${uploadProgress}%` }} />
                </ProgressBar>
                <ProgressText>{uploadProgress}%</ProgressText>
              </ProgressOverlay>
            )}
          </PreviewContainer>
        ) : (
          <EmptyState>
            <UploadIcon>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 8L12 3L7 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </UploadIcon>
            <DropText>
              {isDragging ? 'Drop your image here' : 'Drag and drop an image, or click to browse'}
            </DropText>
            <FileInfo>JPG, PNG, GIF, or WebP (max 10MB)</FileInfo>
          </EmptyState>
        )}
      </DropZone>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const DropZone = styled.div<{ $isDragging: boolean; $hasPreview: boolean }>`
  width: 100%;
  min-height: ${(props) => (props.$hasPreview ? '300px' : '200px')};
  border: 2px dashed
    ${(props) => (props.$isDragging ? props.theme.colors.primary : props.theme.colors.border)};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.default};
  background-color: ${(props) =>
    props.$isDragging ? props.theme.colors.primaryOpacity10 : props.theme.colors.surface};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background-color: ${(props) => props.theme.colors.primaryOpacity10};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
`;

const UploadIcon = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
  transition: color ${(props) => props.theme.transitions.default};

  ${DropZone}:hover & {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const DropText = styled.p`
  font-size: ${(props) => props.theme.typography.body.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;

const FileInfo = styled.p`
  font-size: ${(props) => props.theme.typography.small.fontSize};
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 280px;
  object-fit: contain;
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const ProgressOverlay = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  background: ${(props) => props.theme.colors.surface};
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${(props) => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: ${(props) => props.theme.typography.small.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  text-align: center;
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: ${(props) => props.theme.colors.errorBackground};
  color: ${(props) => props.theme.colors.error};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.small.fontSize};
`;
