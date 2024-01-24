document.getElementById("sendbtn").addEventListener("click",(event)=>{
    SendMessage(event)
})
document.getElementById("logout").addEventListener("click",()=>{
    localStorage.clear();
    window.location.href ="/login.html"
})
// document.getElementById("common").addEventListener("click",()=>{
//     localStorage.removeItem("chats");
//     localStorage.setItem("selectedGroup",0)
//     let parent = document.getElementById("gpname")
//     parent.innerHTML = "Common"
//     Refresh(0);
// })
function AddingToList(name)
{
    let parent = document.getElementById("chats");
    let li = document.createElement("li");
    li.textContent = `${name} Joined`;
    li.className = "list-group-item"
    li.style.textAlign = "center"
    li.style.backgroundColor = "#c5c064"
    parent.appendChild(li);
}

async function Refresh(id)
{
    try {
        let parent = document.getElementById("chats");
        parent.innerHTML ="";
        let token = localStorage.getItem("token")
        let parsedToken = parseJwt(token)
        let userName = parsedToken.name;
        let total = JSON.parse(localStorage.getItem("chats"));
        let lastitem;
        if(!total){
            lastitem=0;
        }
        else {
            if(total.length === 0)
            {
                lastitem =0;
            }
            else{
                lastitem = total[total.length-1].id;
            }
            }
        
        let res = await axios.get(`http://localhost:3000/chats?items=${lastitem}&groupid=${id}`,{headers:{"Authorization":token}});
            StoreToLocalStorage(res.data.chats,res.data.id,res.data.name,res.data.users);
            scrollToBottom(parent);

    } catch (error) {
        alert("Error while fetching chats!")
    }
}
function NochatsOnScreen()
{
    let parent = document.getElementById("chats");
    let li = document.createElement("li");
    li.textContent = `No Chats Available`;
    li.className = "list-group-item"
    li.style.textAlign = "center"
    li.style.left="300px"
    li.style.backgroundColor = "#c5c064"
    parent.appendChild(li);
}
function StoreToLocalStorage(data,id,name,users)
{
    let oldarr = JSON.parse(localStorage.getItem("chats"));
    if(oldarr)
    {if(oldarr.length>1000)
        {
            let diff = oldarr.length-1000;
            for(let i=0;i<diff;i++)
            {
                oldarr.shift();
            }
        }
        let newArr = oldarr.concat(data)
        let stringifydata = JSON.stringify(newArr)
        localStorage.setItem("chats",stringifydata);
    }
    else
    {
        let stringifydata = JSON.stringify(data)
        localStorage.setItem("chats",stringifydata);
    }
    let expenses = JSON.parse(localStorage.getItem("chats"));
    if(expenses.length == 0)
    {
        NochatsOnScreen()
    }
    else ChatsOnScreen(expenses,id,name,users)
}
function ChatsOnScreen(arr,id,name,users)
{
    AddingToList("You")
    let i =0;
    for(let k =0;k<users.length;k++)
    {
        if(users[k].id != id)
        {
            AddingToList(users[k].name)
        }
    }
    while(arr.length>i)
    {
        if(arr[i].userId == id)
        {
            let parent = document.getElementById("chats");
            let li = document.createElement("li");
            li.innerHTML = `<big><sup style="text-align: right;">~You: </sup> ${arr[i].message}</big>`;
            li.className = "list-group-item"
            li.style.left = "700px";
            li.style.float = "right"
            li.style.textAlign = "left"
            li.style.backgroundColor = "grey"
            parent.appendChild(li);
        }
        else {
            for(let j =0;j<users.length;j++)
            {
                if(arr[i].userId == users[j].id)
                {
                    let parent = document.getElementById("chats");
                    let li = document.createElement("li");
                    li.innerHTML = `<big><sup>~${users[j].name}: </sup> ${arr[i].message}</big>`;
                    li.className = "list-group-item"
                    parent.appendChild(li);
                }
            
            }
        }
        i++;
    }
    scrollToBottom(parent);
}
async function SendMessage(event)
{
    event.preventDefault();
    let message = document.getElementById("message").value;
    let obj={
        message
    }
    try {
        let groupid = localStorage.getItem("selectedGroup");
        let token = localStorage.getItem("token");
        let res = await axios.post(`http://localhost:3000/chats?groupid=${groupid}`,obj,{headers:{"Authorization":token}})
        ShowMyChatsOnScreen(res.data.chat);
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
        `
    }
}
function ShowMyChatsOnScreen(obj)
{
    let parent = document.getElementById("chats");
    let li = document.createElement("li");
    li.textContent = obj.message;
    li.className = "list-group-item"
    li.style.left = "700px";
    li.style.textAlign = "right"
    li.style.backgroundColor = "grey"
    parent.appendChild(li);
    scrollToBottom(parent);
}
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

async function UsersforGroups()
{
    try {
        let res = await axios.get("http://localhost:3000/users");
        if(res.status == 201)
        {
            ShowUsers(res.data.users);
        }
    } catch (error) {
        alert("Unable to fetch users")
    }
}
function ShowUsers(users)
{
    let token = localStorage.getItem("token")
    let parsedToken = parseJwt(token)
    let userName = parsedToken.name;
    let parent = document.getElementById("selectusers");
    let i =0;
    while(i<users.length)
    {
       if(users[i].name != userName)
       {
        let label = document.createElement("label");
        label.innerHTML =`      
        <input type="checkbox" name="checkboxes" value="${users[i].email}"> ${users[i].name}`
        parent.appendChild(label);
       }
        i++;
    }
}
UsersforGroups()
document.getElementById("newgroup").addEventListener("submit",(event)=>{
    CreateNewGroup(event)
})
async function CreateNewGroup(event)
{
    event.preventDefault();
    let groupname = document.getElementById("name").value;
    var checkboxes = document.getElementsByName("checkboxes");
    var selectedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    var selectedValues = selectedCheckboxes.map(checkbox => checkbox.value);
    console.log("Selected Checkboxes:", selectedValues);
    let arr = Array.from(selectedValues)
    let obj ={
        groupname,
        users:arr
    }
    let token = localStorage.getItem("token")
    try {
        let res= await axios.post("http://localhost:3000/groups",obj,{headers:{"Authorization":token}})
        
    } catch (error) {
        alert("Unable to create Group")
    }
}
async function GetGroups()
{
    let token = localStorage.getItem("token")
    try {
        let res = await axios.get("http://localhost:3000/groups",{headers:{"Authorization":token}});
        GroupsOnScreen(res.data.groups);
        
    } catch (error) {
        alert("Error in fetching Groups")
    }
}
GetGroups();
function GroupsOnScreen(groups)
{
    let GroupParent = document.getElementById("inputs");
    let i =0;
    while(groups.length>i)
    {
        let newDiv = document.createElement("div");
        newDiv.className="groupdiv"
        let groupBtn = document.createElement("input");
        groupBtn.className ="groupinput"
        let editBtn = document.createElement("button");
        let span = document.createElement("span");
        span.className="material-symbols-outlined"
        span.textContent = "edit"
        editBtn.appendChild(span);
        editBtn.className ="btn btn-outline-primary btn-lg mb-3 mb-lg-0" 
        editBtn.setAttribute('data-bs-toggle', 'modal');
        editBtn.setAttribute('data-bs-target', '#signup-form');
        groupBtn.type = "button";
        let name = groups[i].name;
        let grpid = groups[i].id;
        groupBtn.id = `${name}`;
        groupBtn.value =`${name}`;
        groupBtn.addEventListener("click",()=>{
            SelectedGroup(grpid,name);
        })
        editBtn.addEventListener("click",(event)=>{
            EditSelectedGroup(grpid,name)
        })
        GroupParent.appendChild(newDiv);
        newDiv.appendChild(groupBtn);
        newDiv.appendChild(editBtn)
        i++;
    }
}
async function SelectedGroup(id,name)
{
    localStorage.removeItem("chats");
    localStorage.setItem("selectedGroup",id)
    let parent = document.getElementById("gpname")
    parent.innerHTML = `${name}`
    Refresh(id)
}
function autoRefresh() {
    let id = localStorage.getItem("selectedGroup")
    if(id)
    {
    Refresh(id);
    }
}
setInterval(autoRefresh, 10000);
localStorage.removeItem("selectedGroup");

async function EditSelectedGroup(grpid,name)
{   
    try {
        let res = await axios.get("http://localhost:3000/users");
        if(res.status == 201)
        {
            ShowgroupUsers(res.data.users);
        }
    } catch (error) {
        alert("Unable to fetch users")
    }
    function ShowgroupUsers(users)
    {
        let token = localStorage.getItem("token")
        let parsedToken = parseJwt(token)
        let userName = parsedToken.name;
        let parent = document.getElementById("slectedgroupsusers");
        let i =0;
        while(i<users.length)
        {
           if(users[i].name != userName)
           {
            let label = document.createElement("label");
            label.innerHTML =`      
            <input type="checkbox" name="checkboxes" value="${users[i].email}"> ${users[i].name}`
            parent.appendChild(label);
           }
            i++;
        }
    }

}
