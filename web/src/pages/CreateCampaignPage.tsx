import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <ContentHeader>
          <BackButton onClick={() => navigate(-1)}>
            <BackIcon />
            Back
          </BackButton>
          <HeaderContent>
            <PageTitle>Create Campaign</PageTitle>
            <PageSubtitle>
              Use AI to help craft compelling campaign content and generate photorealistic images
            </PageSubtitle>
          </HeaderContent>
          <ProgressIndicator>
            <ProgressStep $active={!!formData.title}>
              <ProgressStepIcon>1</ProgressStepIcon>
              <ProgressStepLabel>Basics</ProgressStepLabel>
            </ProgressStep>
            <ProgressLine $completed={!!formData.imageUrl} />
            <ProgressStep $active={!!formData.imageUrl}>
              <ProgressStepIcon>2</ProgressStepIcon>
              <ProgressStepLabel>Image</ProgressStepLabel>
            </ProgressStep>
            <ProgressLine $completed={!!formData.story} />
            <ProgressStep $active={!!formData.story}>
              <ProgressStepIcon>3</ProgressStepIcon>
              <ProgressStepLabel>Content</ProgressStepLabel>
            </ProgressStep>
          </ProgressIndicator>
        </ContentHeader>

        <Main>
          <BackgroundPattern />
          <Form onSubmit={handleSubmit}>
            <motion.div custom={0} initial="hidden" animate="visible" variants={sectionVariants}>
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <InfoIcon />
                  </SectionIcon>
                  <SectionHeaderText>
                    <SectionTitle>Basic Information</SectionTitle>
                    <SectionDescription>Set up the foundation for your campaign</SectionDescription>
                  </SectionHeaderText>
                </SectionHeader>

                <FormGrid>
                  <FormGroup $fullWidth>
                    <Label htmlFor="title">Campaign Title</Label>
                    <InputWrapper>
                      <Input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter a compelling campaign title"
                        maxLength={100}
                      />
                      <CharacterCount>{formData.title.length}/100</CharacterCount>
                    </InputWrapper>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="category">Category</Label>
                    <SelectWrapper>
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
                      <SelectArrow />
                    </SelectWrapper>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="goalAmount">Goal Amount</Label>
                    <InputWrapper $hasPrefix>
                      <InputPrefix>$</InputPrefix>
                      <Input
                        id="goalAmount"
                        type="number"
                        min="100"
                        max="1000000"
                        value={formData.goalAmount}
                        onChange={(e) => handleInputChange('goalAmount', e.target.value)}
                        placeholder="10,000"
                        $hasPrefix
                      />
                    </InputWrapper>
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
                </FormGrid>
              </Section>
            </motion.div>

            <motion.div custom={1} initial="hidden" animate="visible" variants={sectionVariants}>
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <ImageIconSvg />
                  </SectionIcon>
                  <SectionHeaderText>
                    <SectionTitle>Campaign Image</SectionTitle>
                    <SectionDescription>
                      Upload an image or use AI to generate a photorealistic image
                    </SectionDescription>
                  </SectionHeaderText>
                </SectionHeader>

                {formData.imageUrl ? (
                  <ImagePreviewContainer
                    as={motion.div}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImagePreview src={formData.imageUrl} alt="Campaign preview" />
                    <ImageOverlay>
                      <ChangeImageButton type="button" onClick={() => setIsMediaLibraryOpen(true)}>
                        <EditIcon />
                        Change Image
                      </ChangeImageButton>
                      <RemoveImageButton
                        type="button"
                        onClick={() => handleInputChange('imageUrl', '')}
                      >
                        <TrashIcon />
                        Remove
                      </RemoveImageButton>
                    </ImageOverlay>
                  </ImagePreviewContainer>
                ) : (
                  <ImagePlaceholder
                    as={motion.button}
                    whileHover={{ scale: 1.01, borderColor: '#00a0c4' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsMediaLibraryOpen(true)}
                    type="button"
                  >
                    <ImagePlaceholderGlow />
                    <ImagePlaceholderIcon />
                    <ImagePlaceholderText>Click to add an image</ImagePlaceholderText>
                    <ImagePlaceholderSubtext>
                      Browse, upload, or generate with AI
                    </ImagePlaceholderSubtext>
                    <ImagePlaceholderBadge>AI Powered</ImagePlaceholderBadge>
                  </ImagePlaceholder>
                )}
              </Section>
            </motion.div>

            <motion.div custom={2} initial="hidden" animate="visible" variants={sectionVariants}>
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <ContentIcon />
                  </SectionIcon>
                  <SectionHeaderText>
                    <SectionTitle>Campaign Content</SectionTitle>
                    <SectionDescription>
                      Write your story. Use AI Assist buttons to enhance your text.
                    </SectionDescription>
                  </SectionHeaderText>
                </SectionHeader>

                <ContentFields>
                  <AITextEnhancer
                    value={formData.description}
                    onChange={(value) => handleInputChange('description', value)}
                    field="description"
                    label="Short Description"
                    placeholder="Briefly describe your campaign and its goals"
                    rows={3}
                  />

                  <AITextEnhancer
                    value={formData.teaser}
                    onChange={(value) => handleInputChange('teaser', value)}
                    field="teaser"
                    label="Teaser Text"
                    placeholder="Write an engaging teaser that appears on campaign cards"
                    rows={3}
                  />

                  <AITextEnhancer
                    value={formData.story}
                    onChange={(value) => handleInputChange('story', value)}
                    field="story"
                    label="Full Story"
                    placeholder="Tell the full story of your campaign. Explain why donations matter, who will benefit, and how the funds will be used."
                    rows={8}
                  />
                </ContentFields>
              </Section>
            </motion.div>

            <FormActions
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
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
                  <>
                    <RocketIcon />
                    Launch Campaign
                  </>
                )}
              </SubmitButton>
            </FormActions>
          </Form>
        </Main>

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
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const InfoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const ImageIconSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const ContentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const RocketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const SelectArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const focusGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 160, 196, 0.4); }
  70% { box-shadow: 0 0 0 0.25rem rgba(0, 160, 196, 0.1); }
  100% { box-shadow: 0 0 0 0.25rem rgba(0, 160, 196, 0.1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background.page};

  @media (max-width: 48rem) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  @media (max-width: 48rem) {
    padding-bottom: 5rem;
  }
`;

const ContentHeader = styled.div`
  padding: 2rem 2rem 1.5rem 2rem;
  background: linear-gradient(
    180deg,
    ${(props) => props.theme.colors.background.card} 0%,
    ${(props) => props.theme.colors.background.page} 100%
  );
  border-bottom: 0.0625rem solid ${(props) => props.theme.colors.border.light};
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 5;

  @media (max-width: 48rem) {
    padding: 5rem 1.5rem 1rem 1.5rem;
  }
`;

const HeaderContent = styled.div`
  margin-bottom: 1.5rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${(props) => props.theme.colors.background.card};
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 2rem;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary.main};
    border-color: ${(props) => props.theme.colors.primary.main};
    transform: translateX(-4px);
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.text.primary} 0%,
    ${(props) => props.theme.colors.primary.main} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;

  @media (min-width: 48rem) {
    font-size: 2.25rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
  max-width: 600px;
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0 0 0;

  @media (max-width: 640px) {
    display: none;
  }
`;

const ProgressStep = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: ${(props) => (props.$active ? 1 : 0.5)};
  transition: opacity 0.3s ease;
`;

const ProgressStepIcon = styled.span`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a0c4 0%, #007a94 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
`;

const ProgressStepLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ProgressLine = styled.div<{ $completed: boolean }>`
  width: 3rem;
  height: 2px;
  background: ${(props) =>
    props.$completed
      ? 'linear-gradient(90deg, #00a0c4 0%, #007a94 100%)'
      : props.theme.colors.border.light};
  transition: background 0.3s ease;
`;

const Main = styled.main`
  position: relative;
  overflow: hidden;
  padding: 2rem;
  flex: 1;

  @media (max-width: 48rem) {
    padding: 1.5rem;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(0, 160, 196, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(0, 160, 196, 0.05) 0%, transparent 50%);
  pointer-events: none;
`;

const Form = styled.form`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Section = styled.section`
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.08),
      0 4px 6px -2px rgba(0, 0, 0, 0.04);
  }

  @media (max-width: 640px) {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.light};
`;

const SectionIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, rgba(0, 160, 196, 0.1) 0%, rgba(0, 160, 196, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary.main};
  flex-shrink: 0;
`;

const SectionHeaderText = styled.div`
  flex: 1;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 0.25rem 0;
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ $fullWidth?: boolean }>`
  grid-column: ${(props) => (props.$fullWidth ? '1 / -1' : 'auto')};
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div<{ $hasPrefix?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputPrefix = styled.span`
  position: absolute;
  left: 1rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  font-size: 0.9375rem;
  font-weight: 500;
  pointer-events: none;
`;

const Input = styled.input<{ $hasPrefix?: boolean }>`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-left: ${(props) => (props.$hasPrefix ? '1.75rem' : '1rem')};
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.625rem;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.colors.text.primary};
  background-color: ${(props) => props.theme.colors.background.input};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(0, 160, 196, 0.1);
    animation: ${focusGlow} 0.3s ease;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.tertiary};
  }
`;

const SelectWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${(props) => props.theme.colors.text.tertiary};
    pointer-events: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem 2.5rem 0.875rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.625rem;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.colors.text.primary};
  background-color: ${(props) => props.theme.colors.background.input};
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(0, 160, 196, 0.1);
  }
`;

const CharacterCount = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  background: ${(props) => props.theme.colors.background.input};
  padding: 0 0.25rem;
`;

const ContentFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ImagePreviewContainer}:hover & {
    opacity: 1;
  }
`;

const ChangeImageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #1f2937;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const RemoveImageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    background: rgba(239, 68, 68, 1);
  }
`;

const ImagePlaceholder = styled.button`
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 2px dashed ${(props) => props.theme.colors.border.light};
  border-radius: 0.75rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.background.page} 0%,
    ${(props) => props.theme.colors.background.card} 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${(props) => props.theme.colors.text.tertiary};
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary.main};
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const ImagePlaceholderGlow = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 160, 196, 0.05) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 3s infinite;
`;

const ImagePlaceholderText = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  position: relative;
`;

const ImagePlaceholderSubtext = styled.span`
  font-size: 0.875rem;
  position: relative;
`;

const ImagePlaceholderBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #00a0c4 0%, #007a94 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 1rem;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid ${(props) => props.theme.colors.border.light};
  margin-top: 0.5rem;
`;

const CancelButton = styled.button`
  padding: 1rem 2rem;
  background: transparent;
  color: ${(props) => props.theme.colors.text.secondary};
  border: 2px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.625rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.text.secondary};
    color: ${(props) => props.theme.colors.text.primary};
    background: ${(props) => props.theme.colors.background.card};
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #00a0c4 0%, #007a94 100%);
  color: white;
  border: none;
  border-radius: 0.625rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 160, 196, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 160, 196, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
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
