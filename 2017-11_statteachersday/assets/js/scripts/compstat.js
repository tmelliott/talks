function compstat() {
  Reveal.addEventListener("fragmentshown", showimg);
  Reveal.addEventListener("fragmenthidden", showimg);
}

function showimg(event) {
  if (Reveal.getCurrentSlide().id == "compstats") {
    var f = Reveal.getState().indexf;

    

    // var img = event.fragment.attributes["data-bg-image"];
    // var imgs = ["galaxy.jpg", "fishschool.jpg", "buses.jpg"];
    // if (f < 0 || f >= imgs.length) {
    //   $("#compimages").css("background-image", "none");
    // } else {
    //   $("#compimages").css("background-image", "url(assets/img/" + imgs[f] + ")");
    // }
  }
}
