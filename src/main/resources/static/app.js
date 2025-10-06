// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // The base URL for your Java backend API
    const API_URL = '/api';

    // --- General Site Logic ---
    handleNavigation();
    handleLogout();

    // --- Page-Specific Logic ---
    // Run the correct function based on which page is currently loaded
    if (document.body.contains(document.getElementById('addDonorForm'))) {
        handleDonorRegistration();
    }
    if (document.body.contains(document.getElementById('newRequestForm'))) {
        handleBloodRequest();
    }
    if (document.body.contains(document.querySelector('.blood-group-stats'))) {
        fetchAndDisplayDonorCounts();
    }
    if (document.body.contains(document.getElementById('donorNotificationsList'))) {
        fetchAndDisplayDonorNotifications();
    }
    if (document.body.contains(document.getElementById('requesterNotificationsList'))) {
        fetchAndDisplayRequesterUpdates();
    }


    // --- Function Definitions ---

    function handleNavigation() {
        const requestBloodCard = document.getElementById('requestBlood');
        const findDonorCard = document.getElementById('findDonor');

        if (requestBloodCard) {
            requestBloodCard.addEventListener('click', () => { window.location.href = 'requester.html'; });
        }
        if (findDonorCard) {
            findDonorCard.addEventListener('click', () => { window.location.href = 'donor.html'; });
        }
    }

    function handleLogout() {
        const logoutButtons = document.querySelectorAll('.logout-btn');
        logoutButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Clear all session data on logout
                sessionStorage.removeItem('currentDonor');
                sessionStorage.removeItem('currentRequest');
                window.location.reload(); 
            });
        });
    }

    function handleDonorRegistration() {
        const addDonorForm = document.getElementById('addDonorForm');
        addDonorForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(addDonorForm);
            const donorData = {
                name: formData.get('name'),
                bloodGroup: formData.get('bloodGroup'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                lastDonatedDate: formData.get('lastDonatedDate') || null,
            };
            
            try {
                const response = await fetch(`${API_URL}/donors`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(donorData),
                });
                if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
                const result = await response.json();
                
                // Store donor data in sessionStorage to use on other pages
                sessionStorage.setItem('currentDonor', JSON.stringify(result));
                
                document.getElementById('addDonorContainer').style.display = 'none';
                const donorDashboard = document.getElementById('donorDashboard');
                donorDashboard.style.display = 'flex'; 

                document.getElementById('donorNameDisplay').textContent = result.name;
                document.getElementById('donorBloodGroupDisplay').textContent = result.bloodGroup;
                document.getElementById('donorPhoneDisplay').textContent = result.phone;
                document.getElementById('donorEmailDisplay').textContent = result.email;

            } catch (error) {
                console.error('Error registering donor:', error);
                alert('There was an error submitting your registration. Please ensure the backend server is running and try again.');
            }
        });
    }

    function handleBloodRequest() {
        const newRequestForm = document.getElementById('newRequestForm');
        newRequestForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(newRequestForm);
            const requestData = {
                patientName: formData.get('patientName'),
                requiredBloodGroup: formData.get('requiredBloodGroup'),
                phone: formData.get('phone'),
            };

            try {
                const response = await fetch(`${API_URL}/requests`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                });
                if (!response.ok) throw new Error(`Failed to submit request: ${response.statusText}`);
                const result = await response.json();

                // Store the created request in sessionStorage
                sessionStorage.setItem('currentRequest', JSON.stringify(result));

                document.getElementById('newRequestContainer').style.display = 'none';
                const requesterDashboard = document.getElementById('requesterDashboard');
                requesterDashboard.style.display = 'flex';

                document.getElementById('patientNameDisplay').textContent = result.patientName;
                document.getElementById('requiredBloodGroupDisplay').textContent = result.requiredBloodGroup;
                document.getElementById('requesterPhoneDisplay').textContent = result.phone;

            } catch (error) {
                console.error('Error submitting request:', error);
                alert('There was an error submitting your request. Please ensure the backend server is running and try again.');
            }
        });
    }

    async function fetchAndDisplayDonorCounts() {
        try {
            const response = await fetch(`${API_URL}/donors`);
            if (!response.ok) throw new Error('Failed to fetch donor data');
            const donors = await response.json();
            const counts = { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0 };
            donors.forEach(donor => {
                if (counts.hasOwnProperty(donor.bloodGroup)) {
                    counts[donor.bloodGroup]++;
                }
            });
            document.querySelectorAll('.blood-group-item').forEach(item => {
                const bloodType = item.querySelector('.blood-type').textContent;
                item.querySelector('.donor-count').textContent = counts[bloodType] || 0;
            });
        } catch (error) {
            console.error('Could not fetch donor counts:', error);
        }
    }

    async function fetchAndDisplayDonorNotifications() {
        const donorDataString = sessionStorage.getItem('currentDonor');
        const notificationsList = document.getElementById('donorNotificationsList');
        const emptyMessage = document.getElementById('emptyMessageContainer');

        if (!donorDataString) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            return;
        }
        const currentDonor = JSON.parse(donorDataString);
        const donorBloodGroup = currentDonor.bloodGroup;
        notificationsList.innerHTML = ''; 

        try {
            const response = await fetch(`${API_URL}/requests`);
            if (!response.ok) throw new Error('Failed to fetch requests.');
            const allRequests = await response.json();
            const matchingRequests = allRequests.filter(request => request.requiredBloodGroup === donorBloodGroup);

            if (matchingRequests.length === 0) {
                if (emptyMessage) emptyMessage.style.display = 'block';
            } else {
                if (emptyMessage) emptyMessage.style.display = 'none';
                matchingRequests.forEach(request => {
                    const notificationHTML = `
                        <div class="notification-item urgent">
                            <div class="notification-icon"><i class="fas fa-exclamation-circle"></i></div>
                            <div class="notification-content">
                                <h3>Urgent Request for ${request.requiredBloodGroup} Blood</h3>
                                <p>A request matches your blood type for a patient named <strong>${request.patientName}</strong>.</p>
                                <p><strong>Contact:</strong> ${request.phone}</p>
                                <span class="timestamp">Posted recently</span>
                            </div>
                            <div class="notification-actions">
                                <button class="action-btn accept-btn">Accept</button>
                                <button class="action-btn decline-btn">Decline</button>
                            </div>
                        </div>`;
                    notificationsList.insertAdjacentHTML('beforeend', notificationHTML);
                });
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            notificationsList.innerHTML = '<p>Could not load notifications. Please try again later.</p>';
        }
    }

    async function fetchAndDisplayRequesterUpdates() {
        const requestDataString = sessionStorage.getItem('currentRequest');
        const list = document.getElementById('requesterNotificationsList');
        const emptyMessage = document.getElementById('requesterEmptyMessage');
        list.innerHTML = '';

        if (!requestDataString) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            return;
        }
        
        const currentRequest = JSON.parse(requestDataString);

        // 1. Add the "Request Submitted" notification first
        list.innerHTML += `
            <div class="notification-item">
                <div class="notification-icon"><i class="fas fa-paper-plane"></i></div>
                <div class="notification-content">
                    <h3>Request Submitted Successfully</h3>
                    <p>Your request for patient <strong>${currentRequest.patientName}</strong> has been submitted and is now visible to potential donors.</p>
                    <span class="timestamp">Received recently</span>
                </div>
            </div>`;

        try {
            // 2. Fetch all donors and find matches
            const response = await fetch(`${API_URL}/donors`);
            if (!response.ok) throw new Error('Failed to fetch donors');
            const allDonors = await response.json();

            // NOTE: In a real app, you would check a status on the request.
            // Here, we simulate by finding all available donors who are a match.
            const matchingDonors = allDonors.filter(donor => donor.bloodGroup === currentRequest.requiredBloodGroup);

            if (matchingDonors.length === 0) {
                // 3. If no donors match, show "Searching" status
                list.innerHTML += `
                    <div class="notification-item">
                        <div class="notification-icon"><i class="fas fa-search"></i></div>
                        <div class="notification-content">
                            <h3>Search in Progress</h3>
                            <p>We are actively searching for donors with <strong>${currentRequest.requiredBloodGroup}</strong> blood. We will notify you as soon as a match is found.</p>
                            <span class="timestamp">Updated just now</span>
                        </div>
                    </div>`;
            } else {
                // 4. If donors match, show each one as "Found"
                matchingDonors.forEach(donor => {
                    list.innerHTML += `
                        <div class="notification-item success">
                            <div class="notification-icon"><i class="fas fa-check-circle"></i></div>
                            <div class="notification-content">
                                <h3>Donor Found!</h3>
                                <p>A donor named <strong>${donor.name}</strong> with <strong>${donor.bloodGroup}</strong> blood is available.</p>
                                <p><strong>Donor Contact:</strong> ${donor.phone}</p>
                                <span class="timestamp">Matched just now</span>
                            </div>
                        </div>`;
                });
            }
        } catch (error) {
            console.error('Error fetching requester updates:', error);
            list.innerHTML += '<p>Could not load updates for your request.</p>';
        }
    }
});