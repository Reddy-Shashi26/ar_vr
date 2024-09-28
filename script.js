const videoElement = document.getElementById('videoElement');
const canvas = document.getElementById('canvas');
const overlayVideo = document.getElementById('overlayVideo');
const qrPlaceholder = document.getElementById('qrPlaceholder');
const context = canvas.getContext('2d');
const cameraToggle = document.getElementById('cameraToggle');

let currentStream; // To hold the current camera stream
let isUsingBackCamera = true; // Start with the back camera

async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: isUsingBackCamera ? { exact: "environment" } : { exact: "user" }, // Switch camera
                width: { ideal: 320 }, // Lower width for better performance
                height: { ideal: 240 }, // Lower height for better performance
                autoFocus: true // Enable autofocus
            }
        };

        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop()); // Stop current stream
        }

        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = currentStream; // Set the source of videoElement to the stream
        videoElement.play(); // Play the video
        requestAnimationFrame(tick); // Start processing frames
    } catch (error) {
        console.error("Error accessing camera: ", error);
        alert("Could not access the camera. Please check permissions.");
    }
}

function tick() {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        // Set canvas size to video size
        canvas.height = videoElement.videoHeight;
        canvas.width = videoElement.videoWidth;

        // Draw video frame to canvas
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Get image data from canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            overlayVideo.style.display = "block"; // Show video overlay when QR is detected
        } else {
            overlayVideo.style.display = "none"; // Hide video overlay
        }
    }
    requestAnimationFrame(tick); // Keep processing frames
}
//shashi
// Start the camera when the page loads
window.onload = startCamera;

// Toggle camera when the switch is changed
cameraToggle.addEventListener('change', () => {
    isUsingBackCamera = !isUsingBackCamera; // Toggle camera state
    startCamera(); // Restart camera with new settings
});
