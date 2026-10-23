/**
 * PaperClip - Scorer Bridge Module
 * 
 * Non-invasively monitors the PDF generation pipeline on index.html.
 * When a PDF is generated and ready for preview, dynamically injects
 * a "Score with Local AI" action button that forwards the document to score.html.
 */

(function initScorerBridge() {
    function injectScorerButton() {
        const downloadControls = document.querySelector('.download-controls');
        if (!downloadControls || document.getElementById('scorePdfBtn')) return;

        const scoreBtn = document.createElement('button');
        scoreBtn.id = 'scorePdfBtn';
        scoreBtn.type = 'button';
        scoreBtn.innerHTML = '<i class="fas fa-award"></i> Score with Local AI';
        scoreBtn.setAttribute('title', 'Evaluate and score this PDF using local open-source AI');
        scoreBtn.style.cssText = `
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.25s ease;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        `;

        scoreBtn.addEventListener('mouseenter', () => {
            scoreBtn.style.transform = 'translateY(-2px)';
            scoreBtn.style.boxShadow = '0 6px 18px rgba(99, 102, 241, 0.45)';
        });

        scoreBtn.addEventListener('mouseleave', () => {
            scoreBtn.style.transform = 'translateY(0)';
            scoreBtn.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.35)';
        });

        scoreBtn.addEventListener('click', () => {
            if (window.currentPdfBlob) {
                const downloadName = (document.getElementById('downloadName') && document.getElementById('downloadName').value) || 'Assignment.pdf';
                const docTypeSelect = document.getElementById('docType');
                const docType = (docTypeSelect && docTypeSelect.value) ? docTypeSelect.value.replace('.pdf', '') : 'assignment';
                sessionStorage.setItem('paperclip_scoring_pdf', window.currentPdfBlob);
                sessionStorage.setItem('paperclip_scoring_name', downloadName);
                sessionStorage.setItem('paperclip_scoring_type', docType);
                window.location.href = 'analyze.html';
            } else {
                window.location.href = 'analyze.html';
            }
        });

        // Insert adjacent to download button
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn && downloadBtn.parentNode === downloadControls) {
            downloadControls.insertBefore(scoreBtn, downloadBtn.nextSibling);
        } else {
            downloadControls.appendChild(scoreBtn);
        }
    }

    // Observe preview section visibility
    const previewSection = document.getElementById('previewSection');
    if (previewSection) {
        const observer = new MutationObserver(() => {
            if (previewSection.style.display !== 'none') {
                injectScorerButton();
            }
        });
        observer.observe(previewSection, { attributes: true, attributeFilter: ['style'] });
    }

    // Also check on DOM ready and window load
    document.addEventListener('DOMContentLoaded', () => {
        const genBtn = document.getElementById('generateBtn');
        if (genBtn) {
            genBtn.addEventListener('click', () => {
                setTimeout(injectScorerButton, 800);
                setTimeout(injectScorerButton, 2000);
            });
        }
    });
})();
