document.getElementById("sendbtn").addEventListener("click",(event)=>{
    SendMessage(event)
})

async function Refresh()
{
    try {
        let token = localStorage.getItem("token")
        let parsedToken = parseJwt(token)
        let userName = parsedToken.name;
        console.log(userName)
        let res = await axios.get("http://localhost:3000/chats",{headers:{"Authorization":token}});
        ChatsOnScreen(res.data.chats,res.data.id,res.data.name)
    } catch (error) {
        alert("Error while fetching chats!")
    }
}
Refresh();
function ChatsOnScreen(arr,id,name)
{
    console.log(arr,id,name)
    let i =0;
    while(arr.length>i)
    {
        if(arr[i].userId == id)
        {
            let parent = document.getElementById("chats");
            let li = document.createElement("li");
            li.textContent = arr[i].message;
            li.className = "list-group-item"
            li.style.textAlign = "right"
            li.style.backgroundColor = "grey"
            parent.appendChild(li);
        }
        else{
            let parent = document.getElementById("chats");
            let li = document.createElement("li");
            li.textContent = arr[i].message;
            li.className = "list-group-item"
            parent.appendChild(li);
        }
        i++;
    }
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
    li.style.textAlign = "right"
    li.style.backgroundColor = "grey"
    parent.appendChild(li);
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