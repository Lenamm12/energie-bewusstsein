function toggle() {
  var aside = document.getElementById("aside");
  aside.classList.toggle("change");

  var canvas = document.getElementById("canvas");
  canvas.classList.toggle("change");

  /* var body = document.body.classList.toggle("change")*/

  onWindowResize();
}

const navLinks = document.querySelectorAll(".nav-links a");
const divs = document.querySelectorAll("div.articleDiv");

divs.forEach((div) => {
  div.style.display = "none";
});

/* window.onload = (event)=>{
  let pathName =   window.location.pathname.split('/');
  console.log(pathName);
  if(!pathname){
 document.getElementById("Home").style.display = "block";
  }
  else
 document.getElementById(pathName).classList.add("active")
 } */

document.getElementById("Home").style.display = "block";
document.getElementById("Home").classList.add("active");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetDiv = link.getAttribute("href").substring(1);
    divs.forEach((div) => {
      if (div.id === targetDiv) {
        div.style.display = "block";
        div.classList.add("active");
      } else {
        div.style.display = "none";
        div.classList.remove("active");
      }
    });
  });
});

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    console.log(this);
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
