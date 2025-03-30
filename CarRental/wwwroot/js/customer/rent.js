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
    // ✅ Show Rental Details Modal
    // ============================
    function showRentalDetails() {
        if (!selectedCar.model) {
            alert("Error: No car selected. Please try again.");
            return;
        }

        carModelElem.innerText = selectedCar.model;
        ratePerDayElem.innerText = `₱${selectedCar.ratePerDay.toLocaleString()}`;
        updateTotalPayment();

        rentalModal.style.display = "flex";
    }

    document.querySelectorAll("#pickupDate, #returnDate").forEach(input => {
        input.addEventListener("change", updateTotalPayment);
    });

    // ✅ Disable Confirm Button by Default
    document.getElementById("confirmRentalBtn").disabled = true;

    function updateTotalPayment() {
        const pickupDateInput = document.getElementById("pickupDate");
        const returnDateInput = document.getElementById("returnDate");
        const confirmRentalBtn = document.getElementById("confirmRentalBtn");

        const pickupDateValue = pickupDateInput.value.trim();
        const returnDateValue = returnDateInput.value.trim();

        // ✅ Disable button if no pickup date is selected
        if (!pickupDateValue) {
            daysRentedElem.innerText = "0";
            totalPaymentElem.innerText = "₱0";
            confirmRentalBtn.disabled = true;
            return;
        }

        const pickupDate = new Date(pickupDateValue);
        const returnDate = returnDateValue ? new Date(returnDateValue) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // ✅ Check if pickup date is in the past
        if (pickupDate < today) {
            alert("❌ Error: Pickup date cannot be the previous date.");
            pickupDateInput.value = "";
            pickupDateInput.focus();
            daysRentedElem.innerText = "0";
            totalPaymentElem.innerText = "₱0";
            confirmRentalBtn.disabled = true;
            return;
        }

        // ✅ Set minimum return date based on pickup date
        returnDateInput.setAttribute("min", pickupDateValue);

        // ✅ Disable button if return date is invalid or not set
        if (!returnDateValue || returnDate <= pickupDate) {
            daysRentedElem.innerText = "0";
            totalPaymentElem.innerText = "₱0";
            confirmRentalBtn.disabled = true;
            return;
        }

        // ✅ Calculate rental days and total payment
        const diffTime = Math.abs(returnDate - pickupDate);
        const daysRented = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysRentedElem.innerText = daysRented;

        const totalPayment = daysRented * selectedCar.ratePerDay;
        totalPaymentElem.innerText = `₱${totalPayment.toLocaleString()}`;

        // ✅ Enable button only when valid dates are selected
        confirmRentalBtn.disabled = false;
    }

    // ✅ Prevent Confirm Button Click if Disabled
    document.getElementById("confirmRentalBtn").addEventListener("click", function (event) {
        const confirmRentalBtn = document.getElementById("confirmRentalBtn");
        const pickupDateInput = document.getElementById("pickupDate");
        const returnDateInput = document.getElementById("returnDate");

        const pickupDateValue = pickupDateInput.value.trim();
        const returnDateValue = returnDateInput.value.trim();

        // ❌ Prevent if no dates are selected
        if (!pickupDateValue || !returnDateValue) {
            alert("❌ Error: Please select both pickup and return dates before confirming.");
            event.stopPropagation(); // ✅ Stop any propagation
            event.preventDefault(); // ✅ Prevent form submission
            return false; // ✅ Ensure nothing proceeds
        }

        // ❌ Prevent if button is still disabled
        if (confirmRentalBtn.disabled) {
            alert("❌ Error: Please fix the date selection before proceeding.");
            event.stopPropagation();
            event.preventDefault();
            return false;
        }

        // ✅ Proceed only if everything is valid
        alert(`✅ Rental confirmed for ${selectedCar.model}! 🚗`);
        rentalModal.style.display = "none"; // ✅ Hide modal only if valid
        return true;
    });




    document.getElementById("closeRentalModal").addEventListener("click", function () {
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



document.addEventListener("DOMContentLoaded", function () {
    const detailsModal = document.getElementById("detailsModal");
    const closeDetailsModal = document.getElementById("closeDetailsModal");

    // ✅ Open Car Details Modal on "Details" Click
    document.querySelector(".car-list").addEventListener("click", function (e) {
        const detailsButton = e.target.closest(".details-link");
        if (detailsButton) {
            e.preventDefault();
            const carCard = detailsButton.closest(".car-card");

            // Get Car Details
            const carModel = carCard.querySelector("h2").innerText;
            const carImage = carCard.querySelector(".car-image").src;
            const carPrice = carCard.querySelector(".price").innerText;

            // Update Modal Content
            document.getElementById("carDetailsTitle").innerText = carModel;
            document.getElementById("carDetailsImage").src = carImage;
            document.getElementById("carDetailsPrice").innerText = carPrice;

            // ✅ Show Modal
            detailsModal.style.display = "flex";
        }
    });

    // ✅ Close Car Details Modal
    closeDetailsModal.addEventListener("click", function () {
        detailsModal.style.display = "none";
    });

    window.addEventListener("click", function (e) {
        if (e.target === detailsModal) {
            detailsModal.style.display = "none";
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const rentBadges = document.querySelectorAll(".rent-badge");
    const detailsLinks = document.querySelectorAll(".details-link");
    const rentNowBtn = document.getElementById("rentNowBtn");
    const agreeCheckbox = document.getElementById("agreeCheckbox");
    const acceptBtn = document.getElementById("acceptBtn");

    let selectedCarId = null;

    // ✅ Handle Rent Button Click (From Car List)
    rentBadges.forEach((btn) => {
        btn.addEventListener("click", function (event) {
            event.preventDefault();
            selectedCarId = this.getAttribute("data-id");
            openTermsModal(selectedCarId);
        });
    });

    // ✅ Handle Details Button Click
    detailsLinks.forEach((btn) => {
        btn.addEventListener("click", function (event) {
            event.preventDefault();
            selectedCarId = this.getAttribute("data-id");
            openDetailsModal(selectedCarId);
        });
    });

    // ✅ Handle "Rent Now" Button in Car Details Modal
    rentNowBtn.addEventListener("click", function () {
        if (selectedCarId) {
            closeModal("detailsModal"); // Close Car Details
            openTermsModal(selectedCarId); // Go to Terms and Conditions
        }
    });

    // ✅ Handle Accept Button in Terms Modal
    acceptBtn.addEventListener("click", function () {
        if (selectedCarId) {
            closeModal("termsModal"); // Close Terms Modal
            openRentalModal(selectedCarId); // Proceed to Rental Modal
        }
    });

    // ✅ Enable Accept Button Only if Checkbox is Checked
    agreeCheckbox.addEventListener("change", function () {
        acceptBtn.disabled = !agreeCheckbox.checked;
    });

    // ============================
    // ✅ Open Terms Modal
    // ============================
    function openTermsModal(carId) {
        selectedCarId = carId;
        openModal("termsModal");
    }

    // ============================
    // ✅ Open Rental Modal
    // ============================
    function openRentalModal(carId) {
        const rentalModal = document.getElementById("rentalModal");
        if (rentalModal) {
            document.getElementById("carModel").textContent = `Car ID: ${carId}`;
            openModal("rentalModal");
        }
    }

    // ============================
    // ✅ Open Car Details Modal
    // ============================
    function openDetailsModal(carId) {
        const carCard = document.querySelector(`.car-card [data-id="${carId}"]`).closest(".car-card");

        if (carCard) {
            document.getElementById("carDetailsTitle").textContent = carCard.dataset.makeModel;
            document.getElementById("carDetailsImage").src = carCard.querySelector(".car-image").src;
            document.getElementById("carDetailsPrice").innerHTML = `<strong>${carCard.querySelector(".price").textContent}</strong>`;
            document.getElementById("makeModel").textContent = carCard.dataset.makeModel;
            document.getElementById("seaters").textContent = carCard.dataset.seaters;
            document.getElementById("fuelType").textContent = carCard.dataset.fuelType;
            document.getElementById("fuelTankCapacity").textContent = carCard.dataset.fuelTankCapacity;
            document.getElementById("transmission").textContent = carCard.dataset.transmission;
            document.getElementById("groundClearance").textContent = carCard.dataset.groundClearance;

            openModal("detailsModal");
        }
    }

    // ============================
    // ✅ Open and Close Modal Helpers
    // ============================
    function openModal(modalId) {
        document.getElementById(modalId).style.display = "flex";
        document.body.classList.add("modal-open");
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = "none";
        document.body.classList.remove("modal-open");
    }

    // ✅ Close Modals on Click
    document.querySelectorAll(".modal .close").forEach((closeBtn) => {
        closeBtn.addEventListener("click", function () {
            closeModal(this.closest(".modal").id);
        });
    });
});




// ============================
// ✅ SUCCESS MODAL LOGIC
// ============================
document.addEventListener("DOMContentLoaded", function () {
    const renterModal = document.getElementById("renterModal");
    const submitRenterBtn = document.getElementById("submitRenterBtn");
    const successModal = document.getElementById("successModal");
    const referenceNumberSpan = document.getElementById("referenceNumber");
    const closeSuccessModal = document.querySelector("#successModal .close");
    const successOkBtn = document.getElementById("successOkBtn");

    // ✅ Hide success modal on page load
    if (successModal) {
        successModal.style.display = "none";
        successModal.style.opacity = "0"; // Avoid flash effect
    }

    // ============================
    // ✅ Generate Random Reference Number
    // ============================
    function generateReferenceNumber() {
        return "TXN" + Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    // ============================
    // ✅ Close Modal Function
    // ============================
    function closeModal(modal) {
        if (modal) {
            modal.style.display = "none";
            modal.style.opacity = "0";
        }
    }

    // ============================
    // ✅ Open Modal Function
    // ============================
    function openModal(modal) {
        if (modal) {
            modal.style.display = "flex"; // ✅ Show modal properly
            modal.style.opacity = "1";
        } else {
            console.error("❌ Modal not found!");
        }
    }


    // ============================
    // ✅ Submit Renter Details with Validations
    // ============================
    submitRenterBtn.addEventListener("click", function () {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const mobileNumber = document.getElementById("mobileNumber").value.trim();
        const address = document.getElementById("address").value.trim();
        const licenseNumber = document.getElementById("licenseNumber").value.trim();

        // ============================
        // 🚨 Validation Rules
        // ============================
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const mobilePattern = /^[0-9]{11}$/; // 11-digit mobile number
        const licensePattern = /^[A-Z]{3}-[0-9]{4}-[A-Z]{2}$/; // e.g., ABC-1234-XY

        // ============================
        // ❌ Validate Empty Fields
        // ============================
        if (!firstName || !lastName || !email || !mobileNumber || !address || !licenseNumber) {
            alert("❗ Please fill in all the required fields.");
            return;
        }

        // ============================
        // ❌ Validate Email Format
        // ============================
        if (!emailPattern.test(email)) {
            alert("❌ Invalid email format. Please enter a valid email (e.g., example@email.com).");
            return;
        }

        // ============================
        // ❌ Validate Mobile Number Format
        // ============================
        if (!mobilePattern.test(mobileNumber)) {
            alert("❌ Invalid mobile number. Please enter an 11-digit valid mobile number.");
            return;
        }

        // ============================
        // ❌ Validate License Number Format
        // ============================
        if (!licensePattern.test(licenseNumber)) {
            alert("❌ Invalid license number. Format should be ABC-1234-XY.");
            return;
        }

        // ✅ All Validations Passed
        closeModal(renterModal); // Close Renter Modal
        referenceNumberSpan.textContent = generateReferenceNumber(); // Generate Reference
        openModal(successModal); // Open Success Modal
    });

    // ============================
    // ✅ Close Success Modal on X Button Click
    // ============================
    closeSuccessModal.addEventListener("click", function () {
        closeModal(successModal);
    });

    // ✅ Close Success Modal on OK Button Click
    successOkBtn.addEventListener("click", function () {
        closeModal(successModal);
    });

    // ✅ Close Modal When Clicking Outside Modal
    window.addEventListener("click", function (event) {
        if (event.target === successModal) {
            closeModal(successModal);
        }
    });
});


