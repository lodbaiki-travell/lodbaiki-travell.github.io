"use strict";

const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const menuButton = document.querySelector(".menu-button");
const navLinks = Array.from(nav.querySelectorAll("a"));
const compactHeader = window.matchMedia("(max-width: 900px)");

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  nav.toggleAttribute("data-open", open);
}

function updateCurrentLink() {
  const currentLink = navLinks.find((link) => link.hash === window.location.hash) || navLinks[0];
  for (const link of navLinks) {
    if (link === currentLink) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

header.setAttribute("data-menu-ready", "");
menuButton.hidden = false;
menuButton.addEventListener("click", () => {
  setMenu(!nav.hasAttribute("data-open"));
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("click", (event) => {
  if (nav.hasAttribute("data-open") && !header.contains(event.target)) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.hasAttribute("data-open")) {
    setMenu(false);
    menuButton.focus();
  }
});
compactHeader.addEventListener("change", () => setMenu(false));
window.addEventListener("hashchange", updateCurrentLink);
updateCurrentLink();

const lightbox = document.querySelector(".lightbox");

if (typeof lightbox.showModal === "function") {
  const tiles = Array.from(document.querySelectorAll(".gallery-tile"));
  const image = lightbox.querySelector(".lightbox-image");
  const caption = lightbox.querySelector(".lightbox-caption");
  const counter = lightbox.querySelector(".lightbox-counter");
  const previous = lightbox.querySelector(".lightbox-prev");
  const next = lightbox.querySelector(".lightbox-next");
  let currentImage = 0;
  let opener;

  function showImage(index) {
    currentImage = (index + tiles.length) % tiles.length;
    const tile = tiles[currentImage];
    image.src = tile.href;
    image.alt = tile.querySelector("img").alt;
    caption.textContent = tile.querySelector(".gallery-label").textContent;
    counter.textContent = (currentImage + 1) + " / " + tiles.length;
  }

  tiles.forEach((tile, index) => {
    tile.setAttribute("aria-haspopup", "dialog");
    tile.addEventListener("click", (event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      opener = tile;
      showImage(index);
      lightbox.showModal();
    });
  });

  previous.addEventListener("click", () => showImage(currentImage - 1));
  next.addEventListener("click", () => showImage(currentImage + 1));
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(currentImage - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(currentImage + 1);
    }
  });
  lightbox.addEventListener("close", () => {
    opener.focus({ preventScroll: true });
  });
}
