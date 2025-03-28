function logoutUser() {
    fetch('/Guest/Account/Logout', {
        method: 'POST', 
        credentials: 'include'
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url; 
            } else {
                return response.text();
            }
        })
        .then(data => {
            console.log("Logout Response:", data);
            window.location.href = "/Guest/Account/Login"; 
        })
        .catch(error => console.error('Logout Error:', error));
}
