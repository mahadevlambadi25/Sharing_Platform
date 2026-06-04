const defaultRequests = [
    { id: 1, student: "Rahul", resource: "Laptop", status: "pending" },
    { id: 2, student: "Aman", resource: "Projector", status: "pending" },
    { id: 3, student: "Priya", resource: "Camera", status: "pending" },
    { id: 4, student: "Neha", resource: "Microphone", status: "pending" },
    { id: 5, student: "Sahil", resource: "Lab Kit", status: "pending" }
];

const feedbackApiUrl = "";

const demoFeedbacks = [
    {
        studentName: "Rahul",
        resource: "Laptop",
        feedback: "Good condition and useful.",
        rating: "4/5"
    },
    {
        studentName: "Aman",
        resource: "Projector",
        feedback: "Working fine but little slow.",
        rating: "3/5"
    },
    {
        studentName: "Sahil",
        resource: "Camera",
        feedback: "Very good quality.",
        rating: "5/5"
    }
];

function getRequests() {
    const savedRequests = localStorage.getItem("requests");

    if (savedRequests) {
        const requests = JSON.parse(savedRequests);
        const savedIds = requests.map((request) => request.id);
        const newDemoRequests = defaultRequests.filter((request) => !savedIds.includes(request.id));

        if (newDemoRequests.length > 0) {
            const updatedRequests = [...requests, ...newDemoRequests];
            saveRequests(updatedRequests);
            return updatedRequests;
        }

        return requests;
    }

    localStorage.setItem("requests", JSON.stringify(defaultRequests));
    return defaultRequests;
}

function saveRequests(requests) {
    localStorage.setItem("requests", JSON.stringify(requests));
}

function updateRequestStatus(id, status) {
    const requests = getRequests().map((request) => {
        if (request.id === id) {
            return { ...request, status };
        }

        return request;
    });

    saveRequests(requests);
}

function renderPendingRequests() {
    const pendingTable = document.getElementById("requesttable");

    if (!pendingTable) {
        return;
    }

    const pendingRequests = getRequests().filter((request) => request.status === "pending");

    pendingTable.innerHTML = "";

    if (pendingRequests.length === 0) {
        pendingTable.innerHTML = `
            <tr>
                <td colspan="4">No pending requests</td>
            </tr>
        `;
        return;
    }

    pendingRequests.forEach((request) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${request.student}</td>
            <td>${request.resource}</td>
            <td>Pending</td>
            <td>
                <button class="approve" data-id="${request.id}">Approve</button>
                <button class="reject" data-id="${request.id}">Reject</button>
            </td>
        `;

        pendingTable.appendChild(row);
    });
}

function renderStatusTable(tableId, status, emptyMessage) {
    const tableBody = document.getElementById(tableId);

    if (!tableBody) {
        return;
    }

    const requests = getRequests().filter((request) => request.status === status);

    tableBody.innerHTML = "";

    if (requests.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="3">${emptyMessage}</td>
            </tr>
        `;
        return;
    }

    requests.forEach((request) => {
        const row = document.createElement("tr");
        const statusClass = status === "approved" ? "approved-text" : "rejected-text";
        const statusText = status === "approved" ? "Approved" : "Rejected";

        row.innerHTML = `
            <td>${request.student}</td>
            <td>${request.resource}</td>
            <td class="${statusClass}">${statusText}</td>
        `;

        tableBody.appendChild(row);
    });
}

function getSavedFeedbacks() {
    const savedFeedbacks =
        localStorage.getItem("userFeedbacks") ||
        localStorage.getItem("feedbacks");

    if (!savedFeedbacks) {
        return demoFeedbacks;
    }

    return JSON.parse(savedFeedbacks);
}

async function loadFeedbacks() {
    if (!feedbackApiUrl) {
        return getSavedFeedbacks();
    }

    const response = await fetch(feedbackApiUrl);
    return response.json();
}

function renderFeedbacks(feedbacks) {
    const feedbackTable = document.getElementById("feedbackTable");

    if (!feedbackTable) {
        return;
    }

    feedbackTable.innerHTML = "";

    if (feedbacks.length === 0) {
        feedbackTable.innerHTML = `
            <tr>
                <td colspan="4">No feedback available</td>
            </tr>
        `;
        return;
    }

    feedbacks.forEach((item) => {
        const row = document.createElement("tr");
        const studentCell = document.createElement("td");
        const resourceCell = document.createElement("td");
        const feedbackCell = document.createElement("td");
        const ratingCell = document.createElement("td");

        studentCell.textContent = item.studentName || item.student || item.name || "";
        resourceCell.textContent = item.resource || item.resourceName || "";
        feedbackCell.textContent = item.feedback || item.message || "";
        ratingCell.textContent = item.rating || "";

        row.appendChild(studentCell);
        row.appendChild(resourceCell);
        row.appendChild(feedbackCell);
        row.appendChild(ratingCell);
        feedbackTable.appendChild(row);
    });
}

document.addEventListener("click", (event) => {
    const button = event.target;

    if (button.classList.contains("approve")) {
        updateRequestStatus(Number(button.dataset.id), "approved");
        renderPendingRequests();
        alert("Request Approved");
    }

    if (button.classList.contains("reject")) {
        updateRequestStatus(Number(button.dataset.id), "rejected");
        renderPendingRequests();
        alert("Request Rejected");
    }
});

renderPendingRequests();
renderStatusTable("approvedRequests", "approved", "No approved requests");
renderStatusTable("rejectedRequests", "rejected", "No rejected requests");

loadFeedbacks()
    .then(renderFeedbacks)
    .catch(() => {
        renderFeedbacks(getSavedFeedbacks());
    });
