async function uploadImage() {
    const fileInput = document.getElementById("imageInput");
    if (fileInput.files.length === 0) {
        alert("Please select an image first!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
        const base64Data = reader.result.split(",")[1];

        const response = await fetch("https://api.github.com/repos/radheeshm/stock/contents/images/" + file.name, {
            method: "PUT",
            headers: {
                "Authorization": "token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Upload new image",
                content: base64Data
            })
        });

        if (response.ok) {
            alert("Image uploaded successfully!");
            loadImages();
        } else {
            alert("Upload failed: " + response.statusText);
        }
    };
}

async function loadImages() {
    const response = await fetch("https://api.github.com/repos/radheeshm/stock/contents/images/");
    const images = await response.json();

    const gallery = document.getElementById("imageGallery");
    gallery.innerHTML = "";

    images.forEach(image => {
        if (image.download_url) {
            const imgElement = document.createElement("img");
            imgElement.src = image.download_url;
            gallery.appendChild(imgElement);
        }
    });
}

loadImages();
