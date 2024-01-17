document.getElementById("sendbtn").addEventListener("click",(event)=>{
    SendMessage(event)
})
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
    let div = document.createElement("div");
    div.textContent = obj.message;
    div.className = "list-group-item"
    parent.appendChild(div);
}