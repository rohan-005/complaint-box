document
  .getElementById("complaintForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    // Get form fields
    const name = this.name.value.trim();
    const mobile = this.mobile.value.trim();
    const address = this.address.value.trim();
    const email = this.email.value.trim();
    const complaint = this.complaint.value.trim();
    const fileInput = this.attachment;

    // Optional: convert file to base64 string if attached
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const base64File = file ? reader.result : null;

      // Create a complaint object
      const complaintData = {
        id: Date.now(),
        name,
        mobile,
        address,
        email,
        complaint,
        file: base64File,
      };

      // Retrieve existing complaints or initialize an empty array
      const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

      // Add new complaint
      complaints.push(complaintData);

      // Store updated list in LocalStorage
      localStorage.setItem("complaints", JSON.stringify(complaints));

      alert("Complaint submitted successfully!");
      this.reset();
    };

    if (file) {
      reader.readAsDataURL(file); // Convert file to base64
    } else {
      reader.onload(); // No file, just proceed
    }
  });
