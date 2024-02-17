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

            // ローマ数字を追加
            const romanNum = document.createElement('span');
            romanNum.className = 'roman';
            romanNum.textContent = romanize(index + 1) + '.';
            romanNum.style.display = 'inline-block'; // ブロックレベル要素として扱う
            romanNum.style.width = '40px'; // 適切な幅を設定（必要に応じて調整）
            romanNum.style.textAlign = 'right'; // 右揃えにする
            li.appendChild(romanNum);

            // ToDoテキストを追加
            const todoText = document.createElement('span');
            todoText.className = 'todo-text';
            todoText.textContent = todo.text;
            todoText.contentEditable = 'true'; // ToDoテキストを編集可能にする
            todoText.style.overflowWrap = 'break-word'; // 一定の文字数を超えたら改行する
            
            // ビューポートの幅に応じて幅を設定
            if (window.matchMedia('(max-width: 600px)').matches) {
                // ビューポートの幅が600px以下の場合（スマホ）
                todoText.style.width = '16ch';
            } else {
                // ビューポートの幅が600pxより大きい場合（パソコン）
                todoText.style.width = '24ch';
            }
            
            todoText.style.overflow = 'auto'; // 内容が領域を超えたらスクロールバーを表示
            li.appendChild(todoText);

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
            },
            // スマホ対応のための設定
            forceFallback: true,
            fallbackClass: 'sortable-fallback',
            fallbackOnBody: true
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
