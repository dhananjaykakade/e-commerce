var MenuBtn= document.querySelector('#MenuBtn');
var Nav= document.querySelector('#navbar');

var check = 0
MenuBtn.addEventListener("click",function() {
  if (check==0) {
    Nav.style.right='0';
    console.log(check)
    check = 1
    console.log(check)
  }
  else{
    Nav.style.right='-500px';
    check = 0

  }

})


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



gsap.to("#footer h4",{
  opacity:0,
  duration:1,
})


