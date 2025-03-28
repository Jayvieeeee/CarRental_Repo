document.addEventListener("DOMContentLoaded", function () {
    // ============================
    // ✅ Terms and Conditions & Rental Modal Elements
    // ============================
    const termsModal = document.getElementById("termsModal");
    const rentalModal = document.getElementById("rentalModal");
    const closeTermsModal = document.querySelector("#termsModal .close");
    const closeRentalModal = document.querySelector("#rentalModal .close");
    const termsBox = document.getElementById("termsBox");
    const agreeCheckbox = document.getElementById("agreeCheckbox");
    const acceptBtn = document.getElementById("acceptBtn");

    // Rental details placeholders
    const carModelElem = document.getElementById("carModel");
    const ratePerDayElem = document.getElementById("ratePerDay");
    const daysRentedElem = document.getElementById("daysRented");
    const totalPaymentElem = document.getElementById("totalPayment");

    // Global car data for selected car
    let selectedCar = {};

    // ============================
    // ✅ Open Terms Modal on Rent Click
    // ============================
    const carList = document.querySelector(".car-list");

    if (carList) {
        carList.addEventListener("click", function (e) {
            const rentButton = e.target.closest(".rent-badge");
            if (rentButton) {
                e.preventDefault();
                // Get selected car details
                const carCard = rentButton.closest(".car-card");
                selectedCar = {
                    id: rentButton.dataset.id,
                    model: carCard.querySelector("h2").innerText,
                    ratePerDay: parseInt(carCard.querySelector(".price").innerText.replace("₱", "").split(" ")[0]),
                };

                // Show Terms and Conditions modal
                termsModal.style.display = "flex";
                resetModalState();
            }
        });
    }

    // ============================
    // ✅ Close Terms Modal
    // ============================
    closeTermsModal.addEventListener("click", function () {
        termsModal.style.display = "none";
        resetModalState();
    });

    window.addEventListener("click", function (e) {
        if (e.target === termsModal) {
            termsModal.style.display = "none";
            resetModalState();
        }
    });

    // ============================
    // ✅ Enable Checkbox and Button on Scroll or Click
    // ============================
    termsBox.addEventListener("scroll", function () {
        if (termsBox.scrollTop + termsBox.clientHeight >= termsBox.scrollHeight - 1) {
            agreeCheckbox.checked = true;
            acceptBtn.disabled = false;
        }
    });

    agreeCheckbox.addEventListener("change", function () {
        if (agreeCheckbox.checked) {
            acceptBtn.disabled = false;
        } else {
            acceptBtn.disabled = true;
        }
    });

    // ============================
    // ✅ Show Rental Details Modal After Accepting Terms
    // ============================
    acceptBtn.addEventListener("click", function () {
        termsModal.style.display = "none"; // Hide Terms Modal
        showRentalDetails(); // Show Rental Details
    });

    // ============================
    // ✅ Show Rental Details Modal
    // ============================
    function showRentalDetails() {
        if (!selectedCar.model) {
            alert("Error: No car selected. Please try again.");
            return;
        }

        // Update rental details in modal
        carModelElem.innerText = selectedCar.model;
        ratePerDayElem.innerText = `₱${selectedCar.ratePerDay.toLocaleString()}`;
        updateTotalPayment();

        // Show Rental Details Modal
        rentalModal.style.display = "flex";
    }

    // ============================
    // ✅ Update Total Payment Calculation
    // ============================
    document.querySelectorAll("#pickupDate, #returnDate").forEach(input => {
        input.addEventListener("change", updateTotalPayment);
    });

    function updateTotalPayment() {
        const pickupDate = new Date(document.getElementById("pickupDate").value);
        const returnDate = new Date(document.getElementById("returnDate").value);

        if (pickupDate && returnDate && returnDate > pickupDate) {
            const diffTime = Math.abs(returnDate - pickupDate);
            const daysRented = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            daysRentedElem.innerText = daysRented;
            const totalPayment = daysRented * selectedCar.ratePerDay;
            totalPaymentElem.innerText = `₱${totalPayment.toLocaleString()}`;
        } else {
            daysRentedElem.innerText = "0";
            totalPaymentElem.innerText = "₱0";
        }
    }

    // ============================
    // ✅ Close Rental Modal
    // ============================
    closeRentalModal.addEventListener("click", function () {
        rentalModal.style.display = "none";
    });

    window.addEventListener("click", function (e) {
        if (e.target === rentalModal) {
            rentalModal.style.display = "none";
        }
    });

    // ============================
    // ✅ Confirm Rental Action
    // ============================
    document.getElementById("confirmRentalBtn").addEventListener("click", function () {
        alert(`✅ Rental confirmed for ${selectedCar.model}! 🚗`);
        rentalModal.style.display = "none";
    });

    // ============================
    // ✅ Reset Modal State for Terms & Rental
    // ============================
    function resetModalState() {
        agreeCheckbox.checked = false;
        agreeCheckbox.disabled = false;
        acceptBtn.disabled = true;
        termsBox.scrollTop = 0;
        document.getElementById("pickupDate").value = "";
        document.getElementById("returnDate").value = "";
        daysRentedElem.innerText = "0";
        totalPaymentElem.innerText = "₱0";
    }
});

// ============================
// ✅ Renter Details Modal Elements
// ============================
const renterModal = document.getElementById("renterModal");
const closeRenterModal = document.querySelector("#renterModal .close");
const submitRenterBtn = document.getElementById("submitRenterBtn");

// ============================
// ✅ Open Renter Modal After Confirm Rental
// ============================
document.getElementById("confirmRentalBtn").addEventListener("click", function () {
    rentalModal.style.display = "none"; // Hide Rental Details Modal
    renterModal.style.display = "flex"; // Show Renter Details Modal
});

// ============================
// ✅ Close Renter Modal
// ============================
closeRenterModal.addEventListener("click", function () {
    renterModal.style.display = "none";
});

window.addEventListener("click", function (e) {
    if (e.target === renterModal) {
        renterModal.style.display = "none";
    }
});


// ============================
// ✅ Submit Renter Details Action
// ============================
submitRenterBtn.addEventListener("click", function () {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobileNumber = document.getElementById("mobileNumber").value.trim();
    const address = document.getElementById("address").value.trim();
    const licenseNumber = document.getElementById("licenseNumber").value.trim();

    if (!firstName || !lastName || !email || !mobileNumber || !address || !licenseNumber) {
        alert("❗ Please fill in all the required fields.");
        return;
    }

    alert(`✅ Rental confirmed for ${firstName} ${lastName}! 🚗`);
    renterModal.style.display = "none"; // Hide Renter Modal
});

