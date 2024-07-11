const progress = document.querySelector("#progress");
const prev = document.querySelector("#prev");
const next = document.querySelector("#next");
const circles = document.querySelectorAll(".circle");
const stepContainers = document.querySelectorAll(".step-container");

let currentStep = 1;

next.addEventListener("click", () => {
  currentStep++;

  if (currentStep > circles.length) {
    currentStep = circles.length;
  }

  update();
});

prev.addEventListener("click", () => {
  currentStep--;

  if (currentStep < 1) {
    currentStep = 1;
  }

  update();
});

function update() {
    circles.forEach((circle, idx) => {
      if (idx < currentStep) {
        circle.classList.add("active");
      } else {
        circle.classList.remove("active");
      }
    });
  
    stepContainers.forEach((container, idx) => {
      if (idx === currentStep - 1  ) {
        container.style.display = "block";
      } else {
        container.style.display = "none";
      }
    });
  
    if (currentStep === circles.length) {
      progress.style.width = "100%";
    } else {
      progress.style.width = ((currentStep - 1) / (circles.length - 1)) * 100 + "%";
    }
  
    if (currentStep === 1 ) {
      prev.disabled = true;
      progress.style.width = "0%";
    } else if (currentStep === circles.length  ) {
      next.disabled = true;
    } else if (go=== true ) {
      next.disabled = true;
      
   
    } else {
      prev.disabled = false;
      next.disabled = false;
    }
  }
      

update(); // Initial update to set up the progress and button states



