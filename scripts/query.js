/* ===== Google Font Import - Poppins ===== */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap');

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}
body{
    background: #E3F2FD;
}
.select-menu{
    width: 380px;
    margin: 140px auto;
}
.select-menu .select-btn{
    display: flex;
    height: 55px;
    background: #fff;
    padding: 20px;
    font-size: 18px;
    font-weight: 400;
    border-radius: 8px;
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
}
.select-btn i{
    font-size: 25px;
    transition: 0.3s;
}
.select-menu.active .select-btn i{
    transform: rotate(-180deg);
}
.select-menu .options{
    position: relative;
    padding: 20px;
    margin-top: 10px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0,0,0,0.1);
    display: none;
}
.select-menu.active .options{
    display: block;
}
.options .option{
    display: flex;
    height: 55px;
    cursor: pointer;
    padding: 0 16px;
    border-radius: 8px;
    align-items: center;
    background: #fff;
}
.options .option:hover{
    background: #F2F2F2;
}
.option i{
    font-size: 25px;
    margin-right: 12px;
}
.option .option-text{
    font-size: 18px;
    color: #333;
}

//
// ===========Custom Dropdown Select Menu in HTML CSS & JavaScript
//
// ============
<body>
    <div class="select-menu">
        <div class="select-btn">
            <span class="sBtn-text">Select your option</span>
            <i class="bx bx-chevron-down"></i>
        </div>

        <ul class="options">
            <li class="option">
                <i class="bx bxl-github" style="color: #171515;"></i>
                <span class="option-text">Github</span>
            </li>
            <li class="option">
                <i class="bx bxl-instagram-alt" style="color: #E1306C;"></i>
                <span class="option-text">Instagram</span>
            </li>
            <li class="option">
                <i class="bx bxl-linkedin-square" style="color: #0E76A8;"></i>
                <span class="option-text">Linkedin</span>
            </li>
            <li class="option">
                <i class="bx bxl-facebook-circle" style="color: #4267B2;"></i>
                <span class="option-text">Facebook</span>
            </li>
            <li class="option">
                <i class="bx bxl-twitter" style="color: #1DA1F2;"></i>
                <span class="option-text">Twitter</span>
            </li>
        </ul>
    </div>

</body>


const optionMenu = document.querySelector(".select-menu"),
       selectBtn = optionMenu.querySelector(".select-btn"),
       options = optionMenu.querySelectorAll(".option"),
       sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

options.forEach(option =>{
    option.addEventListener("click", ()=>{
        let selectedOption = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedOption;

        optionMenu.classList.remove("active");
    });
});