// ページが読み込まれたときに実行されるコード
document.addEventListener('DOMContentLoaded', (event) => {
    const LOCAL_STORAGE_KEY = 'todoApp.todos';
    let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

    // ローマ数字に変換する関数
    function romanize(num) {
        const lookup = {m:1000,cm:900,d:500,cd:400,c:100,xc:90,l:50,xl:40,x:10,ix:9,v:5,iv:4,i:1};
        let roman = '';
        for (let i in lookup ) {
            while ( num >= lookup[i] ) {
                roman += i;
                num -= lookup[i];
            }
        }
        return roman;
    }

    // ToDoリストをレンダリングする関数
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

            // ToDoテキストの前に番号を追加
            li.appendChild(document.createTextNode(romanize(index + 1) + '. ' + todo.text));

            // 削除ボタンを作成
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Del.';
            deleteButton.className = 'delete-button';
            deleteButton.style.float = 'right'; // 削除ボタンを右端に寄せる
            deleteButton.addEventListener('click', () => deleteTodo(todo.id));
            li.appendChild(deleteButton);

            todoList.appendChild(li);
        });

        // Sortable.jsを使用してToDoリストの要素間のソートを可能にする
        new Sortable(todoList, {
            animation: 150,
            onEnd: function (evt) {
                const item = todos.splice(evt.oldIndex, 1)[0];
                todos.splice(evt.newIndex, 0, item);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
                renderTodos();
            }
        });
    }

    // 新しいToDoを追加する関数
    function addTodo(text) {
        todos.push({ id: Date.now(), text, completed: false });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
        renderTodos();
    }

    // ToDoの完了状態を切り替える関数
    function toggleComplete(id) {
        todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
        renderTodos();
    }

    // ToDoを削除する関数
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
        renderTodos();
    }

// フォームの送信イベントをリッスンする
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('input[type="text"]');
    if (input.value === '') return;
    addTodo(input.value);
    input.value = ''; // 送信後にinputタグの値をクリア
});

    // 初期のToDoリストをレンダリングする
    renderTodos();

});
