document.addEventListener("DOMContentLoaded", () => {
  loadContent();
});
function loadContent() {
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
    downloadLink.innerHTML =
      '<span class="material-symbols-outlined"> download </span>';
    downloadLink.className = "download-link";

    //  <span class="material-symbols-outlined">delete</span>
    const delbtn = document.createElement("i");
    delbtn.className = "trashs fa fa-trash-o";
    delbtn.addEventListener("click", function () {
      const index = images.findIndex((image) => image.src === src);
      if (index !== -1) {
        confirm("Delete ?");
        removeImageFromLocalStorage(index);
        imageWrapper.remove();
      }
    });
    const btn = document.createElement("button");
    btn.className = "btns";
    btn.appendChild(downloadLink);

    figcaption.appendChild(btn);
    figcaption.appendChild(delbtn);
    imageWrapper.appendChild(uploadedImage);
    imageWrapper.addEventListener("mousemove", (eva) =>{
        var zoomer = eva.currentTarget;
        var offsetX = e.offsetX;
        var offsetY = e.offsetY;
        var zoomedX = (offsetX / zoomer.offsetWidth) * 100;
        var zoomedY = (offsetY / zoomer.offsetHeight) * 100;
        var zoomedSize = "200%";
        zoomer.style.backgroundPosition = zoomedX + "% " + zoomedY + "%";
        zoomer.style.backgroundSize = zoomedSize;
      
    });
    imageWrapper.appendChild(figcaption);

    return imageWrapper;
  }

  function adjustButtonMargin() {
    const uploadedImages = document.querySelectorAll("figure");
    uploadedImages.forEach((figure) => {
      const image = figure.querySelector("img");
      if (image) {
        figure.style.width = `${image.width}px`;
      }
    });
  }
  //                 const uploadedImages = document.querySelectorAll('.uploaded-image');
  //                 uploadedImages.forEach(image => {
  //                     const fi = image.parentElement.querySelector('.btns');

  //                    // if (image.width < 300) {
  //                         // fi.style.marginRight = '120px';
  //                         // image.parentElement.querySelector('.download-link').style.fontSize = '17px';
  //                         // image.parentElement.querySelector('.download-link').style.fontWeight = '700';
  //                         // image.parentElement.querySelector('.trashs').style.right = '120px';
  //                     // image.parentElement.querySelector('figure').style.gridTemplateRows='270px';
  //                     const figureElement = image.querySelector('figure');
  //                     console.log(figureElement);
  // if (figureElement) {
  //     figureElement.style.width = `${image.width}px`;
  // }
  //  else {   fi.style.marginRight = '0px';
  //                     }
  //                 });

  uploadBtn.addEventListener("click", () => {
    imageInput.click();
    createImageWrapper(imageData);

    // Trigger the file input click event
  });
  imageInput.addEventListener("change", () => {
    const files = imageInput.files;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = {
          src: e.target.result,
          name: file.name,
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
  adjustButtonMargin(); // Adjust button margin when loading existing images
}
