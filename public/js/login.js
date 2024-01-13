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
        }

    } catch (error) {
        document.body.innerHTML += `<ul class= "list-group">
        <li class= "list-group-item" style="background-color: yellow; color:red;">${error.response.data.error}</li>
        </ul>`
    }
}