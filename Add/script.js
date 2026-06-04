// ================= SAVE =================
const form = document.getElementById("resourceForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
         let contact = document.getElementById("contact").value;

  
    if (contact.length !== 10 || isNaN(contact)) {
        alert("Contact number must be exactly 10 digits ❗");
        return;
    }
    

        let data = JSON.parse(localStorage.getItem("resources")) || [];

        let file = document.getElementById("image").files[0];
        let reader = new FileReader();

        reader.onload = function () {

            let newItem = {
                id: Date.now(),
                name: document.getElementById("resourceName").value,
                category: document.getElementById("category").value,
                condition: document.getElementById("condition").value,
                owner: document.getElementById("ownerName").value,
                contact: document.getElementById("contact").value,
                location: document.getElementById("location").value,
                description: document.getElementById("description").value,
                image: reader.result,
                availability: document.getElementById("availability").value
            };

            data.push(newItem);
            localStorage.setItem("resources", JSON.stringify(data));

            alert("Added Successfully ✅");

            form.reset();
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            alert("Select image ❗");
        }
    });
}


// ================= DISPLAY =================
function displayResources(data, isAdmin = false) {

    let container = document.getElementById("container");
    if (!container) return;

    container.innerHTML = "";

    data.forEach((item) => {

        container.innerHTML += `
        <div class="card">

            <img src="${item.image || 'https://via.placeholder.com/300'}">

            <h3>Item : ${item.name}</h3>
            <p>Category: ${item.category}</p>
            <p>Owner Name : ${item.owner}</p>
             <p>Contact : ${item.contact}</p>
            <p>Status: ${item.availability}</p>

            ${isAdmin ? 
            `<button onclick="deleteResource(${item.id})">Delete</button>` :
            `<button onclick="requestItem(${item.id})">Request</button>`
            }

        </div>
        `;
    });
}


// ================= LOAD (USER PAGE) =================
function loadResources() {
    let data = JSON.parse(localStorage.getItem("resources")) || [];
    displayResources(data, false);
}

loadResources();


// ================= DELETE (ADMIN) =================
function deleteResource(id) {
    let data = JSON.parse(localStorage.getItem("resources")) || [];

    data = data.filter(item => item.id !== id);

    localStorage.setItem("resources", JSON.stringify(data));

    loadResources();
}


// ================= REQUEST =================
function requestItem(id) {

    let data = JSON.parse(localStorage.getItem("resources")) || [];

    let updatedData = data.map(item => {

        if (item.id === id) {

            return {
                ...item,
                availability: "Unavailable" // 🔥 AUTO CHANGE STATUS
            };
        }

        return item;
    });

    localStorage.setItem("resources", JSON.stringify(updatedData));

    loadResources(); // 🔥 refresh UI

    alert("Request Sent & Item Marked Unavailable ✅");
}


// ================= SEARCH =================
let search = document.getElementById("search");

if (search) {
    search.addEventListener("input", function () {

        let data = JSON.parse(localStorage.getItem("resources")) || [];
        let value = search.value.toLowerCase();

        let filtered = data.filter(item =>
            item.name.toLowerCase().includes(value) ||
            item.category.toLowerCase().includes(value) ||
            item.owner.toLowerCase().includes(value)
        );

        displayResources(filtered, false);
    });
}


// ================= CATEGORY FILTER =================
document.querySelectorAll(".categories button").forEach(btn => {

    btn.addEventListener("click", function () {

        let category = this.innerText;
        let data = JSON.parse(localStorage.getItem("resources")) || [];

        if (category === "All") {
            displayResources(data, false);
        } else {
            let filtered = data.filter(item => item.category === category);
            displayResources(filtered, false);
        }
    });
});