(function() {
  var carousel = document.querySelectorAll('.carousel')[0],
      slides = document.querySelectorAll('.carousel-slide'),
      arrows = document.querySelectorAll('.carousel-navigator.carousel-arrow'),
      interval = document.querySelectorAll('.carousel')[0].dataset.interval,
      controls, arrowPrev, arrowNext, dots,
      scrollInt,
      startSlide = 0,
      slideIndex = 0,
      autoClick = new Event('autoClick');

  var slider = {
    init() {
      slider.initControls();
      slider.setSlidePositions();
    },
    initControls() {
      controls = document.createElement('div');
        controls.className = 'carousel-controls';
        if (carousel.dataset.arrows == 'true') {
          arrowPrev = document.createElement('div');
            arrowPrev.className = 'carousel-navigator carousel-arrow carousel-prev';
            let faPrev = document.createElement('i');
            faPrev.setAttribute('class', 'fas fa-chevron-left');
            arrowPrev.appendChild(faPrev);
            arrowPrev.addEventListener('click', slider.slidePrev);
            arrowPrev.addEventListener('autoClick', slider.slidePrev);
          controls.appendChild(arrowPrev);
          arrowNext = document.createElement('div');
            arrowNext.className = 'carousel-navigator carousel-arrow carousel-next';
            let faNext = document.createElement('i');
            faNext.setAttribute('class', 'fas fa-chevron-right');
            arrowNext.appendChild(faNext);
            arrowNext.addEventListener('click', slider.slideNext);
            arrowNext.addEventListener('autoClick', slider.slideNext);
          controls.appendChild(arrowNext);
        }
        if (carousel.dataset.dots == 'true') {
          dots = document.createElement('ul');
            dots.className = 'carousel-navigator carousel-dots';
            for (let i = 0; i < slides.length; i++) {
              let dot = document.createElement('li');
                dot.className = 'carousel-navigator carousel-dot';
                dot.dataset.target = i;
                dot.addEventListener('click', slider.dotNavigate);
              dots.appendChild(dot);
            }
          controls.appendChild(dots);
        }
      carousel.appendChild(controls);
    },
    autoScroll() {
      arrowNext.dispatchEvent(autoClick);
    },
    setSlidePosition(index,position) {
      slides[index].style.left = `${(position*100)}%`;
    },
    setSlidePositions() {
      for (const [index, slide] of slides.entries()) {
        slide.classList.toggle('active', index == slideIndex);
        slide.classList.toggle('prev', index == slider.findPrev());
        slide.classList.toggle('next', index == slider.findNext());
      }
      for (const dot of dots.children) {
        dot.classList.toggle('active', dot.dataset.target == slideIndex);
      }
    },
    findPrev() {
      if (slideIndex == 0) { return slides.length - 1 };
      return slideIndex - 1;
    },
    findNext() {
      return (slideIndex + 1) % slides.length;
    },
    slideNext(e) {
      if (++slideIndex >= slides.length) slideIndex = 0;
      slider.setSlidePositions();
      if (e.type != 'autoClick') {
        clearInterval(scrollInt);
        scrollInt = setInterval(slider.autoScroll, interval);
      }
    },
    slidePrev(e) {
      if (--slideIndex < 0) slideIndex = slides.length - 1;
      slider.setSlidePositions();
      if (e.type != 'autoClick') {
        clearInterval(scrollInt);
        scrollInt = setInterval(slider.autoScroll, interval);
      }
    },
    dotNavigate(e) {
      clearInterval(scrollInt);
      scrollInt = setInterval(slider.autoScroll, interval);
      slideIndex = parseInt(e.target.dataset.target);
      slider.setSlidePositions();
    }
  };

  for (const [index, slide] of slides.entries()) {
    slide.style.backgroundImage = `url(${slide.dataset.carouselBg})`;
  }
  slider.init();
  scrollInt = setInterval(slider.autoScroll, interval);
})();
