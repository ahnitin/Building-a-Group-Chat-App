document.getElementById("forgot").addEventListener("submit",(event)=>{
    ForgotForm(event);
})
async function ForgotForm(event)
{
    event.preventDefault();
    let email = document.getElementById("email").value;
    try {
        await axios.post("http://54.174.11.103:3000/forgotpassword");

    } catch (error) {
        document.body.innerHTML += `<ul class= "list-group" style="background-color: yellow;">
        <li class= "list-group-item" style="background-color: yellow; color:red; height: 35px; width:200px; text-align:center;" >
        ${error.response.data.error}
        </li>
        </ul>`
    }
}