document.addEventListener("DOMContentLoaded", () => {
  load();
});
function load() {
  const imageInput = document.getElementById("imageInput");
  const uploadBtn = document.getElementById("uploadBtn");
  const imageContainer = document.getElementById("imageContainer");
  const images = JSON.parse(localStorage.getItem("uploadedImages")) || [];
  function updateLocalStorage() {
    localStorage.setItem("uploadedImages", JSON.stringify(images));
  }
  function addImageToLocalStorage(imageData) {
    images.push(imageData);
    updateLocalStorage();
  }
  function removeImageFromLocalStorage(index) {
    images.splice(index, 1);
    updateLocalStorage();
  }
  function loadImagesFromLocalStorage() {
    images.forEach((imageData) => {
      const imageWrapper = createImageWrapper(imageData);
      imageContainer.appendChild(imageWrapper);
    });
  }
  function createImageWrapper(imageData) {
    const { src, name } = imageData;
    const imageWrapper = document.createElement("figure");
    imageWrapper.className = "itemimg";
    imageWrapper.onmousemove = function (eve) {
      // Use 'eve' instead of 'e'
      var zoomer = eve.currentTarget;
      var offsetX = eve.offsetX;
      var offsetY = eve.offsetY;
      var zoomedX = (offsetX / zoomer.offsetWidth) * 100;
      var zoomedY = (offsetY / zoomer.offsetHeight) * 100;
      var zoomedSize = "200%";
      zoomer.style.backgroundPosition = zoomedX + "% " + zoomedY + "%";
      zoomer.style.backgroundSize = zoomedSize;
    };

    const uploadedImage = document.createElement("img");
    uploadedImage.src = src;
    uploadedImage.className = "uploaded-image";
    uploadedImage.draggable = true;

    const figcaption = document.createElement("figcaption");
    const downloadLink = document.createElement("a");
    downloadLink.href = src;
    downloadLink.download = name;
    const shortenedName =
      name.length > 10 ? name.substring(0, 10) + "..." : name;
    downloadLink.innerHTML = '<i class="ddown gg-software-download"></i>';
    downloadLink.className = "download-link";
    downloadLink.style.fontSize = "2px";
    //  <span class="material-symbols-outlined">delete</span>
    const delbtn = document.createElement("i");
    delbtn.className = "trashs fa fa-trash-o";
    delbtn.addEventListener("click", function () {
      const index = images.findIndex((image) => image.src === src);
      if (index !== -1) {
        removeImageFromLocalStorage(index);
        imageWrapper.remove();
      }
    });
    const btn = document.createElement("button");
    btn.className = "btns";
    btn.appendChild(downloadLink);

    figcaption.appendChild(btn);
    figcaption.appendChild(delbtn);
    imageWrapper.appendChild(figcaption);
    imageWrapper.appendChild(uploadedImage);

    return imageWrapper;
  }

  function adjustButtonMargin() {
    const uploadedImages = document.querySelectorAll('figure');
    uploadedImages.forEach(figure => {
        const image = figure.querySelector('img');
        if (image) {
            figure.style.width = `${image.width}px`;
        }
    });
}

uploadBtn.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', () => {
    const files = imageInput.files;
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = {
                src: e.target.result,
                name: file.name
            };

            addImageToLocalStorage(imageData);
            const imageWrapper = createImageWrapper(imageData);
            imageContainer.appendChild(imageWrapper);
            adjustButtonMargin();
        };
        reader.readAsDataURL(file);
    }
});

loadImagesFromLocalStorage();
adjustButtonMargin();
}