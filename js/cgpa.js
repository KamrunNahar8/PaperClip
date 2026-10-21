/**
 * DIU CGPA Logic Engine
 * Official Grading Scale (4.00)
 */

const DIU_GRADES = {
    "A+": 4.00,
    "A": 3.75,
    "A-": 3.50,
    "B+": 3.25,
    "B": 3.00,
    "B-": 2.75,
    "C+": 2.50,
    "C": 2.25,
    "D": 2.00,
    "F": 0.00
};

const courseContainer = document.getElementById('courseContainer');
const addCourseBtn = document.getElementById('addCourseBtn');
const cgpaDisplay = document.getElementById('cgpaDisplay');
const gradeStatus = document.getElementById('gradeStatus');
const totalCreditsDisplay = document.getElementById('totalCredits');
const resetBtn = document.getElementById('resetBtn');

let courses = [];

/** Initialize the Application */
function init() {
    const saved = localStorage.getItem('diu_courses');
    if (saved) {
        courses = JSON.parse(saved);
        renderCourses();
    }
    updateCalculations();
}

/** Render Course List from Array */
function renderCourses() {
    courseContainer.innerHTML = '';
    courses.forEach((course, index) => {
        createCourseRow(index, course);
    });
}

/** Add New Empty Course */
function addCourse() {
    const newCourse = { name: '', credit: 3, grade: 'A+' };
    courses.push(newCourse);
    createCourseRow(courses.length - 1, newCourse);
    updateCalculations();
}

/** Create DOM Element for a Course Row */
function createCourseRow(index, courseData) {
    const row = document.createElement('div');
    row.className = 'course-row';

    const nameInput = `<input type="text" placeholder="Course ${index + 1}" value="${courseData.name}" oninput="updateCourse(${index}, 'name', this.value)">`;
    
    const creditInput = `<input type="number" step="0.5" min="0" value="${courseData.credit}" oninput="updateCourse(${index}, 'credit', this.value)">`;
    
    let gradeOptions = '';
    Object.keys(DIU_GRADES).forEach(g => {
        gradeOptions += `<option value="${g}" ${courseData.grade === g ? 'selected' : ''}>${g}</option>`;
    });
    const gradeSelect = `<select onchange="updateCourse(${index}, 'grade', this.value)">${gradeOptions}</select>`;
    
    const deleteBtn = `<button onclick="removeCourse(${index})" class="remove-btn"><i class="fas fa-times-circle"></i></button>`;

    row.innerHTML = nameInput + creditInput + gradeSelect + deleteBtn;
    courseContainer.appendChild(row);
}

/** Update Course Data in State */
window.updateCourse = function(index, field, value) {
    if (field === 'credit') value = parseFloat(value) || 0;
    courses[index][field] = value;
    saveAndCalc();
};

/** Remove Course from State */
window.removeCourse = function(index) {
    courses.splice(index, 1);
    renderCourses();
    saveAndCalc();
};

/** Core Calculation Engine */
function updateCalculations() {
    let totalCredits = 0;
    let totalWeightedPoints = 0;

    courses.forEach(c => {
        const credit = parseFloat(c.credit) || 0;
        const gp = DIU_GRADES[c.grade] || 0;
        totalCredits += credit;
        totalWeightedPoints += (credit * gp);
    });

    const cgpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : "0.00";
    
    // Smooth counters or direct updates
    cgpaDisplay.textContent = cgpa;
    totalCreditsDisplay.textContent = totalCredits;

    // Update Status
    updateStatusLabel(parseFloat(cgpa), totalCredits);
}

/** Professional Status Label Logic */
function updateStatusLabel(cgpa, credits) {
    if (credits === 0) {
        gradeStatus.textContent = "No Courses Added";
        gradeStatus.style.color = "var(--text-muted)";
        return;
    }

    if (cgpa >= 3.9) { gradeStatus.textContent = "Excellent Result"; gradeStatus.style.color = "#fbbf24"; }
    else if (cgpa >= 3.75) { gradeStatus.textContent = "Very Good Result"; gradeStatus.style.color = "#60a5fa"; }
    else if (cgpa >= 3.50) { gradeStatus.textContent = "Good Result"; gradeStatus.style.color = "#34d399"; }
    else if (cgpa >= 2.00) { gradeStatus.textContent = "Passing Status"; gradeStatus.style.color = "var(--text-color)"; }
    else { gradeStatus.textContent = "Needs Improvement"; gradeStatus.style.color = "#f87171"; }
}

function saveAndCalc() {
    localStorage.setItem('diu_courses', JSON.stringify(courses));
    updateCalculations();
}

const downloadPdfBtn = document.getElementById('downloadPdfBtn');

/** Generate Professional PDF Report */
async function generatePdfReport() {
    if (courses.length === 0) {
        alert("Please add at least one course to generate a report.");
        return;
    }

    try {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // --- Header Section ---
        page.drawText('PaperClip', { x: 50, y: height - 50, size: 24, font: fontBold, color: rgb(0.145, 0.388, 0.921) });
        page.drawText('CGPA Calculator', { x: 50, y: height - 72, size: 12, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
        
        const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
        page.drawText(`Generated on: ${date}`, { x: 50, y: height - 100, size: 10, font: fontRegular });
        
        page.drawLine({ start: { x: 50, y: height - 110 }, end: { x: 550, y: height - 110 }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });

        // --- Table Header ---
        let currentY = height - 140;
        page.drawText('Course Name', { x: 50, y: currentY, size: 11, font: fontBold });
        page.drawText('Credits', { x: 350, y: currentY, size: 11, font: fontBold });
        page.drawText('Grade', { x: 450, y: currentY, size: 11, font: fontBold });
        page.drawText('GP', { x: 520, y: currentY, size: 11, font: fontBold });

        page.drawLine({ start: { x: 50, y: currentY - 5 }, end: { x: 550, y: currentY - 5 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });

        // --- Table Rows ---
        currentY -= 25;
        courses.forEach((course, index) => {
            if (currentY < 100) return; // Basic page overflow handling

            const gp = DIU_GRADES[course.grade] || 0;
            const courseName = course.name || `Course ${index + 1}`;
            
            page.drawText(courseName.substring(0, 45), { x: 50, y: currentY, size: 10, font: fontRegular });
            page.drawText(course.credit.toString(), { x: 350, y: currentY, size: 10, font: fontRegular });
            page.drawText(course.grade, { x: 450, y: currentY, size: 10, font: fontRegular });
            page.drawText(gp.toFixed(2), { x: 520, y: currentY, size: 10, font: fontRegular });

            // Zebra striping/lines
            page.drawLine({ start: { x: 50, y: currentY - 5 }, end: { x: 550, y: currentY - 5 }, thickness: 0.5, color: rgb(0.95, 0.95, 0.95) });
            currentY -= 20;
        });

        // --- Summary Section ---
        currentY -= 20;
        page.drawRectangle({ x: 50, y: currentY - 60, width: 500, height: 60, color: rgb(0.97, 0.98, 1.0), borderColor: rgb(0.145, 0.388, 0.921), borderWidth: 1 });
        
        const totalCredits = totalCreditsDisplay.textContent;
        const cgpa = cgpaDisplay.textContent;
        const status = gradeStatus.textContent;

        page.drawText(`Total Credits Completed: ${totalCredits}`, { x: 70, y: currentY - 20, size: 12, font: fontBold });
        page.drawText(`Final CGPA: ${cgpa}`, { x: 70, y: currentY - 45, size: 16, font: fontBold, color: rgb(0.145, 0.388, 0.921) });
        page.drawText(status, { x: 400, y: currentY - 20, size: 10, font: fontBold, color: rgb(0.3, 0.3, 0.3) });

        // --- Footer Footer ---
        page.drawText('This report is generated by PaperClip and is not an official university transcript.', { x: 50, y: 30, size: 8, font: fontRegular, color: rgb(0.6, 0.6, 0.6) });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `PaperClip_CGPA_Report_${new Date().getTime()}.pdf`;
        link.click();

    } catch (error) {
        console.error('PDF Generation Error:', error);
        alert('Failed to generate PDF. Please try again.');
    }
}

/** Event Bindings */
addCourseBtn.addEventListener('click', () => {
    addCourse();
    // Scroll to bottom
    setTimeout(() => courseContainer.lastElementChild?.scrollIntoView({ behavior: 'smooth' }), 100);
});

downloadPdfBtn.addEventListener('click', generatePdfReport);

resetBtn.addEventListener('click', () => {
    if (confirm("Permanently clear all course data?")) {
        courses = [];
        localStorage.removeItem('diu_courses');
        renderCourses();
        updateCalculations();
    }
});

// Boot the app
init();
