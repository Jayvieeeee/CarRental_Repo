document.addEventListener("DOMContentLoaded", function () {
    class CarRentalSystem {
        constructor() {
            // Cache DOM elements
            this.cacheElements();

            // Initialize state
            this.selectedCar = {};

            // Set up the system
            this.initialize();
        }

        cacheElements() {
            // Modals
            this.termsModal = document.getElementById("termsModal");
            this.rentalModal = document.getElementById("rentalModal");
            this.renterModal = document.getElementById("renterModal");
            this.successModal = document.getElementById("successModal");
            this.detailsModal = document.getElementById("detailsModal");

            // Buttons
            this.agreeCheckbox = document.getElementById("agreeCheckbox");
            this.acceptBtn = document.getElementById("acceptBtn");
            this.submitRenterBtn = document.getElementById("submitRenterBtn");
            this.confirmRentalBtn = document.getElementById("confirmRentalBtn");
            this.rentNowBtn = document.getElementById("rentNowBtn");
            this.successOkBtn = document.getElementById("successOkBtn");

            // Data display elements
            this.carModelElem = document.getElementById("carModel");
            this.ratePerDayElem = document.getElementById("ratePerDay");
            this.daysRentedElem = document.getElementById("daysRented");
            this.totalPaymentElem = document.getElementById("totalPayment");
            this.referenceNumberSpan = document.getElementById("referenceNumber");

            // Form elements
            this.termsBox = document.getElementById("termsBox");
            this.pickupDateInput = document.getElementById("pickupDate");
            this.returnDateInput = document.getElementById("returnDate");

            // Renter form elements
            this.firstNameInput = document.getElementById("firstName");
            this.lastNameInput = document.getElementById("lastName");
            this.emailInput = document.getElementById("email");
            this.mobileNumberInput = document.getElementById("mobileNumber");
            this.addressInput = document.getElementById("address");
            this.licenseNumberInput = document.getElementById("licenseNumber");
        }

        initialize() {
            // Set initial states
            this.hideElement(this.successModal);
            this.confirmRentalBtn.disabled = true;
            this.acceptBtn.disabled = true;

            // Set up event listeners
            this.setupEventListeners();

            // Set minimum date for date pickers
            const today = new Date();
            const todayFormatted = today.toISOString().split('T')[0];
            this.pickupDateInput.setAttribute('min', todayFormatted);

            // Disable all previous dates in the date picker
            this.disablePastDates(this.pickupDateInput);

            this.returnDateInput.disabled = true; // Disable return date initially
            this.setupDateValidation();
        }

        setupEventListeners() {
            // Car list interactions
            const carList = document.querySelector(".car-list");
            if (carList) {
                carList.addEventListener("click", (e) => this.handleCarListClick(e));
            }

            // Modal close handlers
            this.setupModalCloseHandlers();

            // Terms modal specific
            this.termsBox.addEventListener("scroll", (e) => this.handleTermsScroll(e));
            this.agreeCheckbox.addEventListener("change", () => this.toggleAcceptButton());
            this.acceptBtn.addEventListener("click", () => this.handleAcceptTerms());

            // Rental modal specific
            this.pickupDateInput.addEventListener("change", () => this.updateTotalPayment());
            this.returnDateInput.addEventListener("change", () => this.updateTotalPayment());
            this.confirmRentalBtn.addEventListener("click", (e) => this.handleConfirmRental(e));

            // Renter modal specific
            this.submitRenterBtn.addEventListener("click", (e) => this.handleSubmitRenter(e));

            // Success modal
            this.successOkBtn.addEventListener("click", () => this.closeSuccessModal());

            // Rent Now button in details modal
            this.rentNowBtn.addEventListener("click", () => {
                this.closeModal(this.detailsModal);
                this.openTermsModal();
            });
        }

        setupModalCloseHandlers() {
            // Close buttons - handle both regular modals and details modal
            document.querySelectorAll(".modal .close, .details-modal .close").forEach(closeBtn => {
                closeBtn.addEventListener("click", (e) => {
                    const modal = e.target.closest(".modal, .details-modal");
                    this.closeModal(modal);
                });
            });

            // Click outside to close - handle both regular modals and details modal
            document.querySelectorAll(".modal, .details-modal").forEach(modal => {
                modal.addEventListener("click", (e) => {
                    if (e.target === modal) {
                        this.closeModal(modal);
                    }
                });
            });
        }


        handleCarListClick(e) {
            const rentButton = e.target.closest(".rent-badge");
            const detailsButton = e.target.closest(".details-link") || (e.target.tagName === "A" && e.target.classList.contains("details-link"));

            if (rentButton) {
                e.preventDefault();
                this.handleRentButtonClick(rentButton);
            } else if (detailsButton) {
                e.preventDefault();
                this.handleDetailsButtonClick(detailsButton);
            }
        }

        handleRentButtonClick(rentButton) {
            const carCard = rentButton.closest(".car-card");
            this.selectedCar = {
                id: rentButton.dataset.id,
                model: carCard.querySelector("h2").innerText,
                ratePerDay: this.parsePrice(carCard.querySelector(".price").innerText),
                element: carCard
            };

            this.openTermsModal();
        }

        handleDetailsButtonClick(detailsButton) {
            const carCard = detailsButton.closest(".car-card");

            // Store all car details including the rate per day
            this.selectedCar = {
                id: detailsButton.dataset.id,
                model: carCard.querySelector("h2").innerText,
                ratePerDay: this.parsePrice(carCard.querySelector(".price").innerText),
                price: carCard.querySelector(".price").innerText,
                image: carCard.querySelector(".car-image").src,
                makeModel: carCard.dataset.makeModel,
                seaters: carCard.dataset.seaters,
                fuelType: carCard.dataset.fuelType,
                fuelTankCapacity: carCard.dataset.fuelTank,
                transmission: carCard.dataset.transmission,
                groundClearance: carCard.dataset.clearance
            };

            // Update details modal content
            document.getElementById("carDetailsTitle").textContent = this.selectedCar.model;
            document.getElementById("carDetailsImage").src = this.selectedCar.image;
            document.getElementById("carDetailsPrice").innerHTML = `<strong>${this.selectedCar.price}</strong> per day`;

            // Update specifications
            document.getElementById("makeModel").textContent = this.selectedCar.makeModel;
            document.getElementById("seaters").textContent = this.selectedCar.seaters;
            document.getElementById("fuelType").textContent = this.selectedCar.fuelType;
            document.getElementById("fuelTankCapacity").textContent = this.selectedCar.fuelTankCapacity;
            document.getElementById("transmission").textContent = this.selectedCar.transmission;
            document.getElementById("groundClearance").textContent = this.selectedCar.groundClearance;

            this.openModal(this.detailsModal);
        }

        // ======================
        // MODAL MANAGEMENT
        // ======================

        showElement(element) {
            element.style.display = "flex";
            document.body.classList.add("modal-open");
        }

        hideElement(element) {
            element.style.display = "none";
            document.body.classList.remove("modal-open");
        }

        openModal(modal) {
            console.log(`Opening modal: ${modal.id}`);
            this.showElement(modal);
        }

        closeModal(modal) {
            console.log(`Closing modal: ${modal.id}`);
            this.hideElement(modal);
        }

        openTermsModal() {
            this.resetModalState();
            this.openModal(this.termsModal);
        }

        // ======================
        // TERMS MODAL FUNCTIONS
        // ======================

        handleTermsScroll(e) {
            const termsBox = e.target;
            const scrolledToBottom = termsBox.scrollTop + termsBox.clientHeight >= termsBox.scrollHeight - 1;

            if (scrolledToBottom) {
                this.agreeCheckbox.checked = true;
                this.acceptBtn.disabled = false;
            }
        }

        handleAcceptTerms() {
            if (!this.agreeCheckbox.checked) {
                this.showError("Please agree to the terms and conditions first.");
                return;
            }

            this.closeModal(this.termsModal);
            this.openRentalModal();
        }

        toggleAcceptButton() {
            this.acceptBtn.disabled = !this.agreeCheckbox.checked;
        }

        // ======================
        // RENTAL MODAL FUNCTIONS
        // ======================

        openRentalModal() {
            if (!this.selectedCar.model || !this.selectedCar.ratePerDay) {
                this.showError("Error: No car selected. Please try again.");
                return;
            }

            // Reset the date inputs and disable return date
            this.pickupDateInput.value = "";
            this.returnDateInput.value = "";
            this.returnDateInput.disabled = true;
            this.resetPaymentDisplay();

            this.carModelElem.innerText = this.selectedCar.model;
            this.ratePerDayElem.innerText = this.formatPrice(this.selectedCar.ratePerDay);

            this.openModal(this.rentalModal);
        }

        disablePastDates(dateInput) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            dateInput.addEventListener('input', (e) => {
                const selectedDate = new Date(e.target.value);
                selectedDate.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    this.showError("Please select today's date or a future date");
                    e.target.value = '';
                    this.resetPaymentDisplay();
                }
            });
        }

        setupDateValidation() {
            this.pickupDateInput.addEventListener('change', () => {
                if (this.pickupDateInput.value) {
                    const pickupDate = new Date(this.pickupDateInput.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (pickupDate < today) {
                        this.showError("Pickup date cannot be in the previous days");
                        this.pickupDateInput.value = '';
                        this.returnDateInput.disabled = true;
                        this.returnDateInput.value = '';
                        this.resetPaymentDisplay();
                        return;
                    }

                    this.returnDateInput.disabled = false;
                    this.returnDateInput.min = this.pickupDateInput.value;

                    if (this.returnDateInput.value && this.returnDateInput.value < this.pickupDateInput.value) {
                        this.returnDateInput.value = '';
                        this.resetPaymentDisplay();
                    }
                } else {
                    this.returnDateInput.disabled = true;
                    this.returnDateInput.value = '';
                    this.resetPaymentDisplay();
                }
                this.updateTotalPayment();
            });

            this.returnDateInput.addEventListener('change', () => {
                this.updateTotalPayment();
            });
        }

        updateTotalPayment() {
            if (!this.pickupDateInput.value) {
                this.resetPaymentDisplay();
                return;
            }

            if (this.pickupDateInput.value && this.returnDateInput.value) {
                const pickupDate = new Date(this.pickupDateInput.value);
                const returnDate = new Date(this.returnDateInput.value);

                if (returnDate <= pickupDate) {
                    this.showError("Return date must be after pickup date");
                    this.returnDateInput.value = '';
                    this.resetPaymentDisplay();
                    return;
                }

                const diffTime = Math.abs(returnDate - pickupDate);
                const daysRented = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const totalPayment = daysRented * this.selectedCar.ratePerDay;

                this.daysRentedElem.innerText = daysRented;
                this.totalPaymentElem.innerText = this.formatPrice(totalPayment);
                this.confirmRentalBtn.disabled = false;
            } else {
                this.resetPaymentDisplay();
            }
        }

        handleConfirmRental(e) {
            e.preventDefault();

            const pickupDateValue = this.pickupDateInput.value.trim();
            const returnDateValue = this.returnDateInput.value.trim();

            if (!pickupDateValue || !returnDateValue) {
                this.showError("Please select both pickup and return dates.");
                return;
            }

            if (this.confirmRentalBtn.disabled) {
                this.showError("Please fix the date selection before proceeding.");
                return;
            }

            this.showAlert(`Rental confirmed for ${this.selectedCar.model}!`);
            this.closeModal(this.rentalModal);
            this.openRenterModal();
        }

        // ======================
        // RENTER DETAILS HANDLING
        // ======================

        openRenterModal() {
            this.resetRenterModalState();
            this.openModal(this.renterModal);
        }

        handleSubmitRenter(e) {
            e.preventDefault();
            console.log("Submit button clicked - starting validation");

            if (!this.validateRenterForm()) {
                console.log("Form validation failed");
                return;
            }

            console.log("Form validation passed - proceeding to show success modal");

            this.closeModal(this.renterModal);

            const refNumber = this.generateReferenceNumber();
            console.log("Generated reference number:", refNumber);
            this.referenceNumberSpan.textContent = refNumber;

            console.log("Attempting to open success modal");
            this.openModal(this.successModal);
        }

        validateRenterForm() {
            const formData = {
                firstName: this.firstNameInput.value.trim(),
                lastName: this.lastNameInput.value.trim(),
                email: this.emailInput.value.trim(),
                mobileNumber: this.mobileNumberInput.value.trim().replace(/\s/g, ''),
                address: this.addressInput.value.trim(),
                licenseNumber: this.licenseNumberInput.value.trim()
            };

            console.log("Form data:", formData);

            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const mobilePattern = /^[0-9]{11}$/;
            const licensePattern = /^[A-Za-z]{2,3}-[0-9]{2,4}-[0-9]{4,5}$/;

            for (const [field, value] of Object.entries(formData)) {
                if (!value) {
                    this.showError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                    return false;
                }
            }

            if (!emailPattern.test(formData.email)) {
                this.showError("Please enter a valid email address (e.g., example@email.com).");
                return false;
            }

            if (!mobilePattern.test(formData.mobileNumber)) {
                this.showError("Please enter a valid 11-digit mobile number (e.g., 09123456789).");
                return false;
            }

            if (!licensePattern.test(formData.licenseNumber)) {
                this.showError("License number format should be ABC-1234-56789 (as shown in the placeholder).");
                return false;
            }

            console.log("All validations passed");
            return true;
        }

        // ======================
        // SUCCESS MODAL
        // ======================

        closeSuccessModal() {
            this.closeModal(this.successModal);
        }

        // ======================
        // UTILITY FUNCTIONS
        // ======================

        parsePrice(priceString) {
            return parseInt(priceString.replace("₱", "").replace(",", "").split(" ")[0]);
        }

        formatPrice(amount) {
            return `₱${amount.toLocaleString()}`;
        }

        generateReferenceNumber() {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789';
            let result = 'TXN-';

            for (let i = 0; i < 3; i++) {
                result += letters.charAt(Math.floor(Math.random() * letters.length));
            }

            result += '-';

            for (let i = 0; i < 4; i++) {
                result += numbers.charAt(Math.floor(Math.random() * numbers.length));
            }

            result += '-';

            for (let i = 0; i < 2; i++) {
                result += letters.charAt(Math.floor(Math.random() * letters.length));
            }

            return result;
        }

        showError(message) {
            alert(`❌ Error: ${message}`);
        }

        showAlert(message) {
            alert(`✅ ${message}`);
        }

        resetPaymentDisplay() {
            this.daysRentedElem.innerText = "0";
            this.totalPaymentElem.innerText = this.formatPrice(0);
            this.confirmRentalBtn.disabled = true;
        }

        resetModalState() {
            this.agreeCheckbox.checked = false;
            this.acceptBtn.disabled = true;
            this.termsBox.scrollTop = 0;
            this.pickupDateInput.value = "";
            this.returnDateInput.value = "";
            this.resetPaymentDisplay();
        }

        resetRenterModalState() {
            this.firstNameInput.value = "";
            this.lastNameInput.value = "";
            this.emailInput.value = "";
            this.mobileNumberInput.value = "";
            this.addressInput.value = "";
            this.licenseNumberInput.value = "";
        }
    }

    // Initialize the system
    new CarRentalSystem();
});