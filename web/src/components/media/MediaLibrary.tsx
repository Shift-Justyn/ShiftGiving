import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ImageUploader } from './ImageUploader';
import { ImageGenerator } from './ImageGenerator';
import { getMediaAssets, uploadMedia, generateImage } from '../../api/media';
import { MediaAsset } from '../../api/types';

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

type TabType = 'browse' | 'upload' | 'generate';

export function MediaLibrary({ isOpen, onClose, onSelect }: MediaLibraryProps) {
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<MediaAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMediaAssets();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAssets(mediaAssets);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredAssets(mediaAssets.filter((asset) => asset.name.toLowerCase().includes(query)));
    }
  }, [searchQuery, mediaAssets]);

  const loadMediaAssets = async () => {
    setIsLoading(true);
    try {
      const assets = await getMediaAssets();
      setMediaAssets(assets);
      setFilteredAssets(assets);
    } catch (error) {
      console.error('Failed to load media assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const newAsset = await uploadMedia(file);
      setMediaAssets([newAsset, ...mediaAssets]);
      setActiveTab('browse');
    } catch (error) {
      console.error('Failed to upload media:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async (prompt: string, style: string) => {
    try {
      const newAsset = await generateImage(prompt, style);
      setMediaAssets([newAsset, ...mediaAssets]);
    } catch (error) {
      console.error('Failed to generate image:', error);
      throw error;
    }
  };

  const handleSelectAsset = (assetUrl: string) => {
    setSelectedAsset(assetUrl);
  };

  const handleConfirmSelection = () => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      onClose();
      setSelectedAsset(null);
      setSearchQuery('');
      setActiveTab('browse');
    }
  };

  const handleGeneratorSelect = (url: string) => {
    onSelect(url);
    onClose();
    setSearchQuery('');
    setActiveTab('browse');
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Media Library</Title>
          <CloseButton onClick={onClose}>
            <svg
              width="24"
              height="24"
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
        </Header>

        <TabBar>
          <Tab $active={activeTab === 'browse'} onClick={() => setActiveTab('browse')}>
            Browse
          </Tab>
          <Tab $active={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>
            Upload
          </Tab>
          <Tab $active={activeTab === 'generate'} onClick={() => setActiveTab('generate')}>
            Generate with AI
          </Tab>
        </TabBar>

        <Content>
          {activeTab === 'browse' && (
            <BrowseTab>
              <SearchBar
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {isLoading ? (
                <LoadingState>Loading media assets...</LoadingState>
              ) : filteredAssets.length === 0 ? (
                <EmptyState>
                  {searchQuery
                    ? 'No images found matching your search.'
                    : 'No images available. Upload or generate one to get started.'}
                </EmptyState>
              ) : (
                <ImageGrid>
                  {filteredAssets.map((asset) => (
                    <ImageCard
                      key={asset.id}
                      $selected={selectedAsset === asset.url}
                      onClick={() => handleSelectAsset(asset.url)}
                    >
                      <ImageThumbnail src={asset.url} alt={asset.name} />
                      <ImageName>{asset.name}</ImageName>
                    </ImageCard>
                  ))}
                </ImageGrid>
              )}

              {selectedAsset && (
                <SelectButton onClick={handleConfirmSelection}>Select Image</SelectButton>
              )}
            </BrowseTab>
          )}

          {activeTab === 'upload' && (
            <UploadTab>
              <ImageUploader onUpload={handleUpload} isUploading={isUploading} />
            </UploadTab>
          )}

          {activeTab === 'generate' && (
            <GenerateTab>
              <ImageGenerator onGenerate={handleGenerate} onSelect={handleGeneratorSelect} />
            </GenerateTab>
          )}
        </Content>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: ${(props) =>
    props.theme.mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.colors.border.light};

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.light};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0 2rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.light};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.$active ? props.theme.colors.primary.main : 'transparent')};
  color: ${(props) =>
    props.$active ? props.theme.colors.primary.main : props.theme.colors.text.secondary};
  font-size: 1rem;
  font-weight: ${(props) => (props.$active ? 600 : 500)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
`;

const BrowseTab = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.primary};
  background-color: ${(props) => props.theme.colors.background.card};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(0, 160, 196, 0.1);
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.secondary};
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const ImageCard = styled.div<{ $selected: boolean }>`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid
    ${(props) =>
      props.$selected ? props.theme.colors.primary.main : props.theme.colors.border.light};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary.main};
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const ImageThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageName = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 1rem;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #00a0c4 0%, #007a94 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 160, 196, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const UploadTab = styled.div``;

const GenerateTab = styled.div``;
