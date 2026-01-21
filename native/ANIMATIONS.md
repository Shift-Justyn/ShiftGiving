# Animation Implementation Guide

This document describes all animations and visual polish added to the GivingApp native app using Moti and React Native Reanimated.

## Architecture

The native app uses:
- **Moti**: Declarative animation library for entrance/exit animations
- **React Native Reanimated**: Gesture and press interaction animations
- **Expo Router**: Screen transition animations
- **Animation Defaults**: Centralized configuration in `src/theme/animations.ts`

## Configured Dependencies

### Babel Configuration
The project includes a `babel.config.js` that configures:
1. Tamagui babel plugin for component optimization
2. React Native Reanimated plugin (required for gesture support)

### App Configuration
`app.json` includes the `react-native-reanimated/plugin` for proper setup.

## Animation Components

### 1. Card Animations (CampaignCard, OrganizationCard)

**Location**: `src/components/campaigns/CampaignCard.tsx`, `src/components/organizations/OrganizationCard.tsx`

**Features**:
- Fade-in on mount with staggered delay based on list position
- Scale down to 0.98 on press with spring physics
- Scale back to 1.0 on release
- Stagger delay: `index * 100ms` (100ms per card)

**Animation Properties**:
```typescript
from: { opacity: 0, translateY: 20 }
animate: { opacity: 1, translateY: 0 }
duration: 500ms
```

**Press Interaction**:
- Uses `useSharedValue` and `useAnimatedStyle` for smooth press feedback
- Spring configuration: damping: 10, mass: 1

### 2. Progress Bar Animation (CampaignProgress)

**Location**: `src/components/campaigns/CampaignProgress.tsx`

**Features**:
- Animates width from 0% to actual percentage on mount
- Spring animation for natural, bouncy feel
- Duration: 800ms

**Animation Properties**:
```typescript
from: { width: '0%' }
animate: { width: `${percentage}%` }
type: 'spring'
duration: 800ms
damping: 12
```

### 3. Button Animations (Button)

**Location**: `src/components/ui/Button.tsx`

**Features**:
- Entrance fade-in animation (300ms)
- Scale down to 0.96 on press
- Animated loading spinner (360-degree rotation)
- Smooth press feedback with spring physics

**Loading Spinner**:
```typescript
from: { rotate: '0deg' }
animate: { rotate: '360deg' }
duration: 1000ms (looping)
```

**Press Feedback**:
- Spring animation on press in/out
- Scale range: 1.0 to 0.96

### 4. Tab Icon Animations

**Location**: `app/(tabs)/_layout.tsx`

**Features**:
- Icons scale from 0.8 to 1.0 on tab activation
- Opacity animates from 0 to 1
- Spring animation for smooth appearance
- Applied to all navigation tab icons

**Animation Properties**:
```typescript
from: { scale: 0.8, opacity: 0 }
animate: { scale: 1, opacity: 1 }
type: 'spring'
```

### 5. Screen Transition Animations

**Location**: `app/_layout.tsx`

**Features**:
- Fade-in animations for all screen transitions
- Applied to auth, tabs, campaigns, organizations, and detail screens
- Smooth opacity transitions

**Configuration**:
```typescript
cardStyleInterpolator: ({ current }) => ({
  cardStyle: { opacity: current.progress },
})
```

### 6. Skeleton Loaders (Skeleton, SkeletonCard)

**Location**: `src/components/ui/Skeleton.tsx`

**Features**:
- Shimmer animation effect (pulse between 0.6 and 1.0 opacity)
- Custom width, height, and border radius support
- Pre-built SkeletonCard component for campaign/organization cards
- Uses LinearGradient for shimmer effect

**Animation Properties**:
```typescript
from: { opacity: 0.6 }
animate: { opacity: 1 }
duration: 800ms (looping)
```

**SkeletonCard Structure**:
- Image placeholder (140px height)
- Title skeleton (80% width, 16px height)
- Progress bar skeleton (100% width, 8px height)
- Meta text skeleton (50% width, 14px height)
- Description skeleton (100% width, 12px height)

### 7. List Animations (HomeScreen)

**Location**: `app/(tabs)/index.tsx`

**Features**:
- Staggered entrance animation for list items
- Each card animates with a delay based on its index
- Skeleton placeholders shown during loading
- Smooth list scroll with momentum

**Implementation**:
```typescript
<CampaignCard campaign={item} onPress={handleCampaignPress} index={index} />
```

## Animation Utilities

**Location**: `src/theme/animations.ts`

Centralized animation configurations:

1. **animationDefaults**: Global timing and spring config
2. **cardAnimation**: Standard card entrance animation
3. **progressAnimation**: Progress bar spring config
4. **pressAnimation**: Button press feedback
5. **scaleOnPressAnimation**: Card press feedback
6. **spinAnimation**: Loading spinner rotation
7. **fadeInAnimation**: General fade-in
8. **shimmerAnimation**: Skeleton loader shimmer

## Testing

All animation components include tests verifying:
- Animation components render correctly
- Animations render without errors
- Loading states display skeletons
- Press interactions work as expected
- Stagger delays apply correctly

**Test Files**:
- `src/components/campaigns/__tests__/CampaignCard.test.tsx`
- `src/components/campaigns/__tests__/CampaignProgress.test.tsx`
- `src/components/ui/__tests__/Button.test.tsx`
- `src/components/ui/__tests__/Skeleton.test.tsx`
- `src/components/organizations/__tests__/OrganizationCard.test.tsx`

## Performance Considerations

1. **Moti vs Reanimated Trade-offs**:
   - Moti: Simple entrance/exit animations, good for initial renders
   - Reanimated: Complex gestures and continuous interactions

2. **Spring Physics**:
   - All spring animations use consistent damping: 10
   - Mass: 1 for responsive feel
   - No overshoot clamping for natural bounce

3. **Duration Consistency**:
   - Card entrance: 500ms
   - Progress animation: 800ms
   - Button press: Instant spring response
   - Loading spinner: 1000ms rotation

## Best Practices

1. **Index Prop**: Pass `index` to `CampaignCard` and `OrganizationCard` for stagger effect
2. **Skeleton Usage**: Show skeleton placeholders during data loading
3. **Press Feedback**: All interactive elements should have scale feedback
4. **Screen Transitions**: Fade animations apply by default for all navigation

## Integration Points

### HomeScreen Changes
- Updated to pass `index` prop to cards
- Skeleton cards shown during loading
- Stagger animations applied automatically

### Component Updates
- `CampaignCard`: Added Moti wrapper and press animation
- `OrganizationCard`: Added animations matching CampaignCard
- `Button`: Enhanced with scale and loading spinner animation
- `CampaignProgress`: Progress fill animates with spring

## Future Enhancements

Potential animation improvements:
1. Pull-to-refresh with custom indicator
2. Swipe gestures for card navigation
3. Expandable campaign details animation
4. Toast notification animations
5. Modal entrance/exit animations
6. Gesture-based back button animation

## Validation

All animations have been validated for:
- Smooth performance (60fps target)
- No jank or stuttering
- Responsive press feedback
- Proper loading state visualization
- Cross-platform compatibility (iOS/Android)

## Resources

- **Moti Documentation**: https://moti.fyi
- **React Native Reanimated**: https://docs.swmansion.com/react-native-reanimated
- **Expo Router**: https://docs.expo.dev/routing/introduction
- **Animation Principles**: Carbon Design System animations

## Configuration Files

- `babel.config.js`: Babel plugin configuration
- `app.json`: Expo Router and Reanimated setup
- `tamagui.config.ts`: Tamagui component styling
- `src/theme/animations.ts`: Centralized animation defaults
