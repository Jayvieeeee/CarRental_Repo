document.addEventListener("DOMContentLoaded", function () {
    console.log("carlist.js loaded successfully!"); // ✅ JS loaded check

    const editModal = document.getElementById("editCarModal");
    const deleteModal = document.getElementById("deleteCarModal");
    const addCarModal = document.getElementById("addCarModal");

    const openAddCarModal = document.getElementById("openAddCarModal");

    const closeEditModal = document.getElementById("closeModal");
    const closeDeleteModal = document.getElementById("closeDeleteModal");
    const closeAddModal = document.getElementById("closeAddModal");

    const cancelEdit = document.getElementById("cancelEdit");
    const cancelDelete = document.getElementById("cancelDelete");
    const cancelAddCar = document.getElementById("cancelAddCar");

    const saveAddCar = document.getElementById("saveAddCar");

    if (openAddCarModal) {
        openAddCarModal.addEventListener("click", function () {
            console.log("Opening Add Car Modal");
            addCarModal.style.display = "block";
        });
    }

    const closeModals = (modal) => {
        if (modal) modal.style.display = "none";
    };
    // x icon modals close
    if (closeEditModal && closeDeleteModal && closeAddModal) {
        closeEditModal.onclick = () => closeModals(editModal);
        closeDeleteModal.onclick = () => closeModals(deleteModal);
        closeAddModal.onclick = () => closeModals(addCarModal);
    }

    // cancel button modal
    if (cancelEdit && cancelDelete && cancelAddCar) {
        cancelEdit.onclick = () => closeModals(editModal);
        cancelDelete.onclick = () => closeModals(deleteModal);
        cancelAddCar.onclick = () => closeModals(addCarModal);
    }


    // close modal when clicked outside
    window.onclick = (event) => {
        if (event.target === addCarModal) closeModals(addCarModal);
        if (event.target === editModal) closeModals(editModal);
        if (event.target === deleteModal) closeModals(deleteModal);
    };

   // Add Car Modal
    if (saveAddCar) {
        saveAddCar.addEventListener("click", function () {
            const formData = new FormData(document.getElementById("addCarForm"));

            fetch("/Admin/CarList/AddCar", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message);
                        closeModals(addCarModal);
                        location.reload(); // Reload after adding car
                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(err => console.error("Error adding car:", err));
        });
    }

    // Edit Modal
    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const carId = this.getAttribute("data-id");
            console.log("Editing Car ID:", carId);

            fetch(`/CarList/GetCar?id=${carId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById("CarId").value = data.carId;
                        document.getElementById("Brand").value = data.brand;
                        document.getElementById("Model").value = data.model;
                        document.getElementById("Seaters").value = data.seaters;
                        document.getElementById("RentalPrice").value = data.rentalPrice;
                        document.getElementById("Status").value = data.status;
                        editModal.style.display = "block";
                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(err => console.error("Error fetching car:", err));
        });
    });

    //  Delete Modal
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const carId = this.getAttribute("data-id");
            console.log("Deleting Car ID:", carId);

            fetch(`/CarList/GetCar?id=${carId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById("deleteCarId").value = data.carId;
                        document.getElementById("deleteBrand").value = data.brand;
                        document.getElementById("deleteModel").value = data.model;
                        document.getElementById("deleteSeaters").value = data.seaters;
                        document.getElementById("deleteRentalPrice").value = data.rentalPrice;
                        document.getElementById("deleteStatus").value = data.status;
                        deleteModal.style.display = "block";
                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(err => console.error("Error fetching car for delete:", err));
        });
    });
});
