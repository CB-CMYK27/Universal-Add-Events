# Event QR Generator PWA

A Progressive Web App that creates QR codes for calendar events. Users can scan the QR code to add events to their calendar, or download the ICS file directly.

## Features

- Create calendar events with title, location, description, start and end times
- Generate QR codes that contain the event details
- Download QR codes as PNG images
- Download ICS calendar files for direct import
- Works offline once installed
- Mobile-friendly responsive design
- Installable as a standalone app

## Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Upload all files from this directory to the repository
3. Go to repository Settings > Pages
4. Under "Source", select "Deploy from a branch"
5. Select the branch (usually `main` or `master`) and folder (root `/`)
6. Click Save
7. Your PWA will be available at `https://[username].github.io/[repository-name]/`

## Local Development

Simply open `index.html` in a modern web browser. For full PWA functionality (including service worker), you'll need to serve it over HTTPS or localhost.

You can use Python's built-in server:
```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

## Usage

1. Fill in the event details:
   - Event title (required)
   - Location (optional)
   - Description (optional)
   - Start date and time (required)
   - End date and time (required)

2. Click "Generate QR Code"

3. The QR code will appear below the form

4. You can then:
   - Download the QR code as a PNG image to share with others
   - Download the ICS file to add the event to your own calendar
   - Share the QR code for others to scan and add to their calendars

## Browser Compatibility

Works on all modern browsers that support:
- Service Workers
- Canvas API
- Blob API
- File downloads

Tested on Chrome, Firefox, Safari, and Edge.

## Technical Details

- Pure HTML, CSS, and JavaScript (no build process required)
- Uses QRCode.js library for QR code generation
- Creates standard ICS (iCalendar) files compatible with all major calendar applications
- Service worker provides offline functionality
- Responsive design works on mobile and desktop

## License

Free to use and modify for any purpose.
