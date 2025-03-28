
        $(document).ready(function () {
            let resendCooldown = 60; // Cooldown in seconds
            let countdownInterval;


            $("#closeModal").on("click", function () {
                window.location.href = "/Guest/Account/ForgotPassword";
            });

            $(document).on("submit", "#verifyCodeForm", function (e) {
                e.preventDefault();

                let formData = $(this).serialize();

                $.ajax({
                    url: this.action,
                    method: this.method,
                    data: formData,
                    dataType: "json",
                    success: function (response) {

                        if (response.success) {
                            let redirectUrl = response.redirectUrl;
  
                            window.location.href = redirectUrl;
                        } else {
    
                            $(".error-message").text(response.message).show();
                        }
                    },
                    error: function (xhr, status, error) {
                      
                        alert("Error processing request. Please try again.");
                    }
                });
            });

            $("#resendCode").on("click", function (e) {
                e.preventDefault();
                let $this = $(this);
                if ($this.prop("disabled")) return;

                $this.prop("disabled", true);
                startCountdown(resendCooldown);

                let email = $("input[name='Email']").val();
               

                $.ajax({
                    url: "/Guest/Account/ResendCode",
                    method: "POST",
                    data: { email: email },
                    success: function (response) {
                    
                        if (response.success) {
                       
                            alert("Verification code has been resent to your email.");
                        } else {
                            alert(response.message);
                            clearInterval(countdownInterval);
                            $this.prop("disabled", false).text("Resend Code");
                        }
                    },
                    error: function (xhr, status, error) {
                       
                        alert("Error processing request.");
                        clearInterval(countdownInterval);
                        $this.prop("disabled", false).text("Resend Code");
                    }
                });
            });

            // ✅ Start Countdown Timer
            function startCountdown(timeLeft) {
                let $resendTimer = $("#resendTimer");
                let $resendCode = $("#resendCode");

                $resendCode.text(`Resend Code (${timeLeft}s)`);
                countdownInterval = setInterval(function () {
                    timeLeft--;
                    $resendCode.text(`Resend Code (${timeLeft}s)`);

                    if (timeLeft <= 0) {
                        clearInterval(countdownInterval);
                        $resendCode.prop("disabled", false).text("Resend Code");
                    }
                }, 1000);
            }
        });
