//******** Variables  *************//
const addBtn = document.getElementById("add-btn");
const updateBtn = document.getElementById("update-row-btn");
const searchBtn = document.getElementById("search-btn");

//******** Functions *************//
const insertRowIntoTable = (data) => {
  const table = document.querySelector(".table-body");
  const isTableData = table.querySelector(".no-data");

  let tableHTML = "<tr>";

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === "dateAdded") {
        data[key] = new Date(data[key]).toLocaleString();
      }
      tableHTML += `<td>${data[key]}</td>`;
    }
  }

  tableHTML += `<td><button class="delete-row-btn" data-id=${data.id} >Delete</button></td>`;
  tableHTML += `<td><button class="edit-row-btn" data-id=${data.id} >Edit</button></td>`;

  tableHTML += "</tr>";

  if (isTableData) {
    table.innerHTML = tableHTML;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHTML;
  }
};

const loadHTMLTable = (data) => {
  const table = document.querySelector(".table-body");

  if (data.length === 0) {
    table.innerHTML =
      "<tr class='table-body__no-users'><td class='no-data' colspan='5' >THERE ARE NO USERS</td></tr>";
    return;
  }

  let tableHTML = "";
  data.forEach(({ id, nombre, apellido, email, date_added }) => {
    tableHTML += `<tr class="table-body__row">
                      <td class="table-body__data">${id}</td>
                      <td class="table-body__data">${nombre}</td>
                      <td class="table-body__data">${apellido}</td>
                      <td class="table-body__data">${email}</td>
                      <td class="table-body__data">${new Date(
                        date_added
                      ).toLocaleString()}</td>
                      <td class="table-body__data"><button class="delete-row-btn" data-id=${id} >Delete</button></td>
                      <td class="table-body__data"><button class="edit-row-btn" data-id=${id}>Edit</button></td>
                    </tr>`;
  });

  table.innerHTML = tableHTML;
};

const deleteRowById = (id) => {
  fetch(`http://localhost:5000/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
};

const handleEditRow = (id) => {
  const updateSection = document.getElementById("update-section");

  updateSection.hidden = false;
  updateSection.classList.remove("update-none");
  document.getElementById("update-name-input").dataset.id = id;
};

//*********** Execute Code *********//
document.addEventListener("click", (e) => {
  if (e.target === addBtn) {
    //inputs
    const nameInput = document.getElementById("name-input");
    const lastNameInput = document.getElementById("lastName-input");
    const emailInput = document.getElementById("email-input");

    //values
    const name = nameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;

    //regex
    const regexEmail =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    nameInput.value = "";
    lastNameInput.value = "";
    emailInput.value = "";

    if (name === "") {
      return console.log("The field NAME is required");
    }
    if (lastName === "") {
      return console.log("The field LASTNAME is required");
    }
    if (!regexEmail.test(email)) {
      return console.log("The EMAIL is invalid");
    }

    fetch("http://localhost:5000/insert", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ name, lastName, email }),
    })
      .then((res) => res.json())
      .then((data) => insertRowIntoTable(data["data"]));
  }

  if (e.target.matches(".delete-row-btn")) {
    deleteRowById(e.target.dataset.id);
  }

  if (e.target.matches(".edit-row-btn")) {
    handleEditRow(e.target.dataset.id);
  }

  if (e.target === updateBtn) {
    const nameInput = document.getElementById("update-name-input");
    const lastNameInput = document.getElementById("update-lastname-input");
    const emailInput = document.getElementById("update-email-input");

    //values
    const name = nameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;

    //regex
    const regexEmail =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //Test
    if (name === "") {
      return console.log("The field NAME is required");
    }
    if (lastName === "") {
      return console.log("The field LASTNAME is required");
    }
    if (!regexEmail.test(email)) {
      return console.log("The EMAIL is invalid");
    }

    fetch("http://localhost:5000/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: nameInput.dataset.id,
        name: nameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
      }),
    });
    setTimeout(() => {
      document.getElementById("update-section").classList.add("update-none");
      location.reload();
    }, 1500);
  }

  if (e.target === searchBtn) {
    const searchValue = document.getElementById("search-input").value;
    fetch(`http://localhost:5000/search/${searchValue}`)
      .then((response) => response.json())
      .then((data) => loadHTMLTable(data["data"]));
  }
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:5000/getAll")
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data["data"]));
});
