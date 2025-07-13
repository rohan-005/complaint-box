// === STORE NEW COMPLAINT ===
document
  .getElementById("complaintForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    const name = this.name.value.trim();
    const mobile = this.mobile.value.trim();
    const address = this.address.value.trim();
    const email = this.email.value.trim();
    const complaint = this.complaint.value.trim();
    const category = this.category.value; 
    const fileInput = this.attachment;
    const file = fileInput.files[0];

    const saveComplaint = (base64File = null) => {
      const complaintData = {
        id: Date.now(),
        name,
        mobile,
        address,
        email,
        complaint,
        category,
        file: base64File,
        status: "Pending",
        timestamp: new Date().toLocaleString(),
      };

      const complaints = JSON.parse(localStorage.getItem("complaints")) || [];
      complaints.push(complaintData);
      localStorage.setItem("complaints", JSON.stringify(complaints));

      alert("Complaint submitted successfully!");
      this.reset();
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => saveComplaint(reader.result);
      reader.readAsDataURL(file);
    } else {
      saveComplaint(); // No file case
    }
  });

// === FETCH COMPLAINTS BY MOBILE ===
document.getElementById("statusForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const mobile = this.mobileSearch.value.trim();
  const resultsContainer = document.getElementById("complaintResults");

  resultsContainer.innerHTML = ""; // Clear old results

  const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

  const matching = complaints.filter((c) => c.mobile === mobile);

  if (matching.length === 0) {
    resultsContainer.innerHTML =
      "<p>No complaints found for this mobile number.</p>";
    return;
  }

  matching.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "complaint-item";
    div.innerHTML = `
        <h3>Complaint #${i + 1}</h3>
        <p><strong>Date:</strong> ${c.timestamp}</p>
        <p><strong>Name:</strong> ${c.name}</p>
        <p><strong>Address:</strong> ${c.address}</p>
        <p><strong>Email:</strong> ${c.email}</p>
        <p><strong>Status:</strong> ${c.status}</p>
        <p><strong>Complaint:</strong> ${c.complaint}</p>
        ${
          c.file
            ? `<a href="${c.file}" target="_blank">View Attachment</a>`
            : ""
        }
        <hr/>
      `;
    resultsContainer.appendChild(div);
  });

  this.reset(); // Clear input
});

function closepanel(panel) {
  document.getElementById(panel).style.display = "none";
}

function openpanel(panel) {
  document.getElementById(panel).style.display = "block";
}

function loadComplaintsForAdmin() {
  const container = document.getElementById("adminComplaints");
  container.innerHTML = "";

  const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

  if (complaints.length === 0) {
    container.innerHTML = "<p>No complaints found.</p>";
    return;
  }

  complaints.forEach((c, index) => {
    const div = document.createElement("div");
    div.className = "complaint-item";

    div.innerHTML = `
      <h3>Complaint #${index + 1}</h3>
      <p><strong>Date:</strong> ${c.timestamp}</p>
      <p><strong>Name:</strong> ${c.name}</p>
      <p><strong>Mobile:</strong> ${c.mobile}</p>
      <p><strong>Address:</strong> ${c.address}</p>
      <p><strong>Email:</strong> ${c.email}</p>
      <p><strong>Complaint:</strong> ${c.complaint}</p>
      <p><strong>Category:</strong> ${c.category || "N/A"}</p>
      ${c.file ? `<a href="${c.file}" target="_blank">View Attachment</a>` : ""}
      <p><strong>Status:</strong> 
        <select data-id="${c.id}" onchange="updateStatus(this)">
          <option value="Pending" ${
            c.status === "Pending" ? "selected" : ""
          }>Pending</option>
          <option value="In Progress" ${
            c.status === "In Progress" ? "selected" : ""
          }>In Progress</option>
          <option value="Resolved" ${
            c.status === "Resolved" ? "selected" : ""
          }>Resolved</option>
        </select>
      </p>
    `;

    container.appendChild(div);
  });
}

function updateStatus(selectElement) {
  const complaintId = Number(selectElement.getAttribute("data-id"));
  const newStatus = selectElement.value;

  const complaints = JSON.parse(localStorage.getItem("complaints")) || [];
  const index = complaints.findIndex((c) => c.id === complaintId);

  if (index !== -1) {
    complaints[index].status = newStatus;
    localStorage.setItem("complaints", JSON.stringify(complaints));
    alert("Status updated successfully!");
  }
}

window.onload = loadComplaintsForAdmin;