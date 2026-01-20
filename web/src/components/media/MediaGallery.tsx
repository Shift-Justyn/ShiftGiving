import React, { useState } from 'react';
import styled from 'styled-components';

interface MediaGalleryImage {
  url: string;
  caption?: string;
}

interface MediaGalleryProps {
  images: MediaGalleryImage[];
}

export function MediaGallery({ images }: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  return (
    <>
      <Container>
        <GalleryGrid>
          {images.map((image, index) => (
            <GalleryItem key={index} onClick={() => openLightbox(index)}>
              <GalleryImage src={image.url} alt={image.caption || `Gallery image ${index + 1}`} />
              {image.caption && <ImageCaption>{image.caption}</ImageCaption>}
            </GalleryItem>
          ))}
        </GalleryGrid>
      </Container>

      {lightboxOpen && (
        <LightboxOverlay
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          <LightboxContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeLightbox} aria-label="Close lightbox">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </CloseButton>

            {images.length > 1 && (
              <>
                <NavButton $position="left" onClick={goToPrevious} aria-label="Previous image">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </NavButton>

                <NavButton $position="right" onClick={goToNext} aria-label="Next image">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </NavButton>
              </>
            )}

            <LightboxImageWrapper>
              <LightboxImage
                src={images[currentIndex].url}
                alt={images[currentIndex].caption || `Image ${currentIndex + 1}`}
              />
            </LightboxImageWrapper>

            {images[currentIndex].caption && (
              <LightboxCaption>{images[currentIndex].caption}</LightboxCaption>
            )}

            {images.length > 1 && (
              <ImageCounter>
                {currentIndex + 1} / {images.length}
              </ImageCounter>
            )}
          </LightboxContent>
        </LightboxOverlay>
      )}
    </>
  );
}

const Container = styled.div`
  width: 100%;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }
`;

const GalleryItem = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.default};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${(props) => props.theme.transitions.default};

  ${GalleryItem}:hover & {
    transform: scale(1.05);
  }
`;

const ImageCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6), transparent);
  color: white;
  font-size: ${(props) => props.theme.typography.small.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const LightboxContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem 2rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 3rem 1rem 1rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.default};
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 40px;
    height: 40px;
  }
`;

const NavButton = styled.button<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${(props) => (props.$position === 'left' ? 'left: 1rem;' : 'right: 1rem;')}
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.default};
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 40px;
    height: 40px;
  }
`;

const LightboxImageWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: calc(100vh - 200px);
`;

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.xl};
  animation: zoomIn 0.3s ease;

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const LightboxCaption = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${(props) => props.theme.borderRadius.md};
  color: white;
  font-size: ${(props) => props.theme.typography.body.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  text-align: center;
  max-width: 800px;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: ${(props) => props.theme.typography.small.fontSize};
    padding: 0.75rem 1.5rem;
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${(props) => props.theme.borderRadius.full};
  color: white;
  font-size: ${(props) => props.theme.typography.small.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;
