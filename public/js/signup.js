document.getElementById("signup-form").addEventListener("submit", (event) => {
  SignupForm(event);
});

async function SignupForm(event) {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let password = document.getElementById("password").value;
  let obj = {
    name,
    email,
    phone,
    password,
  };
  try {
    console.log(obj);
    let res = await axios.post("http://54.174.11.103:3000/signup", obj);
    if (res.status == 201) {
      alert(res.data.message);
      window.location.href = "./login.html";
    }
  } catch (error) {
    document.getElementById(
      "peter"
    ).innerHTML += `<ul class= "list-group" style="background-color: yellow;">
        <li class= "list-group-item" style="background-color: yellow; color:red;" >
        ${error.response.data.error}
        </li>
        </ul>`;
    console.log(error);
  }
}
