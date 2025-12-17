document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".page");
  const links = document.querySelectorAll("a[href]");

  links.forEach(link => {
    const href = link.getAttribute("href");

    // Ignore external links
    if (
      href.startsWith("http") ||
      href.startsWith("#") ||
      href.startsWith("mailto") ||
      href.startsWith("tel")
    ) return;

    link.addEventListener("click", e => {
      e.preventDefault();

      page.classList.add("page-exit");

      setTimeout(() => {
        window.location.href = href;
      }, 350);
    });
  });
});
