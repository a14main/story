let pages = null;
let index = 0;
const inventory = {
  jade: false,
  book: false
};

// dom

const mainArea = document.querySelector(".main");
const begin = document.querySelector("#begin");
let currentPage = document.querySelector(".section");

// loaders

function initialize(data) {
  if (!data) {
    showErrorMessage("Story data not found.");
    return false;
  }
  pages = data;

  setTimeout(() => {
    begin.classList.remove("disabled");
    begin.addEventListener("click", () => loadPage(0));
  }, 400);
}

function loadPage(i) {
  while (mainArea.lastChild && mainArea.lastChild.id != `section-${index}`) {
    mainArea.removeChild(mainArea.lastChild);
  }
  const page = pages[i];
  const divider = document.createElement("div");
  divider.classList.add("section", "divider");
  const section = document.createElement("div");
  section.classList.add("section", "content");
  section.id = `section-${i}`;
  const textContainer = document.createElement("div");
  textContainer.classList.add("text-container");

  const p = document.createElement("p");
  p.classList.add("text");
  p.textContent = page.paragraph;
  const ul = document.createElement("ul");
  ul.classList.add("choices");
  if (page.children) {
    page.children.forEach((child) => {
      addLink(ul, i, child);
    });
  }
  if (page.links) {
    page.links.forEach((child) => {
      addLink(ul, i, child);
    });
  }

  textContainer.appendChild(p);
  textContainer.appendChild(ul);
  section.appendChild(textContainer);
  mainArea.appendChild(divider);
  mainArea.appendChild(section);
  section.scrollIntoView({
    behavior: "smooth",
    block: "end"
  });
  currentPage = section;
}

function addLink(ul, from, to) {
  const page = pages[to];
  if (!page) {
    return;
  }
  if (page.title == "BACK") {
    return;
  }
  if (from == 90) {
    if (to == 106 && !inventory.jade) {
      return;
    }

    if (to == 91 && !inventory.book) {
      return;
    }
  }
  if (page.title == "END") {
    page.title = "The End";
  }
  const li = document.createElement("li");
  li.classList.add("choice");
  if (page.chosen) {
    li.classList.add("chosen");
  }

  li.textContent = page.title;
  li.addEventListener("click", () => {
    chooseOption(from, to);
    page.chosen = true;
    li.classList.add("chosen");
  });
  
  ul.appendChild(li);
}

function chooseOption(from, to) {
  if (to == 94) {
    inventory.jade = true;
  }
  if (to == 101) {
    inventory.book = true;
  }
  index = from;
  loadPage(to);
}

function showErrorMessage(msg) {
  //todo
}

function loadData() {
  fetch("https://a14main.github.io/story/data/data.json")
    .then((response) => response.json())
    .then((json) => {
      initialize(json);
    });
}

loadData();
