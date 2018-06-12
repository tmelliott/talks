$(document).ready(function() {
  // call functions etc here
  Reveal.initialize({
    controls: false,
    // height: '100%',
    // width: '100%',
    // margin: 0,
    progress: false,
    transition: 'none',
    history: true, // can unset this for final - makes reloading nicer
    math: {
      jax: ["output/CommonHTML"],
  		// mathjax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js',
  		config: 'TeX-AMS_HTML-full'  // See http://docs.mathjax.org/en/latest/config-files.html
  	},
    dependencies: [
  		{ src: 'assets/revealjs/plugin/math/math.js', async: true }
  	]
  });

  // more functions?
  // graphs();
});

// variables we'll need to use throughout the place
var aklmap, busdata, points_visible, aklsvg, aklbuses, pts = [], routepath, particles, realbus, segments;