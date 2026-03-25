# Chroma

A Pinterest-inspired visual discovery app that allows users to explore aesthetic imagery using search and color-based discovery.

**Live Demo:** https://chroma-mu.vercel.app
**GitHub:** https://github.com/islanddxo/chroma  

---

## Overview

Chroma reimagines image discovery by combining traditional search with intuitive color exploration. Users can browse images, filter by color, and seamlessly explore content through an infinite scrolling experience.

---

## Key Features

- **Search + discovery** — Dynamic search powered by the Unsplash API  
- **Color-based filtering** — Hex color picker with custom mapping logic  
- **Infinite scrolling** — Seamless loading using Intersection Observer  
- **Theme browsing** — Category-based discovery (art, fashion, nature, etc.)  
- **Light / dark mode** — Persisted UI preferences  
- **Ambient UI effects** — Dynamic gradient glow based on selected color  

---

## Technical Highlights

- Implemented **infinite scroll** using Intersection Observer  
- Built a **hex → color mapping system** to work with API limitations  
- Designed **fallback logic** when strict color filtering returns no results  
- Managed multiple UI states (search, theme, color, pagination)  
- Focused on **UX decisions** (hidden queries, smooth interactions)

---

## Tech Stack

- JavaScript (ES6+)
- React 18
- Vite
- Unsplash API
- CSS 

