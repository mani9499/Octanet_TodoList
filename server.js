const express = require('express');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/todo', (req, res) => {
    fs.readFile('todos.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: "Failed to read todos.json" });
        }
        let todos = [];
        if (data) {
            todos = JSON.parse(data);
        }
        todos.push(req.body);
        fs.writeFile('todos.json', JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Failed to write to todos.json" });
            }
            res.json({ message: "Success", data: req.body });
        });
    });
});

app.get('/todos', (req, res) => {
    fs.readFile('todos.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: "Failed to read todos.json" });
        }
        const todos = JSON.parse(data || '[]'); 
        res.json(todos);
    });
});
app.delete('/todo/:task', (req, res) => {
    fs.readFile('todos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Failed to read todos.json" });
        }
        let todos = JSON.parse(data);
        todos = todos.filter(todo => todo.task !== req.params.task);

        fs.writeFile('todos.json', JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: "Failed to write todos.json" });
            }

            res.status(204).send();
        });
    });
});
app.put('/updatetodos/:task',(req,res)=>{
    fs.readFile('todos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Failed to read todos.json" });
        }

        let todos = JSON.parse(data);
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].task === req.params.task) {
                todos[i].status = "yes";
                break;
            }
        }
        fs.writeFile('todos.json',JSON.stringify(todos,null,2),(err)=>{
            if(err){
                console.log(err);
            }
            res.status(204).send();
        });
    })
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
