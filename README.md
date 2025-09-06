## ArtistsHub 🎵
    This is a practice project.
    The ArtistsHub website is a place where users can learn about artists, browse their albums, and read reviews. 
    Our goal was to create a convenient and modern platform that allows users to quickly find the information they need
    and get inspired by music.

### 🛠 Technologies Used
--------------------------------

**🇯‌🇸‌Front-end**
* HTML/CSS
* JavaScript
* Pagination
* Responsive Design

**⚒️ Utilities**
* VSCode
* Webpack
* Parcel
* [Figma](https://www.figma.com/design/QzED11W6Vgdcv6VoXtvA3h/ArtistsHub?node-id=8246-1856&t=3PD2AyWJfN3uZRdn-0)
* Git/GitHub
* Trello

**📚️ Libraries**
* [Slider: Swiper.js](https://swiperjs.com/demos)
* [Rating: css-star-rating](https://www.npmjs.com/package/css-star-rating)
  
### API Integration
Seamless integration with [SoundWave API](https://sound-wave.b.goit.study/api-docs/)
* Configurable search parameters
* Rate limiting compliance
* Response data processing

### 🎤 Artists Section
- **Artist catalog** with photos, genres, and brief information
- **Pagination** — initially displays 8 cards, "Load More" button loads additional ones
- **Modal windows** with detailed artist information
- **Dynamic data** through API for up-to-date information

**🪟 Modal window functionality**
- Detailed artist biography
- List of albums or playlists  
- Close via "×" button, click outside window, or Escape key
- Convenient navigation without leaving the page

### ℹ️ About ArtistsHub Section
- Information about the team and project
- Team photos and platform logo
- Description of the idea and project goals
- Design according to mockup for optimal UX

### 📝 Feedback Section
- **User reviews** with star ratings
- **Interactive slider** based on Swiper.js
- **Feedback form** through modal window with fields:
  - Username
  - Message text  
  - Rating (stars)
- Automatic rounding of ratings from backend
- Using css-star-rating library for rating display

### 🎨 UX/UI Features

- Responsive design for all devices
- Smooth animations and transitions
- Intuitive modal windows
- Convenient content pagination
- Interactive elements (swipe, hover effects)

### 🛠️ Installation

```bash
# Clone repository
git clone https://github.com/your-username/artistshub.git

# Navigate to project folder
cd artistshub

# Install dependencies
npm install

# Run project
npm start
```

***🤝 Contributing***

We're open to collaboration! If you have ideas or found a bug:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make a commit (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request
