function updateTicketPrice() {
    const selectedPromotion = document.getElementById("promotion").value;
    document.getElementById("ticketPrice").value = selectedPromotion;
}

function updateUserPoints() {
    const selectedUser = document.getElementById("userId");
    const selectedPoints = selectedUser.options[selectedUser.selectedIndex].getAttribute("data-points");
    document.getElementById("userPoints").value = selectedPoints;
}

function validateForm(userPoints, selectedPromotionPointsNeeded) {
    const selectedPromotion = document.getElementById("promotion").value;

    if (selectedPromotionPointsNeeded > userPoints) {
        alert("Insufficient points");
        return false;
    }

    return true;
}
