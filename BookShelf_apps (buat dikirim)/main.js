const todos = [];
const RENDER_DATA_NEW = 'render-todo';
const SAVE_EVENT = 'saved-todo';
const BOOKSHELF_KEY = 'BOOKSHELF_APPS';

// fungsi UnikIdBook
function generateId() {
    return +new Date();
}

// fungsi untuk skema data 
function generateTodoObject (id, title, author, year, bookIsCompleted) {
    return {
        id, 
        title, 
        author, 
        year: parseInt(year) , 
        bookIsCompleted
    }
}

// fungsi saveData
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(BOOKSHELF_KEY, parsed);
        document.dispatchEvent(new Event(SAVE_EVENT));
    }
}

// fungsi isStorageExist
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert ('LocalStorage tersedia');
        return false;
    }
    return true;
}

// fungsi agar data buku tampil ketika di refresh
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOKSHELF_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const todo of data) {
            todos.push(todo);
        }
    }
    document.dispatchEvent(new Event(RENDER_DATA_NEW));
}

// UNTUK mencari buku sesuai dengan ID
function findTodo(todoId) {
    for (todoItem  of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

// UNTUK mencari buku sesuai dengan ID lalu DIHAPUS
function findTodoIndex(todoId) {
    for (const index in todos) {
      if (todos[index].id === todoId) {
        return index;
      }
    }
   
    return -1;
  }

// event localStorage
document.addEventListener(SAVE_EVENT, function () {
    console.log (localStorage.getItem(BOOKSHELF_KEY));
})

// fungsi tambahTodo untuk menambahkan buku baru
function addTodo() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const timestamp = document.getElementById('inputBookYear').value;
    const bookIsCompleted = document.getElementById('inputBookIsComplete').checked;
    
    if (!checkBox.Checked) {
        
    }
    const generatedId = generateId();
    const todoObject = generateTodoObject (generatedId, textTitle, textAuthor, timestamp, bookIsCompleted/*,  false*/);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_DATA_NEW));
    saveData();
}

// untuk checkBox add buku
const checkBox = document.getElementById('inputBookIsComplete');
let check = false;
checkBox.addEventListener('change', function () {
    
    if (checkBox.checked) {
        let check = true;
        document.querySelector('span').innerText = 'SELESAI DIBACA'
        document.querySelector('span').style.color = 'black'
    }else {
        let check = false;
        document.querySelector('span').innerText = 'Belum Selesai Di Baca'
        document.querySelector('span').style.color = 'white'
    }
}) 

// untuk fitur search
document.getElementById('searchBook').addEventListener('submit', function (event) {
    event.preventDefault();

    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.inner');

    for (const books of bookList) {
        if (books.innerText.toLowerCase().includes(searchBook)) {
            books.parentElement.style.display = 'block';
        }else{
            books.parentElement.style.display = 'none';
        }
    }
})

// MENAMPILKAN BUKU YANG TELAH DITAMBAHKAN
function makeTodo(todoObject) {

    const {id, title, author, year, bookIsCompleted/*isCompleted*/} = todoObject;
// untuk text
    const textTitle = document.createElement('h3');
    textTitle.innerText = todoObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis: ' + todoObject.author;
    
    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun: ' + todoObject.year;

// untuk menyematkan/menyisipkan text berupa innterText 
//  dan
// untuk mencapai text dll (karena ada di dalam tag div (html)) maka pakai method append
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

// untuk memanggil text 
    const container = document.createElement('article');
    container.classList.add('book_item');
    
    container.append(textContainer);
    container.setAttribute('id', `todos-${generateTodoObject.id}`);
    
    if (todoObject.bookIsCompleted) {

        // button di rak selesai dibaca
        const undoButton = document.createElement('button')
        undoButton.classList.add('blue');
        undoButton.innerText = 'Belum Selesai dibaca';
        
        undoButton.addEventListener('click', function () {
            moveTaskToInCompleted(todoObject.id);
        });

        const trashButtom = document.createElement('button');
        trashButtom.classList.add('red');
        trashButtom.innerText = 'Hapus Buku';

        trashButtom.addEventListener('click', function () {
            const iya = confirm ('anda yakin menghapus buku ini ?');
                if (iya == true) {
                    removeTaskToCompleted(todoObject.id);
                    document.dispatchEvent(new Event(RENDER_DATA_NEW));
                    alert('buku terhapus');
                }
            document.dispatchEvent(new Event(RENDER_DATA_NEW))            
        })

        container.append(undoButton, trashButtom /*, editButton */);
    
    }else {

        // button di rak belum selesai
        const checkedButton = document.createElement('button');
        checkedButton.classList.add('green');
        checkedButton.innerText = 'Sudah dibaca';
        
        checkedButton.addEventListener('click', function () {
            addTaskToCompleted(todoObject.id);
        });

        // BUTTON UNTUK MENGHAPUS
        const trashButtom = document.createElement('button');
        trashButtom.classList.add('red');
        trashButtom.innerText = 'Hapus Buku';

        trashButtom.addEventListener('click', function () {
            const iya = confirm ('anda yakin menghapus buku ini ?');
                if (iya == true) {
                    removeTaskToCompleted(todoObject.id);
                    document.dispatchEvent(new Event(RENDER_DATA_NEW));
                    alert('buku terhapus');
                }
            document.dispatchEvent(new Event(RENDER_DATA_NEW));
        })

        container.append(checkedButton, trashButtom);
    }

    return container;
}
// MENAMBAHKAN KE RAK SUDAH DIBACA
function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return   ;

    todoTarget.bookIsCompleted = true;
    document.dispatchEvent(new Event(RENDER_DATA_NEW));
    saveData();
}
// berpindah buku dari selesai ke belum
function moveTaskToInCompleted(todoId) {
    const moveTodo = findTodo(todoId);

    if (moveTodo == null) return;

    moveTodo.bookIsCompleted = false;
    document.dispatchEvent(new Event(RENDER_DATA_NEW));
    saveData();
}
// hapus buku
function removeTaskToCompleted(todoId) {
    const removeToddo = findTodoIndex(todoId);

    if (removeToddo === -1) return;

    todos.splice(removeToddo, 1);
    document.dispatchEvent(new Event (RENDER_DATA_NEW));
    saveData();
    
}

// menjalankan html dan menyimpan data dalam memori 
document.addEventListener('DOMContentLoaded', function () {
    const submitFormBook = document.getElementById('inputBook');

    submitFormBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();
    });

    // memanggil fungsi local storage
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});


// EVENT RENDER_DATA_NEW
document.addEventListener(RENDER_DATA_NEW, function () {
    console.log(todos);
    const uncompletedTodoList = document.getElementById('incompleteBookshelfList');
    uncompletedTodoList.innerHTML = '';

    // untuk memindahkan buku ke sudah di baca
    const completeBookshelfList = document.getElementById('completeBookshelfList')
    completeBookshelfList.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        uncompletedTodoList.append(todoElement);

        if (!todoItem.bookIsCompleted/*isCompleted*/) {
            uncompletedTodoList.append(todoElement);
        }else {
            completeBookshelfList.append(todoElement);
        }
    }
})