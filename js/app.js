/**
 * Core PDF Synthesis Module
 * Orchestrates document upload, client-side rendering, spatial data management, and compression pipeline.
 */

/**
 * Faculty Data Loader — Backend Integration
 *
 * Attempts to load faculty data from the local Node.js API server (localhost:3000).
 * If the server is not running, it silently falls back to the static `facultyData`
 * variable already loaded by `js/faculty_data.js`. The rest of the app is unaffected.
 *
 * To start the backend: open a terminal in the `backend/` folder and run `node server.js`
 */
(async function loadFacultyFromAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/faculty', {
            signal: AbortSignal.timeout(2000) // 2 second timeout — don't slow down page load
        });
        if (response.ok) {
            const data = await response.json();
            // Override the static facultyData with the data served from the local backend
            window.facultyData = data;
            console.log(`[PaperClip API] Faculty data loaded from local backend. (${data.length} members)`);
        }
    } catch (e) {
        // Backend is not running — silently keep using the static js/faculty_data.js
        // This ensures the project works exactly as before without the backend.
    }
})();

const fileInput = document.getElementById('fileInput');
const imageList = document.getElementById('imageList');
const submitDateInput = document.getElementById('submitDate');
const hiddenDateInput = document.getElementById('hiddenDate');
const teacherInput = document.getElementById('teacherName');
const designationInput = document.getElementById('designation');
const autocompleteList = document.getElementById('teacherAutocomplete');

let filesArray = [];

/**
 * Real-time typeahead orchestration for faculty data mapping.
 */
if (teacherInput && autocompleteList) {
    teacherInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        autocompleteList.innerHTML = '';
        
        if (!value || typeof facultyData === 'undefined') {
            autocompleteList.style.display = 'none';
            const parent = teacherInput.closest('.form-section');
            if (parent) parent.style.zIndex = '1';
            return;
        }

        const filtered = facultyData.filter(f => 
            f.name.toLowerCase().includes(value)
        ).slice(0, 10);

        if (filtered.length > 0) {
            autocompleteList.style.display = 'block';
            
            const parent = teacherInput.closest('.form-section');
            if (parent) parent.style.zIndex = '1000';

            filtered.forEach(faculty => {
                const div = document.createElement('div');
                div.className = 'autocomplete-item';
                div.innerHTML = `<strong>${faculty.name}</strong><span>${faculty.designation}</span>`;
                div.onclick = () => {
                    teacherInput.value = faculty.name;
                    designationInput.value = faculty.designation;
                    autocompleteList.style.display = 'none';
                    if (parent) parent.style.zIndex = '1';
                };
                autocompleteList.appendChild(div);
            });
        } else {
            autocompleteList.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!teacherInput.contains(e.target) && !autocompleteList.contains(e.target)) {
            autocompleteList.style.display = 'none';
        }
    });
}

/**
 * Intelligent Filename Engine: Automatically constructs standardized output filenames.
 * Pattern: Student Name (Student ID) - Course Name.pdf
 */
const outputNameInput = document.getElementById('outputName');
const studentNameInput = document.getElementById('studentName');
const studentIDInput = document.getElementById('studentID');
const courseNameInput = document.getElementById('courseName');

function updateOutputFilename() {
    const name = studentNameInput.value.trim();
    const id = studentIDInput.value.trim();
    const course = courseNameInput.value.trim();
    
    // Fallback to default if both name and ID are missing
    if (!name && !id) {
        outputNameInput.value = 'DIU.pdf';
        return;
    }
    
    let filename = "";
    if (name && id) {
        filename = `${name} (${id})`;
    } else {
        filename = name || id;
    }
    
    if (course) {
        filename += ` - ${course}`;
    }
    
    outputNameInput.value = `${filename}.pdf`;
}

// Bind listeners to trigger filename updates on input
[studentNameInput, studentIDInput, courseNameInput].forEach(el => {
    if (el) el.addEventListener('input', updateOutputFilename);
});

/**
 * Re-indexes array buffer orchestration nodes to guarantee the correct visual render sequence.
 */
function updatePageNumbers() {
    const items = imageList.querySelectorAll('.image-item');
    items.forEach((item, index) => {
        const badge = item.querySelector('.page-badge');
        if (badge) {
            badge.textContent = (index + 1).toString().padStart(2, '0');
        }
    });
}

/**
 * Injects the immutable cover page node into the synthesis buffer.
 */
function renderCoverCard() {
    if (document.getElementById('coverCard')) return;

    const item = document.createElement('div');
    item.className = 'image-item';
    item.id = 'coverCard';
    item.style.cursor = 'default';
    
    const badge = document.createElement('div');
    badge.className = 'page-badge';
    badge.textContent = '01';
    item.appendChild(badge);
    
    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.style.opacity = '0.3';
    handle.style.cursor = 'not-allowed';
    handle.innerHTML = '<i class="fas fa-lock"></i>';
    item.appendChild(handle);
    
    const pdfIcon = document.createElement('div');
    pdfIcon.className = 'pdf-icon';
    pdfIcon.innerHTML = '<i class="fas fa-file-invoice"></i>';
    item.appendChild(pdfIcon);
    
    const info = document.createElement('div');
    info.className = 'file-info';
    info.textContent = 'DIU COVER PAGE (Auto-generated)';
    item.appendChild(info);
    
    const spacer = document.createElement('div');
    spacer.style.width = '2rem';
    item.appendChild(spacer);
    
    imageList.prepend(item);
    updatePageNumbers();
}

/**
 * Ephemeral byte-vector optimization layer. Mitigates memory bloating prior to blob synthesis.
 */
function compressImage(file, quality = 0.7, maxWidth = 1200, maxHeight = 1600) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            let { width, height } = img;
            const aspectRatio = width / height;
            
            if (width > maxWidth) {
                width = maxWidth;
                height = width / aspectRatio;
            }
            if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatio;
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const newFiles = Array.from(e.target.files).filter(file => 
            file.type.startsWith('image/') || file.type === 'application/pdf'
        );
        
        if (newFiles.length !== e.target.files.length) {
            alert('Some files were ignored. Only images and PDF files are supported.');
        }

        if (filesArray.length === 0 && newFiles.length > 0) {
            renderCoverCard();
        }
        
        const startIndex = filesArray.length;
        filesArray = filesArray.concat(newFiles);
        
        newFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'image-item';
            item.dataset.index = startIndex + index;
            
            const pBadge = document.createElement('div');
            pBadge.className = 'page-badge';
            item.appendChild(pBadge);

            const handle = document.createElement('div');
            handle.className = 'drag-handle';
            handle.innerHTML = '<i class="fas fa-grip-vertical"></i>';
            item.appendChild(handle);
            
            if(file.type.startsWith('image/')){
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                item.appendChild(img);
            } else {
                const pdfIcon = document.createElement('div');
                pdfIcon.className = 'pdf-icon';
                pdfIcon.innerHTML = '<i class="fas fa-file-pdf"></i>';
                item.appendChild(pdfIcon);
            }
            
            const info = document.createElement('div');
            info.className = 'file-info';
            info.textContent = file.name;
            item.appendChild(info);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                const fileIndex = parseInt(item.dataset.index);
                filesArray.splice(fileIndex, 1);
                item.remove();
                
                if (filesArray.length === 0) {
                    const cover = document.getElementById('coverCard');
                    if (cover) cover.remove();
                }

                Array.from(imageList.children).forEach((child, idx) => {
                    child.dataset.index = idx;
                });
                updatePageNumbers();
            };
            item.appendChild(removeBtn);
            
            imageList.appendChild(item);
        });
        
        updatePageNumbers();

        if (!imageList.sortable) {
            imageList.sortable = new Sortable(imageList, { 
                animation: 250,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                dragClass: 'sortable-drag',
                filter: '#coverCard',
                onMove: function(evt) {
                    return evt.related.id !== 'coverCard';
                },
                onEnd: function(evt) {
                    const newOrder = Array.from(imageList.children)
                        .filter(item => item.id !== 'coverCard')
                        .map(item => parseInt(item.dataset.index));
                    
                    const reorderedFiles = newOrder.map(index => filesArray[index]);
                    filesArray = reorderedFiles;
                    
                    Array.from(imageList.children).forEach((item, index) => {
                        item.dataset.index = index;
                    });

                    updatePageNumbers();
                }
            });
        }
        
        fileInput.value = '';
    });
}

/**
 * Main application synthesis routine: coordinates metadata injection, asset parsing, and blob generation pipeline.
 * Evaluates binary outputs statically with no server transmission logic.
 */
async function generatePDF(isCompress = false) {
    const btn = isCompress ? document.getElementById('compressBtn') : document.getElementById('generateBtn');
    const originalContent = btn.innerHTML;
    const otherBtn = isCompress ? document.getElementById('generateBtn') : document.getElementById('compressBtn');
    
    try {
        btn.disabled = true;
        btn.innerHTML = isCompress ? '<i class="fas fa-spinner fa-spin"></i> Compressing PDF...' : '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        btn.style.opacity = '0.8';
        if (otherBtn) {
            otherBtn.disabled = true;
            otherBtn.style.opacity = '0.5';
        }

        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.create();

        const docType = document.getElementById('docType').value.trim();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const coverPage = pdfDoc.addPage([595, 842]);
        
        const semester = document.getElementById('semester').value;
        const studentName = document.getElementById('studentName').value;
        const studentID = document.getElementById('studentID').value;
        const batch = document.getElementById('batch').value;
        const section = document.getElementById('section').value;
        const courseCode = document.getElementById('courseCode').value;
        const courseName = document.getElementById('courseName').value;
        const teacherName = document.getElementById('teacherName').value;
        const designation = document.getElementById('designation').value;
        const submitDate = document.getElementById('submitDate').value;
        
        const supportedTypes = ['assignment.pdf', 'lab_report.pdf', 'lab_task.pdf', 'quiz.pdf', 'presentation.pdf'];
        const isSupported = supportedTypes.includes(docType);
        
        if (!isSupported) {
            alert('Sorry, cover not available now for this document type. Please select a supported type.');
            btn.disabled = false;
            btn.innerHTML = originalContent;
            btn.style.opacity = '1';
            if (otherBtn) {
                otherBtn.disabled = false;
                otherBtn.style.opacity = '1';
            }
            return;
        }
        
        // --- DRAW COVER PAGE ---
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        try {
            const logoResponse = await fetch('Logos/Logo-DIU.png');
            const logoBytes = await logoResponse.arrayBuffer();
            const logoImage = await pdfDoc.embedPng(logoBytes);
            
            const logoWidth = 180;
            const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
            const logoX = (coverPage.getWidth() - logoWidth) / 2;
            const logoY = 750;
            
            coverPage.drawImage(logoImage, { x: logoX, y: logoY, width: logoWidth, height: logoHeight });
        } catch (error) {
            console.error('Error loading DIU logo image:', error);
            coverPage.drawText('Daffodil', { x: 242, y: 800, size: 28, font: boldFont, color: rgb(0.1, 0.4, 0.8) });
            coverPage.drawText('International', { x: 255, y: 785, size: 12, font, color: rgb(0.4, 0.4, 0.4) });
            coverPage.drawText('University', { x: 265, y: 765, size: 24, font: boldFont, color: rgb(0.2, 0.6, 0.2) });
        }
        
        const isLabReport = docType === 'lab_report.pdf';
        const docTitleMap = {
            'assignment.pdf': 'Assignment',
            'lab_report.pdf': 'Lab Report',
            'lab_task.pdf': 'Lab Task',
            'quiz.pdf': 'Quiz',
            'presentation.pdf': 'Presentation Assessment'
        };
        const docTitle = docTitleMap[docType] || 'Assignment';
        const docTitleSize = 26;
        const docTitleWidth = boldFont.widthOfTextAtSize(docTitle, docTitleSize);
        coverPage.drawText(docTitle, { x: (coverPage.getWidth() - docTitleWidth) / 2, y: 700, size: docTitleSize, font: boldFont });

            let tableY = 650;
            coverPage.drawRectangle({ x: 75, y: tableY - 15, width: 445, height: 30, borderWidth: 1, borderColor: rgb(0, 0, 0), opacity: 0 });
            const subtitle = 'Only for course Teacher';
            const subtitleWidth = font.widthOfTextAtSize(subtitle, 11);
            coverPage.drawText(subtitle, { x: 75 + (445 - subtitleWidth) / 2, y: tableY - (11 / 4), size: 11, font });

            tableY -= 30;
            
            const cols = [{ x: 75, w: 80 }, { x: 155, w: 30 }, { x: 185, w: 80 }, { x: 265, w: 80 }, { x: 345, w: 80 }, { x: 425, w: 50 }, { x: 475, w: 45 }];
            const drawCenteredInCell = (text, colIndex, y, size, font) => {
                const col = cols[colIndex];
                const tw = font.widthOfTextAtSize(text, size);
                coverPage.drawText(text, { x: col.x + (col.w - tw) / 2, y: y - (size / 4), size, font });
            };

            coverPage.drawRectangle({ x: 75, y: tableY - 15, width: 445, height: 30, borderWidth: 1, borderColor: rgb(0, 0, 0), opacity: 0 });
            cols.slice(0, -1).forEach(c => coverPage.drawLine({ start: { x: c.x + c.w, y: tableY + 15 }, end: { x: c.x + c.w, y: tableY - 15 }, thickness: 1, color: rgb(0, 0, 0) }));

            drawCenteredInCell('Criteria', 0, tableY, 8, font);
            drawCenteredInCell('Mark', 1, tableY, 8, font);
            drawCenteredInCell('Needs', 2, tableY + 5, 8, font);
            drawCenteredInCell('Improvement', 2, tableY - 5, 8, font);
            drawCenteredInCell('Developing', 3, tableY, 8, font);
            drawCenteredInCell('Sufficient', 4, tableY, 8, font);
            drawCenteredInCell('Above', 5, tableY + 5, 8, font);
            drawCenteredInCell('Average', 5, tableY - 5, 8, font);
            drawCenteredInCell('Total', 6, tableY + 5, 8, font);
            drawCenteredInCell('Mark', 6, tableY - 5, 8, font);
            
            tableY -= 30;
            coverPage.drawRectangle({ x: 75, y: tableY - 15, width: 445, height: 30, borderWidth: 1, borderColor: rgb(0, 0, 0), opacity: 0 });
            cols.slice(0, -1).forEach(c => coverPage.drawLine({ start: { x: c.x + c.w, y: tableY + 15 }, end: { x: c.x + c.w, y: tableY - 15 }, thickness: 1, color: rgb(0, 0, 0) }));

            let totalTopMark = '5';
            if (isLabReport) {
                totalTopMark = '25';
            } else if (docType === 'presentation.pdf') {
                totalTopMark = '8';
            }

            drawCenteredInCell('Allocate mark &', 0, tableY + 5, 8, font);
            drawCenteredInCell('Percentage', 0, tableY - 5, 8, font);
            drawCenteredInCell('25%', 2, tableY, 8, font);
            drawCenteredInCell('50%', 3, tableY, 8, font);
            drawCenteredInCell('75%', 4, tableY, 8, font);
            drawCenteredInCell('100%', 5, tableY, 8, font);
            drawCenteredInCell(totalTopMark, 6, tableY, 8, font);
            
            let criteriaList;
            if (isLabReport) {
                criteriaList = [{ name: 'Understanding', mark: '3' }, { name: 'Analysis', mark: '4' }, { name: 'Implementation', mark: '8' }, { name: 'Report Writing', mark: '10' }];
            } else if (docType === 'presentation.pdf') {
                criteriaList = [{ name: 'Delivery', mark: '3' }, { name: 'Content/\nOrganization', mark: '3' }, { name: 'Enthusiasm/\nAudience Awareness', mark: '2' }];
            } else {
                criteriaList = [{ name: 'Clarity', mark: '1' }, { name: 'Content Quality', mark: '2' }, { name: 'Spelling & Grammar', mark: '1' }, { name: 'Organization', mark: '1' }];
            }
            
            criteriaList.forEach(item => {
                tableY -= 30;
                coverPage.drawRectangle({ x: 75, y: tableY - 15, width: 445, height: 30, borderWidth: 1, borderColor: rgb(0, 0, 0), opacity: 0 });
                cols.slice(0, -1).forEach(c => coverPage.drawLine({ start: { x: c.x + c.w, y: tableY + 15 }, end: { x: c.x + c.w, y: tableY - 15 }, thickness: 1, color: rgb(0, 0, 0) }));
                
                if (item.name.includes('\n')) {
                    const lines = item.name.split('\n');
                    drawCenteredInCell(lines[0], 0, tableY + 4, 8, font);
                    drawCenteredInCell(lines[1], 0, tableY - 4, 8, font);
                } else {
                    drawCenteredInCell(item.name, 0, tableY, 8, font);
                }
                
                drawCenteredInCell(item.mark, 1, tableY, 8, font);
            });
            
            tableY -= 30;
            coverPage.drawRectangle({ x: 75, y: tableY - 15, width: 445, height: 30, borderWidth: 1, borderColor: rgb(0, 0, 0), opacity: 0 });
            coverPage.drawLine({ start: { x: 475, y: tableY + 15 }, end: { x: 475, y: tableY - 15 }, thickness: 1, color: rgb(0, 0, 0) });
            coverPage.drawText('Total obtained mark', { x: 85, y: tableY - 2, size: 8, font });
            
            tableY -= 60;
            coverPage.drawRectangle({ x: 75, y: tableY - 15, width: 445, height: 60, borderWidth: 1, borderColor: rgb(0, 0, 0), opacity: 0 });
            coverPage.drawText('Comments', { x: 90, y: tableY + 30, size: 8, font });
            
            let infoY = tableY - 45;
            coverPage.drawText(`Semester: ${semester || 'Unknown'}`, { x: 75, y: infoY, size: 11, font });
            infoY -= 25;
            
            const selectedModeNode = document.querySelector('input[name="presentationMode"]:checked');
            const isMulti = docType === 'presentation.pdf' && selectedModeNode && selectedModeNode.value === 'multi';

            if (isMulti) {
                let count = parseInt(document.getElementById('multiStudentCount').value) || 2;
                if (count > 8) count = 8;
                for (let i = 1; i <= count; i++) {
                    const nameInput = document.getElementById(i === 1 ? 'studentName' : `studentName_${i}`);
                    const idInput = document.getElementById(i === 1 ? 'studentID' : `studentID_${i}`);
                    const nameStr = nameInput ? nameInput.value : '';
                    const idStr = idInput ? idInput.value : '';
                    coverPage.drawText(`Student Name: ${nameStr || 'Unknown'}`, { x: 75, y: infoY, size: 11, font });
                    coverPage.drawText(`Student ID: ${idStr || '000000000'}`, { x: 300, y: infoY, size: 11, font });
                    infoY -= 18;
                }
                infoY -= 7;
            } else {
                coverPage.drawText(`Student Name: ${studentName || 'Unknown'}`, { x: 75, y: infoY, size: 11, font });
                infoY -= 25;
                coverPage.drawText(`Student ID: ${studentID || '123456789'}`, { x: 75, y: infoY, size: 11, font });
                infoY -= 25;
            }

            coverPage.drawText(`Batch: ${batch || 'Unknown'}`, { x: 75, y: infoY, size: 11, font });
            coverPage.drawText(`Section: ${section || 'Unknown'}`, { x: 300, y: infoY, size: 11, font });
            infoY -= 25;
            coverPage.drawText(`Course Code: ${courseCode || 'Unknown'}`, { x: 75, y: infoY, size: 11, font });
            coverPage.drawText(`Course Name: ${courseName || 'Unknown'}`, { x: 300, y: infoY, size: 11, font });
            infoY -= 25;
            coverPage.drawText(`Course Teacher Name: ${teacherName || 'Unknown'}`, { x: 75, y: infoY, size: 11, font });
            infoY -= 25;
            coverPage.drawText(`Designation: ${designation || 'Unknown'}`, { x: 75, y: infoY, size: 11, font });
            infoY -= 25;
            
            let formattedDate = submitDate || new Date().toLocaleDateString('en-GB');
            coverPage.drawText(`Submission Date: ${formattedDate}`, { x: 75, y: infoY, size: 11, font });
        

        for(const file of filesArray){
            if(file.type.startsWith('image/')){
                try {
                    const quality = isCompress ? 0.35 : 0.8;
                    const maxW = isCompress ? 800 : 1200;
                    const maxH = isCompress ? 1130 : 1600;
                    const compressedBlob = await compressImage(file, quality, maxW, maxH);
                    const imgBytes = await compressedBlob.arrayBuffer();
                    const img = await pdfDoc.embedJpg(imgBytes);
                    const maxWidth = 545, maxHeight = 792;
                    let { width, height } = img;
                    const aspectRatio = width / height;
                    if (width > maxWidth) { width = maxWidth; height = width / aspectRatio; }
                    if (height > maxHeight) { height = maxHeight; width = height * aspectRatio; }
                    const imgPage = pdfDoc.addPage([595, 842]);
                    imgPage.drawImage(img, { x: (595 - width) / 2, y: (842 - height) / 2, width, height });
                } catch (e) { console.error(e); }
            } else if(file.type === 'application/pdf'){
                try {
                    const pdfBytes = await file.arrayBuffer();
                    const uploadPdf = await PDFDocument.load(pdfBytes);
                    const pageIndices = uploadPdf.getPageIndices();
                    const copiedPages = await pdfDoc.copyPages(uploadPdf, pageIndices);
                    copiedPages.forEach((page) => {
                        pdfDoc.addPage(page);
                    });
                } catch (e) { console.error(e); }
            }
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const sizeDisplay = pdfBytes.length > 1024 * 1024 ? `${(pdfBytes.length / (1024 * 1024)).toFixed(2)} MB` : `${(pdfBytes.length / 1024).toFixed(0)} KB`;
        document.getElementById('fileSizeInfo').textContent = `File size: ${sizeDisplay}`;

        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth <= 768;
        document.getElementById('previewSection').style.display = 'block';
        if (isMobile) {
            document.getElementById('preview').style.display = 'none';
            document.getElementById('mobilePreview').style.display = 'block';
            document.getElementById('openPdfBtn').onclick = () => window.open(blobUrl, '_blank');
        } else {
            document.getElementById('preview').style.display = 'block';
            document.getElementById('mobilePreview').style.display = 'none';
            document.getElementById('preview').src = blobUrl;
        }
        
        document.getElementById('downloadName').value = document.getElementById('outputName').value || 'DIU.pdf';
        window.currentPdfBlob = blobUrl;
        btn.disabled = false;
        btn.innerHTML = originalContent;
        btn.style.opacity = '1';
        if (otherBtn) {
            otherBtn.disabled = false;
            otherBtn.style.opacity = '1';
        }
        document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error(error);
        alert('Error: ' + error.message);
        btn.disabled = false;
        btn.innerHTML = originalContent;
        btn.style.opacity = '1';
        if (otherBtn) {
            otherBtn.disabled = false;
            otherBtn.style.opacity = '1';
        }
    }
}

document.getElementById('generateBtn').addEventListener('click', () => generatePDF(false));

document.getElementById('downloadBtn').addEventListener('click', () => {
    if (window.currentPdfBlob) {
        const a = document.createElement('a');
        a.href = window.currentPdfBlob;
        a.download = document.getElementById('downloadName').value || 'DIU.pdf';
        a.click();
    }
});

document.getElementById('blcBtn').addEventListener('click', () => window.open('https://elearn.daffodilvarsity.edu.bd/', '_blank'));

// Compress PDF functionality
document.getElementById('compressBtn').addEventListener('click', () => generatePDF(true));
