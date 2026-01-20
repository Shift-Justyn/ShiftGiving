import { post } from './client';

export interface GenerateImageRequest {
  prompt: string;
  style?: 'documentary' | 'warm' | 'editorial' | 'candid';
  category?: string;
}

export interface GenerateImageResponse {
  url: string;
  prompt: string;
  revisedPrompt?: string;
}

export interface EnhanceTextRequest {
  text: string;
  field: 'description' | 'teaser' | 'story';
  action: 'fix_grammar' | 'improve' | 'rewrite' | 'tone' | 'expand';
}

export interface EnhanceTextResponse {
  text: string;
  originalText: string;
}

const STYLE_ENHANCEMENTS: Record<string, string> = {
  documentary:
    'Ultra-realistic photograph captured with professional Nikon D850 full-frame camera, documentary photography style, genuine real-world location, authentic natural lighting, shot with 85mm f/1.4 lens for shallow depth of field, extremely high detail and clarity, true-to-life colors, candid moment without posed subjects, backs of heads or cropped angles to avoid showing faces directly, focus on hands and actions rather than facial features, landscape orientation 16:9 aspect ratio, completely indistinguishable from actual photography',
  warm: 'Professional photograph with warm natural lighting, soft golden hour tones, inviting atmosphere, shot on Nikon full-frame camera with 50mm lens, genuine documentary style, authentic community setting, focus on gestures and actions rather than faces, subjects viewed from behind or at angles that crop faces naturally, high detail, true-to-life warm colors, 16:9 landscape format',
  editorial:
    'Editorial photography style, professional Nikon D850 camera, 70-200mm telephoto lens creating natural compression, authentic location, environmental portrait approach focusing on context over faces, subjects shown from behind or with faces naturally obscured by activity, storytelling composition, magazine-quality detail, authentic lighting, 16:9 landscape orientation',
  candid:
    'Candid documentary photograph, Nikon full-frame camera, natural available light, genuine unposed moment, subjects engaged in activity with backs to camera or faces naturally cropped, focus on hands and meaningful actions, authentic community setting, professional photojournalism style, extremely realistic, 16:9 landscape format',
};

const CATEGORY_CONTEXT: Record<string, string> = {
  Animals:
    'animal shelter or rescue environment, pets receiving care, veterinary setting, animals in loving care',
  Community:
    'community center, food distribution, volunteers serving meals, community gathering space, helping hands',
  Education:
    'classroom setting with students backs visible facing a wall or board, learning environment, school supplies, tutoring session seen from behind',
  Health:
    'medical supplies, healthcare workers hands, clinic setting, medical equipment, healing environment',
  Environment:
    'community garden, fresh produce, urban farming, green spaces, environmental restoration',
};

export function buildPhotorealisticPrompt(
  userPrompt: string,
  style: string = 'documentary',
  category?: string
): string {
  const styleEnhancement = STYLE_ENHANCEMENTS[style] || STYLE_ENHANCEMENTS.documentary;
  const categoryContext = category ? CATEGORY_CONTEXT[category] || '' : '';

  let enhancedPrompt = userPrompt.trim();

  if (categoryContext) {
    enhancedPrompt = `${enhancedPrompt}, ${categoryContext}`;
  }

  return `${enhancedPrompt}. ${styleEnhancement}`;
}

export async function generateAIImage(
  request: GenerateImageRequest
): Promise<GenerateImageResponse> {
  const enhancedPrompt = buildPhotorealisticPrompt(
    request.prompt,
    request.style || 'documentary',
    request.category
  );

  return post<GenerateImageResponse>('/api/ai/generate-image', {
    prompt: enhancedPrompt,
    originalPrompt: request.prompt,
  });
}

export async function enhanceText(request: EnhanceTextRequest): Promise<EnhanceTextResponse> {
  return post<EnhanceTextResponse>('/api/ai/enhance-text', request);
}

export const TEXT_FIELD_CONFIG = {
  description: {
    maxLength: 200,
    placeholder: 'Brief description of the campaign (max 200 characters)',
    systemContext: 'campaign description for a charitable donation platform',
  },
  teaser: {
    maxLength: 500,
    placeholder: 'Engaging teaser text for the campaign card (max 500 characters)',
    systemContext: 'campaign teaser that encourages donations',
  },
  story: {
    maxLength: 3000,
    placeholder: 'Full story of the campaign, its impact, and why donations matter',
    systemContext: 'detailed campaign story for a charitable cause',
  },
};

export const TEXT_ACTIONS = [
  { id: 'fix_grammar', label: 'Fix Grammar', icon: 'check' },
  { id: 'improve', label: 'Improve', icon: 'sparkle' },
  { id: 'rewrite', label: 'Rewrite', icon: 'refresh' },
  { id: 'tone', label: 'Tone', icon: 'voice' },
  { id: 'expand', label: 'Expand', icon: 'expand', storyOnly: true },
] as const;
