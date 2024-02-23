document
.getElementById("eventForm")
.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Get the image form and image input
  const imageForm = document.getElementById("imageForm");
  const imageInput = document.getElementById("image");

  // Check if the event form is valid
  if (!event.target.checkValidity()) {
    // The event form is not valid, display an error message or handle validation logic
    console.log(
      "Please fill in all required fields in the event form."
    );
    return;
  }

  // Check if the image form is valid
  if (!imageForm.checkValidity()) {
    // The image form is not valid, display an error message or handle validation logic
    console.log("Please select an image file.");
    return;
  }

  // Upload the image and get the image filename
  try {
    const formData = new FormData(imageForm);
    const response = await fetch("/events/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        "Image upload failed with status " + response.status
      );
    }

    const data = await response.text();
    const imageFilename = data; // Assuming the response is a plain text with the image filename

    console.log(imageFilename);

    // Set the image filename in the event form
    const eventForm = document.getElementById("eventForm");
    const imageFilenameInput = document.createElement("input");
    imageFilenameInput.type = "hidden";
    imageFilenameInput.name = "imageFilename";
    imageFilenameInput.value = imageFilename;
    eventForm.appendChild(imageFilenameInput);

    // Submit the event form
    eventForm.submit();
  } catch (error) {
    console.error(error);
  }
});