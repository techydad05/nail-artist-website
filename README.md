# 💅 Polished Perfection Nail Studio

Welcome to Polished Perfection, a stunning dark-themed website for a professional nail artist. This project showcases a modern, elegant design with beautiful purple and pink accents, built with SvelteKit and DaisyUI.

## ✨ Features

- 🌙 **Dark Theme**: Beautiful dark design with purple, pink, and cyan accents
- 📱 **Fully Responsive**: Mobile-first design that works perfectly on all devices
- 🖼️ **Image Slider**: Auto-advancing slideshow with smooth transitions
- 💅 **Service Showcase**: Interactive service cards with hover effects
- ⭐ **Customer Testimonials**: Social proof with star ratings
- 🎁 **Special Offers**: Eye-catching promotional sections
- ✨ **Smooth Animations**: Floating and sparkling effects throughout
- 🎯 **Modern UI**: Glass-morphism effects and gradient backgrounds
- 📧 **Contact Integration**: Ready for email service integration

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) - Modern web development framework
- [DaisyUI](https://daisyui.com/) - Tailwind CSS components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [EmailJS](https://www.emailjs.com/) - Email service for contact form

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd nail-artist-website
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── lib/
│   └── services/
│       └── emailService.js
├── routes/
│   ├── contact/
│   │   └── +page.svelte
│   ├── gallery/
│   │   └── +page.svelte
│   ├── services/
│   │   └── +page.svelte
│   ├── +layout.svelte
│   └── +page.svelte
├── app.css
└── app.html
```

## Customization

### Colors

The dark theme color palette is defined in `tailwind.config.js` under the `nailArtist` theme:

- **Primary**: Vibrant purple (`#8b5cf6`)
- **Secondary**: Hot pink (`#ec4899`)
- **Accent**: Cyan (`#06b6d4`)
- **Base**: Very dark gray (`#111827`)
- **Neutral**: Dark gray (`#1f2937`)

### Theme Features

- **Gradient Backgrounds**: Beautiful gradients throughout the site
- **Glass-morphism Effects**: Translucent cards with backdrop blur
- **Glow Effects**: Text shadows and glowing elements
- **Custom Scrollbar**: Styled with gradient colors
- **Hover Animations**: Transform and shadow effects on interactive elements

### Content

All content is easily customizable in the Svelte components:

- Update text in the `.svelte` files
- Replace emoji placeholders with real images
- Modify services, pricing, and descriptions

## Email Setup

The contact form uses EmailJS for email delivery. To enable real email sending:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a new service and template
3. Update the `sendContactEmail` function in `src/lib/services/emailService.js` with your EmailJS credentials
4. Uncomment the EmailJS integration code and add your service ID, template ID, and public key

## Deployment

This site can be deployed to any platform that supports SvelteKit applications:

- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [GitHub Pages](https://pages.github.com/)

For Vercel deployment:

1. Install the Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
