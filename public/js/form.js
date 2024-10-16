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

const resultElement = document.getElementById("result_name")
const errorElement = document.getElementById("error_message")

const clearText = () => {
    resultElement.innerText = ""
    errorElement.innerText = ""
}

async function onLogin(event) {
    event.preventDefault();

    clearText()
    let formData = new FormData(loginForm);
    let username = formData.get("username");
    let password = formData.get("password");

    // let isStudent = formData.get("user_type");
    // if (isStudent === null) {
    //     errorElement.innerText = "กรุณาเลือกประเภทผู้ใช้งาน";
    //     return;
    // }
    if (!username || !password) {
        errorElement.innerText = "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน";
        return
    }


    try {
        let response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (response.status === 400) {
            errorElement.innerText = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
            return;
        }

        if (!response.ok) {
            errorElement.innerText = "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์";
            return;
        }

        const result = await response.json();


        resultElement.innerText += `
            ชื่อไทย: ${result['displayname_th']}
            ชื่ออังกฤษ: ${result['displayname_en']}
            คณะ: ${result['faculty']}
            สาขา: ${result['department']}
            ประเภท: ${result['type'] === "student" ? "นักศึกษา" : "อาจารย์"}
        `
        resultModal.style.display = "block";
    } catch (error) {
        errorElement.innerText = "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์";
    }
}

loginForm.addEventListener('submit', onLogin);

loginForm.addEventListener('keydown', (key) => {
    if (key.code !== 'Enter') return;
    setFocusOnEnter()
})

function close() {
    resultModal.style.display = "none";
}

closeModal.addEventListener('click', () => {
    close()
});

document.getElementById("modal-close").addEventListener('click', close);
// Close the modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === resultModal) {
        close()
    }
});
