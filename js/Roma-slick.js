$(document).ready(function () {
  $('.wraper-container').slick({
    dots: true,
    infinite: false,
    speed: 300,
    dots: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  });
});
