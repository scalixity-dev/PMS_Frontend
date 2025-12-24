
export const getTemplateHTML = (templateName: string) => {
    const uppercaseTitle = templateName.toUpperCase();
    return `
        <div class="mock-document-content">
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 8px;">${uppercaseTitle}</h1>
                <p style="font-size: 14px; color: #6B7280;">Template Document</p>
            </div>

            <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 12px;">1. Property Information</h3>
                <p style="line-height: 1.6; color: #374151;">
                    This agreement is made on <span style="background-color: #FEF9C3; padding: 0 4px;">[Date]</span> between 
                    <span style="background-color: #FEF9C3; padding: 0 4px;">[Landlord Name]</span> (hereinafter referred to as "Landlord") and 
                    <span style="background-color: #FEF9C3; padding: 0 4px;">[Tenant Name]</span> (hereinafter referred to as "Tenant") for the property located at 
                    <span style="background-color: #FEF9C3; padding: 0 4px;">[Property Address]</span>.
                </p>
            </div>

            <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 12px;">2. Lease Terms</h3>
                <p style="line-height: 1.6; color: #374151;">
                    The lease term shall commence on <span style="background-color: #FEF9C3; padding: 0 4px;">[Start Date]</span> and shall continue until 
                    <span style="background-color: #FEF9C3; padding: 0 4px;">[End Date]</span>, unless terminated earlier in accordance with the provisions of this agreement.
                </p>
                <ul style="list-style-type: disc; margin-top: 12px; margin-left: 24px;">
                    <li style="margin-bottom: 8px; color: #374151;">Monthly rent amount: <span style="background-color: #FEF9C3; padding: 0 4px;">[Rent Amount]</span></li>
                    <li style="margin-bottom: 8px; color: #374151;">Security deposit: <span style="background-color: #FEF9C3; padding: 0 4px;">[Deposit Amount]</span></li>
                    <li style="margin-bottom: 8px; color: #374151;">Payment due date: <span style="background-color: #FEF9C3; padding: 0 4px;">[Due Date]</span> of each month</li>
                </ul>
            </div>

            <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 12px;">3. Tenant Responsibilities</h3>
                <p style="line-height: 1.6; color: #374151;">
                    The Tenant agrees to maintain the property in good condition and shall be responsible for any damages beyond normal wear and tear.
                    The Tenant shall:
                </p>
                <ul style="list-style-type: disc; margin-top: 12px; margin-left: 24px;">
                    <li style="margin-bottom: 8px; color: #374151;">Pay rent on time each month</li>
                    <li style="margin-bottom: 8px; color: #374151;">Maintain cleanliness and proper upkeep of the premises</li>
                    <li style="margin-bottom: 8px; color: #374151;">Report any maintenance issues promptly to the Landlord</li>
                    <li style="margin-bottom: 8px; color: #374151;">Comply with all applicable laws and regulations</li>
                    <li style="margin-bottom: 8px; color: #374151;">Not make any structural modifications without written consent</li>
                </ul>
            </div>

            <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 12px;">4. Landlord Responsibilities</h3>
                <p style="line-height: 1.6; color: #374151;">
                    The Landlord agrees to maintain the property in habitable condition and ensure all essential services are functional.
                    The Landlord shall provide reasonable notice before entering the property for inspections or repairs.
                </p>
            </div>

            <div style="margin-bottom: 24px;">
                <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 12px;">5. Termination</h3>
                <p style="line-height: 1.6; color: #374151;">
                    Either party may terminate this agreement by providing 
                    <span style="background-color: #FEF9C3; padding: 0 4px;">[Notice Period]</span> days written notice to the other party.
                    The security deposit shall be returned within the time period specified by applicable law, minus any deductions for damages or unpaid rent.
                </p>
            </div>

            <div style="margin-top: 48px; padding-top: 32px; border-top: 2px solid #D1D5DB;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 50%; padding-right: 20px; vertical-align: top;">
                            <p style="font-weight: 600; color: #111827; margin-bottom: 16px;">Landlord Signature:</p>
                            <div style="border-bottom: 2px solid #9CA3AF; margin-bottom: 8px; height: 24px;"></div>
                            <p style="font-size: 14px; color: #4B5563;">Name: <span style="background-color: #FEF9C3; padding: 0 4px;">[Landlord Name]</span></p>
                            <p style="font-size: 14px; color: #4B5563;">Date: <span style="background-color: #FEF9C3; padding: 0 4px;">[Date]</span></p>
                        </td>
                        <td style="width: 50%; padding-left: 20px; vertical-align: top;">
                            <p style="font-weight: 600; color: #111827; margin-bottom: 16px;">Tenant Signature:</p>
                            <div style="border-bottom: 2px solid #9CA3AF; margin-bottom: 8px; height: 24px;"></div>
                            <p style="font-size: 14px; color: #4B5563;">Name: <span style="background-color: #FEF9C3; padding: 0 4px;">[Tenant Name]</span></p>
                            <p style="font-size: 14px; color: #4B5563;">Date: <span style="background-color: #FEF9C3; padding: 0 4px;">[Date]</span></p>
                        </td>
                    </tr>
                </table>
            </div>

            <div style="margin-top: 32px; padding: 16px; background-color: #F9FAF9; border-radius: 8px; border: 1px solid #E5E7E5;">
                <p style="font-size: 12px; color: #6B7280; text-align: center; margin: 0;">
                    This is a template document. Yellow highlighted fields indicate areas that need to be filled in with specific information.
                </p>
            </div>
        </div>
    `;
};
