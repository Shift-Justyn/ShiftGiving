import React, { useState } from 'react';
import styled from 'styled-components';
import { generateAIImage, buildPhotorealisticPrompt } from '../../api/ai';

interface ImageGeneratorProps {
  onGenerate?: (prompt: string, style: string) => Promise<void>;
  onSelect: (url: string) => void;
  category?: string;
}

const STYLE_PRESETS = [
  {
    value: 'documentary',
    label: 'Documentary (Recommended)',
    description: 'Photojournalistic style, backs of heads, candid moments',
  },
  {
    value: 'warm',
    label: 'Warm & Inviting',
    description: 'Golden hour lighting, welcoming atmosphere',
  },
  {
    value: 'editorial',
    label: 'Editorial',
    description: 'Magazine-quality, storytelling composition',
  },
  {
    value: 'candid',
    label: 'Candid',
    description: 'Unposed natural moments, genuine interactions',
  },
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select a category (optional)' },
  { value: 'Animals', label: 'Animals' },
  { value: 'Community', label: 'Community' },
  { value: 'Education', label: 'Education' },
  { value: 'Health', label: 'Health' },
  { value: 'Environment', label: 'Environment' },
];

const PROMPT_SUGGESTIONS: Record<string, string[]> = {
  Animals: [
    'Veterinarian hands gently examining a rescued puppy',
    'Volunteers filling food bowls at an animal shelter',
    'Cat resting peacefully in a clean shelter kennel',
  ],
  Community: [
    'Volunteers arranging food packages at a distribution center',
    'Hands passing a meal tray across a serving counter',
    'People gathered around tables at a community meal event',
  ],
  Education: [
    'Students backs facing a whiteboard in a small classroom',
    'Hands writing in a notebook during a tutoring session',
    'Children sitting at desks working on assignments, viewed from behind',
  ],
  Health: [
    'Medical supplies being organized on shelves',
    'Healthcare worker hands preparing medication',
    'Clean medical equipment in a clinic setting',
  ],
  Environment: [
    'Hands planting seedlings in a community garden',
    'Fresh vegetables growing in raised garden beds',
    'Volunteers working together in an urban garden',
  ],
};

export function ImageGenerator({ onSelect, category: initialCategory }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('documentary');
  const [category, setCategory] = useState(initialCategory || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const suggestions = category ? PROMPT_SUGGESTIONS[category] || [] : [];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateAIImage({
        prompt,
        style: style as 'documentary' | 'warm' | 'editorial' | 'candid',
        category: category || undefined,
      });

      setGeneratedImageUrl(response.url);
    } catch (err) {
      console.error('Failed to generate image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (generatedImageUrl) {
      onSelect(generatedImageUrl);
      setGeneratedImageUrl(null);
      setPrompt('');
    }
  };

  const handleRegenerate = () => {
    setGeneratedImageUrl(null);
    handleGenerate();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handlePreviewPrompt = () => {
    setShowPreview(!showPreview);
  };

  const enhancedPrompt = buildPhotorealisticPrompt(prompt, style, category || undefined);

  return (
    <Container>
      <InputSection>
        <FormGroup>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isGenerating}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="prompt">Describe the image you want to create</Label>
          <PromptTextarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the scene you want to capture. Focus on actions, settings, and atmosphere rather than specific faces. Example: 'Volunteers organizing donation boxes in a warehouse'"
            rows={4}
            disabled={isGenerating}
          />
          <HelpText>
            Tip: Focus on hands, backs of heads, and activities rather than faces. The AI will
            automatically apply photorealistic camera settings.
          </HelpText>
        </FormGroup>

        {suggestions.length > 0 && (
          <SuggestionsSection>
            <SuggestionsLabel>Suggested prompts for {category}:</SuggestionsLabel>
            <SuggestionsList>
              {suggestions.map((suggestion, index) => (
                <SuggestionChip key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </SuggestionChip>
              ))}
            </SuggestionsList>
          </SuggestionsSection>
        )}

        <FormGroup>
          <Label htmlFor="style">Photography Style</Label>
          <Select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            disabled={isGenerating}
          >
            {STYLE_PRESETS.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </Select>
          <StyleDescription>
            {STYLE_PRESETS.find((p) => p.value === style)?.description}
          </StyleDescription>
        </FormGroup>

        {prompt.trim() && (
          <PreviewToggle onClick={handlePreviewPrompt}>
            {showPreview ? 'Hide' : 'Show'} enhanced prompt
          </PreviewToggle>
        )}

        {showPreview && prompt.trim() && (
          <EnhancedPromptPreview>
            <EnhancedPromptLabel>Enhanced prompt (sent to AI):</EnhancedPromptLabel>
            <EnhancedPromptText>{enhancedPrompt}</EnhancedPromptText>
          </EnhancedPromptPreview>
        )}

        <GenerateButton onClick={handleGenerate} disabled={!prompt.trim() || isGenerating}>
          {isGenerating ? (
            <>
              <Spinner />
              Generating with AI...
            </>
          ) : (
            <>
              <SparkleIcon />
              Generate Photorealistic Image
            </>
          )}
        </GenerateButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputSection>

      {generatedImageUrl && (
        <PreviewSection>
          <PreviewLabel>Generated Image</PreviewLabel>
          <PreviewImage src={generatedImageUrl} alt="AI generated image" />
          <ActionButtons>
            <UseButton onClick={handleUseImage}>Use This Image</UseButton>
            <RegenerateButton onClick={handleRegenerate} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Regenerate'}
            </RegenerateButton>
          </ActionButtons>
        </PreviewSection>
      )}

      {isGenerating && !generatedImageUrl && (
        <LoadingSection>
          <LoadingSpinner />
          <LoadingText>Generating your photorealistic image...</LoadingText>
          <LoadingSubtext>
            Using Nikon D850 full-frame camera simulation with natural lighting
          </LoadingSubtext>
        </LoadingSection>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const PromptTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-family: inherit;
  color: ${(props) => props.theme.colors.text.primary};
  background-color: ${(props) => props.theme.colors.background.card};
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(0, 160, 196, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.tertiary};
  }
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0.5rem 0 0 0;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.colors.text.primary};
  background-color: ${(props) => props.theme.colors.background.card};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(0, 160, 196, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyleDescription = styled.p`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0.5rem 0 0 0;
  font-style: italic;
`;

const SuggestionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SuggestionsLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
`;

const SuggestionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SuggestionChip = styled.button`
  padding: 0.5rem 0.75rem;
  background-color: ${(props) => props.theme.colors.background.page};
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 1rem;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary.main};
    border-color: ${(props) => props.theme.colors.primary.main};
    color: white;
  }
`;

const PreviewToggle = styled.button`
  align-self: flex-start;
  padding: 0;
  background: none;
  border: none;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.primary.main};
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: ${(props) => props.theme.colors.primary.hover};
  }
`;

const EnhancedPromptPreview = styled.div`
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.background.page};
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
`;

const EnhancedPromptLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0 0 0.5rem 0;
`;

const EnhancedPromptText = styled.p`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
  line-height: 1.5;
  font-family: monospace;
`;

const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
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

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.error};
  font-size: 0.875rem;
  margin: 0;
  padding: 0.75rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 0.5rem;
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: ${(props) => props.theme.colors.background.card};
  border-radius: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
`;

const PreviewLabel = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.background.page};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const UseButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #00a0c4 0%, #007a94 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
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

const RegenerateButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: ${(props) => props.theme.colors.text.primary};
  border: 2px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${(props) => props.theme.colors.primary.main};
    color: ${(props) => props.theme.colors.primary.main};
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
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

const LoadingSpinner = styled(Spinner)`
  width: 48px;
  height: 48px;
  border-width: 4px;
  border-color: rgba(0, 160, 196, 0.2);
  border-top-color: #00a0c4;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
`;

const LoadingSubtext = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
`;
