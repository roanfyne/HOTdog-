const password = "hotcats+dogs";

function verifyPassword() {
    const userPassword = document.getElementById('password').value;
    if (userPassword === password) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-screen').style.display = 'block';
        loadFiles();
    } else {
        alert('Incorrect password!');
    }
}

function uploadFile() {
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result.split(',')[1];
            const filename = file.name;

            const data = {
                event_type: "workflow_dispatch",
                client_payload: {
                    file: content,
                    filename: filename
                }
            };

            fetch(`https://api.github.com/repos/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME/dispatches`, {
                method: "POST",
                headers: {
                    "Authorization": `token Cats69`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status === 204) {
                    alert('File uploaded successfully!');
                    loadFiles();
                } else {
                    alert('File upload failed!');
                }
            });
        };
        reader.readAsDataURL(file);
    }
}

function loadFiles() {
    fetch(`https://api.github.com/repos/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME/contents/uploads`, {
        method: "GET",
        headers: {
            "Authorization": `token Cats69`
        }
    })
    .then(response => response.json())
    .then(files => {
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = '';
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `<a href="${file.download_url}" target="_blank">${file.name}</a>`;
            fileList.appendChild(fileItem);
        });
    });
}

function searchFiles() {
    const query = document.getElementById('search').value.toLowerCase();
    fetch(`https://api.github.com/repos/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME/contents/uploads`, {
        method: "GET",
        headers: {
            "Authorization": `token Cats69`
        }
    })
    .then(response => response.json())
    .then(files => {
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = '';
        files.forEach(file => {
            if (file.name.toLowerCase().includes(query)) {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `<a href="${file.download_url}" target="_blank">${file.name}</a>`;
                fileList.appendChild(fileItem);
            }
        });
    });
}