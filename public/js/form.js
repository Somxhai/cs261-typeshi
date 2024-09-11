

const loginForm = document.getElementById("login-form")
function setFocusOnEnter() {

  if (loginForm.focus()) {
    for (const i of formControl) {
      if (i.value === '') {
        i.nextElementSibling.focus();
        break;
      }
    }
  }
}

async function onLogin() {
  let formData = new FormData(loginForm);
  let username = formData.get("username")
  let password = formData.get("password")
  console.log(username, password)
  let url = ""
  // await fetch(url, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     username,
  //     password
  //   })
  // })
}

loginForm.addEventListener('submit', onLogin);

loginForm.addEventListener('keydown', (key) => {
  if (key.code !== 'Enter') return;
  setFocusOnEnter()
})

