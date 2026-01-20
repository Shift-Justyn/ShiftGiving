import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { AITextEnhancer } from '../components/media/AITextEnhancer';
import { MediaLibrary } from '../components/media/MediaLibrary';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select a category' },
  { value: 'Animals', label: 'Animals' },
  { value: 'Community', label: 'Community' },
  { value: 'Education', label: 'Education' },
  { value: 'Health', label: 'Health' },
  { value: 'Environment', label: 'Environment' },
];

interface CampaignFormData {
  title: string;
  description: string;
  teaser: string;
  story: string;
  goalAmount: string;
  category: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
}

export function CreateCampaignPage() {
  const navigate = useNavigate();
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    description: '',
    teaser: '',
    story: '',
    goalAmount: '',
    category: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setIsMediaLibraryOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate('/');
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.teaser.trim() &&
    formData.story.trim() &&
    formData.goalAmount &&
    formData.category &&
    formData.imageUrl;

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <BackIcon />
            Back
          </BackButton>
          <PageTitle>Create Campaign</PageTitle>
          <PageSubtitle>
            Use AI to help craft compelling campaign content and generate photorealistic images
          </PageSubtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>Basic Information</SectionTitle>

            <FormGroup>
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a compelling campaign title"
                maxLength={100}
              />
              <CharacterCount>{formData.title.length}/100</CharacterCount>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="goalAmount">Goal Amount ($)</Label>
                <Input
                  id="goalAmount"
                  type="number"
                  min="100"
                  max="1000000"
                  value={formData.goalAmount}
                  onChange={(e) => handleInputChange('goalAmount', e.target.value)}
                  placeholder="10000"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </FormGroup>
            </FormRow>
          </Section>

          <Section>
            <SectionTitle>Campaign Image</SectionTitle>
            <SectionDescription>
              Upload an image or use AI to generate a photorealistic image for your campaign
            </SectionDescription>

            {formData.imageUrl ? (
              <ImagePreviewContainer>
                <ImagePreview src={formData.imageUrl} alt="Campaign preview" />
                <ImageOverlay>
                  <ChangeImageButton type="button" onClick={() => setIsMediaLibraryOpen(true)}>
                    Change Image
                  </ChangeImageButton>
                  <RemoveImageButton
                    type="button"
                    onClick={() => handleInputChange('imageUrl', '')}
                  >
                    Remove
                  </RemoveImageButton>
                </ImageOverlay>
              </ImagePreviewContainer>
            ) : (
              <ImagePlaceholder onClick={() => setIsMediaLibraryOpen(true)}>
                <ImagePlaceholderIcon />
                <ImagePlaceholderText>Click to add an image</ImagePlaceholderText>
                <ImagePlaceholderSubtext>
                  Browse, upload, or generate with AI
                </ImagePlaceholderSubtext>
              </ImagePlaceholder>
            )}
          </Section>

          <Section>
            <SectionTitle>Campaign Content</SectionTitle>
            <SectionDescription>
              Write your campaign content below. Use AI Assist buttons to enhance your text.
            </SectionDescription>

            <AITextEnhancer
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              field="description"
              label="Short Description"
              placeholder="Briefly describe your campaign and its goals"
              rows={3}
            />

            <Spacer />

            <AITextEnhancer
              value={formData.teaser}
              onChange={(value) => handleInputChange('teaser', value)}
              field="teaser"
              label="Teaser Text"
              placeholder="Write an engaging teaser that appears on campaign cards"
              rows={3}
            />

            <Spacer />

            <AITextEnhancer
              value={formData.story}
              onChange={(value) => handleInputChange('story', value)}
              field="story"
              label="Full Story"
              placeholder="Tell the full story of your campaign. Explain why donations matter, who will benefit, and how the funds will be used."
              rows={8}
            />
          </Section>

          <FormActions>
            <CancelButton type="button" onClick={() => navigate(-1)}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Creating Campaign...
                </>
              ) : (
                'Create Campaign'
              )}
            </SubmitButton>
          </FormActions>
        </Form>

        <MediaLibrary
          isOpen={isMediaLibraryOpen}
          onClose={() => setIsMediaLibraryOpen(false)}
          onSelect={handleImageSelect}
        />
      </MainContent>
    </PageContainer>
  );
}

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background.page};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: 4rem;
  }
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
`;

const Form = styled.form`
  max-width: 800px;
`;

const Section = styled.section`
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0 0 1.5rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.colors.text.primary};
  background-color: ${(props) => props.theme.colors.background.input};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(0, 160, 196, 0.1);
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.tertiary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.colors.text.primary};
  background-color: ${(props) => props.theme.colors.background.input};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(0, 160, 196, 0.1);
  }
`;

const CharacterCount = styled.span`
  position: absolute;
  right: 0;
  top: 0;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.tertiary};
`;

const Spacer = styled.div`
  height: 1.5rem;
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${ImagePreviewContainer}:hover & {
    opacity: 1;
  }
`;

const ChangeImageButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  color: #1f2937;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const RemoveImageButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ImagePlaceholder = styled.button`
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 2px dashed ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  background: ${(props) => props.theme.colors.background.page};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${(props) => props.theme.colors.text.tertiary};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary.main};
    background: ${(props) => props.theme.colors.primary.light};
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const ImagePlaceholderText = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const ImagePlaceholderSubtext = styled.span`
  font-size: 0.875rem;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.875rem 2rem;
  background: transparent;
  color: ${(props) => props.theme.colors.text.secondary};
  border: 2px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.text.secondary};
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #00a0c4 0%, #007a94 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 160, 196, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
