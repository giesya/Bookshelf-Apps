const bookForm = document.getElementById('bookForm');
const bookFormTitle = document.getElementById('bookFormTitle');
const bookFormAuthor = document.getElementById('bookFormAuthor');
const bookFormYear = document.getElementById('bookFormYear');
const bookFormIsComplete = document.getElementById('bookFormIsComplete');
const bookFormSubmit = document.getElementById('bookFormSubmit');
const searchBook = document.getElementById('searchBook');
const searchBookTitle = document.getElementById('searchBookTitle');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];
let editBookId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadBooksFromStorage();
    renderBooks();
    updateSubmitButtonText();
});

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = bookFormTitle.value;
    const author = bookFormAuthor.value;
        const year = parseInt(bookFormYear.value);
    const isComplete = bookFormIsComplete.checked;
    if (editBookId) {
        updateBook(editBookId, title, author, year, isComplete);
        resetEditMode();
    } else {
        const newBook = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete
        };
        books.push(newBook);
        saveBooksToStorage();
    }
    renderBooks();
    bookForm.reset();
    updateSubmitButtonText();
});

bookFormIsComplete.addEventListener('change', updateSubmitButtonText);

searchBook.addEventListener('submit', (e) => {
    e.preventDefault();
    renderBooks();
});

function loadBooksFromStorage() {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    books = storedBooks ? JSON.parse(storedBooks) : [];
}

function saveBooksToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function renderBooks() {
    const searchQuery = searchBookTitle.value.toLowerCase();
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
    books.forEach(book => {
        if (searchQuery && !book.title.toLowerCase().includes(searchQuery)) {
            return;
        }
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    });
}

function createBookElement(book) {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');
    
    const title = document.createElement('h3');
    title.setAttribute('data-testid', 'bookItemTitle');
    title.innerText = book.title;

    const author = document.createElement('p');
    author.setAttribute('data-testid', 'bookItemAuthor');
    author.innerText = `Penulis: ${book.author}`;

    const year = document.createElement('p');
    year.setAttribute('data-testid', 'bookItemYear');
    year.innerText = `Tahun: ${book.year}`;

    const buttonContainer = document.createElement('div');
    const toggleButton = document.createElement('button');
    toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    toggleButton.addEventListener('click', () => toggleBookStatus(book.id));

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.innerText = 'Hapus Buku';
    deleteButton.addEventListener('click', () => deleteBook(book.id));
    
    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.innerText = 'Edit Buku';
    editButton.addEventListener('click', () => startEditBook(book));

    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(editButton);

    bookItem.appendChild(title);
    bookItem.appendChild(author);
    bookItem.appendChild(year);
    bookItem.appendChild(buttonContainer);
    return bookItem;
}

function toggleBookStatus(id) {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
        books[bookIndex].isComplete = !books[bookIndex].isComplete;
        saveBooksToStorage();
        renderBooks();
    }
}

function deleteBook(id) {
    const confirmation = confirm('Apakah Anda yakin ingin menghapus buku ini?');
    if (confirmation) {
        books = books.filter(book => book.id !== id);
        saveBooksToStorage();
        renderBooks();
        if (editBookId === id) {
            resetEditMode();
        }
    }
}

function startEditBook(book) {
    editBookId = book.id;
    bookFormTitle.value = book.title;
    bookFormAuthor.value = book.author;
    bookFormYear.value = book.year;
    bookFormIsComplete.checked = book.isComplete;

    bookFormSubmit.innerHTML = 'Edit Buku pada rak <span>' + (book.isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca') + '</span>';

    bookForm.scrollIntoView({ behavior: 'smooth' });
}

function updateBook(id, title, author, year, isComplete) {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
        books[bookIndex] = {
            ...books[bookIndex],
            title,
            author,
            year,
            isComplete
        };
        saveBooksToStorage();
    }
}

function resetEditMode() {
    editBookId = null;
    bookForm.reset();
    updateSubmitButtonText();
}

function updateSubmitButtonText() {
    const buttonSpan = bookFormSubmit.querySelector('span');
    buttonSpan.innerText = bookFormIsComplete.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
    if (editBookId) {
        bookFormSubmit.innerHTML = 'Edit Buku pada rak <span>' + (bookFormIsComplete.checked ? 'Selesai dibaca' : 'Belum selesai dibaca') + '</span>';
    } else {
        bookFormSubmit.innerHTML = 'Masukkan Buku ke rak <span>' + (bookFormIsComplete.checked ? 'Selesai dibaca' : 'Belum selesai dibaca') + '</span>';
    }
}