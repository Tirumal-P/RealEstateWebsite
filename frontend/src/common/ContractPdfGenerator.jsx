import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates a PDF document for a contract and triggers download
 * @param {Object} contract - Contract object with all details
 * @param {Object} property - Property associated with the contract
 * @param {Object} customer - Customer associated with the contract
 * @param {Object} owner - Owner associated with the contract
 */
export const generateContractPdf = (contract, property, customer, owner) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Sale Contract - ${property?.name || 'Property'}`,
    subject: 'Real Estate Contract',
    author: 'Real Estate Application',
    creator: 'Real Estate Application'
  });

  // Add header with logo or company name
  doc.setFontSize(22);
  doc.setTextColor(44, 62, 80); // Dark blue color
  doc.text('REAL ESTATE CONTRACT', 105, 20, { align: 'center' });
  
  // Contract type and reference
  doc.setFontSize(14);
  doc.text(`${contract.type === 'rental' ? 'RENTAL AGREEMENT' : 'PROPERTY SALE CONTRACT'}`, 105, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Contract ID: ${contract._id}`, 105, 38, { align: 'center' });
  doc.text(`Date: ${new Date(contract.contractDate).toLocaleDateString()}`, 105, 43, { align: 'center' });
  
  // Add divider
  doc.setDrawColor(41, 128, 185); // Blue color
  doc.setLineWidth(0.5);
  doc.line(20, 48, 190, 48);
  
  // Property information section
  doc.setFontSize(12);
  doc.setTextColor(41, 128, 185);
  doc.text('PROPERTY INFORMATION', 20, 60);
  doc.setTextColor(44, 62, 80);
  doc.setFontSize(10);
  
  // Property details
  const propertyInfo = [
    ['Property Name:', property?.name || 'Not specified'],
    ['Address:', property?.location || 'Not specified'],
    ['Type:', property?.type?.charAt(0).toUpperCase() + property?.type?.slice(1) || 'Not specified'],
    ['Bedrooms:', property?.bhk || 'Not specified'],
  ];
  
  doc.autoTable({
    startY: 65,
    head: [],
    body: propertyInfo,
    theme: 'plain',
    styles: { cellPadding: 1 },
    columnStyles: { 0: { cellWidth: 40, fontStyle: 'bold' } }
  });
  
  // Contract details section
  const lastY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(41, 128, 185);
  doc.text('CONTRACT DETAILS', 20, lastY);
  doc.setTextColor(44, 62, 80);
  doc.setFontSize(10);
  
  // Contract details
  const contractInfo = [
    ['Contract Type:', contract.type === 'rental' ? 'Rental Agreement' : 'Sale Contract'],
    ['Start Date:', new Date(contract.startDate).toLocaleDateString()],
    ['End Date:', new Date(contract.endDate).toLocaleDateString()],
    ['Closing Date:', new Date(contract.closingDate).toLocaleDateString()],
    [contract.type === 'rental' ? 'Monthly Rent:' : 'Sale Price:', `$${contract.salePrice?.toLocaleString() || '0'}`],
    ['Deposit Amount:', `$${contract.depositAmount?.toLocaleString() || '0'}`],
    ['Status:', contract.status?.replace('_', ' ').charAt(0).toUpperCase() + contract.status?.replace('_', ' ').slice(1) || 'Pending']
  ];
  
  doc.autoTable({
    startY: lastY + 5,
    head: [],
    body: contractInfo,
    theme: 'plain',
    styles: { cellPadding: 1 },
    columnStyles: { 0: { cellWidth: 40, fontStyle: 'bold' } }
  });
  
  // Payment terms section
  const termsY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(41, 128, 185);
  doc.text('PAYMENT TERMS', 20, termsY);
  doc.setTextColor(44, 62, 80);
  doc.setFontSize(10);
  doc.text(contract.paymentTerms || 'Not specified', 20, termsY + 10);
  
  // Add loan details if it's a sale contract
  let currentY = termsY + 20;
  if (contract.type === 'sale' && contract.loanDetails && Object.keys(contract.loanDetails).length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('LOAN DETAILS', 20, currentY);
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(10);
    
    const loanInfo = [
      ['Loan Amount:', `$${contract.loanDetails.amount?.toLocaleString() || '0'}`],
      ['Loan Provider:', contract.loanDetails.provider || 'Not specified'],
      ['Loan Type:', contract.loanDetails.type?.charAt(0).toUpperCase() + contract.loanDetails.type?.slice(1) || 'Not specified'],
      ['Interest Rate:', `${contract.loanDetails.interestRate || '0'}%`],
      ['Approval Date:', contract.loanDetails.approvalDate ? new Date(contract.loanDetails.approvalDate).toLocaleDateString() : 'Not specified'],
      ['Loan Status:', contract.loanDetails.status?.charAt(0).toUpperCase() + contract.loanDetails.status?.slice(1) || 'Not specified']
    ];
    
    doc.autoTable({
      startY: currentY + 5,
      head: [],
      body: loanInfo,
      theme: 'plain',
      styles: { cellPadding: 1 },
      columnStyles: { 0: { cellWidth: 40, fontStyle: 'bold' } }
    });
    
    currentY = doc.lastAutoTable.finalY + 10;
  }
  
  // Parties section
  doc.setFontSize(12);
  doc.setTextColor(41, 128, 185);
  doc.text('PARTIES TO THE CONTRACT', 20, currentY);
  doc.setTextColor(44, 62, 80);
  doc.setFontSize(10);
  
  const partiesInfo = [
    ['Owner:', owner?.name || 'Not specified'],
    ['Owner Email:', owner?.email || 'Not specified'],
    ['Owner Phone:', owner?.phone || 'Not specified'],
    ['Customer:', customer?.name || 'Not specified'],
    ['Customer Email:', customer?.email || 'Not specified'],
    ['Customer Phone:', customer?.phone || 'Not specified']
  ];
  
  doc.autoTable({
    startY: currentY + 5,
    head: [],
    body: partiesInfo,
    theme: 'plain',
    styles: { cellPadding: 1 },
    columnStyles: { 0: { cellWidth: 40, fontStyle: 'bold' } }
  });
  
  // Signatures section
  currentY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(41, 128, 185);
  doc.text('SIGNATURES', 20, currentY);
  doc.setTextColor(44, 62, 80);
  doc.setFontSize(10);
  
  // Add signature images if they exist
  currentY += 10;
  
  // Helper function to safely process signatures
  const addSignatureToDocument = (signatureDataUrl, x, y, text) => {
    if (signatureDataUrl && signatureDataUrl !== 'null') {
      try {
        console.log(signatureDataUrl);
        // Handle different data URL formats
        let imgData = signatureDataUrl;
        
        // Check if it's a valid data URL
        if (imgData.startsWith('data:image')) {
          // Extract the base64 part if it's a full data URL
          const commaIndex = imgData.indexOf(',');
          if (commaIndex !== -1) {
            imgData = imgData.substring(commaIndex + 1);
          }
          
          // Add the image to the PDF
          doc.addImage(signatureDataUrl, 'PNG', x, y, 60, 30, undefined, 'FAST');
        } else {
          // If not a valid image data URL, add text instead
          doc.text(`(${text} signature on file)`, x, y + 15);
        }
      } catch (e) {
        console.error('Error adding signature to PDF:', e);
        doc.text(`(${text} signature on file)`, x, y + 15);
      }
    } else {
      doc.text(`(Not signed)`, x, y + 15);
    }
  };
  
  // Owner signature
  doc.text('Owner Signature:', 20, currentY);
  addSignatureToDocument(contract.signatures?.owner, 20, currentY + 5, 'Owner');
  
  // Customer signature
  doc.text('Customer Signature:', 120, currentY);
  addSignatureToDocument(contract.signatures?.customer, 120, currentY + 5, 'Customer');
  
  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }
  
  // Add timestamp and legal notice at the bottom
  doc.setFontSize(8);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 290);
  doc.text('This document is legally binding once signed by all parties.', 105, 290, { align: 'center' });
  
  // Save the PDF
  doc.save(`${contract.type === 'rental' ? 'Rental' : 'Sale'}_Contract_${property?.name || 'Property'}.pdf`);
};

export default generateContractPdf;