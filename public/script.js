let message="All tasks";
document.getElementById('imp').addEventListener('click', function() {
    if (this.style.color === 'white' && this.style.background === 'black') {
        this.style.color = 'yellow';
        this.style.background = 'red';
    } else {
        this.style.color = 'white';
        this.style.background = 'black';
    }
});

function today(diff) {
    let today = new Date();
    today.setDate(today.getDate() + diff);
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('title').textContent=message;
    fetch('/todos')
        .then(response => response.json())
        .then(todos => {
            todos.forEach(todo => {
                rendertodoItem(todo);
            });
        })
        .catch(error => console.error('Error fetching todos:', error));
        document.getElementById('All').addEventListener('click', () => {
            location.reload();
            message="All Tasks";
            document.getElementById('title').textContent=message;
        });
        document.getElementById('today').addEventListener('click', () => {
            message="Today Tasks";
            document.getElementById('title').textContent=message;
            const Date = today(0);
            DisplayByDate(Date);
        });
        
        document.getElementById('tomorrow').addEventListener('click', () => {
            message="Tomorrow Tasks";
            document.getElementById('title').textContent=message;
            const Date = today(1);
            DisplayByDate(Date);
        });
        
        document.getElementById('important').addEventListener('click', () => {
            message="Important Tasks";
            document.getElementById('title').textContent=message;
            document.querySelectorAll('#todos-list li').forEach(item => {
                const imp_item = item.querySelector('.ri-star-s-fill');
                item.style.display = (imp_item) ? 'flex' : 'none';
            });
        });
        document.getElementById('completed').addEventListener('click',()=>{
            message="Completed Tasks";
            document.getElementById('title').textContent=message;
            document.querySelectorAll('#todos-list li').forEach(item=>{
                const done=item.querySelector(".ri-checkbox-circle-line");
                item.style.display=(done)?'none':'flex';  
            })
        })
});

function DisplayByDate(targetdate) {
    document.querySelectorAll('#todos-list li').forEach(item => {
        const tododate = item.querySelector('div').textContent.split(' ')[0];
        item.style.display = (targetdate == tododate) ? 'flex' : 'none';
    });
}

document.getElementById('date-fetch').addEventListener('input', () => {
    const reqdate = document.getElementById('date-fetch').value;
    DisplayByDate(reqdate);
});



function rendertodoItem(todo) {
    const list = document.getElementById('todos-list');
    const item = document.createElement('li');
    const content = document.createElement('div');
    const holder = document.createElement('div');
    const mark = document.createElement('button');
    const del = document.createElement('button');

    mark.classList.add("ri-checkbox-circle-line");
    del.classList.add("ri-delete-bin-line");
    content.textContent = `${todo.date}     ${todo.task}`;
    if (todo.imp === "true") {
        const imp = document.createElement('button');
        imp.classList.add("ri-star-s-fill");
        holder.appendChild(imp);
    }

    del.addEventListener('click', () => {
        fetch(`/todo/${encodeURIComponent(todo.task)}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.status === 204) {
                item.remove();
                console.log(`Deleted task: ${todo.task}`);
            } else {
                console.error("Failed to delete task");
            }
        })
        .catch(error => console.error('Error deleting todo:', error));
    });

    mark.addEventListener('click', () => {
        fetch(`/updatetodos/${encodeURIComponent(todo.task)}`, {
            method: 'PUT'
        })
        .then(response => {
            if (response.status === 204) {
                console.log('success');
                alert(`${todo.task} successfully completed`);
                location.reload();
            } else {
                console.error("Failed marking task");
            }
        })
        .catch(error => console.error('Error marking todo:', error));
    });
    if(todo.status=="no"){
    holder.appendChild(mark);
    }
    holder.appendChild(del);
    item.appendChild(content);
    item.appendChild(holder);
    list.appendChild(item);
}
document.getElementById('new-todo').addEventListener('submit', function(event) {
    event.preventDefault();
    const formdata = {};
    const elements = this.elements;

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.name) {
            formdata[element.name] = element.value;
        }
        if (element.id === "imp") {
            formdata[element.id] = (element.style.color === 'yellow') ? 'true' : 'false';
        }
    }

    formdata['status'] = "no";
    const jsondata = JSON.stringify(formdata);

    fetch('/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsondata
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.alert(`New task ${formdata.task} Added`);
        location.reload();
    })
    .catch(error => console.error('Error adding new todo:', error));
});
