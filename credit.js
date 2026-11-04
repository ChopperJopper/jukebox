let selectedCredits = 0;


// Vælger creditpakke og åbner betalings-popup
function selectcredits(amount) {

    selectedCredits = amount;

    document.getElementById("paymentPopup").style.display = "flex";

    document.getElementById("paymentOptions").style.display = "block";

    document.getElementById("purchaseSuccess").style.display = "none";
}


// Køber credits efter valg af betalingsmetode
function buycredits(paymentMethod) {

    // Henter eksisterende credits
    let credits = Number(localStorage.getItem("credits")) || 0;

    // Lægger de nye credits til
    credits = credits + selectedCredits;

    // Gemmer credits
    localStorage.setItem("credits", credits);

    // Opdaterer tallet i højre hjørne
    updateCreditCount();

    // Skjuler betalingsmetoderne
    document.getElementById("paymentOptions").style.display = "none";

    // Viser besked om gennemført køb
    document.getElementById("purchaseSuccess").style.display = "block";

    document.getElementById("successMessage").textContent =
        "Du har købt " + selectedCredits +
        " credits med " + paymentMethod +
        ". Du har nu " + credits + " credits.";

    // Nulstiller det valgte antal
    selectedCredits = 0;
}


// Opdaterer creditcount i HTML
function updateCreditCount() {

    let credits = Number(localStorage.getItem("credits")) || 0;

    document.querySelector(".creditcount").textContent = credits;
}


// Lukker popup
function closePopup() {

    document.getElementById("paymentPopup").style.display = "none";

}