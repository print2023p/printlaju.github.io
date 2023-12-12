// Pricing as per the given excel sheet
const pricing = {
    'BlackNWhite': 0.3,
    'Color': 1,
    'TapeBinding': 2,
    'CombBinding': 6,
    'ScheduledDelivery': 3,
    'OneHourDelivery': 5, 
    'Lamination': 2
};


// Function to add a new file input section
function addFile() {
    const filesContainer = document.getElementById('filesContainer');
    const fileIndex = filesContainer.children.length + 1;
    const fileDiv = document.createElement('div');
    fileDiv.classList.add('file-section');
    fileDiv.dataset.index = fileIndex;
    fileDiv.innerHTML = `
        <div class="form-section">
            <label for="fileName${fileIndex}">File Name ${fileIndex}:</label>
            <input type="text" id="fileName${fileIndex}" name="fileName" class="form-input">
        </div>
        <div class="form-section">
            <label for="color${fileIndex}">Color:</label>
            <select id="color${fileIndex}" name="color" class="form-input">
                <option value="BlackNWhite">Black & White</option>
                <option value="Color">Color</option>
            </select>
        </div>
        <div class="form-section">
            <label for="binding${fileIndex}">Binding:</label>
           <select id="binding${fileIndex}" name="binding" class="form-input">
                <option value="stapler">Stapler (RM 0)</option>
                <option value="none">None (RM 0)</option>
                <option value="TapeBinding">Tape Binding</option>
                <option value="CombBinding">Comb Binding</option>
            </select>
        </div>
        <div class="form-section">
            <label for="pages${fileIndex}">Pages:</label>
            <input type="number" id="pages${fileIndex}" name="pages" class="form-input" value="1">
        </div>
        <div class="form-section">
            <label for="lamination${fileIndex}">Lamination:</label>
            <select id="lamination${fileIndex}" name="lamination" class="form-input">
                <option value="no">No</option>
                <option value="yes">Yes</option>
            </select>
        </div>
        <div class="form-section">
            <label for="printSide${fileIndex}">Print Side:</label>
            <select id="printSide${fileIndex}" name="printSide" class="form-input">
                <option value="singleSided">Single-Sided</option>
                <option value="doubleSided">Double-Sided</option>
            </select>
        </div>
        <button type="button" class="remove-file-btn" onclick="removeFile(this)">Remove</button>
    `;
    filesContainer.appendChild(fileDiv);

    updateRemoveButtonsVisibility(); // Update the visibility of 'Remove' buttons
}

// Function to remove a file input section
function removeFile(button) {
    button.parentElement.remove();
    updateRemoveButtonsVisibility(); // Update visibility after removal
}

function calculateTotalCost(filesData) {
    console.log(filesData);  // Check the structure and content of filesData
    let total = 0;
    const deliveryOption = document.getElementById('delivery').value;
    console.log('Delivery Option:', deliveryOption);  // Inspect the selected delivery option
    const deliveryCost = pricing[deliveryOption];
    console.log('Delivery Cost:', deliveryCost);  // Inspect the delivery cost

    if (isNaN(deliveryCost)) {
        console.error('Delivery cost is not a number:', deliveryOption);
        return NaN;  // Early return if delivery cost is not a number
    }

    total += deliveryCost;

    filesData.forEach(file => {
        console.log('File:', file);  // Inspect each file's data
        let fileCost = (file.pages * pricing[file.color]) || 0;
        console.log('File Cost after color pricing:', fileCost);
        fileCost += pricing[file.binding] || 0;
        console.log('File Cost after binding pricing:', fileCost);
        fileCost += (file.lamination === 'yes' ? pricing['Lamination'] * file.pages : 0);
        console.log('File Cost after lamination pricing:', fileCost);

        if (isNaN(fileCost)) {
            console.error('File cost is not a number for file:', file);
        }

        total += fileCost;
    });

    if (isNaN(total)) {
        console.error('Total cost is not a number. Check the file data and pricing.');
    }

    return total;
}


// Function to update visibility of 'Remove' buttons
function updateRemoveButtonsVisibility() {
    const fileSections = document.querySelectorAll('.file-section');
    fileSections.forEach((section, index) => {
        const removeButton = section.querySelector('.remove-file-btn');
        removeButton.style.display = fileSections.length > 1 ? 'block' : 'none';
    });
}

// Function to navigate to the File Data Section
document.getElementById('nextButton').addEventListener('click', () => {
    // Get references to the sections
    const masterDataSection = document.getElementById('masterDataSection');
    const fileDataSection = document.getElementById('fileDataSection');

    // Add the fade-out animation class to the master data section
    masterDataSection.classList.add('fade-out');

    // Add the fade-in animation class to the file data section
    fileDataSection.classList.add('fade-in');

    // After a short delay, hide the master data section and show the file data section
    setTimeout(() => {
        masterDataSection.classList.add('hidden');
        fileDataSection.style.display = 'block';

        // Remove the animation classes
        masterDataSection.classList.remove('fade-out');
        fileDataSection.classList.remove('fade-in');
        
        // Get input values
        var customerName = document.getElementById('customerName').value;
        var taman = document.getElementById('taman').value;
        var jalan = document.getElementById('jalan').value;
        var houseNo = document.getElementById('houseNo').value;
        var delivery = document.getElementById('delivery').value;
        
        // Save data to local storage
        localStorage.setItem('customerName', customerName);
        localStorage.setItem('taman', taman);
        localStorage.setItem('jalan', jalan);
        localStorage.setItem('houseNo', houseNo);
        localStorage.setItem('delivery', delivery);
    }, 500); // Adjust the delay to match the animation duration
    addFile(); 
    setTimeout(() => {
            // This ensures we're waiting for any animations or DOM updates to complete.
            const firstInput = document.querySelector('.file-section input[name="fileName"]');
            if (firstInput) {
                firstInput.focus();
            }
        }, 500); // This delay should match the longest delay you have after which the input is guaranteed to be visible
});


// Function to navigate back to the Master Data Section
document.getElementById('backButton').addEventListener('click', () => {
    document.getElementById('fileDataSection').style.display = 'none';
    document.getElementById('masterDataSection').style.display = 'block';
});

// Function to send data and show SweetAlert confirmation
// Function to send data and show SweetAlert confirmation
function sendData() {
    // Collect file data from the form
    const filesData = Array.from(document.querySelectorAll('.file-section')).map(section => ({
        fileName: section.querySelector('input[name="fileName"]').value,
        color: section.querySelector('select[name="color"]').value,
        binding: section.querySelector('select[name="binding"]').value,
        pages: parseInt(section.querySelector('input[name="pages"]').value, 10),
        lamination: section.querySelector('select[name="lamination"]').value,
        printSide: section.querySelector('select[name="printSide"]').value
    }));

    // Check if any customer information field is missing
    const customerName = document.getElementById('customerName').value;
    const taman = document.getElementById('taman').value;
    const jalan = document.getElementById('jalan').value;
    const houseNo = document.getElementById('houseNo').value;
    const delivery = document.getElementById('delivery').value;

    if (!customerName || !taman || !jalan || !houseNo || !delivery) {
        Swal.fire({
            title: 'Incomplete Data',
            text: 'Please fill in all customer information fields and ensure all file entries have "File Name" and "Pages" filled.',
            icon: 'error',
        });
        return; // Prevent further execution of sendData()
    }

    // Check if any file is missing "File Name" or "Pages" fields
    const missingFile = filesData.find(file => !file.fileName || isNaN(file.pages) || file.pages <= 0);

    // If any file is missing required fields, show SweetAlert and prevent submission
    if (missingFile) {
        Swal.fire({
            title: 'Incomplete Data',
            text: 'Please fill in both "File Name" and "Pages" fields for all files.',
            icon: 'error',
        });
        return; // Prevent further execution of sendData()
    }

    // Calculate total cost
    const totalCost = calculateTotalCost(filesData);

       // Construct message text with all user inputs for verification
    let message = `<div style="text-align: left;">`;
    message += `<strong>Customer Name:</strong> ${customerName}<br>`;
    message += `<strong>Taman:</strong> ${taman}<br>`;
    message += `<strong>Jalan:</strong> ${jalan}<br>`;
    message += `<strong>House No:</strong> ${houseNo}<br>`;
    message += `<strong>Delivery:</strong> ${delivery}<br><br>`;
    message += `<strong>Files to Print:</strong><br>`;

    filesData.forEach((file, index) => {
        message += `File ${index + 1}: ${file.fileName}<br>`;
        message += `Color: ${file.color}<br>`;
           let bindingText = file.binding; // Default to the binding value
        if (file.binding === 'stapler') {
            bindingText = 'Stapler';
        } else if (file.binding === 'none') {
            bindingText = 'None';
        } else if (file.binding === 'TapeBinding') {
            bindingText = 'Tape Binding';
        } else if (file.binding === 'CombBinding') {
            bindingText = 'Comb Binding';
        }

        message += `Binding: ${file.binding}\<br>`;
        message += `Pages: ${file.pages}<br>`;
        message += `Lamination: ${file.lamination === 'yes' ? 'Yes' : 'No'}<br>`;
        message += `Print Side: ${file.printSide === 'doubleSided' ? 'Double-Sided' : 'Single-Sided'}<br><br>`;
    });

    message += `<strong>Estimated Total Cost:</strong> RM${totalCost.toFixed(2)}<br>`;
    message += '</div>';
    // Show the confirmation dialog with the message
    
    let plainTextMessage = `Order Confirmation\n`;
    plainTextMessage += `Customer Name: ${customerName}\n`;
    plainTextMessage += `Taman: ${taman}\n`;
    plainTextMessage += `Jalan: ${jalan}\n`;
    plainTextMessage += `House No: ${houseNo}\n`;
    plainTextMessage += `Delivery: ${delivery.replace(/([A-Z])/g, ' $1').trim()}\n\n`;
    plainTextMessage += `Files to Print:\n`;

    filesData.forEach((file, index) => {
        plainTextMessage += `File ${index + 1}: ${file.fileName}\n`;
        plainTextMessage += `Color: ${file.color}\n`;
              let bindingText = file.binding; // Default to the binding value
        if (file.binding === 'stapler') {
            bindingText = 'Stapler';
        } else if (file.binding === 'none') {
            bindingText = 'None';
        } else if (file.binding === 'TapeBinding') {
            bindingText = 'Tape Binding';
        } else if (file.binding === 'CombBinding') {
            bindingText = 'Comb Binding';
        }

        plainTextMessage += `Binding: ${bindingText}\n`;
        plainTextMessage += `Pages: ${file.pages}\n`;
        plainTextMessage += `Lamination: ${file.lamination === 'yes' ? 'Yes' : 'No'}\n`;
        plainTextMessage += `Print Side: ${file.printSide === 'doubleSided' ? 'Double-Sided' : 'Single-Sided'}\n\n`;
    });

    plainTextMessage += `Estimated Total Cost: RM${totalCost.toFixed(2)}\n`;
    plainTextMessage += `[Generated by PrintLaju.com]`;

    
    Swal.fire({
        title: 'Please Confirm Your Order',
        html: message,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // If confirmed, proceed with sending data
            // Encode message for URL
            const encodedMessage = encodeURIComponent(plainTextMessage);

            // Create WhatsApp link and open it
            const whatsappLink = `https://wa.me/6581551816?text=${encodedMessage}`;
            window.open(whatsappLink, '_blank');
        }
    });
}


// Attach event listener to the 'Add File' button
document.getElementById('addFile').addEventListener('click', addFile);

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the span element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Open the modal when the button is clicked
btn.onclick = function() {
  modal.style.display = "block";
}

// Close the modal when the span (×) is clicked
span.onclick = function() {
  modal.style.display = "none";
}

// Close the modal when anywhere outside of it is clicked
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
window.onload = function() {
    // Get the splash screen and the first container element with the class 'container'
    var splashScreen = document.getElementById('splashScreen');
    var container = document.querySelector('.container');
    
    // Initially hide the container
    container.style.display = 'none';
    
    // Get the logo and check if it has the correct 'src' attribute
    var logo = document.getElementById('logo');
    if (logo && logo.src.endsWith('logo.png')) {
        // Apply the breathing light effect to the logo
        logo.style.animation = 'breathingLight 1s infinite';
        
        // Set a timeout to remove the splash screen from view after 2 seconds
        setTimeout(function() {
            // Hide the entire splash screen, not just the logo
            splashScreen.style.display = 'none';
            
            // After the splash screen is gone, show the container
            container.style.display = 'block';
        }, 1000);
    }
    document.getElementById('customerName').value = localStorage.getItem('customerName') || '';
    document.getElementById('taman').value = localStorage.getItem('taman') || '';
    document.getElementById('jalan').value = localStorage.getItem('jalan') || '';
    document.getElementById('houseNo').value = localStorage.getItem('houseNo') || '';
    document.getElementById('delivery').value = localStorage.getItem('delivery') || 'Scheduled Delivery 7pm-9pm';
    updateRemoveButtonsVisibility();
};

// Define the keyframes for the breathing light effect
var style = document.createElement('style');
style.innerHTML = `
@keyframes breathingLight {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
`;
document.head.appendChild(style);

