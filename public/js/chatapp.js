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
    console.log(message)
}