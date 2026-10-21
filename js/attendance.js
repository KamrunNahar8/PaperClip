/**
 * DIU Attendance Planner (Simplified)
 * Calculates the 75% threshold results automatically.
 */

document.addEventListener('DOMContentLoaded', () => {
    const totalClassesInput = document.getElementById('totalClasses');
    const calculateBtn = document.getElementById('calculateBtn');
    const mustAttendDisplay = document.getElementById('mustAttendDisplay');
    const canSkipDisplay = document.getElementById('canSkipDisplay');
    const comparisonDisplay = document.getElementById('comparisonDisplay');
    const summaryText = document.getElementById('summaryText');
    const resultArea = document.getElementById('resultArea');

    if (!calculateBtn || !totalClassesInput) {
        console.error("Attendance Planner: Required elements not found.");
        return;
    }

    function calculateAttendance() {
        const total = parseInt(totalClassesInput.value.trim());

        if (isNaN(total) || total <= 0) {
            alert("Please enter a valid number for total classes.");
            return;
        }

        // Logic: Calculate the 75% Goal
        const mustAttend = Math.ceil(total * 0.75);
        const canSkip = total - mustAttend;
        const percentage = ((mustAttend / total) * 100).toFixed(1);

        // UI Updates
        if (mustAttendDisplay) mustAttendDisplay.textContent = mustAttend;
        if (canSkipDisplay) canSkipDisplay.textContent = canSkip;
        
        if (comparisonDisplay) {
            comparisonDisplay.textContent = `${percentage}% > 75%`;
        }
        
        if (summaryText) {
            summaryText.innerHTML = `To maintain the <strong>75% attendance</strong> requirement for a course with <strong>${total}</strong> total classes:<br><br>
            You must attend at least <strong>${mustAttend}</strong> classes. This gives you a safe margin of <strong>${canSkip}</strong> classes that you can skip.`;
        }

        // Show Result Area
        if (resultArea) {
            resultArea.style.display = 'block';
            setTimeout(() => {
                resultArea.classList.add('active');
            }, 10);
        }

        // Scroll to results on mobile
        if (window.innerWidth <= 768 && resultArea) {
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /** Event Bindings */
    calculateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        calculateAttendance();
    });

    totalClassesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateAttendance();
        }
    });
});
