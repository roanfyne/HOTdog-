const password = "hotcats+dogs";
const repoOwner = "roanfyne"; // Replace with your GitHub username
const repoName = "HOTdog-"; // Replace with your repository name
const token = "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"; // Replace with your actual PAT securely

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

            fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/dispatches`, {
                method: "POST",
                headers: {
                    "Authorization": `token ${token}`,
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
    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/uploads`, {
        method: "GET",
        headers: {
            "Authorization": `token ${token}`
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
    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/uploads`, {
        method: "GET",
        headers: {
            "Authorization": `token ${token}`
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
