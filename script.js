if (window.location.hash === ""){
    window.location.hash="farmer" // this sets the default section
}
function router(divID){ 
    /// this is used to navigate between different sections 


    const sections=document.querySelectorAll("section")
    sections.forEach(item => item.classList.remove("visible"))
    const div =document.querySelector("#"+divID)
    div.classList.add("visible")
    window.location.hash=divID


}

router(window.location.hash.replace("#",""));  // this is to keep track of where the user was before refreshing
