const socket = io(window.location.origin);
socket.on("group-message", (groupId) => {
  let id = localStorage.getItem("selectedGroup");
  if (id == groupId) {
    Refresh(groupId);
  }
});

document.getElementById("sendbtn").addEventListener("click", (event) => {
  SendMessage(event);
});
document.getElementById("logout").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/login.html";
});
// document.getElementById("common").addEventListener("click",()=>{
//     localStorage.removeItem("chats");
//     localStorage.setItem("selectedGroup",0)
//     let parent = document.getElementById("gpname")
//     parent.innerHTML = "Common"
//     Refresh(0);
// })

//This function is show how many users joined Chat
function AddingToList(name) {
  let parent = document.getElementById("chats");
  let li = document.createElement("li");
  li.textContent = `${name} Joined`;
  li.className = "list-group-item";
  li.style.textAlign = "center";
  li.style.left = "350px";
  li.style.backgroundColor = "#c5c064";
  parent.appendChild(li);
}
//Refresh function
async function Refresh(id) {
  try {
    let parent = document.getElementById("chats");
    parent.innerHTML = "";
    let token = localStorage.getItem("token");
    let parsedToken = parseJwt(token);
    let userName = parsedToken.name;
    let total = JSON.parse(localStorage.getItem("chats"));
    let lastitem;
    if (!total) {
      lastitem = 0;
    } else {
      if (total.length === 0) {
        lastitem = 0;
      } else {
        lastitem = total[total.length - 1].id;
      }
    }

    let res = await axios.get(
      `http://localhost:3000/chats?items=${lastitem}&groupid=${id}`,
      { headers: { Authorization: token } }
    );
    StoreToLocalStorage(
      res.data.chats,
      res.data.id,
      res.data.name,
      res.data.users
    );
    scrollToBottom(parent);
  } catch (error) {
    alert("Error while fetching chats!");
  }
}
function NochatsOnScreen() {
  let parent = document.getElementById("chats");
  let li = document.createElement("li");
  li.textContent = `No Chats Available`;
  li.className = "list-group-item";
  li.style.textAlign = "center";
  li.style.left = "300px";
  li.style.backgroundColor = "#c5c064";
  parent.appendChild(li);
}
function StoreToLocalStorage(data, id, name, users) {
  let oldarr = JSON.parse(localStorage.getItem("chats"));
  if (oldarr) {
    if (oldarr.length > 1000) {
      let diff = oldarr.length - 1000;
      for (let i = 0; i < diff; i++) {
        oldarr.shift();
      }
    }
    let newArr = oldarr.concat(data);
    let stringifydata = JSON.stringify(newArr);
    localStorage.setItem("chats", stringifydata);
  } else {
    let stringifydata = JSON.stringify(data);
    localStorage.setItem("chats", stringifydata);
  }
  let expenses = JSON.parse(localStorage.getItem("chats"));
  if (expenses.length == 0) {
    NochatsOnScreen();
  } else ChatsOnScreen(expenses, id, name, users);
}
// DOM Manupulation for adding chats on Screen
function ChatsOnScreen(arr, id, name, users) {
  AddingToList("You");
  let i = 0;
  for (let k = 0; k < users.length; k++) {
    if (users[k].id != id) {
      AddingToList(users[k].name);
    }
  }
  while (arr.length > i) {
    if (arr[i].userId == id) {
      if (arr[i].isImage) {
        let parent = document.getElementById("chats");
        let li = document.createElement("li");
        li.innerHTML = `<big><sup style="text-align: right;">~You: </sup><img src="${arr[i].message}" height="150px" width="100%"></big>`;
        li.className = "list-group-item";
        li.style.left = "700px";
        li.style.backgroundColor = "grey";
        parent.appendChild(li);
      } else {
        let parent = document.getElementById("chats");
        let li = document.createElement("li");
        li.innerHTML = `<big><sup style="text-align: right;">~You: </sup> ${arr[i].message}</big>`;
        li.className = "list-group-item";
        li.style.left = "700px";
        li.style.float = "right";
        li.style.textAlign = "left";
        li.style.backgroundColor = "grey";
        parent.appendChild(li);
      }
    } else {
      for (let j = 0; j < users.length; j++) {
        if (arr[i].userId == users[j].id) {
          if (arr[i].isImage) {
            let parent = document.getElementById("chats");
            let li = document.createElement("li");
            li.innerHTML = `<big><sup style="text-align: right;">~${users[j].name}: </sup><img src="${arr[i].message}" height="150px" width="100%"></big>`;
            li.className = "list-group-item";
            parent.appendChild(li);
          } else {
            let parent = document.getElementById("chats");
            let li = document.createElement("li");
            li.innerHTML = `<big><sup>~${users[j].name}: </sup> ${arr[i].message}</big>`;
            li.className = "list-group-item";
            parent.appendChild(li);
          }
        }
      }
    }
    i++;
  }
  scrollToBottom(parent);
}
// Sending Messages
async function SendMessage(event) {
  event.preventDefault();
  let message = document.getElementById("message").value;
  let obj = {
    message,
  };
  try {
    let groupid = localStorage.getItem("selectedGroup");
    let token = localStorage.getItem("token");
    let res = await axios.post(
      `http://localhost:3000/chats?groupid=${groupid}`,
      obj,
      { headers: { Authorization: token } }
    );
    socket.emit("new-group-message", groupid);
    ShowMyChatsOnScreen(res.data.chat);
    document.getElementById("message").value = "";
  } catch (error) {
    document.body.innerHTML += `<ul id="SomethingWrong">
        <li class= "list-group-item" style="background-color: yellow; color:red; height: 35px; width:200px; text-align:center;" >
        ${error.response.data.error}
        </li>
        </ul>
        <script>
            const SomethingWrong = document.getElementById("SomethingWrong")
            setTimeout(function(){
                SomethingWrong.innerHTML = "";
            },6000)
        </script>
        `;
  }
}
function ShowMyChatsOnScreen(obj) {
  if (obj.isImage) {
    let parent = document.getElementById("chats");
    let li = document.createElement("li");
    li.innerHTML = `<big><sup style="text-align: right;">~You: </sup><img src="${obj.message}" height="150px" width="100%"></big>`;
    li.className = "list-group-item";
    li.style.left = "700px";
    li.style.backgroundColor = "grey";
    parent.appendChild(li);
  } else {
    let parent = document.getElementById("chats");
    let li = document.createElement("li");
    li.innerHTML = `<big><sup style="text-align: right;">~You: </sup> ${obj.message}</big>`;
    li.className = "list-group-item";
    li.style.left = "700px";
    li.style.textAlign = "right";
    li.style.backgroundColor = "grey";
    parent.appendChild(li);
  }
  scrollToBottom(parent);
}
// Decrpting the Token
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}
// Getting Users for the groups which will be Created
async function UsersforGroups() {
  try {
    let res = await axios.get("http://localhost:3000/users");
    if (res.status == 201) {
      ShowUsers(res.data.users);
    }
  } catch (error) {
    alert("Unable to fetch users");
  }
}
function ShowUsers(users) {
  let token = localStorage.getItem("token");
  let parsedToken = parseJwt(token);
  let userName = parsedToken.name;
  let parent = document.getElementById("selectusers");
  let i = 0;
  while (i < users.length) {
    if (users[i].name != userName) {
      let label = document.createElement("label");
      label.innerHTML = `      
        <input type="checkbox" name="checkboxes" value="${users[i].email}"> ${users[i].name}`;
      parent.appendChild(label);
    }
    i++;
  }
}
UsersforGroups();
document.getElementById("newgroup").addEventListener("submit", (event) => {
  CreateNewGroup(event);
});

// Creating Groups and Group related Tasks
async function CreateNewGroup(event) {
  event.preventDefault();
  let groupname = document.getElementById("name").value;
  var checkboxes = document.getElementsByName("checkboxes");
  var selectedCheckboxes = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  );
  var selectedValues = selectedCheckboxes.map((checkbox) => checkbox.value);
  console.log("Selected Checkboxes:", selectedValues);
  let arr = Array.from(selectedValues);
  let obj = {
    groupname,
    users: arr,
  };
  let token = localStorage.getItem("token");
  try {
    let res = await axios.post("http://localhost:3000/groups", obj, {
      headers: { Authorization: token },
    });
  } catch (error) {
    alert("Unable to create Group");
  }
}
async function GetGroups() {
  let token = localStorage.getItem("token");
  try {
    let res = await axios.get("http://localhost:3000/groups", {
      headers: { Authorization: token },
    });
    console.log(res.data.admins);
    GroupsOnScreen(res.data.groups, res.data.admins);
  } catch (error) {
    alert("Error in fetching Groups");
  }
}
GetGroups();
async function GroupsOnScreen(groups, admins) {
  let GroupParent = document.getElementById("inputs");
  let i = 0;
  while (groups.length > i) {
    let newDiv = document.createElement("div");
    newDiv.className = "groupdiv";
    let groupBtn = document.createElement("input");
    groupBtn.className = "groupinput";
    groupBtn.type = "button";
    let name = groups[i].name;
    let grpid = groups[i].id;
    groupBtn.id = `${name}`;
    groupBtn.value = `${name}`;
    groupBtn.addEventListener("click", () => {
      SelectedGroup(grpid, name);
    });
    GroupParent.appendChild(newDiv);
    newDiv.appendChild(groupBtn);
    for (let j = 0; j < admins.length; j++) {
      if (groups[i].id == admins[j].groupId) {
        let editBtn = document.createElement("button");
        let span = document.createElement("span");
        span.className = "material-symbols-outlined";
        span.textContent = "edit";
        editBtn.appendChild(span);
        editBtn.className = "btn btn-outline-primary btn-lg mb-3 mb-lg-0";
        editBtn.setAttribute("data-bs-toggle", "modal");
        editBtn.setAttribute("data-bs-target", "#editgroup-form");

        editBtn.addEventListener("click", (event) => {
          document.getElementById("slectedgroupsusers").innerHTML = "";
          EditSelectedGroup(event, grpid, name);
        });

        newDiv.appendChild(editBtn);
      }
    }
    i++;
  }
}
async function SelectedGroup(id, name) {
  localStorage.removeItem("chats");
  localStorage.setItem("selectedGroup", id);
  let parent = document.getElementById("gpname");
  parent.innerHTML = `${name}`;
  Refresh(id);
}

localStorage.removeItem("selectedGroup");

// Button for edititng the Group only for admins
async function EditSelectedGroup(event, grpid, name) {
  let h1 = document.getElementById("group__name");
  h1.innerHTML = `${name}`;
  localStorage.setItem("selectedGroup", grpid);
  event.preventDefault();
  try {
    let res = await axios.get(
      `http://localhost:3000/Allusers?groupid=${grpid}`
    );
    if (res.status == 200) {
      ShowgroupUsers(
        res.data.adminUsers,
        res.data.groupUsers,
        res.data.otherUsers,
        grpid,
        name
      );
    }
  } catch (error) {
    alert("Unable to fetch users");
  }
  function ShowgroupUsers(adminUsers, groupUsers, otherUsers, grpid, name) {
    document.getElementById("Group_Members").innerHTML = "";
    let token = localStorage.getItem("token");
    let parsedToken = parseJwt(token);
    let userName = parsedToken.name;
    let parent = document.getElementById("slectedgroupsusers");
    let i = 0;
    while (i < adminUsers.length) {
      if (adminUsers[i].name != userName) {
        let label = document.createElement("label");
        label.innerHTML = `      
                <input type="checkbox" class="editcheckbox" value="${adminUsers[i].email}" readonly checked> ${adminUsers[i].name}`;
        let adminbtn = document.createElement("button");
        adminbtn.innerHTML = "Remove Admin";
        adminbtn.className = "EditRemovebtn";
        adminbtn.addEventListener("click", (event) => {
          let a = adminbtn.previousElementSibling.value;
          console.log(a);
          RemoveUserAdmin(event, a);
        });
        let RemoveUserBtn = document.createElement("button");
        RemoveUserBtn.innerHTML = "Remove User";
        RemoveUserBtn.className = "EditRemovebtn";
        RemoveUserBtn.addEventListener("click", (event) => {
          let a =
            RemoveUserBtn.previousElementSibling.previousElementSibling.value;
          console.log(a);
          RemoveUserFromGroup(event, a);
        });
        label.appendChild(adminbtn);
        label.appendChild(RemoveUserBtn);
        document.getElementById("Group_Members").appendChild(label);
      }
      i++;
    }
    i = 0;
    while (i < groupUsers.length) {
      let label = document.createElement("label");
      label.innerHTML = `      
            <input type="checkbox" class="editcheckbox" value="${groupUsers[i].email}" readonly checked> ${groupUsers[i].name}`;
      let adminbtn = document.createElement("button");
      adminbtn.innerHTML = "Add as Admin";
      adminbtn.className = "EditRemovebtn";
      adminbtn.addEventListener("click", (event) => {
        let a = adminbtn.previousElementSibling.value;
        console.log(a);
        CreateUserAdmin(event, a);
      });
      let RemoveUserBtn = document.createElement("button");
      RemoveUserBtn.innerHTML = "Remove User";
      RemoveUserBtn.className = "EditRemovebtn";
      RemoveUserBtn.addEventListener("click", (event) => {
        let a =
          RemoveUserBtn.previousElementSibling.previousElementSibling.value;
        console.log(a);
        RemoveUserFromGroup(event, a);
      });
      label.appendChild(adminbtn);
      label.appendChild(RemoveUserBtn);
      document.getElementById("Group_Members").appendChild(label);
      i++;
    }
    i = 0;
    while (i < otherUsers.length) {
      let label = document.createElement("label");
      label.innerHTML = `      
            <input type="checkbox" class="editcheckbox1" value="${otherUsers[i].email}"> ${otherUsers[i].name}`;
      parent.appendChild(label);
      i++;
    }
  }
}
async function CreateUserAdmin(event, email_id) {
  event.preventDefault();
  let groupid = localStorage.getItem("selectedGroup");
  let token = localStorage.getItem("token");
  let obj = {
    groupid,
    email: email_id,
  };
  console.log(obj);
  try {
    let res = await axios.post("http://localhost:3000/admin", obj);
    if (res.status == 201) {
      alert(res.data.message);
      window.location.href = "/chatapp.html";
    }
  } catch (error) {
    alert("Problem in Creating Admin");
    // Do the required Changes Nitin
  }
}
async function RemoveUserAdmin(event, email_id) {
  let groupid = localStorage.getItem("selectedGroup");
  let obj = {
    groupid,
    email: email_id,
  };
  try {
    let res = await axios.post("http://localhost:3000/removeadmin", obj);
    if (res.status == 200) {
      alert(res.data.message);
      window.location.href = "/chatapp.html";
    }
  } catch (error) {
    alert("Problem in Deleting Admin");
    // Do the required Changes Nitin
  }
}
async function RemoveUserFromGroup(event, email_id) {
  let groupid = localStorage.getItem("selectedGroup");
  let obj = {
    groupid,
    email: email_id,
  };
  try {
    let res = await axios.post("http://localhost:3000/removeuser", obj);
    if (res.status == 200) {
      alert(res.data.message);
      window.location.href = "/chatapp.html";
    }
  } catch (error) {
    alert("Problem in Removing User");
  }
}

document.getElementById("savechanges").addEventListener("click", (event) => {
  UpdateGroupUsers(event);
});
async function UpdateGroupUsers(event) {
  event.preventDefault();
  console.log("Hey it's Working!!!!");
  var checkboxes = document.getElementsByClassName("editcheckbox1");
  var selectedCheckboxes = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  );
  var selectedValues = selectedCheckboxes.map((checkbox) => checkbox.value);
  console.log("Selected Checkboxes:", selectedValues);
  let arr = Array.from(selectedValues);
  console.log(arr);
  let groupid = localStorage.getItem("selectedGroup");
  let obj = {
    arr,
    groupid,
  };
  try {
    let res = await axios.post("http://localhost:3000/addusers", obj);
    if (res.status == 201) {
      alert(res.data.message);
      window.location.href = "/chatapp.html";
    }
  } catch (error) {
    alert("Error in Adding Members to group!!");
  }
}

function previewImage() {
  const fileInput = document.getElementById("fileInput");
  const previewImage = document.getElementById("divforimage");

  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      previewImage.src = event.target.result;
      previewImage.style.display = "block";
    };
    reader.readAsDataURL(file);
    console.log("Path:", file);
  }
}

// Add event listener to file input
document.getElementById("fileInput").addEventListener("change", previewImage);

// Listen for change event on file inputs
document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById("fileInput1");
    formData.append("image", fileInput.files[0]);
    const token = localStorage.getItem("token");
    let groupid = localStorage.getItem("selectedGroup");
    try {
      const response = await axios.post(
        `http://localhost:3000/uploadfiles?groupid=${groupid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );
      ShowMyChatsOnScreen(response.data.imagemsg);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  });
