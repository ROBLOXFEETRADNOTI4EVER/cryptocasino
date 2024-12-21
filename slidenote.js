function SlideNotes(duration, fontColor, fontSize, fontWeight, smoothness, backgroundColor, borderRadius, shadow, message) {
    // Create a container for the note
    const noteContainer = document.createElement("div");
    noteContainer.textContent = message; // Dynamically set the message
    noteContainer.style.position = "fixed";
    noteContainer.style.top = "20px"; // Change to match admin.html positioning
    noteContainer.style.right = "20px"; // Align to the right for a typical toaster style
    noteContainer.style.padding = "15px 30px";
    noteContainer.style.color = fontColor;
    noteContainer.style.fontSize = fontSize;
    noteContainer.style.fontWeight = fontWeight;
    noteContainer.style.background = backgroundColor;
    noteContainer.style.borderRadius = borderRadius;
    noteContainer.style.boxShadow = shadow;
    noteContainer.style.textAlign = "center";
    noteContainer.style.zIndex = "1000"; // Ensure it appears above other elements
    noteContainer.style.transition = `opacity ${smoothness}s ease-in-out`;

    // Append to the body
    document.body.appendChild(noteContainer);

    // Fade in
    noteContainer.style.opacity = "1";

    // Fade out after the specified duration
    setTimeout(() => {
        noteContainer.style.opacity = "0";
        setTimeout(() => {
            // Remove the note after it fades out
            document.body.removeChild(noteContainer);
        }, smoothness * 1000); // Wait for the fade-out animation to complete
    }, duration * 1000);
}
