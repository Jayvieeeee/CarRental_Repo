document.addEventListener("DOMContentLoaded", function () {

    let timer = 60;
    let countdown = document.getElementById("timer");
    let resendText = document.getElementById("resend-text");
    let countdownContainer = document.getElementById("countdown");
    let resendLink = document.getElementById("resend-code");

    function startTimer() {
        countdown.textContent = timer;
        let interval = setInterval(() => {
            timer--;
            countdown.textContent = timer;

            if (timer <= 0) {
                clearInterval(interval);
                countdownContainer.style.display = "none";
                resendText.style.display = "block";
            }
        }, 1000);
    }

    if (countdown) startTimer();

    resendLink?.addEventListener("click", function (e) {
        e.preventDefault();
        resendText.style.display = "none";
        countdownContainer.style.display = "block";
        timer = 60;
        startTimer();

        fetch("/Guest/Account/ResendCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "RequestVerificationToken":
                    document.querySelector('input[name="__RequestVerificationToken"]')
                        .value,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.success ? "New verification code sent!" : data.message);
            })
            .catch((error) => console.error("Error:", error));
    });


    const menuOpenButton = document.querySelector("#menu-open-button");
    const menuCloseButton = document.querySelector("#menu-close-button");

    menuOpenButton?.addEventListener("click", () => {
        document.body.classList.toggle("show-mobile-menu");
    });

    menuCloseButton?.addEventListener("click", () => {
        document.body.classList.remove("show-mobile-menu");
    });

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let currentSection = "";

        sections.forEach((section) => {
            let sectionTop = section.offsetTop - 150;
            let sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            let targetSection = link.getAttribute("href").replace("#", "");
            if (targetSection === currentSection) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        const carInfoBox = document.querySelector(".car-info-box");
        if (currentSection === "viewCars") {
            carInfoBox.style.display = "block";
        } else {
            carInfoBox.style.display = "none";
        }
    });

    var swiper = new Swiper(".mySwiper", {
        loop: true,
        centeredSlides: true,
        slidesPerView: 3,
        spaceBetween: 30,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        on: {
            init: function () {
                updateCarInfo(); // Initial update on page load
            },
            slideChangeTransitionEnd: function () {
                updateCarInfo(); // Update after slide change
            },
        },
    });


    function updateCarInfo() {
        let activeSlide = document.querySelector(".swiper-slide.swiper-slide-active");
        let carInfoBox = document.querySelector(".car-info-box");

        if (activeSlide && activeSlide.dataset.brand) {
            carInfoBox.style.display = "block";
            document.getElementById("car-brand-model").innerHTML = `
                <span class="car-title">${activeSlide.dataset.brand} ${activeSlide.dataset.model}</span>`;
            document.getElementById("car-seaters").innerHTML = `
                <span class="car-details">Capacity: ${activeSlide.dataset.seaters} Seater</span>`;
            document.getElementById("car-price").innerHTML = `
                <span class="car-rate">Rate per day: <strong class="price">&#8369;${activeSlide.dataset.price}</strong></span>`;
        } else {
            carInfoBox.style.display = "none";
        }
    }


    updateCarInfo();

    function toggleFAQ(element) {
        const faqItem = element.parentElement;
        const icon = element.querySelector(".faq-icon");


        faqItem.classList.toggle("open");

        if (faqItem.classList.contains("open")) {
            icon.classList.replace("fa-chevron-down", "fa-chevron-up");
        } else {
            icon.classList.replace("fa-chevron-up", "fa-chevron-down");
        }

        document.querySelectorAll(".faq-item").forEach((item) => {
            if (item !== faqItem) {
                item.classList.remove("open");
                const otherIcon = item.querySelector(".faq-icon");
                if (otherIcon) {
                    otherIcon.classList.replace("fa-chevron-up", "fa-chevron-down");
                }
            }
        });
    }



    document.querySelectorAll(".faq-question").forEach((item) => {
        item.addEventListener("click", function () {
            toggleFAQ(this);
        });
    });

});