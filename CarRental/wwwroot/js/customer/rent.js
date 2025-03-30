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
            const today = new Date().toISOString().split('T')[0];
            this.pickupDateInput.setAttribute('min', today);

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
        }

        setupModalCloseHandlers() {
            // Close buttons
            document.querySelectorAll(".modal .close").forEach(closeBtn => {
                closeBtn.addEventListener("click", (e) => {
                    const modal = e.target.closest(".modal");
                    this.closeModal(modal);
                });
            });

            // Click outside to close
            document.querySelectorAll(".modal").forEach(modal => {
                modal.addEventListener("click", (e) => {
                    if (e.target === modal) {
                        this.closeModal(modal);
                    }
                });
            });
        }

        handleCarListClick(e) {
            const rentButton = e.target.closest(".rent-badge");
            const detailsButton = e.target.closest(".details-link");

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
            this.selectedCar.id = detailsButton.dataset.id;

            // Update details modal content
            document.getElementById("carDetailsTitle").textContent = carCard.querySelector("h2").innerText;
            document.getElementById("carDetailsImage").src = carCard.querySelector(".car-image").src;
            document.getElementById("carDetailsPrice").innerText = carCard.querySelector(".price").innerText;

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
            if (!this.selectedCar.model) {
                this.showError("Error: No car selected. Please try again.");
                return;
            }

            this.carModelElem.innerText = this.selectedCar.model;
            this.ratePerDayElem.innerText = this.formatPrice(this.selectedCar.ratePerDay);
            this.updateTotalPayment();

            this.openModal(this.rentalModal);
        }

        setupDateValidation() {
            this.pickupDateInput.addEventListener('change', () => {
                if (this.pickupDateInput.value) {
                    this.returnDateInput.disabled = false;
                    this.returnDateInput.min = this.pickupDateInput.value;

                    // If return date is before pickup, clear it
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

        // Update the updateTotalPayment() method:
        updateTotalPayment() {
            // Clear payment if no pickup date
            if (!this.pickupDateInput.value) {
                this.resetPaymentDisplay();
                return;
            }

            // Only calculate if both dates are valid
            if (this.pickupDateInput.value && this.returnDateInput.value) {
                const pickupDate = new Date(this.pickupDateInput.value);
                const returnDate = new Date(this.returnDateInput.value);

                if (returnDate <= pickupDate) {
                    this.showError("Return date must be after pickup date");
                    this.returnDateInput.value = '';
                    this.resetPaymentDisplay();
                    return;
                }

                // Calculate rental period
                const diffTime = Math.abs(returnDate - pickupDate);
                const daysRented = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const totalPayment = daysRented * this.selectedCar.ratePerDay;

                // Update display
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

            // Validate form
            if (!this.validateRenterForm()) {
                console.log("Form validation failed");
                return;
            }

            console.log("Form validation passed - proceeding to show success modal");

            // Close renter modal
            this.closeModal(this.renterModal);

            // Generate and display reference number
            const refNumber = this.generateReferenceNumber();
            console.log("Generated reference number:", refNumber);
            this.referenceNumberSpan.textContent = refNumber;

            // Show success modal
            console.log("Attempting to open success modal");
            this.openModal(this.successModal);
        }

        validateRenterForm() {
            // Get form values
            const formData = {
                firstName: this.firstNameInput.value.trim(),
                lastName: this.lastNameInput.value.trim(),
                email: this.emailInput.value.trim(),
                mobileNumber: this.mobileNumberInput.value.trim().replace(/\s/g, ''),
                address: this.addressInput.value.trim(),
                licenseNumber: this.licenseNumberInput.value.trim()
            };

            console.log("Form data:", formData);

            // Validation patterns
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const mobilePattern = /^[0-9]{11}$/;
            const licensePattern = /^[A-Za-z]{2,3}-[0-9]{2,4}-[0-9]{4,5}$/; // Updated to match your placeholder format

            // Check empty fields
            for (const [field, value] of Object.entries(formData)) {
                if (!value) {
                    this.showError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                    return false;
                }
            }

            // Validate email
            if (!emailPattern.test(formData.email)) {
                this.showError("Please enter a valid email address (e.g., example@email.com).");
                return false;
            }

            // Validate mobile number
            if (!mobilePattern.test(formData.mobileNumber)) {
                this.showError("Please enter a valid 11-digit mobile number (e.g., 09123456789).");
                return false;
            }

            // Validate license number (updated to match your placeholder format)
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

            // Generate 3 random letters
            for (let i = 0; i < 3; i++) {
                result += letters.charAt(Math.floor(Math.random() * letters.length));
            }

            result += '-';

            // Generate 4 random numbers
            for (let i = 0; i < 4; i++) {
                result += numbers.charAt(Math.floor(Math.random() * numbers.length));
            }

            result += '-';

            // Generate 2 random letters
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