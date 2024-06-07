import '../css/main.css';
import '../css/bootstrap.min.css';

// src/js/index.js

// Import all images from the images directory
function importAll(r) {
	r.keys().forEach(r);
}

importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));
  

$(document).ready(function(){
 $('.header').height($(window).height());

 $(".navbar a").click(function(){
 	$("body,html").animate({
 		scrollTop:$("#" + $(this).data('value')).offset().top
 	},1000)
  
 })

})