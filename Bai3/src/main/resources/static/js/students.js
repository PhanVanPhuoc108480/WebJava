const apiUrl = '/api/students';

// Dữ liệu mặc định ban đầu
const defaultStudents = [
    {
        id: "108480",
        studentCode: "108480",
        fullName: "Phan Văn Phước",
        email: "phuoc108480@donga.edu.vn",
        phone: "0388496329",
        className: "IT24B"
    },
    {
        id: "SV001",
        studentCode: "SV001",
        fullName: "Nguyễn Văn Ánh",
        email: "nguyenvanan@gmail.com",
        phone: "0901234567",
        className: "CNTT1"
    },
    {
        id: "SV003",
        studentCode: "SV003",
        fullName: "Lê Văn Cường",
        email: "levancuong@gmail.com",
        phone: "0923456789",
        className: "CNTT2"
    },
    {
        id: "SV002",
        studentCode: "SV002",
        fullName: "Trần Thị Bình",
        email: "tranthibinh@gmail.com",
        phone: "0912345678",
        className: "CNTT1"
    },
    {
        id: "SV006",
        studentCode: "SV006",
        fullName: "Võ Thị Hà",
        email: "vothiha@gmail.com",
        phone: "0956789012",
        className: "CNTT3"
    }
];


// ===============================
// LOCAL STORAGE
// ===============================

function getLocalData() {
    const data = localStorage.getItem('app_students_data');

    if (!data) {
        localStorage.setItem(
            'app_students_data',
            JSON.stringify(defaultStudents)
        );

        return defaultStudents;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        localStorage.removeItem('app_students_data');

        localStorage.setItem(
            'app_students_data',
            JSON.stringify(defaultStudents)
        );

        return defaultStudents;
    }
}


function saveLocalData(data) {
    localStorage.setItem(
        'app_students_data',
        JSON.stringify(data)
    );
}


// ===============================
// STATE
// ===============================

const state = {
    students: getLocalData(),
    editingId: null
};


// ===============================
// HELPER
// ===============================

const $ = (selector) => document.querySelector(selector);


function escapeHtml(value = '') {
    return String(value).replace(
        /[&<>"']/g,
        (c) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[c])
    );
}


function showToast(message) {
    const toast = $('#toast');

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


// ===============================
// SẮP XẾP SINH VIÊN
// ===============================

function sortStudents(students) {

    return [...students].sort((a, b) => {

        const codeA = String(a.studentCode || '').trim();
        const codeB = String(b.studentCode || '').trim();

        // Lấy phần số trong mã sinh viên
        const numA = parseInt(codeA.replace(/\D/g, ''), 10);
        const numB = parseInt(codeB.replace(/\D/g, ''), 10);

        // Nếu cả hai đều có số
        if (!isNaN(numA) && !isNaN(numB)) {

            // 108480 sẽ nằm sau SV001...SV010
            const isNormalA = /^SV\d+$/i.test(codeA);
            const isNormalB = /^SV\d+$/i.test(codeB);

            if (isNormalA && isNormalB) {
                return numA - numB;
            }

            if (isNormalA && !isNormalB) {
                return -1;
            }

            if (!isNormalA && isNormalB) {
                return 1;
            }

            return numA - numB;
        }

        return codeA.localeCompare(codeB);
    });
}


// ===============================
// HIỂN THỊ DANH SÁCH
// ===============================

function renderStudents(students = state.students) {

    const rows = $('#student-rows');

    if (!rows) return;

    if (!students || students.length === 0) {

        rows.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center; padding:20px;">
                    Chưa có sinh viên nào
                </td>
            </tr>
        `;

        return;
    }

    // Luôn sắp xếp trước khi hiển thị
    const sortedStudents = sortStudents(students);

    rows.innerHTML = sortedStudents.map((student, index) => `

        <tr>

            <td style="text-align:center;">
                ${index + 1}
            </td>

            <td>
                <strong>
                    ${escapeHtml(student.studentCode)}
                </strong>
            </td>

            <td>
                ${escapeHtml(student.fullName)}
            </td>

            <td>
                ${escapeHtml(student.email)}
            </td>

            <td>
                ${escapeHtml(student.phone || '')}
            </td>

            <td>
                ${escapeHtml(student.className || '')}
            </td>

            <td style="text-align:center;">

                <div
                    class="action-btns"
                    style="
                        display:flex;
                        gap:5px;
                        justify-content:center;
                    "
                >

                    <button
                        class="btn btn-warning"
                        data-edit="${student.id}"
                    >
                        Sửa
                    </button>

                    <button
                        class="btn btn-danger"
                        data-delete="${student.id}"
                    >
                        Xóa
                    </button>

                </div>

            </td>

        </tr>

    `).join('');
}


// ===============================
// LOAD DỮ LIỆU TỪ API
// ===============================

async function loadStudents(keyword = '') {

    try {

        const url = keyword
            ? `${apiUrl}/search?keyword=${encodeURIComponent(keyword)}`
            : apiUrl;

        const response = await fetch(url);

        if (response.ok) {

            const data = await response.json();

            if (Array.isArray(data)) {

                // Nhận dữ liệu từ SQL Server
                state.students = data;

                // Lưu lại dữ liệu mới
                saveLocalData(data);
            }
        }

    } catch (error) {

        console.warn(
            'Backend chưa sẵn sàng, sử dụng dữ liệu LocalStorage.'
        );
    }


    // ===============================
    // TÌM KIẾM
    // ===============================

    if (keyword) {

        const lower = keyword.toLowerCase();

        const filtered = state.students.filter(student => {

            const studentCode =
                String(student.studentCode || '').toLowerCase();

            const fullName =
                String(student.fullName || '').toLowerCase();

            const email =
                String(student.email || '').toLowerCase();

            const phone =
                String(student.phone || '').toLowerCase();

            return (
                studentCode.includes(lower) ||
                fullName.includes(lower) ||
                email.includes(lower) ||
                phone.includes(lower)
            );
        });

        renderStudents(filtered);

    } else {

        renderStudents(state.students);
    }
}


// ===============================
// MODAL
// ===============================

function openModal(student = null) {

    state.editingId = student?.id || null;

    $('#modal-title').textContent =
        student
            ? 'Cập nhật sinh viên'
            : 'Thêm sinh viên';

    $('#student-id').value =
        student?.id || '';

    $('#student-code').value =
        student?.studentCode || '';

    $('#full-name').value =
        student?.fullName || '';

    $('#email').value =
        student?.email || '';

    $('#phone').value =
        student?.phone || '';

    $('#class-name').value =
        student?.className || '';

    $('#form-error').textContent = '';

    $('#student-modal').classList.add('open');
}


function closeModal() {

    $('#student-modal').classList.remove('open');
}


// ===============================
// THÊM / SỬA SINH VIÊN
// ===============================

async function saveStudent(event) {

    event.preventDefault();

    const studentData = {

        studentCode:
            $('#student-code').value.trim(),

        fullName:
            $('#full-name').value.trim(),

        email:
            $('#email').value.trim(),

        phone:
            $('#phone').value.trim(),

        className:
            $('#class-name').value.trim()
    };


    const isEditing =
        Boolean(state.editingId);


    const newId =
        isEditing
            ? state.editingId
            : (
                studentData.studentCode ||
                String(Date.now())
            );


    // ===============================
    // CẬP NHẬT LOCAL
    // ===============================

    if (isEditing) {

        const index =
            state.students.findIndex(
                s =>
                    String(s.id) ===
                    String(state.editingId)
            );

        if (index !== -1) {

            state.students[index] = {
                ...state.students[index],
                ...studentData
            };
        }

    } else {

        const existIndex =
            state.students.findIndex(
                s =>
                    s.studentCode ===
                    studentData.studentCode
            );

        if (existIndex !== -1) {

            state.students[existIndex] = {
                id: newId,
                ...studentData
            };

        } else {

            state.students.push({
                id: newId,
                ...studentData
            });
        }
    }


    saveLocalData(state.students);


    // Hiển thị theo SV001 → SV002 → SV003...
    renderStudents(state.students);


    closeModal();


    showToast(
        isEditing
            ? 'Đã cập nhật sinh viên!'
            : 'Đã thêm sinh viên thành công!'
    );


    // ===============================
    // GỬI API BACKEND
    // ===============================

    try {

        const response = await fetch(

            isEditing
                ? `${apiUrl}/${state.editingId}`
                : apiUrl,

            {
                method:
                    isEditing
                        ? 'PUT'
                        : 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify(studentData)
            }
        );


        if (!response.ok) {

            console.warn(
                'API trả về lỗi:',
                response.status
            );
        }

    } catch (error) {

        console.warn(
            'Không kết nối được Backend.'
        );
    }
}


// ===============================
// XÓA SINH VIÊN
// ===============================

async function deleteStudent(id) {

    if (
        !confirm(
            'Bạn có chắc muốn xóa sinh viên này?'
        )
    ) {
        return;
    }


    state.students =
        state.students.filter(
            student =>
                String(student.id) !==
                String(id)
        );


    saveLocalData(state.students);


    renderStudents(state.students);


    showToast(
        'Đã xóa sinh viên!'
    );


    try {

        const response =
            await fetch(
                `${apiUrl}/${id}`,
                {
                    method: 'DELETE'
                }
            );


        if (!response.ok) {

            console.warn(
                'API xóa thất bại.'
            );
        }

    } catch (error) {

        console.warn(
            'Không kết nối được Backend.'
        );
    }
}


// ===============================
// EVENT LISTENERS
// ===============================

// Form
const studentForm =
    $('#student-form');

if (studentForm) {

    studentForm.addEventListener(
        'submit',
        saveStudent
    );
}


// Mở modal thêm
const openCreateTop =
    $('#open-create-top');

if (openCreateTop) {

    openCreateTop.addEventListener(
        'click',
        () => openModal()
    );
}


// Đóng modal
const cancelModal =
    $('#cancel-modal');

if (cancelModal) {

    cancelModal.addEventListener(
        'click',
        closeModal
    );
}


const closeModalButton =
    $('#close-modal');

if (closeModalButton) {

    closeModalButton.addEventListener(
        'click',
        closeModal
    );
}


// ===============================
// NÚT SỬA / XÓA
// ===============================

const studentRows =
    $('#student-rows');

if (studentRows) {

    studentRows.addEventListener(
        'click',
        (event) => {

            const editBtn =
                event.target.closest(
                    '[data-edit]'
                );

            const deleteBtn =
                event.target.closest(
                    '[data-delete]'
                );


            // Sửa
            if (editBtn) {

                const student =
                    state.students.find(
                        s =>
                            String(s.id) ===
                            String(
                                editBtn.dataset.edit
                            )
                    );

                if (student) {

                    openModal(student);
                }
            }


            // Xóa
            if (deleteBtn) {

                deleteStudent(
                    deleteBtn.dataset.delete
                );
            }
        }
    );
}


// ===============================
// TÌM KIẾM
// ===============================

const searchInput =
    $('#search-input');

if (searchInput) {

    searchInput.addEventListener(
        'input',
        (event) => {

            loadStudents(
                event.target.value.trim()
            );
        }
    );
}


// Nếu HTML của m có search-btn
const searchButton =
    $('#search-btn');

if (searchButton) {

    searchButton.addEventListener(
        'click',
        () => {

            loadStudents(
                searchInput
                    ? searchInput.value.trim()
                    : ''
            );
        }
    );
}


// ===============================
// CHẠY LẦN ĐẦU
// ===============================

loadStudents();