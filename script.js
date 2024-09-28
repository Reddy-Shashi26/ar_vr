const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvas');
const canvas = canvasElement.getContext('2d');
const overlayVideo = document.getElementById('overlayVideo');
const scanElement = document.querySelector('.scan'); // Reference to the scanning animation element

// Access the camera with back camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
        videoElement.srcObject = stream;
        videoElement.play();
    })
    .catch(err => {
        console.error('Error accessing camera: ', err);
    });

// Function to check for QR code
function tick() {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        canvasElement.height = videoElement.videoHeight;
        canvasElement.width = videoElement.videoWidth;
        canvas.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, canvasElement.width, canvasElement.height);

        if (code) {
            console.log('QR Code scanned: ', code.data);
            overlayVideo.style.display = 'block'; // Show the video
            overlayVideo.play(); // Play the video

            // Stop the scanning animation
            scanElement.style.animation = 'none'; // Stop the animation
            scanElement.style.background = 'transparent'; // Optionally, hide the scan bar
        } else {
            // If no QR code is detected, restart the animation if needed
            scanElement.style.animation = ''; // Restart the animation if desired
            scanElement.style.background = 'linear-gradient(cyan, transparent)';
        }
    }
    requestAnimationFrame(tick);
}

// Start the scanning loop
requestAnimationFrame(tick);
