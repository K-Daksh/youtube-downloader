async function downloadVideo(quality) {
    // console.log(window.location.href);
    const serverUrl = 'http://localhost:5000/api/get-info'; // Adjust the port to 5000 as per Flask app

    try {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // url: window.location.href,  // Replace with a valid video URL
                url: 'https://www.youtube.com/watch?v=EaOqFvQdZ1k',  // Replace with a valid video URL
                // quality: quality // Video quality parameter (without the 'p')
            }),
        });

        // If response is successful, show the result
        if (response.ok) {
            const data = await response.json(); // Parse the JSON response
            // alert('Response:', JSON.stringify(data)); // Show response
            console.log(data);
        } else {
            console.log('failed');
        }
    } catch (error) {
        console.log('failed');
    }
}


downloadVideo('1080');
