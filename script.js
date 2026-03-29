document.addEventListener('DOMContentLoaded', () => {
    const companySelect = document.getElementById('companySelect');
    const contentArea = document.getElementById('dynamicContent');

    companySelect.addEventListener('change', () => {
        const company = companySelect.value;
        contentArea.innerHTML = '';

        if (company === 'tcs') {
            contentArea.innerHTML = `
                <div class="form-container">
                    <div class="form-group">
                        <label>Total / Gross Annual Salary <span style="color:red">*</span></label>
                        <input type="number" id="totalSalary" placeholder="Enter Annual Amount">
                        <div id="salaryError" style="color:red; font-size:0.8rem; margin-top:5px;" class="hidden">Please enter a valid salary.</div>
                    </div>

                    <div class="checkbox-group">
                        <input type="checkbox" id="hasRetention">
                        <label for="hasRetention" style="cursor:pointer; margin:0;">Does Total Salary includes Retention Incentive?</label>
                    </div>

                    <div id="retentionDiv" class="form-group hidden">
                        <label>Annual Retention Amount</label>
                        <input type="number" id="retentionAmount" value="0">
                    </div>

                    <div class="form-group">
                        <label>Annual Gratuity Amount</label>
                        <input type="number" id="gratuity" value="0">
                    </div>

                    <div class="form-group">
                        <label>Annual PF Amount</label>
                        <input type="number" id="pfAmount" value="0">
                    </div>

                    <div class="form-group">
                        <label>Annual Performance Bonus</label>
                        <input type="number" id="performanceBonus" value="0">
                    </div>

                    <button id="calcBtn">Calculate Take-Home</button>
                    <div id="resultArea"></div>
                </div>
            `;

            // Attach event listeners to new elements
            document.getElementById('hasRetention').addEventListener('change', function () {
                document.getElementById('retentionDiv').classList.toggle('hidden', !this.checked);
            });

            document.getElementById('calcBtn').addEventListener('click', calculateTCS);

        } else if (company === 'infosys' || company === 'accenture') {
            const name = company.charAt(0).toUpperCase() + company.slice(1);
            contentArea.innerHTML = `<div class="coming-soon"><strong>${name}</strong> calculator is coming soon!</div>`;
        }
    });

    function calculateTCS() {
        const salaryInput = document.getElementById('totalSalary');
        const salaryError = document.getElementById('salaryError');

        if (!salaryInput.value || parseFloat(salaryInput.value) <= 0) {
            salaryError.classList.remove('hidden');
            salaryInput.style.borderColor = 'red';
            return;
        }

        salaryError.classList.add('hidden');
        salaryInput.style.borderColor = '#ced4da';

        const total = parseFloat(salaryInput.value);
        const gratuity = parseFloat(document.getElementById('gratuity').value) || 0;
        const pf = parseFloat(document.getElementById('pfAmount').value) || 0;
        const perfBonus = parseFloat(document.getElementById('performanceBonus').value) || 0;

        const retentionCheck = document.getElementById('hasRetention');
        const retention = (retentionCheck && retentionCheck.checked) ? parseFloat(document.getElementById('retentionAmount').value) || 0 : 0;

        // Math Logic
        const annualLiquid = total - retention - gratuity - (pf * 2) - perfBonus;
        const monthlyInHand = annualLiquid / 12;
        const quarterlyPayout = monthlyInHand + (perfBonus / 4);

        document.getElementById('resultArea').innerHTML = `
            <div class="results">
                <div class="res-line">
                    <span>Monthly In-Hand:</span>
                    <span class="highlight">₹${Math.round(monthlyInHand).toLocaleString('en-IN')}</span>
                </div>
                <div class="warning-box">
                    <strong>Notice:</strong> Estimate only. Excludes PT, Insurance, and TDS.
                </div>
                <div class="res-line" style="margin-top:15px; border-top: 1px solid #bdd1f3; padding-top: 10px;">
                    <span>Quarterly Bonus Month:</span>
                    <span class="highlight">₹${Math.round(quarterlyPayout).toLocaleString('en-IN')}</span>
                </div>
            </div>
        `;
    }
});
