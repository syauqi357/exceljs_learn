// File input change handler to show filename
document.getElementById('fileUpload').addEventListener('change', function (e) {
    const fileName = e.target.files[0]?.name;
    const display = document.getElementById('fileNameDisplay');
    if (fileName) {
        display.textContent = `Selected file: ${fileName}`;
        display.classList.remove('hidden');
    } else {
        display.classList.add('hidden');
    }
});

document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault()
    const formdata = new FormData(this)
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerText = 'Uploading...';
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

    try {
        const response = await fetch('http://localhost:3000/uploads', {
            method: 'POST',
            body: formdata
        })
        const res = await response.json()

        // Simple toast notification (using alert for now, but could be improved)
        alert(res.message)

        loadStudents(); // Refresh table after uploads

        // Reset form
        this.reset();
        document.getElementById('fileNameDisplay').classList.add('hidden');

    } catch (error) {
        console.error('Error:', error);
        alert('Upload failed. Please try again.');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
})

async function loadStudents() {
    const tbody = document.querySelector('#studentTable tbody');
    const emptyState = document.getElementById('emptyState');

    try {
        const response = await fetch('http://localhost:3000/students');
        const students = await response.json();

        tbody.innerHTML = ''; // Clear existing rows

        if (students.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            students.forEach(student => {
                const row = document.createElement('tr');
                row.className = "bg-white hover:bg-gray-50 transition-colors";

                // Status badge logic
                let statusClass = "bg-gray-100 text-gray-800";
                if (student.status?.toLowerCase() === 'active') statusClass = "bg-green-100 text-green-800";
                if (student.status?.toLowerCase() === 'inactive') statusClass = "bg-red-100 text-red-800";

                row.innerHTML = `
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${student.id}</td>
                            <td class="px-6 py-4">${student.name}</td>
                            <td class="px-6 py-4">${student.age}</td>
                            <td class="px-6 py-4">
                                <span class="${statusClass} text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-opacity-20">
                                    ${student.status || 'Unknown'}
                                </span>
                            </td>
                        `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading students:', error);
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-red-500">Failed to load data</td></tr>';
    }
}

// Load data on page load
loadStudents();
