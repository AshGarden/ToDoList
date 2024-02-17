document.addEventListener('DOMContentLoaded', (event) => {
    const LOCAL_STORAGE_KEY = 'todoApp.todos';
    let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    let sortable;

    function romanize(num) {
        const lookup = {m:1000,cm:900,d:500,cd:400,c:100,xc:90,l:50,xl:40,x:10,ix:9,v:5,iv:4,i:1};
        let roman = '';
        for (let i in lookup ) {
            while ( num >= lookup[i] ) {
                roman += i;
                num -= lookup[i];
            }
        }
        return roman.toLowerCase();
    }

    function renderTodos() {
        const todoList = document.querySelector('.todo-list');
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleComplete(todo.id));
            li.appendChild(checkbox);

            const romanNum = document.createElement('span');
            romanNum.className = 'roman';
            romanNum.textContent = romanize(index + 1) + '.';
            romanNum.style.display = 'inline-block';
            romanNum.style.width = '40px';
            romanNum.style.textAlign = 'center';
            li.appendChild(romanNum);

            const todoText = document.createElement('span');
            todoText.className = 'todo-text';
            todoText.textContent = todo.text;
            todoText.contentEditable = 'true';
            todoText.style.overflowWrap = 'break-word';
            if (window.matchMedia('(max-width: 600px)').matches) {
                todoText.style.width = '16ch';
            } else {
                todoText.style.width = '24ch';
            }
            todoText.style.overflow = 'auto';
            todoText.addEventListener('blur', () => {
                todo.text = todoText.textContent;
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
            });
            li.appendChild(todoText);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Del.';
            deleteButton.className = 'delete-button';
            deleteButton.style.float = 'right';
            deleteButton.addEventListener('click', () => deleteTodo(todo.id));
            li.appendChild(deleteButton);

            todoList.appendChild(li);
        });

        if (sortable) {
            sortable.destroy();
        }

        sortable = new Sortable(todoList, {
            animation: 150,
            onEnd: function (evt) {
                const item = todos.splice(evt.oldIndex, 1)[0];
                todos.splice(evt.newIndex, 0, item);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
            },
            forceFallback: true,
            fallbackClass: 'sortable-fallback',
            fallbackOnBody: true
        });
    }

    function addTodo(text) {
        todos.push({ id: Date.now(), text, completed: false });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
        renderTodos();
    }

    function toggleComplete(id) {
        todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
        renderTodos();
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
        renderTodos();
    }

    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.querySelector('input[type="text"]');
        if (input.value === '') return;
        addTodo(input.value);
        input.value = '';
    });

    renderTodos();
});
