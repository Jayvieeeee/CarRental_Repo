// T&C Modal

// Open T&C Modal

console.log("rent.js is loaded and running!");

function openModal(CarId, price) {
    let modal = document.getElementById("rentModal");

    if (modal) {
        modal.style.display = "flex";

        let hiddenCarId = document.getElementById("CarId");
        if (hiddenCarId) {
            hiddenCarId.value = CarId;
        }
        localStorage.setItem("selectedCarId", CarId);
        localStorage.setItem(`carPrice_${CarId}`, price);
    }
}

// Close T&C Modal
function closeModal() {
    let modal = document.getElementById("rentModal");
    if (modal) {
        modal.style.display = "none";
    }
}

function toggleAcceptButton() {
    let termsCheckbox = document.getElementById("termsCheckbox");
    let acceptButton = document.getElementById("acceptButton");

    if (termsCheckbox && acceptButton) {
        acceptButton.disabled = !termsCheckbox.checked;
        acceptButton.classList.toggle("enabled", termsCheckbox.checked);
    }
}

function calculateEstimatedPrice() {
    let rentalDate = new Date(document.getElementById("rentalDate").value);
    let returnDate = new Date(document.getElementById("returnDate").value);
    let estimatedPriceInput = document.getElementById("estimatedPrice");

    let carId = localStorage.getItem("selectedCarId") || document.getElementById("CarId")?.value || null;


    if (!carId) {
        console.error("No Car ID Found!");
        estimatedPriceInput.value = "Error: No car selected!";
        return;
    }

    let carRentalPrice = localStorage.getItem(`carPrice_${carId}`);

    if (!carRentalPrice) {
        estimatedPriceInput.value = "Error: Car price not found!";
        return;
    }

    let timeDiff = returnDate - rentalDate;
    let days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    let totalPrice = days * parseFloat(carRentalPrice);
    estimatedPriceInput.value = `₱${totalPrice.toLocaleString()}`;
    console.log("Estimated Price Set:", estimatedPriceInput.value);
}

// Close button functionality
document.addEventListener("DOMContentLoaded", function () {
 
    let closeBtn = document.querySelector(".modal .close");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Open Rental Details Modal after Accept button is clicked
    acceptButton.addEventListener("click", function () {
        document.getElementById("rentModal").style.display = "none"; // Close terms modal
        rentalDetailsModal.style.display = "flex"; // Open rental details modal
    });

    // Enable confirm button only when fields are valid
    function validateForm() {
        let pickup = document.getElementById("rentalDate").value;
        let returnDate = document.getElementById("returnDate").value;
        let confirmRentalBtn = document.getElementById("confirmRentalBtn");

        let pickupError = document.getElementById("pickupError");
        let returnError = document.getElementById("returnError");

        document.getElementById("rentalDate").addEventListener("input", calculateEstimatedPrice);
        document.getElementById("returnDate").addEventListener("input", calculateEstimatedPrice);


        let isValid = true;

        // Validate Pick-up Date (Must not be empty)
        if (!pickup) {
            pickupError.style.display = "block";
            isValid = false;
        } else {
            pickupError.style.display = "none";

        if (!returnDate || returnDate <= pickup) {
            returnError.style.display = "block";
            isValid = false;
        } else {
            returnError.style.display = "none";
        }

        // Enable or disable the confirm button
        confirmRentalBtn.disabled = !isValid;
        confirmRentalBtn.classList.toggle("enabled", isValid);
    }

    // Validate Date Inputs in Real-Time
    document.getElementById("rentalDate").addEventListener("input", validateForm);
    document.getElementById("returnDate").addEventListener("input", validateForm);

    // Confirm Rental button click logic
    let confirmRentalBtn = document.getElementById("confirmRentalBtn");
    if (confirmRentalBtn) {
        confirmRentalBtn.addEventListener("click", function () {
            rentalDetailsModal.style.display = "none"; // Close rental details modal
            document.getElementById("renterDetailsModal").style.display = "flex"; // Open renter details modal
        });
    }
});



function closeRenterModal() {
    let modal = document.getElementById("renterDetailsModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Function to open the Confirmation modal
function openConfirmationModal() {
    let modal = document.getElementById("confirmationModal");
    let okButton = document.getElementById("okButton");

    if (modal) {
        modal.style.display = "flex"; 
    }

    if (okButton) {
        okButton.disabled = false; 
        okButton.classList.add("enabled"); 
        okButton.style.pointerEvents = "auto"; 
    }
}

function closeConfirmationModal() {
    let modal = document.getElementById("confirmationModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Ensure "OK" button is clickable
document.addEventListener("DOMContentLoaded", function () {
    let okButton = document.getElementById("okButton");
    if (okButton) {
        okButton.addEventListener("click", closeConfirmationModal);
    }
});


// Renter Form Validation
document.addEventListener("DOMContentLoaded", function () {

    let renterForm = document.getElementById("renterForm");
    let submitButton = renterForm.querySelector("button[type='submit']");
    let licenseInput = document.getElementById("licenseNo");
    let addressInput = document.getElementById("address");
    let phoneInput = document.getElementById("contactNo");

    function validateLicense() {
        let licensePattern = /^[A-Z]\d{2}-\d{2}-\d{6}$/; // A12-12-123456
        return licensePattern.test(licenseInput.value);
    }

    function validateForm() {
        let allFieldsFilled =
            licenseInput.value.trim() !== "" &&
            addressInput.value.trim() !== "" &&
            phoneInput.value.trim() !== "" &&
            validateLicense(); 

        submitButton.disabled = !allFieldsFilled;
        submitButton.classList.toggle("enabled", allFieldsFilled);
    }

    // Real-time validation
    licenseInput.addEventListener("input", validateForm);
    addressInput.addEventListener("input", validateForm);
    phoneInput.addEventListener("input", validateForm);


    validateForm();

    renterForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent actual form submission

        if (!submitButton.disabled) {
            closeRenterModal(); 
            openConfirmationModal(); 
        } else {
            alert("Please fill out all fields correctly.");
        }
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetch user info and wait for response
        const response = await fetch("https://localhost:7181/guest/account/userinfo", {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (data.userId) {
            localStorage.setItem("userId", data.userId); 
        } else {
            console.error(" No userId found in response");
        }
    } catch (error) {
        console.error(" Error fetching user info:", error);
    }


    let userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Error: User ID is missing. Please log in.");
        return;
    } else {
        console.log(" User ID detected:", userId);
    }

    let form = document.getElementById("renterForm");
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            let carId = localStorage.getItem("selectedCarId");
            let rentalDate = document.getElementById("rentalDate").value;
            let returnDate = document.getElementById("returnDate").value;
            let contactNo = document.getElementById("contactNo").value;
            let licenseNo = document.getElementById("licenseNo").value;
            let address = document.getElementById("address").value;

            if (!carId) {
                alert("Error: No car selected!");
                return;
            }

            let estimatedPriceInput = document.getElementById("estimatedPrice");
            let estimatedPrice = estimatedPriceInput.value.trim().replace(/[₱,]/g, "");

            if (!estimatedPrice || isNaN(estimatedPrice)) {
                alert("Error: Estimated price is invalid!");
                return;
            }


            let requestData = {
                userId: parseInt(userId),
                carId: parseInt(carId),
                rentalDate: new Date(rentalDate).toISOString(),
                returnDate: new Date(returnDate).toISOString(),
                estimatedPrice: parseFloat(estimatedPrice),
                contactNo: contactNo,
                licenseNo: licenseNo,
                address: address
            };

            console.log("Sending rental request:", JSON.stringify(requestData, null, 2));

            try {
                let response = await fetch("https://localhost:7181/api/customer/rentcar/requestrental", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(requestData)
                });

                console.log(" Fetch response status:", response.status);

                let result = await response.json();
                console.log("Response from server:", result);

                if (result.success) {
                    //alert("Rental request successfully sent!");
                    closeRenterModal();
                    openConfirmationModal();
                } else {
                    alert("Error: " + result.message);
                }
            } catch (error) {
                console.error("Request failed:", error);
                alert("Something went wrong. Please try again.");
            }
        });
    }
});
