# Theme Configuration Guide

This guide explains how to change the website's color scheme and background effects.

## Overview

The website now uses a centralized theme system that makes it easy to change colors across all pages without editing individual HTML files.

## Files Structure

- `JS/theme-config.js` - Contains all theme colors and Vanta.js configuration
- `JS/vanta-background.js` - Handles the animated background initialization
- All HTML files now reference these centralized files

## How to Change Colors

### 1. Edit Theme Colors

Open `JS/theme-config.js` and modify the color values in the `THEME_CONFIG` object:

```javascript
const THEME_CONFIG = {
  light: {
    highlightColor: 0xffffff, // Light theme highlight color
    midtoneColor: 0x954f6c, // Light theme midtone color
    lowlightColor: 0xffffff, // Light theme lowlight color
    baseColor: 0xffffff, // Light theme base color
  },
  dark: {
    highlightColor: 0x6e2b62, // Dark theme highlight color
    midtoneColor: 0x1f162f, // Dark theme midtone color
    lowlightColor: 0x080707, // Dark theme lowlight color
    baseColor: 0x080707, // Dark theme base color
  },
};
```

### 2. Color Format

Colors are specified in hexadecimal format with the `0x` prefix:

- `0xffffff` = White
- `0x000000` = Black
- `0xff0000` = Red
- `0x00ff00` = Green
- `0x0000ff` = Blue

### 3. Vanta.js Settings

You can also modify the Vanta.js animation settings in the same file:

```javascript
const VANTA_CONFIG = {
  el: "body",
  mouseControls: true,
  touchControls: true,
  gyroControls: true,
  minHeight: 1000.0,
  minWidth: 1000.0,
  speed: 2.5, // Animation speed
  zoom: 1.6, // Zoom level
};
```

## Current Dark Theme Colors

The current dark theme uses these colors (from index.html):

- **Highlight Color**: `0x6e2b62` (Deep Plum)
- **Midtone Color**: `0x1f162f` (Midnight Purple)
- **Lowlight Color**: `0x080707` (True Black)
- **Base Color**: `0x080707` (True Black)

## Benefits

1. **Centralized Management**: Change colors in one place, affects all pages
2. **Consistency**: All pages use the same color scheme
3. **Easy Maintenance**: No need to edit multiple HTML files
4. **Theme Switching**: Automatic theme switching between light and dark modes

## Testing Changes

After making changes to `JS/theme-config.js`:

1. Save the file
2. Refresh any page on the website
3. Toggle between light and dark themes to see the changes
4. All pages should reflect the new colors

## Files Affected

The following files now use the centralized theme system:

- `index.html`
- `about.html`
- `contact.html`
- `designs.html`
- `project-agile-hrms.html`
- `project-it-incidents.html`
- `project-quick-mic-drop.html`
