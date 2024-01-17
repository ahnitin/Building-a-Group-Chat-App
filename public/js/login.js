document.getElementById("login-form").addEventListener("submit",(event)=>{
    LoginForm(event)
})

async function LoginForm(event)
{
    event.preventDefault();
    try {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let obj ={
            email,password
        }
        let res = await axios.post("http://localhost:3000/login",obj);
        if(res.status===201) {
            alert(res.data.message);
            localStorage.setItem("token",res.data.token);
            window.location.href="/chatapp.html"
        }

    } catch (error) {
        document.body.innerHTML += `<ul class= "list-group" style="background-color: yellow;">
        <li class= "list-group-item" style="background-color: yellow; color:red; height: 35px; width:200px; text-align:center;" >
        ${error.response.data.error}
        </li>
        </ul>`
    }
}