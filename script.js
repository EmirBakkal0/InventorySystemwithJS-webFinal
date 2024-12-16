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


function show(id){
    const forms = document.querySelectorAll("form")
    forms.forEach(item => item.classList.remove("visible"))
    const div =document.querySelector("#"+id)
    div.classList.add("visible")
}

router(window.location.hash.replace("#",""));  // this is to keep track of where the user was before refreshing
