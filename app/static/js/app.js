




//ajax call

const sendData = async function(url, data={}) {
    const req = await fetch(url, {
        method:"POST",
        headers:{ 
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });
    try {
        const res = await req.json();
        return res;
    } catch( err ) {
        console.log("Error "+err);
    }
}



//function to handel deletion on a list

const deleteListHandler = function(e){
    if(confirm('Are You Sure You Want to Delete A full list?')) { 
        const listId = this.parentElement.dataset.id;
        fetch(`/lists/${listId}/delete`, {
            method:'DELETE'
        }).then(data=>data.json()).then( jsonData =>{
            let id = Number(listId)
            id -= 1;
            window.location.replace("http://127.0.0.1:5000/lists/"+ (id > 0 ? id : 1));
        });
    }else{
        return;
    }
}


// function to handel deletion event for a task
const deleteHandler = function(eve) {        
    const taskId = this.previousElementSibling.previousElementSibling.dataset.id;
    fetch(`/tasks/${taskId}/delete`,{
        method:"DELETE"
    }).then(data=>data.json()).then( jsonData =>{
        this.parentElement.remove()
        console.log(jsonData.action);
    });
}

//function to handel update task event for a task

const updateHandler =  function(eve) {
    const completed = eve.target.checked;
    const taskId = eve.target.dataset.id;
    if(completed){
       this.parentElement.style.textDecoration='line-through';
    }else{
        this.parentElement.style.textDecoration='none';
    }
    sendData(`/tasks/${taskId}/update`,{'completed':completed}).then(d=>console.log(d.action))

}



//lists

const inpList = document.getElementById('form1');
const formList = document.getElementById('formList');
const ulList = document.getElementById('list');
const allBtns = document.querySelectorAll('.list-item button')
const allLis = document.querySelectorAll('.list-item');


// function to create new list 

function addList(data, ul) {

    const li = document.createElement('li');
    li.classList.add('nav-item' ,'list-item');
    li.setAttribute('data-id',data.id)
    const link = document.createElement('a');
    link.classList.add('nav-link','active');
    link.innerText = data.title;
    link.setAttribute('href', data.id)
    link.addEventListener('click',function(e){       
        activateLi(link)
    })
    const btnList = document.createElement('button');
    btnList.innerText='x';
    btnList.addEventListener('click',deleteListHandler)
    li.appendChild(link);
    li.appendChild(btnList);
    ul.appendChild(li);
    if(ul.childElementCount == 1){
        link.classList.add('activate')   
    }else{
        link.classList.remove('activate')
    }

}


//function to activate a list item
function activateLi(li) {
    if(window.location.pathname.split('/')[2] == li.dataset.id)
    {
        li.firstElementChild.classList.add("activate")
        li.style.zIndex=1
        
    }
    else
    li.firstElementChild.classList.remove("activate")
}



// adding new list
formList.addEventListener('submit', function(e){
    e.preventDefault()
    const list = inpList.value;
    //cleaning input from spaces
    const cleanList = list.trim();
    //if there is no input
    if(cleanList === '') {
        const err = document.querySelector('#error');
        err.style.display='block';
        err.innerHTML = "You Must Enter A valid List Name !";
        window.setTimeout(function(){
            err.style.display='none';
        },2000);
        return;
    }

    sendData('/lists/create', {'title':cleanList})
    .then(data=> {
        if(data.error) {
            const err = document.querySelector('#error');
            err.style.display='block';
            err.innerHTML = data.error;
            return;

        }
        addList(data, ulList) })

});



//Activate  Lists

allLis.forEach(ele=>{
    activateLi(ele)
})


// Activate Deletion Btns
allBtns.forEach(ele=>{
    ele.addEventListener('click', deleteListHandler);
})






// adding new task in UI

function addTask(data, ul) {
    //Creating a new task li + input checkbox ... and listener for first event
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'border-0', 'mb-2', 'rounded');
    li.setAttribute('style','background-color: #f4f6f7');
    const checkBox = document.createElement('input');
    checkBox.setAttribute('type','checkbox');
    checkBox.setAttribute('data-id',data.id);
    checkBox.classList.add('form-check-input' ,'me-2');

    //event handler for every new check box input
    checkBox.addEventListener('change', updateHandler);

    const sTag = document.createElement('s');
    sTag.innerHTML = `${data.description}`;
    const newBtn = document.createElement('button');
    newBtn.innerText = "X";
    newBtn.classList.add("btn", "btn-outline-danger", "del-task");
    newBtn.style.position = 'absolute';
    newBtn.style.right = "5px";

    //event handler for every new delete button
    newBtn.addEventListener('click', deleteHandler);

    li.appendChild(checkBox)
    li.appendChild(sTag)
    li.appendChild(newBtn);
    ul.appendChild(li);
}




//tasks
const inpTask = document.getElementById('form2');
const formTask = document.getElementById('formTask');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const ulTask = document.getElementById('tasks');
const btns = document.querySelectorAll('.del-task');
//adding task invoke
formTask.addEventListener('submit', function(e){
    e.preventDefault()
    const task = inpTask.value;
    //cleaning input from spaces
    const cleanTask = task.trim();
    //if there is no input
    if(cleanTask === '') {
        const err = document.querySelector('#error');
        err.style.display='block';
        err.innerHTML = "You Must Enter A valid Task !";
        window.setTimeout(function(){
            err.style.display='none';
        },2000);
        return;
    }
    if(ulList.childElementCount == 0) {
        const err = document.querySelector('#error');
        err.style.display='block';
        err.innerHTML = " Enter A list first ";
        window.setTimeout(function(){
            err.style.display='none';
        },2000);
        return;
    }
    //else
    sendData('/tasks/create',{'description':cleanTask, 
    'list_id':window.location.pathname.split('/')[2]}).then(data=>{
        if(data.error) {
            const err = document.querySelector('#error');
            err.style.display='block';
            err.innerHTML = data.error;
            return;
        }
        
        addTask(data, ulTask)
    })


});

//check boxes handlers for next time use
checkboxes.forEach(ele=>{
    ele.addEventListener('change',updateHandler);   
});


// buttons handler for next time use
btns.forEach(btn=>{
    btn.addEventListener('click', deleteHandler);
})

