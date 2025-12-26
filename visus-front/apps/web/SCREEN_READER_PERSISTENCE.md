# Screen Reader Persistence - Usage Guide

## ✅ Implementation Complete

The screen reader now **persists across all pages** in your application!

## How It Works

The screen reader functionality has been moved to a **global context** (`AccessibilityContext`) that wraps the entire application at the root level. This means:

- ✅ Settings are maintained when navigating between pages
- ✅ Screen reader continues to work on all pages
- ✅ Visual focus indicator follows you everywhere
- ✅ All settings persist in localStorage
- ✅ No need to re-enable after navigation

## Architecture

```
Root Component (__root.tsx)
├── AuthProvider
└── AccessibilityProvider ← Screen Reader lives here!
    ├── Settings State (global)
    ├── useScreenReader Hook (active everywhere)
    └── useFocusIndicator Hook (active everywhere)
        └── All Pages
            ├── Accessibility Settings Page
            ├── Home Page
            ├── Dashboard
            └── Any Other Page
```

## Using Accessibility Features in Your Components

### 1. Access Settings Anywhere

```tsx
import { useAccessibility } from '../contexts/AccessibilityContext';

function MyComponent() {
  const { settings, setSettings, speak, stop } = useAccessibility();

  return (
    <button onClick={() => speak('Hello!')}>
      Say Hello
    </button>
  );
}
```

### 2. Add Status Indicator to Any Page

```tsx
import { ScreenReaderStatus } from '../components/ScreenReaderStatus';

function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <ScreenReaderStatus /> {/* Floating toggle button */}
    </div>
  );
}
```

### 3. Create Accessible Buttons

```tsx
import { AccessibleButton } from '../components/ScreenReaderStatus';

function MyForm() {
  return (
    <AccessibleButton onClick={() => console.log('Clicked!')}>
      Submit Form
    </AccessibleButton>
  );
}
```

## Files Modified

### New Files:
- ✅ `src/contexts/AccessibilityContext.tsx` - Global state management
- ✅ `src/components/ScreenReaderStatus.tsx` - Reusable status widget

### Modified Files:
- ✅ `src/routes/__root.tsx` - Added AccessibilityProvider
- ✅ `src/routes/_private/-pages/acessibilidade.tsx` - Now uses context instead of local state

## Key Benefits

### Before (Local State):
- ❌ Screen reader only worked on accessibility page
- ❌ Settings lost when navigating away
- ❌ Had to re-enable on each page

### After (Global Context):
- ✅ Screen reader works on ALL pages
- ✅ Settings persist across navigation
- ✅ One-time setup, always active
- ✅ Can access speak() function from any component
- ✅ Centralized state management

## Testing

1. **Navigate to Accessibility Page**
   - Enable screen reader
   - Adjust settings (rate, pitch, volume)

2. **Navigate to Another Page**
   - Screen reader should still be active
   - Try tabbing through elements
   - Hear announcements on all pages

3. **Refresh Browser**
   - Settings should persist (localStorage)
   - Screen reader auto-activates if it was on

4. **Toggle from Any Page**
   - Add `<ScreenReaderStatus />` to any component
   - Quick toggle without going to settings

## API Reference

### useAccessibility()

Returns an object with:

```typescript
{
  settings: AccessibilitySettings,      // Current settings
  setSettings: (settings) => void,      // Update settings
  resetSettings: () => void,            // Reset to defaults
  speak: (text: string, interrupt?: boolean) => void,  // Speak text
  stop: () => void,                     // Stop speaking
  isSupported: boolean                  // Browser support check
}
```

### AccessibilitySettings Type

```typescript
{
  screenReader: boolean;      // Enable/disable screen reader
  fontSize: number;           // 12-24px
  zoom: number;               // 80-150%
  bold: boolean;              // Bold text
  highContrast: boolean;      // High contrast mode
  mode: "light" | "dark";     // Theme mode
  speechRate: number;         // 0.5-2.0
  speechPitch: number;        // 0.5-2.0
  speechVolume: number;       // 0-1
}
```

## Examples

### Example 1: Announce Page Load

```tsx
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useEffect } from 'react';

function Dashboard() {
  const { speak } = useAccessibility();

  useEffect(() => {
    speak('Dashboard carregado');
  }, []);

  return <div>Dashboard Content</div>;
}
```

### Example 2: Announce Form Errors

```tsx
function LoginForm() {
  const { speak } = useAccessibility();
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      speak(`Erro: ${error}`, true);
    }
  }, [error, speak]);

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Example 3: Custom Navigation Announcements

```tsx
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useLocation } from '@tanstack/react-router';

function Layout() {
  const { speak } = useAccessibility();
  const location = useLocation();

  useEffect(() => {
    const pageName = location.pathname.split('/').pop() || 'home';
    speak(`Navegado para página ${pageName}`);
  }, [location.pathname, speak]);

  return <>{/* layout content */}</>;
}
```

## Troubleshooting

### Screen Reader Not Working on New Pages?

Check that `AccessibilityProvider` is at the root level in `__root.tsx`:

```tsx
<AuthProvider>
  <AccessibilityProvider>  ← Must be here!
    <Outlet />
  </AccessibilityProvider>
</AuthProvider>
```

### Settings Not Persisting?

- Check browser localStorage is enabled
- Check for console errors
- Verify localStorage key: `a11y_settings_v1`

### Want to Disable on Specific Pages?

```tsx
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useEffect } from 'react';

function VideoPlayerPage() {
  const { settings, setSettings } = useAccessibility();

  useEffect(() => {
    // Temporarily disable screen reader for video
    const wasEnabled = settings.screenReader;
    setSettings(s => ({ ...s, screenReader: false }));

    return () => {
      // Re-enable when leaving page
      if (wasEnabled) {
        setSettings(s => ({ ...s, screenReader: true }));
      }
    };
  }, []);

  return <div>Video Player</div>;
}
```

## Next Steps

1. ✅ Screen reader now works globally
2. Consider adding `<ScreenReaderStatus />` to main layout
3. Add speak() announcements to key user actions
4. Test navigation across all pages
5. Gather user feedback on announcements

---

**Status**: ✅ **Fully Functional and Global**

The TalkBack-like screen reader now persists across your entire application!
