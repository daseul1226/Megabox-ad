const revealElements = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".topnav a");
const sections = document.querySelectorAll("main .section[id]");
const counters = document.querySelectorAll("[data-count]");
const projectVisuals = document.querySelectorAll(".project-visual");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const activeId = entry.target.id;

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("is-active", isActive);
      });
    });
  },
  {
    rootMargin: "-35% 0px -50% 0px",
    threshold: 0.1,
  }
);

sections.forEach((section) => navObserver.observe(section));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 1200;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        element.textContent = Math.floor(progress * target).toString();

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = target.toString();
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(element);
    });
  },
  {
    threshold: 0.6,
  }
);

counters.forEach((counter) => counterObserver.observe(counter));

const openLightbox = (imageUrl, label) => {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightboxImage.src = imageUrl;
  lightboxImage.alt = label;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
};

projectVisuals.forEach((visual) => {
  const imageElement = visual.querySelector(".project-visual-image");
  const imageUrlFromImage = imageElement?.getAttribute("src");
  const backgroundImage = getComputedStyle(visual).backgroundImage;
  const match = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
  const imageUrl = imageUrlFromImage || match?.[1];

  if (!imageUrl) {
    return;
  }

  visual.setAttribute("role", "button");
  visual.setAttribute("tabindex", "0");

  const label = visual
    .closest(".project-card")
    ?.querySelector("h3")
    ?.textContent?.trim() || "프로젝트 이미지";

  visual.addEventListener("click", () => openLightbox(imageUrl, label));
  visual.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(imageUrl, label);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

window.addEventListener("beforeprint", () => {
  revealElements.forEach((element) => element.classList.add("is-visible"));
  closeLightbox();
});
