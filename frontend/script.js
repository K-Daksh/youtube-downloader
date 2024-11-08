let button;
let modal;
let quality = "720";


async function downloadVideo(q) {
    const quality = String(q);
    console.log(window.location.href);
    const serverUrl = 'http://localhost:5000/api/download';

    try {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: window.location.href,
                quality: quality
            }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Response:', JSON.stringify(data));
            alert('Download Complete!');
        } else {
            console.log('Failed to download video. Status:', response.status);
        }
    } catch (error) {
        console.log('Error occurred:', error.message);
    }
}

async function getInfo() {
    console.log(window.location.href);
    const serverUrl = 'http://localhost:5000/api/get-info';

    try {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: window.location.href,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            return ["error: can't get qualities"];
        }
    } catch (error) {
        return ["error: URL not found"];
    }
}



function coverButton() {
    var element = document.querySelector('.style-scope.ytd-download-button-renderer');
    if (element) {
        var rect = element.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0 && rect.top === 0 && rect.left === 0) {
            if (button) {
                document.body.removeChild(button);
                button = null;
            }
            return;
        }
        if (button) {
            document.body.removeChild(button);
        }

        button = document.createElement('button');
        button.innerHTML = "Download";
        button.style.position = "absolute";
        button.style.top = `${rect.top + window.scrollY}px`;
        button.style.left = `${rect.left + window.scrollX}px`;
        button.style.width = `${rect.width}px`;
        button.style.height = `${rect.height}px`;
        button.style.backgroundColor = "#ee0979";
        button.style.background = "linear-gradient(to right, #ff6a00, #ee0979)";
        button.style.color = "#FFFFFF";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.zIndex = "2";
        button.style.borderRadius = "20px";
        button.style.fontWeight = "bold";

        // Add event listener to open the modal on button click
        button.addEventListener("click", function () {
            openModal();
        });

        document.body.appendChild(button);
        // console.log("Button added at the element's position.");
    } else {
        if (button) {
            document.body.removeChild(button);
            button = null;
        }
        // console.log("Element not found!");
    }
}

// Function to create and open the modal
async function openModal() {
    modal = document.createElement('div');
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
    modal.style.zIndex = "9999"; // Ensure it is on top

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.position = "absolute";
    modalContent.style.top = "50%";
    modalContent.style.left = "50%";
    modalContent.style.transform = "translate(-50%, -50%)";
    modalContent.style.backgroundColor = "#FFFFFF";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "10px";
    modalContent.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    modalContent.style.height = "50%";
    modalContent.style.width = "50%";
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const loader = document.createElement('div');
    loader.innerHTML = "Loading...";
    loader.style.fontSize = "20px";
    loader.style.color = "#000";
    loader.style.textAlign = "center";
    loader.style.marginTop = "20%";

    modalContent.appendChild(loader);

    // Wait for the data (show loader)
    let qualityList;
    try {
        qualityList = await getInfo();
    } catch (error) {
        if (modal) {
            document.body.removeChild(modal);
            modal = null;
        };
        alert("Please Download or start the windows helper!");
    }

    // Remove loader after data is loaded
    modalContent.removeChild(loader);

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.style.width = "30px"
    closeButton.innerHTML = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    // closeButton.style.backgroundColor = "red";
    closeButton.style.color = "#272727";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "25px";

    closeButton.addEventListener("click", function () {
        document.body.removeChild(modal);
        modal = null; // Clear modal reference
    });

    const flexContainer = document.createElement('div');
    flexContainer.style.display = "flex";
    flexContainer.style.justifyContent = "space-around";
    flexContainer.style.marginTop = "20px";

    // Create dropdown menus
    const dropdown1 = document.createElement('select');
    dropdown1.style.marginTop = "3%";
    dropdown1.style.padding = "20px";
    dropdown1.style.textAlign = "center";
    dropdown1.style.backgroundColor = "#272727";
    dropdown1.style.color = "#FFFFFF";
    dropdown1.style.border = "none";
    dropdown1.style.borderRadius = "25px";
    dropdown1.style.width = "100%";


    try {
        qualityList.available_qualities.forEach(quality => {
            if (quality >= 144) {
                const option = document.createElement('option');
                option.text = `${quality}p`;
                option.value = quality;
                dropdown1.add(option);
            }
        });
    } catch {
        if (modal) {
            document.body.removeChild(modal);
            modal = null;
        };
        alert("Please Download or start the windows helper!");
    }
    dropdown1.addEventListener('change', function () {
        quality = dropdown1.value;
        console.log('Selected Quality:', quality);
    });
    // Append dropdowns to the flex container
    flexContainer.appendChild(dropdown1);
    // Create heading
    const heading = document.createElement('h1');
    heading.innerHTML = "Download this video.";
    heading.style.color = "#272727";
    heading.style.textAlign = "center";
    heading.style.fontSize = "50px";
    heading.style.marginTop = "4%";
    heading.style.marginBottom = "20px";


    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = "Download";
    downloadButton.style.padding = "20px";
    downloadButton.style.backgroundColor = "#272727";
    downloadButton.style.color = "#FFFFFF";
    downloadButton.style.border = "none";
    downloadButton.style.cursor = "pointer";
    downloadButton.style.borderRadius = "25px";
    downloadButton.style.width = "100%";
    downloadButton.style.marginTop = "3%"

    downloadButton.addEventListener("click", async function () {
        if (modal) {
            document.body.removeChild(modal);
            modal = null;
        }
        alert("Download Started.");
        await downloadVideo(quality);
    });

    modalContent.appendChild(closeButton);
    modalContent.appendChild(heading);
    modalContent.appendChild(flexContainer);
    modalContent.appendChild(downloadButton);
}


window.addEventListener('load', function () {
    setInterval(coverButton, 1000);
});
