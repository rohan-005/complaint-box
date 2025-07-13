// Fetch complaints from localStorage
let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

const adminComplaintsDiv = document.getElementById("adminComplaints");
const statusFilter = document.getElementById("statusFilter");
const attachmentFilter = document.getElementById("attachmentFilter");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const mobileFilter = document.getElementById("mobileFilter");
const categoryFilter = document.getElementById("categoryFilter"); 

// Function to render complaints
function renderComplaints() {
  adminComplaintsDiv.innerHTML = "";

  const filtered = complaints.filter((complaint) => {
    const matchesStatus =
      !statusFilter.value || complaint.status === statusFilter.value;

    const hasAttachment = complaint.file && complaint.file !== "";
    const matchesAttachment =
      !attachmentFilter.value ||
      (attachmentFilter.value === "yes" && hasAttachment) ||
      (attachmentFilter.value === "no" && !hasAttachment);

    const complaintDate = new Date(complaint.timestamp);
    const from = fromDate.value ? new Date(fromDate.value) : null;
    const to = toDate.value ? new Date(toDate.value) : null;

    const matchesDate =
      (!from || complaintDate >= from) && (!to || complaintDate <= to);

    const matchesMobile =
      !mobileFilter.value || complaint.mobile.includes(mobileFilter.value);

    const matchesCategory =
      !categoryFilter.value || complaint.category === categoryFilter.value;

    return (
      matchesStatus &&
      matchesAttachment &&
      matchesDate &&
      matchesMobile &&
      matchesCategory
    );
  });

  filtered.forEach((complaint, index) => {
    const div = document.createElement("div");
    div.className = "complaint-item";
    div.innerHTML = `
      <p><strong>Name:</strong> ${complaint.name || "N/A"}</p>
      <p><strong>Address:</strong> ${complaint.address || "N/A"}</p>
      <p><strong>Email:</strong> ${complaint.email || "N/A"}</p>
      <p><strong>Date:</strong> ${complaint.timestamp || "N/A"}</p>
      <p><strong>Status:</strong> ${complaint.status}</p>
      <p><strong>Mobile:</strong> ${complaint.mobile || "N/A"}</p>
      <p><strong>Category:</strong> ${complaint.category || "N/A"}</p>
      <p><strong>Description:</strong> ${complaint.complaint || "N/A"}</p>
      <p><strong>Attachment:</strong> ${
        complaint.file
          ? `<a href="${complaint.file}" target="_blank">View Attachment</a>`
          : "<em>No attachment</em>"
      }</p>

      <label><strong>Change Status:</strong></label>
      <select onchange="changeStatus(${index}, this.value)">
        <option value="Pending" ${
          complaint.status === "Pending" ? "selected" : ""
        }>Pending</option>
        <option value="Resolved" ${
          complaint.status === "Resolved" ? "selected" : ""
        }>Resolved</option>
      </select>

      <button class="remove-btn" onclick="removeComplaint(${index})">Remove</button>
      <button class="remove-btn" style="background:#0077cc; right: 100px;" onclick="downloadPDF(${index})">Download PDF</button>
    `;
    adminComplaintsDiv.appendChild(div);
  });
}

// Remove complaint by index
function removeComplaint(index) {
  if (confirm("Are you sure you want to remove this complaint?")) {
    complaints.splice(index, 1);
    localStorage.setItem("complaints", JSON.stringify(complaints));
    renderComplaints();
  }
}

// Change complaint status
function changeStatus(index, newStatus) {
  complaints[index].status = newStatus;
  localStorage.setItem("complaints", JSON.stringify(complaints));
  renderComplaints();
}

// Download complaint as PDF
async function downloadPDF(index) {
  const complaint = complaints[index];

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Complaint Details", 20, 20);

  const lines = [
    `Name: ${complaint.name || "N/A"}`,
    `Address: ${complaint.address || "N/A"}`,
    `Email: ${complaint.email || "N/A"}`,
    `Mobile: ${complaint.mobile || "N/A"}`,
    `Date: ${complaint.timestamp || "N/A"}`,
    `Status: ${complaint.status}`,
    `Category: ${complaint.category || "N/A"}`,
    `Description: ${complaint.complaint || "N/A"}`,
    `Attachment: ${complaint.file ? "Attached" : "None"}`,
  ];

  let y = 30;
  lines.forEach((line) => {
    doc.text(line, 20, y);
    y += 10;
  });

  doc.save(`complaint-${index + 1}.pdf`);
}

// Filter listeners
[statusFilter, attachmentFilter, fromDate, toDate, mobileFilter, categoryFilter].forEach((el) =>
  el.addEventListener("input", renderComplaints)
);

// Initial rendering
renderComplaints();