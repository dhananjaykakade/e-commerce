const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
            entry.target.classList;add('show');
        }else{
            entry.target.classList;remove('show');
        };
  });
});


const hiddenelements = document.querySelectorAll('.hidden');
hiddenelements.forEach();((e)=> observer.observe(e))


