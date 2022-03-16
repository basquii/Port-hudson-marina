(function(win, doc) {
    "use strict";
    const options = {
      duration: 3000,
      numSlidesToShow: 1,
      delay: 505
    };
    const sliderData = {
      isClicked: false,
      timeout: null,
      slider: doc.querySelector(".slider"),
      container: doc.querySelector(".slider-container"),
      slides: [...doc.querySelectorAll(".slide")],
      slideItem: doc.querySelector(".slide"),
      totalSlides: [...doc.querySelectorAll(".slide")].length,
      prevBtn: doc.querySelector(".prev"),
      nextBtn: doc.querySelector(".next"),
      windowTimeOut: null,
      move: 0,
      slideWidth: null,
      isMouseDown: false,
      clientx: null
    };
    const siblings = nodeEl =>
    [...nodeEl.parentElement.children].filter(sibling => sibling !== nodeEl);
    function handleLoop() {
      clearTimeout(sliderData.timeout);
      sliderData.timeout = setTimeout(function() {
        handleNextMovement();
      }, options.duration);
    }
    handleLoop();
    function handleResizing() {
      sliderData.slideWidth = parseInt(
        sliderData.slider.offsetWidth / options.numSlidesToShow
      );
      sliderData.slides.forEach(
        slide => (slide.style.width = `${sliderData.slideWidth}px`)
      );
      sliderData.container.style.width =
        parseInt(sliderData.slideWidth * sliderData.totalSlides) + "px";
    }
    handleResizing();
    win.addEventListener("resize", function() {
      clearTimeout(sliderData.windowTimeOut);
      sliderData.windowTimeOut = setTimeout(handleResizing, options.delay);
    });
    function handlePrevMovement() {
      if (!sliderData.isClicked) {
        sliderData.isClicked = true;
        sliderData.move = sliderData.move <= 0 ? 0 : sliderData.move - 1;
        sliderData.container.style.transform = `translateX(${-1 *
          sliderData.slideWidth *
          sliderData.move}px)`;
        handleDotClick(sliderData.move);
        setTimeout(function() {
          sliderData.isClicked = false;
          handleLoop();
        }, options.delay);
      }
    }
  
    function handleNextMovement() {
      if (!sliderData.isClicked) {
        sliderData.isClicked = true;
        sliderData.move =
          sliderData.move >= sliderData.totalSlides - 1
          ? sliderData.totalSlides - 1
        : sliderData.move + 1;
        sliderData.container.style.transform = `translateX(${-1 *
          sliderData.slideWidth *
          sliderData.move}px)`;
        handleDotClick(sliderData.move);
        setTimeout(function() {
          sliderData.isClicked = false;
          handleLoop();
        }, options.delay);
      }
    }
    sliderData.nextBtn.addEventListener("click", handleNextMovement);
    sliderData.prevBtn.addEventListener("click", handlePrevMovement);
  
    sliderData.slider.addEventListener("mousedown", function(e) {
      e.preventDefault();
      if (!sliderData.isMouseDown) {
        sliderData.isMouseDown = true;
        sliderData.clientx = e.pageX;
      }
    });
  
    sliderData.slider.addEventListener("mouseup", function(e) {
      e.preventDefault();
      if (sliderData.isMouseDown) {
        sliderData.isMouseDown = false;
        if (e.pageX - sliderData.clientx > 100) {
          handlePrevMovement();
        } else if (e.pageX - sliderData.clientx < -100) {
          handleNextMovement();
        }
      }
      sliderData.container.style.marginLeft = "0px";
    });
  
    sliderData.slider.addEventListener("mousemove", function(e) {
      e.preventDefault();
      if (sliderData.isMouseDown) {
        sliderData.container.style.marginLeft = `${e.pageX -
          sliderData.clientx}px`;
      }
    });
    function handleDotClick(num) {
      var dots = [...doc.querySelectorAll(".dot")];
      dots.forEach(dot => dot.classList.remove("active"));
      dots[num].classList.add("active");
      sliderData.move = num;
      sliderData.container.style.transform = `translateX(${-1 *
        sliderData.slideWidth *
        sliderData.move}px)`;
    }
    function makeDots() {
      var dot = null;
      var dotConatiner = doc.createElement("ul");
      dotConatiner.classList.add("dot-container");
      var df = doc.createDocumentFragment();
      sliderData.slides.forEach((slide, i) => {
        dot = doc.createElement("li");
        dot.classList.add("dot");
        i === 0 ? dot.classList.add("active") : dot.classList.remove("active");
        df.appendChild(dot);
      });
      dotConatiner.appendChild(df);
      sliderData.slider.appendChild(dotConatiner);
      var itrableDots = [...dotConatiner.querySelectorAll(".dot")];
      itrableDots.forEach((iterableDot, idx) => {
        iterableDot.setAttribute("data-slide", idx + 1);
        iterableDot.addEventListener("click", function(e) {
          handleDotClick(idx);
        });
      });
    }
    makeDots();
  })(window, document);
  