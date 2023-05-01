const setEditModal = (isbn) => {
    // We will implement this later
}

const deleteBook = (isbn) => {
    // We will implement this later
}

const loadBooks = () => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://localhost:3001/data", false);
    xhttp.send();

    const dataArr = JSON.parse(xhttp.responseText);

    for (let data of dataArr) {
        const x = `
            <div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${data.title}</h5>
                        <h6 class="card-subtitle">Score: ${data.score}</h6>

                        <div>Value Searched: ${data.value}</div>
                        <div>Date: ${data.date}</div>
                        <div>URL: <a href="${data.url}">${data.url}</a></div>

                        <hr>

                    </div>
                </div>
            </div>
        `

        document.getElementById('data').innerHTML = document.getElementById('data').innerHTML + x;
    }
}

loadBooks();