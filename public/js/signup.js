document.getElementById("signup-form").addEventListener("submit",(event)=>{
    SignupForm(event);
})

async function SignupForm(event)
{
    event.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;
    let obj={
        name,
        email,
        phone,
        password
    }
    try {
        let res = await axios.post("http://localhost:3000/signup",obj)
    } catch (error) {
        console.log(error)        
    }
}