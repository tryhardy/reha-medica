
    $(".medicineList .slider").slick({
        infinite: true,
        dots: true,
        speed: 700,
        slidesToShow: 2,
        slidesToScroll: 1,
      
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });

    