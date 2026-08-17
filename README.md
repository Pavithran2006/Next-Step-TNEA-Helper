# NextStep - Your Engineering Admission Guide

A comprehensive Next.js 14 application for Tamil Nadu Engineering Admissions (TNEA) counselling guidance and tools. Navigate your engineering journey with confidence.

## Features

### 🏫 College Explorer
- Comprehensive database of engineering colleges in Tamil Nadu
- Advanced filtering by course, location, college type, and NIRF ranking
- Detailed college information including fees, courses, and contact details
- Responsive card-based layout for easy browsing

### 📊 Cutoff Viewer
- Historical cutoff trends with interactive Chart.js visualizations
- Filter by college, course, and community (OC, BC, MBC, SC)
- Tabular data with trend analysis
- Compare cutoffs across multiple years (2021-2023)

### 📝 Mock Choice Filling
- Interactive drag-and-drop interface using react-beautiful-dnd
- Practice choice filling with real college data
- Save preferences to localStorage
- Export choice list as PDF using jsPDF
- Realistic simulation of TNEA counselling process

### ❓ TNEA Help Guide
- Complete step-by-step counselling guide
- Bilingual support (English & Tamil)
- Important dates and deadlines
- Required documents checklist
- Official links and helpline numbers

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: bootstrap CSS
- **Charts**: Chart.js with react-chartjs-2
- **Drag & Drop**: react-beautiful-dnd
- **PDF Export**: jsPDF
- **UI Components**: @headlessui/react
- **Language**: JavaScript/JSX

## Project Structure

```
nextstep-app/
├── app/                    # Next.js App Router pages
│   ├── layout.jsx         # Root layout
│   ├── page.jsx           # Home page
│   ├── explorer/          # College Explorer
│   ├── cutoffs/           # Cutoff Viewer
│   ├── mock/              # Mock Choice Filling
│   └── help/              # Help Guide
├── components/            # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── CollegeCard.jsx
├── public/
│   └── data/              # JSON data files
│       ├── colleges.json
│       └── cutoffs.json
└── styles/
    └── globals.css        # Global styles
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone or download the project files**
   ```bash
   # If you have the files, navigate to the project directory
   cd nextstep-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click
4. Your app will be live with automatic deployments

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Data Files

The app uses JSON files located in `/public/data/`:

- **colleges.json**: Contains engineering college information
- **cutoffs.json**: Historical cutoff data for various colleges and courses

### Adding More Data

To add more colleges or cutoff data:

1. Edit `/public/data/colleges.json` for college information
2. Edit `/public/data/cutoffs.json` for cutoff trends
3. Follow the existing data structure
4. The app will automatically load new data

## Features in Detail

### Responsive Design
- Mobile-first approach with bootstrap CSS
- Adaptive layouts for desktop, tablet, and mobile
- Touch-friendly interface for mobile devices

### Performance
- Next.js 14 optimizations
- Static JSON data loading
- Efficient component rendering
- Fast page transitions

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast colors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Important Notes

- This is an **unofficial** helper application
- Always verify information from official TNEA sources
- Cutoff data is approximate and for reference only
- For official counselling, visit anna.gov.in

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Create an issue on GitHub
- Check the Help section in the app
- Refer to official TNEA resources

---

**Made with ❤️ for aspiring engineers in Tamil Nadu**
