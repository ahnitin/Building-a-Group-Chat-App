document.getElementById("sendbtn").addEventListener("click",(event)=>{
    SendMessage(event)
})
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

async function Refresh()
{
    try {
        let parent = document.getElementById("chats");
        parent.innerHTML ="";
        let token = localStorage.getItem("token")
        let parsedToken = parseJwt(token)
        let userName = parsedToken.name;
        console.log("no chats")
        let total = JSON.parse(localStorage.getItem("chats"));
        let lastitem;
        console.log("no chats3")
        if(!total){
            console.log("nochats4:")
            lastitem=0;
        }
        else {
            if(total.length == 0)
            {
                lastitem =0;
            }
            else{
                lastitem = total[total.length-1].id;
            }
            }
        
        let res = await axios.get(`http://localhost:3000/chats?items=${lastitem}`,{headers:{"Authorization":token}});
        if(res.data.chats.length == 0)
        {
            console.log("no chats1")
            NochatsOnScreen();
        }
        else{
            StoreToLocalStorage(res.data.chats,res.data.id,res.data.name,res.data.users);
            scrollToBottom(parent);
        }

    } catch (error) {
        alert("Error while fetching chats!")
    }
}
Refresh();
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
    ChatsOnScreen(expenses,id,name,users)
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
        let token = localStorage.getItem("token");
        console.log(token,obj)
        let res = await axios.post("http://localhost:3000/chats",obj,{headers:{"Authorization":token}})
        ShowMyChatsOnScreen(res.data.chat);
    } catch (error) {
        document.body.innerHTML += `<ul class= "list-group" style="background-color: yellow;">
        <li class= "list-group-item" style="background-color: yellow; color:red; height: 35px; width:200px; text-align:center;" >
        ${error.response.data.error}
        </li>
        </ul>`
    }
    console.log(message)
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
function autoRefresh() {
    Refresh();
}
setInterval(autoRefresh, 10000);

function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

async function UsersforGroups()
{
    try {
        let res = await axios.get("http://localhost:3000/users");
        if(res.status == 201)
        {
            console.log("users fetched")
            ShowUsers(res.data.users);
        }
    } catch (error) {
        alert("Unable to fetch users")
    }
}
function ShowUsers(users)
{
    
    let parent = document.getElementById("selectusers");
    console.log(users)
    console.log(users[0].name)
    let i =0;
    while(i<users.length)
    {
        let label = document.createElement("label");
        label.innerHTML =`      
        <input type="checkbox" name="checkboxes" value="${users[i].name}"> ${users[i].name}`
        parent.appendChild(label);
        i++;
    }
}
UsersforGroups()
