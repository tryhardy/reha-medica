(function () {
  const scopeLinks = document.querySelectorAll(".scope_item a");
  const scopeCards = document.querySelectorAll(".scope_cards");
  const scopeBG = document.querySelectorAll(".scope_bg");

  scopeLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      let dataID = e.target.dataset.scope;

      deleteActiveScopes();
      e.target.classList.add("scope_link__active");
      showActiveScopes(dataID);
    });
  });

  function deleteActiveScopes() {
    scopeLinks.forEach((link) => {
      link.classList.remove("scope_link__active");
    });
    scopeCards.forEach((card) => {
      card.classList.remove("shown-flex");
    });
    scopeBG.forEach((bg) => {
      bg.classList.remove("shown");
    });
  }

  function showActiveScopes(ID) {
    scopeCards.forEach((card) => {
      let cardID = card.dataset.scope;
      if (cardID === ID) {
        card.classList.add("shown-flex");
      }
    });
    scopeBG.forEach((bg) => {
      let bgID = bg.dataset.scope;
      if (bgID === ID) {
        bg.classList.add("shown");
      }
    });
  }
})();