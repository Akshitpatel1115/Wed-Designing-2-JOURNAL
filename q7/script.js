$(document).ready(function() {

    // --- 1. Sign Up Page Logic ---
    if ($('#signupForm').length > 0) {
        // Initialize jQuery Validation for Sign Up Form
        $('#signupForm').validate({
            rules: {
                name: {
                    required: true,
                    minlength: 3
                },
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 6
                },
                confirmPassword: {
                    required: true,
                    equalTo: "#password"
                }
            },
            messages: {
                name: {
                    required: "Please enter your full name",
                    minlength: "Name must consist of at least 3 characters"
                },
                email: "Please enter a valid email address",
                password: {
                    required: "Please provide a password",
                    minlength: "Password must be at least 6 characters long"
                },
                confirmPassword: {
                    required: "Please confirm your password",
                    equalTo: "Passwords do not match"
                }
            },
            errorElement: "div",
            errorPlacement: function(error, element) {
                error.addClass("invalid-feedback text-danger mt-1 small");
                error.insertAfter(element);
            },
            highlight: function(element) {
                $(element).addClass("is-invalid").removeClass("is-valid");
            },
            unhighlight: function(element) {
                $(element).addClass("is-valid").removeClass("is-invalid");
            },
            submitHandler: function(form) {
                // On successful validation
                const user = {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    password: $('#password').val() // Storing plain text password for simple college project
                };
                
                // Store user data in localStorage
                localStorage.setItem('movieAppUser', JSON.stringify(user));
                
                alert("Sign Up Successful! Please login to continue.");
                window.location.href = "login.html"; // Redirect to login
            }
        });
    }

    // --- 2. Login Page Logic ---
    if ($('#loginForm').length > 0) {
        $('#loginForm').validate({
            rules: {
                loginEmail: {
                    required: true,
                    email: true
                },
                loginPassword: {
                    required: true
                }
            },
            messages: {
                loginEmail: "Please enter a valid email address",
                loginPassword: "Password is required"
            },
            errorElement: "div",
            errorPlacement: function(error, element) {
                error.addClass("invalid-feedback text-danger mt-1 small");
                error.insertAfter(element);
            },
            highlight: function(element) {
                $(element).addClass("is-invalid").removeClass("is-valid");
            },
            unhighlight: function(element) {
                $(element).addClass("is-valid").removeClass("is-invalid");
            },
            submitHandler: function(form) {
                const enteredEmail = $('#loginEmail').val();
                const enteredPassword = $('#loginPassword').val();
                
                // Retrieve user data from localStorage to authenticate
                const storedUserData = localStorage.getItem('movieAppUser');
                
                if (storedUserData) {
                    const user = JSON.parse(storedUserData);
                    // Check credentials
                    if (user.email === enteredEmail && user.password === enteredPassword) {
                        // Login successful
                        sessionStorage.setItem('isLoggedIn', 'true');
                        sessionStorage.setItem('currentUserName', user.name);
                        window.location.href = "booking.html"; // Redirect to movie booking
                    } else {
                        // Show error alert
                        $('#loginError').removeClass('d-none');
                    }
                } else {
                    alert("No account found with this email. Please sign up first.");
                }
            }
        });
    }

    // --- 3. Movie Booking Page Logic ---
    if ($('#movieList').length > 0) {
        
        // 3a. Authentication Check (Protect Route)
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            alert("Please login first to access the booking page.");
            window.location.href = "login.html";
        }

        // Display user name on navbar
        $('#userNameDisplay').text("Hi, " + sessionStorage.getItem('currentUserName'));

        // Handle Logout
        $('#logoutBtn').click(function() {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('currentUserName');
            window.location.href = "login.html";
        });

        let selectedMoviePrice = 0;

        // 3b. Fetch Movies using AJAX from JSON file
        $.ajax({
            url: 'movies.json', // Our local JSON file
            method: 'GET',
            dataType: 'json',
            success: function(movies) {
                $('#loadingMovies').hide(); // Hide loading indicator
                let htmlContent = '';
                
                if (!movies || movies.length === 0) {
                    $('#movieList').html('<div class="col-12 text-center text-muted">No movies available at the moment.</div>');
                    return;
                }

                // Iterate carefully through JSON array Using jQuery .each
                $.each(movies, function(index, movie) {
                    htmlContent += `
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="card h-100 shadow-sm movie-card border-0 rounded-4 overflow-hidden">
                                <div class="card-body p-4 text-center">
                                    <h4 class="card-title text-primary fw-bold mb-1">${movie.title}</h4>
                                    <span class="badge bg-secondary mb-3">${movie.genre}</span>
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <div class="text-start">
                                            <small class="text-muted d-block">Time</small>
                                            <span class="fw-medium text-dark">${movie.showTime}</span>
                                        </div>
                                        <div class="text-end">
                                            <small class="text-muted d-block">Price</small>
                                            <span class="fw-bold text-success fs-5">₹${movie.price}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer bg-light border-0 p-3">
                                    <button class="btn btn-primary w-100 fw-bold rounded-3 py-2 book-now-btn" 
                                        data-mtitle="${movie.title}" 
                                        data-mtime="${movie.showTime}" 
                                        data-mprice="${movie.price}">
                                        Book Ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                // Print HTML onto Page
                $('#movieList').html(htmlContent);

                // 3c. Handle Booking Modal logic based on selected ticket
                $('.book-now-btn').click(function() {
                    const title = $(this).data('mtitle');
                    const time = $(this).data('mtime');
                    const price = parseFloat($(this).data('mprice'));
                    
                    selectedMoviePrice = price;

                    // Set modal data
                    $('#modalMovieTitle').text(title);
                    $('#modalShowTime').text(time);
                    $('#modalPrice').text(price.toFixed(2));
                    
                    // Reset ticket input
                    $('#ticketCount').val(1);
                    $('#modalTotalAmount').text(price.toFixed(2));
                    
                    // Show Bootstrap 5 modal
                    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
                    bookingModal.show();
                });
            },
            error: function(xhr, status, error) {
                $('#loadingMovies').html('<div class="alert alert-danger shadow-sm text-center">Failed to load movies. If running locally, you might need a local server (like Live Server or python -m http.server) to fetch JSON.</div>');
            }
        });

        // 3d. Update Dynamic Total Price
        $('#ticketCount').on('input', function() {
            let count = parseInt($(this).val());
            if (isNaN(count) || count < 1) {
                count = 1;
            }
            if (count > 10) {
                count = 10;
                $(this).val(10);
            }
            const total = count * selectedMoviePrice;
            $('#modalTotalAmount').text(total.toFixed(2));
        });

        // 3e. Final Booking Confirmation popup
        $('#confirmBookingBtn').click(function() {
            const count = $('#ticketCount').val();
            const title = $('#modalMovieTitle').text();
            const totalAmount = $('#modalTotalAmount').text();
            
            // Native JS alert for confirmation
            alert(`Booking Confirmed!\n\nMovie: ${title}\nTickets: ${count}\nTotal Paid: ₹${totalAmount}\n\nEnjoy the show!`);
            
            // Hide the modal properly via Bootstrap
            const modalEl = document.getElementById('bookingModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();
        });
    }
});
