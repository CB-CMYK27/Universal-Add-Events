// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    });
}

// Global variables
let qrCodeInstance = null;
let currentEventData = null;

// Form elements
const eventForm = document.getElementById('eventForm');
const qrSection = document.getElementById('qrSection');
const qrCodeDiv = document.getElementById('qrcode');
const errorDiv = document.getElementById('error');
const downloadQRBtn = document.getElementById('downloadQR');
const downloadICSBtn = document.getElementById('downloadICS');

// Set default dates (today and one hour from now)
function setDefaultDates() {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    document.getElementById('startDate').valueAsDate = now;
    document.getElementById('startTime').value = now.toTimeString().slice(0, 5);
    
    document.getElementById('endDate').valueAsDate = oneHourLater;
    document.getElementById('endTime').value = oneHourLater.toTimeString().slice(0, 5);
}

// Format date for ICS file
function formatDateForICS(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

// Create ICS file content
function createICS(eventData) {
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Event QR Generator//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@event-qr-generator`,
        `DTSTAMP:${formatDateForICS(new Date())}`,
        `DTSTART:${formatDateForICS(eventData.startDate)}`,
        `DTEND:${formatDateForICS(eventData.endDate)}`,
        `SUMMARY:${eventData.title}`,
        eventData.location ? `LOCATION:${eventData.location}` : '',
        eventData.description ? `DESCRIPTION:${eventData.description.replace(/\n/g, '\\n')}` : '',
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT',
        'END:VCALENDAR'
    ].filter(line => line).join('\r\n');
    
    return icsContent;
}

// Show error message
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('active');
    setTimeout(() => {
        errorDiv.classList.remove('active');
    }, 5000);
}

// Parse form data
function parseFormData() {
    const title = document.getElementById('title').value.trim();
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    
    const startDateValue = document.getElementById('startDate').value;
    const startTimeValue = document.getElementById('startTime').value;
    const endDateValue = document.getElementById('endDate').value;
    const endTimeValue = document.getElementById('endTime').value;
    
    if (!title || !startDateValue || !startTimeValue || !endDateValue || !endTimeValue) {
        throw new Error('Please fill in all required fields');
    }
    
    const startDate = new Date(`${startDateValue}T${startTimeValue}`);
    const endDate = new Date(`${endDateValue}T${endTimeValue}`);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date or time format');
    }
    
    if (endDate <= startDate) {
        throw new Error('End date must be after start date');
    }
    
    return {
        title,
        location,
        description,
        startDate,
        endDate
    };
}

// Generate QR code
function generateQRCode(eventData) {
    const icsContent = createICS(eventData);
    
    // Clear previous QR code
    qrCodeDiv.innerHTML = '';
    
    // Create new QR code
    qrCodeInstance = new QRCode(qrCodeDiv, {
        text: icsContent,
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L
    });
    
    // Show QR section
    qrSection.classList.add('active');
    qrSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Download QR code as PNG
function downloadQRCode() {
    const canvas = qrCodeDiv.querySelector('canvas');
    if (!canvas) {
        showError('QR code not generated yet');
        return;
    }
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentEventData.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Download ICS file
function downloadICS() {
    if (!currentEventData) {
        showError('No event data available');
        return;
    }
    
    const icsContent = createICS(currentEventData);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentEventData.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Form submit handler
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    try {
        currentEventData = parseFormData();
        generateQRCode(currentEventData);
    } catch (error) {
        showError(error.message);
    }
});

// Download button handlers
downloadQRBtn.addEventListener('click', downloadQRCode);
downloadICSBtn.addEventListener('click', downloadICS);

// Initialize
setDefaultDates();
