# UI Polish Patterns

This document captures reusable UI polish patterns established in the ShiftGiving web app. Use these patterns consistently across the site for a cohesive, professional look.

## Table of Contents

1. [Header Polish](#header-polish)
2. [Logo Styling](#logo-styling)
3. [Trust Badges](#trust-badges)
4. [Input Fields with Icons](#input-fields-with-icons)
5. [Password Visibility Toggle](#password-visibility-toggle)
6. [Focus States with Glow](#focus-states-with-glow)
7. [Card Entrance Animations](#card-entrance-animations)
8. [Button Hover Effects](#button-hover-effects)
9. [Background Patterns](#background-patterns)
10. [Error Boundary](#error-boundary)

---

## Header Polish

Elevated header with gradient and shadow for visual depth.

### Styled Component

```tsx
const Header = styled.header`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main} 0%,
    #0088a8 100%
  );
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: center;
  box-shadow:
    0 0.25rem 1rem rgba(0, 0, 0, 0.15),
    0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
`;
```

### Key Features

- **Gradient background**: Creates depth with a subtle teal-to-darker-teal transition
- **Layered shadow**: Two shadows for realistic depth (soft outer + crisp inner)
- **Z-index**: Ensures header appears above content when scrolling

---

## Logo Styling

Bold, prominent logo with text shadow for light backgrounds.

### Styled Component

```tsx
const LogoText = styled.span<{ $variant: string; $size: string }>`
  font-size: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '1.25rem';
      case 'large':
        return '2rem';
      default:
        return '1.625rem';
    }
  }};
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${(props) => (props.$variant === 'light' ? '#ffffff' : props.theme.colors.primary.main)};
  text-shadow: ${(props) => (props.$variant === 'light' ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none')};
`;
```

### Key Features

- **Bold weight (700)**: Makes the brand name prominent
- **Tight letter-spacing**: Professional, compact appearance
- **Text shadow on light variant**: Adds depth against colored backgrounds

---

## Trust Badges

Blue pill-shaped badges that communicate trust and value propositions.

### Styled Component

```tsx
const TrustBadgesContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const TrustBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border: 1px solid #7dd3fc;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #0369a1;
  box-shadow: 0 1px 2px rgba(14, 165, 233, 0.15);

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;
```

### Usage with Icons

```tsx
import { Shield, Heart, Clock } from 'lucide-react';

<TrustBadgesContainer>
  <TrustBadge>
    <Shield /> Secure Login
  </TrustBadge>
  <TrustBadge>
    <Heart /> No Spam, Ever
  </TrustBadge>
  <TrustBadge>
    <Clock /> 2 Min Setup
  </TrustBadge>
</TrustBadgesContainer>;
```

### Animation (optional)

```tsx
<TrustBadgesContainer
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
>
```

---

## Input Fields with Icons

Input fields with leading icons for visual context.

### Styled Components

```tsx
const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  align-items: center;
  pointer-events: none;

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const StyledInput = styled(Input)<{ $hasIcon?: boolean }>`
  padding-left: ${(props) => (props.$hasIcon ? '2.75rem' : '1rem')};
  // ... other styles
`;
```

### Usage

```tsx
import { Mail, Lock } from 'lucide-react';

<InputWrapper>
  <InputIcon>
    <Mail />
  </InputIcon>
  <StyledInput type="email" $hasIcon />
</InputWrapper>;
```

---

## Password Visibility Toggle

Toggle button to show/hide password input.

### Styled Component

```tsx
const PasswordToggle = styled.button`
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.25rem;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: #6b7280;
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;
```

### Usage

```tsx
import { Eye, EyeOff } from 'lucide-react';

const [showPassword, setShowPassword] = useState(false);

<InputWrapper>
  <InputIcon>
    <Lock />
  </InputIcon>
  <StyledInput type={showPassword ? 'text' : 'password'} $hasIcon />
  <PasswordToggle
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? <EyeOff /> : <Eye />}
  </PasswordToggle>
</InputWrapper>;
```

---

## Focus States with Glow

Animated glow effect on input focus for visual feedback.

### Keyframes and Styles

```tsx
import { keyframes } from 'styled-components';

const focusGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 160, 196, 0.4); }
  70% { box-shadow: 0 0 0 0.25rem rgba(0, 160, 196, 0.1); }
  100% { box-shadow: 0 0 0 0.25rem rgba(0, 160, 196, 0.1); }
`;

const StyledInput = styled(Input)`
  transition: all 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary.main};
    box-shadow: 0 0 0 0.25rem rgba(0, 160, 196, 0.1);
    animation: ${focusGlow} 0.3s ease;
  }
`;
```

---

## Card Entrance Animations

Fade-in and slide-up animation for cards and modals.

### Usage with Framer Motion

```tsx
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Card = styled(motion.div)`
  // card styles
`;

<Card
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  {children}
</Card>;
```

### Staggered Children (optional)

```tsx
// For multiple elements appearing in sequence
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};
```

---

## Button Hover Effects

Elevated button hover with lift and shadow.

### Styled Component

```tsx
const StyledButton = styled(Button)`
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 0.25rem 0.75rem rgba(0, 160, 196, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;
```

---

## Background Patterns

Subtle radial gradient pattern for visual interest.

### Styled Component

```tsx
const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(0, 160, 196, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(0, 160, 196, 0.05) 0%, transparent 50%);
  pointer-events: none;
`;
```

### Usage

Place inside a container with `position: relative` and `overflow: hidden`:

```tsx
const Main = styled.main`
  position: relative;
  overflow: hidden;
`;

<Main>
  <BackgroundPattern />
  {children}
</Main>;
```

---

## Error Boundary

Custom error page with consistent styling for route errors.

### Location

`src/components/ErrorBoundary.tsx`

### Features

- Status code display (404, 401, 403, 500)
- Contextual error messages
- Action buttons: Go Back, Refresh, Home
- Card entrance animation
- Dev-only error details (expandable)

### Router Integration

```tsx
import { ErrorBoundary } from '../components/ErrorBoundary';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      // ... routes
      {
        path: '*',
        element: <ErrorBoundary />,
      },
    ],
  },
]);
```

### Key Styled Components

```tsx
const IconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;

  svg {
    width: 2rem;
    height: 2rem;
    color: #dc2626;
  }
`;

const StatusCode = styled.span`
  font-size: 3rem;
  font-weight: 800;
  color: #e5e7eb;
  display: block;
  margin-bottom: 0.5rem;
`;
```

---

## Color Reference

| Purpose                | Color               | Hex                      |
| ---------------------- | ------------------- | ------------------------ |
| Primary                | ShiftGiving Teal    | `#00a0c4`                |
| Primary Dark           | Header Gradient End | `#0088a8`                |
| Primary Hover          | Darker Teal         | Theme-defined            |
| Focus Ring             | Teal 10%            | `rgba(0, 160, 196, 0.1)` |
| Badge Background Start | Sky 100             | `#e0f2fe`                |
| Badge Background End   | Sky 200             | `#bae6fd`                |
| Badge Border           | Sky 300             | `#7dd3fc`                |
| Badge Text             | Sky 700             | `#0369a1`                |
| Input Border           | Gray 200            | `#e5e7eb`                |
| Input Text             | Gray 800            | `#1f2937`                |
| Placeholder            | Gray 400            | `#9ca3af`                |
| Label Text             | Gray 700            | `#374151`                |
| Muted Text             | Gray 500            | `#6b7280`                |
| Error Icon             | Red 600             | `#dc2626`                |
| Error Background       | Red 50              | `#fef2f2`                |

---

## Shadow Reference

| Purpose      | Shadow                                                                      |
| ------------ | --------------------------------------------------------------------------- |
| Header       | `0 0.25rem 1rem rgba(0, 0, 0, 0.15), 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)` |
| Card         | `0 0.5rem 2rem rgba(0, 0, 0, 0.12), 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08)`  |
| Button Hover | `0 0.25rem 0.75rem rgba(0, 160, 196, 0.3)`                                  |
| Trust Badge  | `0 1px 2px rgba(14, 165, 233, 0.15)`                                        |
| Logo Text    | `0 1px 2px rgba(0, 0, 0, 0.1)`                                              |

---

## Dependencies

- `styled-components` - CSS-in-JS styling
- `framer-motion` - Animation library
- `lucide-react` - Icon library
- `react-router-dom` - Routing (for ErrorBoundary)

---

## Implementation Checklist

When applying polish to a new page:

- [ ] Header with gradient and shadow
- [ ] Bold logo with text shadow (light variant)
- [ ] Card entrance animation (fade + slide)
- [ ] Input fields with leading icons where appropriate
- [ ] Password fields with visibility toggle
- [ ] Focus states with glow animation
- [ ] Button hover lift effect
- [ ] Trust badges for key messaging
- [ ] Background pattern for visual depth
- [ ] Error boundary for route protection
- [ ] Consistent color usage from reference table
- [ ] Consistent shadow usage from reference table
