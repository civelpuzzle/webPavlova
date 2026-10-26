document.addEventListener("DOMContentLoaded", () => {
    // Модальное окно обратной связи (2 3)
    const modal = document.getElementById("feedbackModal");
    const openModalBtn = document.getElementById("openModal");
    const closeModalBtn = document.getElementById("closeModal");
    const modalForm = document.getElementById("modalForm");
    const modalSuccess = document.getElementById("modalSuccess");

    if (modal && openModalBtn && closeModalBtn) {
        function openModal() {
            modal.classList.add("modal--open");
            document.body.style.overflow = "hidden";
        }
        function closeModal() {
            modal.classList.remove("modal--open");
            document.body.style.overflow = "";
        }
        openModalBtn.addEventListener("click", openModal);
        closeModalBtn.addEventListener("click", closeModal);

        modal.addEventListener("click", (e) => {
            if (e.target === modal || e.target.classList.contains("modal__overlay")) {
                closeModal();
            }
        });

        if (modalForm) {
            modalForm.addEventListener("submit", (e) => {
                e.preventDefault();
                modalForm.style.display = "none";
                if (modalSuccess) modalSuccess.style.display = "block";
                setTimeout(() => {
                    closeModal();
                    modalForm.reset();
                    modalForm.style.display = "flex";
                    if (modalSuccess) modalSuccess.style.display = "none";
                }, 2500);
            });
        }
    }

    // Бургер-меню (4)
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");
    if (burger && nav) {
        burger.addEventListener("click", () => {
            burger.classList.toggle("burger--active");
            nav.classList.toggle("nav--open");
        });
        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                burger.classList.remove("burger--active");
                nav.classList.remove("nav--open");
            });
        });
    }

    // Кнопка "Наверх" (5)
    const scrollTopBtn = document.getElementById("scrollTop");
    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add("scroll-top--visible");
            } else {
                scrollTopBtn.classList.remove("scroll-top--visible");
            }
        });
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Аккордеон (6)
    document.querySelectorAll(".faq__item").forEach((item) => {
        const question = item.querySelector(".faq__question");
        const answer = item.querySelector(".faq__answer");
        if (question && answer) {
            question.addEventListener("click", () => {
                const isOpen = item.classList.contains("faq__item--open");
                if (isOpen) {
                    answer.style.maxHeight = null;
                    item.classList.remove("faq__item--open");
                } else {
                    item.classList.add("faq__item--open");
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        }
    });

    // Переключение темы (7)
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("theme-dark");
            themeToggle.textContent = document.body.classList.contains("theme-dark") ? "☀️" : "🌙";
        });
    }

    // Галерея изображений (8)
    const mainImg = document.getElementById("galleryImage");
    const thumbs = document.querySelectorAll("#galleryThumbs img");
    if (mainImg && thumbs.length > 0) {
        thumbs.forEach((thumb) => {
            thumb.addEventListener("click", () => {
                mainImg.src = thumb.src;
                thumbs.forEach((t) => t.classList.remove("active"));
                thumb.classList.add("active");
            });
        });
        if (typeof galleryData !== "undefined" && galleryData.length > 0) {
            // mainImg.src = makeSvg(galleryData[0]);
        }
    }
});
