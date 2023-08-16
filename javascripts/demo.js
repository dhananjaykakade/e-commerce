document.addEventListener("DOMContentLoaded", function() {
  const colorSelect = document.getElementById("color");

  colorSelect.addEventListener("change", function() {
    const selectedColor = colorSelect.value;
    document.body.style.backgroundColor = selectedColor;
  });
});
