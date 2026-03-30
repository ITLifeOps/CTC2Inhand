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
                        <label>Total / Gross Annual Salary <span class="info-icon" data-tooltip="Total Salary, not the CTC. Please check in the Offer Letter or Compensation Letter.">ⓘ</span> <span style="color:red">*</span></label>
                        <input type="number" id="totalSalary" placeholder="Enter Annual Amount">
                        <div id="salaryError" style="color:red; font-size:0.8rem; margin-top:5px;" class="hidden">Please enter a valid salary.</div>
                    </div>

                    <div class="checkbox-group">
                        <input type="checkbox" id="hasRetention">
                        <label for="hasRetention" style="cursor:pointer; margin:0;">Does Total Salary includes Retention Incentive? </label>
                    </div>

                    <div id="retentionDiv" class="form-group hidden">
                        <label>Retention Amount <span class="info-icon" data-tooltip="Retention Incentive, not Elective Incentive. Please check in the Offer Letter or Compensation Letter.">ⓘ</span> </label>
                        <input type="number" id="retentionAmount" value="0">
                    </div>

                    <div class="form-group">
                        <label>Gratuity Amount <span class="info-icon" data-tooltip="Gratuity Amount. Please check in the Offer Letter or Compensation Letter.">ⓘ</span> </label>
                        <input type="number" id="gratuity" value="0">
                    </div>

                    <div class="form-group">
                        <label>PF Amount <span class="info-icon" data-tooltip="Provident Fund Amount. Please check in the Offer Letter or Compensation Letter.">ⓘ</span> </label>
                        <input type="number" id="pfAmount" value="0">
                    </div>

                    <div class="form-group">
                        <label>Performance Bonus <span class="info-icon" data-tooltip="Only Performance Bonus Amount, not the Montly Performance Bonus. Please check in the Offer Letter or Compensation Letter.">ⓘ</span> </label>
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

        } else if (company === 'infosys') {
            contentArea.innerHTML = `
                <div class="form-container">
                    <div class="form-group">
                        <label for="monthlySalary">Monthly Fixed Salary</label>
                        <input type="number" id="monthlySalary" placeholder="Enter amount" value="0">
                        <div id="msalaryError" style="color:red; font-size:0.8rem; margin-top:5px;" class="hidden">Please enter a valid salary.</div>
                    </div>
                
                    <div class="form-group">
                        <label for="perfBonus">Performance Bonus</label>
                        <input type="number" id="perfBonus" placeholder="Enter amount" value="0">
                    </div>
                
                    <div class="form-group">
                        <label for="pfAmount">Monthly PF</label>
                        <input type="number" id="pfAmount" placeholder="Enter PF amount" value="0">
                    </div>
                
                    <button id="calcBtn">Calculate Take-Home</button>
                    <div id="resultArea"></div>
                </div>
            `;

            document.getElementById('calcBtn').addEventListener('click', calculateInfosys);
        } else if (company === 'accenture') {
            const name = company.charAt(0).toUpperCase() + company.slice(1);
            contentArea.innerHTML = `<div class="coming-soon"><strong>${name}</strong> calculator is coming soon!</div>`;
        }
    });

    function calculateTCS() {
        const salaryInput = document.getElementById('totalSalary');
        const salaryError = document.getElementById('msalaryError');

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
        const annualLiquid = total - retention - gratuity - pf - perfBonus;
        const monthlyGross = annualLiquid / 12;
        const monthlyInHand = monthlyGross - (pf / 12);
        const quarterlyGross = monthlyGross + (perfBonus / 4);
        const quarterlyInhand = quarterlyGross - (pf / 12);

        document.getElementById('resultArea').innerHTML = `
            <div class="results fade-in">
                <table class="salary-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Gross (Monthly, Accurate)</th>
                            <th>In-Hand (Net, Estimate)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bonus-row">
                            <td>Quarterly <span class="info-icon" data-tooltip="Every quaters First months Salary Estimated">ⓘ</span> </td>
                            <td>₹${Math.round(quarterlyGross).toLocaleString('en-IN')}</td>
                            <td class="highlight">₹${Math.round(quarterlyInhand).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td>Standard <span class="info-icon" data-tooltip="Every quaters second and third months Salary Estimated">ⓘ</span> </td>
                            <td>₹${Math.round(monthlyGross).toLocaleString('en-IN')}</td>
                            <td class="highlight">₹${Math.round(monthlyInHand).toLocaleString('en-IN')}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="warning-box">
                    <strong>Note:</strong> These result are Estimation. Few deduction are not in calculation such as:
                    <ul>
                      <li>Professional Tax will get deduct in every month</li>
                      <li>Labour WellFare</li>
                      <li>Health Insurance Premium will get deduct as per option selected in 2 months, 4 months or 8 months </li>
                      <li>Income Tax deduction depends on specific Tax Slab and selected Tax Regime </li>
                      <li>The specified retention incentive is paid as a single annual installment.</li>
                    </ul> 
                </div>
            </div>
        `;
    }

    function calculateInfosys() {
        const salaryInput = document.getElementById('monthlySalary');
        const salaryError = document.getElementById('salaryError');

        if (!salaryInput.value || parseFloat(salaryInput.value) <= 0) {
            salaryInput.classList.remove('hidden');
            salaryInput.style.borderColor = 'red';
            return;
        }

        salaryError.classList.add('hidden');
        salaryInput.style.borderColor = '#ced4da';

        const monthly = parseFloat(salaryInput.value) || 0;
        const pf = parseFloat(document.getElementById('pfAmount').value) || 0;
        const pb = parseFloat(document.getElementById('perfBonus').value) || 0;

        // Logic: Gross = Monthly Salary | In-hand = Monthly - PF
        const monthlyGross = monthly;
        const monthlyInHand = monthlyGross - pf;

        const quarterlyGross = monthlyGross + pb * 3;
        const quarterlyGross80 = monthlyGross + pb * 3 * 0.8;
        const quarterlyInhand = quarterlyGross - pf;
        const quarterlyInhand80 = quarterlyGross80 - pf;

        // Update the display with Indian Rupee formatting
        document.getElementById('resultArea').innerHTML = `
            <div class="results fade-in">
                <table class="salary-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Gross (Monthly)</th>
                            <th>In-Hand (Net)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bonus-row">
                            <td>Quarterly <span class="info-icon" data-tooltip="Every quaters one months Salary Estimate">ⓘ</span> </td>
                            <td>₹ ${Math.round(quarterlyGross80).toLocaleString('en-IN')} - ${Math.round(quarterlyGross).toLocaleString('en-IN')} estimate</td>
                            <td class="highlight">₹ ${Math.round(quarterlyInhand80).toLocaleString('en-IN')} - ${Math.round(quarterlyInhand).toLocaleString('en-IN')} estimate</td>
                        </tr>
                        <tr>
                            <td>Standard <span class="info-icon" data-tooltip="Every quaters remaining months Salary">ⓘ</span> </td>
                            <td>₹${Math.round(monthlyGross).toLocaleString('en-IN')} Accurate</td>
                            <td class="highlight">₹${Math.round(monthlyInHand).toLocaleString('en-IN')} Accurate</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="warning-box">
                    <strong>Note:</strong> These result are Estimation. Few deduction are not in calculation such as:
                    <ul>
                      <li>Professional Tax will get deduct in every month</li>
                      <li>Labour WellFare</li>
                      <li>Company Wellfare Trust</li>
                      <li>Health Insurance Premium will get deduct as per option selected in 2 months, 4 months or 8 months </li>
                      <li>Income Tax deduction depends on specific Tax Slab and selected Tax Regime </li>
                    </ul> 
                </div>
            </div>
        `;
    }
});
