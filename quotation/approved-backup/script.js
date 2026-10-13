/* ═══════════════════════════════════════════════════════════
   Shivam Tours & Travels — Quotation Generator
   script.js
═══════════════════════════════════════════════════════════ */

/* ── STATE ──────────────────────────────────────────────── */
let rowCount  = 0;
let rowData   = [];

// Fixed logo — embedded at build time
const LOGO_DATA_URL = "data:image/png;base64,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";

/* ── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const today  = new Date();
  const expiry = new Date(today);
  expiry.setDate(expiry.getDate() + 7);

  document.getElementById('quoteDate').value   = fmtDateInput(today);
  document.getElementById('quoteExpiry').value = fmtDateInput(expiry);

  // Start with one empty row
  addRow();
  recalcTotals();
});

/* ── DATE HELPERS ───────────────────────────────────────── */
function fmtDateInput(d) {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function fmtDateDisplay(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

/* ── ROW MANAGEMENT ─────────────────────────────────────── */
function addRow(desc = '', qty = 1, unit = '', rate = 0) {
  rowCount++;
  const id     = rowCount;
  const amount = parseFloat(qty) * parseFloat(rate);
  rowData.push({ id, desc, qty, unit, rate, amount });

  const tbody = document.getElementById('itemsBody');
  const tr    = document.createElement('tr');
  tr.id       = `row-${id}`;

  tr.innerHTML = `
    <td class="sno-cell">${rowData.length}</td>
    <td>
      <input type="text" class="desc-input"
             placeholder="Service / item description"
             value="${escAttr(desc)}"
             oninput="updateField(${id},'desc',this.value)"/>
    </td>
    <td class="qty-cell">
      <input type="number" class="qty-input"
             placeholder="1" value="${qty}" min="0" step="0.01"
             oninput="updateCalc(${id},'qty',this.value)"/>
    </td>
    <td>
      <input type="text" class="unit-input"
             placeholder="Day/KM/Trip"
             value="${escAttr(unit)}"
             oninput="updateField(${id},'unit',this.value)"/>
    </td>
    <td class="rate-cell">
      <input type="number" class="rate-input"
             placeholder="0.00" value="${rate === 0 ? '' : rate}"
             min="0" step="0.01"
             oninput="updateCalc(${id},'rate',this.value)"/>
    </td>
    <td class="amount-cell" id="amt-${id}">${fmtINR(amount)}</td>
    <td>
      <button class="btn-remove-row" onclick="removeRow(${id})" title="Remove">✕</button>
    </td>
  `;

  tbody.appendChild(tr);
  recalcTotals();

  if (!desc) {
    setTimeout(() => tr.querySelector('.desc-input')?.focus(), 50);
  }
}

function updateField(id, field, value) {
  const row = rowData.find(r => r.id === id);
  if (row) row[field] = value;
}

function updateCalc(id, field, value) {
  const row = rowData.find(r => r.id === id);
  if (!row) return;
  row[field]  = parseFloat(value) || 0;
  row.amount  = (parseFloat(row.qty) || 0) * (parseFloat(row.rate) || 0);
  const cell  = document.getElementById(`amt-${id}`);
  if (cell) cell.textContent = fmtINR(row.amount);
  recalcTotals();
}

function removeRow(id) {
  if (rowData.length <= 1) { alert('At least one item is required.'); return; }
  rowData = rowData.filter(r => r.id !== id);
  document.getElementById(`row-${id}`)?.remove();
  document.querySelectorAll('#itemsBody tr .sno-cell').forEach((cell, i) => {
    cell.textContent = i + 1;
  });
  recalcTotals();
}

/* ── CALCULATIONS ───────────────────────────────────────── */
function recalcTotals() {
  const subtotal   = rowData.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const discount   = parseFloat(document.getElementById('discountAmt')?.value) || 0;
  const taxable    = Math.max(subtotal - discount, 0);
  const taxRate    = parseFloat(document.getElementById('taxRate')?.value) || 0;
  const taxType    = document.getElementById('taxType')?.value || 'none';
  const taxAmt     = taxable * (taxRate / 100);
  const grandTotal = taxable + taxAmt;

  document.getElementById('subtotalDisplay').textContent = '₹ ' + fmtNum(subtotal);

  const discLine = document.getElementById('discountLine');
  if (discount > 0) {
    discLine.style.display = 'flex';
    document.getElementById('discountDisplay').textContent = `− ₹ ${fmtNum(discount)}`;
  } else {
    discLine.style.display = 'none';
  }

  const taxLine = document.getElementById('taxLine');
  let taxLabel = '';
  if (taxType === 'none' || taxRate === 0) {
    taxLine.style.display = 'none';
  } else {
    taxLine.style.display = 'flex';
    if (taxType === 'gst')    taxLabel = `GST — CGST ${taxRate/2}% + SGST ${taxRate/2}%`;
    else if (taxType === 'igst') taxLabel = `IGST (${taxRate}%)`;
    else taxLabel = document.getElementById('taxLabel')?.value || `Tax (${taxRate}%)`;
    document.getElementById('taxLabelDisplay').textContent = taxLabel;
    document.getElementById('taxDisplay').textContent = '₹ ' + fmtNum(taxAmt);
  }

  const customLabelField = document.getElementById('taxLabelField');
  if (customLabelField) {
    customLabelField.style.display = taxType === 'custom' ? 'flex' : 'none';
  }

  document.getElementById('grandTotalDisplay').textContent = '₹ ' + fmtNum(grandTotal);
  document.getElementById('amountWords').textContent =
    numToWords(Math.round(grandTotal)) + ' Rupees Only';
}

/* ── NUMBER FORMATTING ──────────────────────────────────── */
function fmtNum(n) {
  return parseFloat(n || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
}

function fmtINR(n) {
  if (!n || n === 0) return '—';
  return '₹ ' + fmtNum(n);
}

/* ── NUMBER → WORDS (Indian System) ────────────────────── */
const ONES = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
  'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen',
  'Eighteen','Nineteen'];
const TENS = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

function numToWords(n) {
  if (n === 0) return 'Zero';
  if (n < 0)   return 'Minus ' + numToWords(-n);
  let w = '';
  if (n >= 10000000) { w += numToWords(Math.floor(n/10000000)) + ' Crore '; n %= 10000000; }
  if (n >= 100000)   { w += numToWords(Math.floor(n/100000)) + ' Lakh '; n %= 100000; }
  if (n >= 1000)     { w += numToWords(Math.floor(n/1000)) + ' Thousand '; n %= 1000; }
  if (n >= 100)      { w += ONES[Math.floor(n/100)] + ' Hundred '; n %= 100; }
  if (n >= 20) {
    w += TENS[Math.floor(n/10)];
    if (n % 10) w += ' ' + ONES[n % 10];
  } else if (n > 0) {
    w += ONES[n];
  }
  return w.trim();
}

/* ── UTILITY ────────────────────────────────────────────── */
function escAttr(s) {
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

/* ════════════════════════════════════════════════════════════
   PDF GENERATION
════════════════════════════════════════════════════════════ */
function generatePDF() {
  const { jsPDF } = window.jspdf;

  const data = {
    company: {
      name:    val('companyName')    || 'Shivam Tours & Travels',
      phone:   val('companyPhone'),
      website: val('companyWebsite'),
      address: val('companyAddress'),
    },
    quote: {
      number:  val('quoteNumber'),
      date:    fmtDateDisplay(val('quoteDate')),
      expiry:  fmtDateDisplay(val('quoteExpiry')),
      supply:  val('placeOfSupply'),
      subject: val('quoteSubject'),
    },
    trip: {
      vehicle:  val('vehicleType'),
      vehicleNo:val('vehicleNumber'),
      pickup:   val('pickupLocation'),
      drop:     val('dropLocation'),
      travelDate: fmtDateDisplay(val('travelDate')),
      returnDate: fmtDateDisplay(val('returnDate')),
      pax:      val('paxCount'),
      duration: val('tripDuration'),
    },
    client: {
      billTo:  val('billTo'),
      shipTo:  val('shipTo'),
      phone:   val('clientPhone'),
      email:   val('clientEmail'),
    },
    bank: {
      bank:    val('bankName'),
      branch:  val('bankBranch'),
      name:    val('accountName'),
      account: val('accountNo'),
      ifsc:    val('ifscCode'),
      upi:     val('upiId'),
    },
    terms: val('termsConditions'),
  };

  const subtotal  = rowData.reduce((s, r) => s + (parseFloat(r.amount)||0), 0);
  const discount  = parseFloat(document.getElementById('discountAmt')?.value)||0;
  const taxable   = Math.max(subtotal - discount, 0);
  const taxRate   = parseFloat(document.getElementById('taxRate')?.value)||0;
  const taxType   = document.getElementById('taxType')?.value||'none';
  const taxAmt    = taxable * (taxRate/100);
  const grandTotal= taxable + taxAmt;

  let taxLabelStr = '';
  if (taxType !== 'none' && taxRate > 0) {
    if (taxType === 'gst')       taxLabelStr = `GST (CGST ${taxRate/2}% + SGST ${taxRate/2}%)`;
    else if (taxType === 'igst') taxLabelStr = `IGST (${taxRate}%)`;
    else taxLabelStr = val('taxLabel') || `Tax (${taxRate}%)`;
  }

  const wordsTotal = numToWords(Math.round(grandTotal));

  const doc  = new jsPDF({ unit:'mm', format:'a4', orientation:'portrait' });
  const PW   = 210, PH = 297;
  const ML   = 12,  MR = 12;
  const CW   = PW - ML - MR;

  const C_YELLOW = [245, 197, 24];
  const C_BLACK  = [13, 13, 13];
  const C_WHITE  = [255, 255, 255];
  const C_GRAY   = [80, 80, 80];
  const C_LGRAY  = [240, 240, 240];
  const C_MGRAY  = [180, 180, 180];
  const C_TEXT   = [40, 40, 40];

  const rect = (x, y, w, h, fill) => {
    doc.setFillColor(...fill);
    doc.rect(x, y, w, h, 'F');
  };
  const text = (str, x, y, opts = {}) => doc.text(String(str||''), x, y, opts);
  const multiText = (str, x, y, maxW, lineH = 4.5) => {
    const lines = doc.splitTextToSize(str, maxW);
    lines.forEach((l, i) => text(l, x, y + i * lineH));
    return lines.length * lineH;
  };

  let y = 0;

  /* ── HEADER ── */
  rect(0, 0, PW, 38, C_BLACK);
  rect(0, 36, PW, 2.5, C_YELLOW);

  // Fixed logo
  try {
    doc.addImage(LOGO_DATA_URL, 'JPEG', ML, 3, 38, 30, undefined, 'FAST');
  } catch(e) {
    try { doc.addImage(LOGO_DATA_URL, 'PNG', ML, 3, 38, 30, undefined, 'FAST'); } catch(e2) {}
  }

  const nameX = ML + 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...C_YELLOW);
  text(data.company.name.toUpperCase(), nameX, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...C_LGRAY);
  let contactLine = [];
  if (data.company.phone)   contactLine.push(data.company.phone);
  if (data.company.website) contactLine.push(data.company.website);
  if (contactLine.length) text(contactLine.join('   '), nameX, 19);

  if (data.company.address) {
    doc.setFontSize(7.5);
    doc.setTextColor(180, 180, 180);
    const addrLines = doc.splitTextToSize(data.company.address, PW - nameX - MR - 2);
    addrLines.slice(0,2).forEach((l, i) => text(l, nameX, 24 + i*4));
  }

  y = 44;

  /* ── QUOTATION TITLE + META ── */
  rect(ML, y, CW, 9, C_YELLOW);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...C_BLACK);
  text('QUOTATION', ML + 4, y + 6.5);

  doc.setFontSize(9);
  if (data.quote.number) text(`#${data.quote.number}`, PW - MR - 2, y + 6.5, { align:'right' });

  y += 9;

  if (data.quote.subject) {
    rect(ML, y, CW, 7, [30, 30, 30]);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(...C_LGRAY);
    text(data.quote.subject, ML + 4, y + 4.8);
    y += 7;
  }

  const metaH = 14;
  rect(ML, y, CW, metaH, [22, 22, 22]);

  const metaCols = [
    { label: 'Date',            value: data.quote.date   },
    { label: 'Valid Until',     value: data.quote.expiry },
    { label: 'Place of Supply', value: data.quote.supply },
  ].filter(c => c.value);

  const colW2 = CW / Math.max(metaCols.length, 1);
  metaCols.forEach((col, i) => {
    const cx = ML + i * colW2 + 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...C_YELLOW);
    text(col.label.toUpperCase(), cx, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C_WHITE);
    text(col.value, cx, y + 11);
  });

  y += metaH + 4;

  /* ── TRIP DETAILS ── */
  const tripFields = [
    { k:'Vehicle',      v: data.trip.vehicle   },
    { k:'Vehicle No',   v: data.trip.vehicleNo },
    { k:'Pickup',       v: data.trip.pickup    },
    { k:'Drop',         v: data.trip.drop      },
    { k:'Travel Date',  v: data.trip.travelDate},
    { k:'Return Date',  v: data.trip.returnDate},
    { k:'Passengers',   v: data.trip.pax       },
    { k:'Duration/KM',  v: data.trip.duration  },
  ].filter(f => f.v);

  if (tripFields.length > 0) {
    rect(ML, y, CW, 5.5, [30, 30, 30]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...C_YELLOW);
    text('TRIP DETAILS', ML + 3, y + 4);
    y += 5.5;

    const tripBoxH = Math.ceil(tripFields.length / 4) * 10 + 4;
    rect(ML, y, CW, tripBoxH, [248, 248, 248]);
    doc.setDrawColor(...C_MGRAY);
    doc.setLineWidth(0.3);
    doc.rect(ML, y, CW, tripBoxH);

    const tCols = 4;
    const tColW = CW / tCols;
    tripFields.forEach((f, i) => {
      const col = i % tCols;
      const row = Math.floor(i / tCols);
      const tx  = ML + col * tColW + 3;
      const ty  = y + 5 + row * 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(...C_GRAY);
      text(f.k.toUpperCase() + ':', tx, ty);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...C_TEXT);
      text(f.v, tx, ty + 4.5);
    });

    y += tripBoxH + 4;
  }

  /* ── BILL TO / SHIP TO ── */
  const halfW = (CW - 4) / 2;

  rect(ML, y, halfW, 5.5, C_BLACK);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
  doc.setTextColor(...C_YELLOW);
  text('BILL TO', ML + 3, y + 4);

  rect(ML + halfW + 4, y, halfW, 5.5, C_BLACK);
  text('SHIP TO', ML + halfW + 7, y + 4);

  y += 5.5;

  const clientH = 22;
  rect(ML, y, halfW, clientH, C_LGRAY);
  rect(ML + halfW + 4, y, halfW, clientH, C_LGRAY);
  doc.setDrawColor(...C_MGRAY); doc.setLineWidth(0.3);
  doc.rect(ML, y, halfW, clientH);
  doc.rect(ML + halfW + 4, y, halfW, clientH);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...C_TEXT);
  multiText(data.client.billTo || '', ML + 3, y + 6, halfW - 6, 4.5);

  if (data.client.phone) {
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(...C_GRAY);
    text('Ph: ' + data.client.phone, ML + 3, y + clientH - 3);
  }

  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...C_TEXT);
  multiText(data.client.shipTo || data.client.billTo || '', ML + halfW + 7, y + 6, halfW - 6, 4.5);

  y += clientH + 5;

  /* ── ITEMS TABLE ── */
  const tableRows = rowData.map((r, i) => [
    String(i + 1),
    r.desc || '',
    String(r.qty),
    r.unit || '',
    fmtNum(r.rate),
    fmtNum(r.amount),
  ]);

  doc.autoTable({
    startY: y,
    margin: { left: ML, right: MR },
    head: [['S.No', 'Service / Item Description', 'Qty', 'Unit', 'Rate (Rs.)', 'Amount (Rs.)']],
    body: tableRows,
    theme: 'grid',
    styles: {
      font: 'helvetica', fontSize: 9, cellPadding: 3,
      textColor: C_TEXT, lineColor: [210, 210, 210], lineWidth: 0.3,
    },
    headStyles: {
      fillColor: C_YELLOW,
      textColor: C_BLACK,
      fontStyle: 'bold', fontSize: 8.5,
    },
    alternateRowStyles: { fillColor: [252, 252, 250] },
    columnStyles: {
      0: { halign:'center', cellWidth:12 },
      1: { cellWidth:'auto' },
      2: { halign:'center', cellWidth:16 },
      3: { halign:'center', cellWidth:18 },
      4: { halign:'right', cellWidth:28 },
      5: { halign:'right', cellWidth:32, fontStyle:'bold', textColor:[180,130,0] },
    },
  });

  y = doc.lastAutoTable.finalY + 2;

  /* ── TOTALS BLOCK ── */
  const totW = 85;
  const totX = PW - MR - totW;

  if (discount > 0) {
    rect(totX, y, totW, 7.5, [248, 248, 245]);
    doc.setDrawColor(...C_MGRAY); doc.setLineWidth(0.3);
    doc.rect(totX, y, totW, 7.5);
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(...C_TEXT);
    text('Subtotal', totX + 3, y + 5.2);
    doc.setFont('helvetica','bold');
    text('Rs. ' + fmtNum(subtotal), totX + totW - 3, y + 5.2, { align:'right' });
    y += 7.5;

    rect(totX, y, totW, 7.5, [255, 245, 245]);
    doc.rect(totX, y, totW, 7.5);
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
    doc.setTextColor(180,30,30);
    text('Discount', totX + 3, y + 5.2);
    doc.setFont('helvetica','bold');
    text('- Rs. ' + fmtNum(discount), totX + totW - 3, y + 5.2, { align:'right' });
    y += 7.5;
  } else {
    rect(totX, y, totW, 7.5, [248, 248, 245]);
    doc.setDrawColor(...C_MGRAY); doc.setLineWidth(0.3);
    doc.rect(totX, y, totW, 7.5);
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(...C_TEXT);
    text('Subtotal', totX + 3, y + 5.2);
    doc.setFont('helvetica','bold');
    text('Rs. ' + fmtNum(subtotal), totX + totW - 3, y + 5.2, { align:'right' });
    y += 7.5;
  }

  if (taxType !== 'none' && taxRate > 0) {
    rect(totX, y, totW, 7.5, [248, 248, 245]);
    doc.setDrawColor(...C_MGRAY); doc.setLineWidth(0.3);
    doc.rect(totX, y, totW, 7.5);
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(...C_TEXT);
    text(taxLabelStr, totX + 3, y + 5.2);
    doc.setFont('helvetica','bold');
    text('Rs. ' + fmtNum(taxAmt), totX + totW - 3, y + 5.2, { align:'right' });
    y += 7.5;
  }

  rect(totX, y, totW, 10, C_YELLOW);
  doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(...C_BLACK);
  text('GRAND TOTAL', totX + 3, y + 7);
  doc.setFontSize(12);
  text('Rs. ' + fmtNum(grandTotal), totX + totW - 3, y + 7, { align:'right' });
  y += 10 + 4;

  /* ── AMOUNT IN WORDS ── */
  rect(ML, y, CW, 11, [245, 243, 232]);
  doc.setDrawColor(...C_MGRAY); doc.setLineWidth(0.3);
  doc.rect(ML, y, CW, 11);

  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...C_GRAY);
  text('TOTAL AMOUNT IN WORDS:', ML + 3, y + 4.5);
  doc.setFont('helvetica','italic'); doc.setFontSize(9); doc.setTextColor(...C_TEXT);
  text(wordsTotal + ' Rupees Only', ML + 3, y + 9);

  y += 15;

  if (taxType === 'gst' && taxRate > 0) {
    const taxCGST = taxAmt / 2, taxSGST = taxAmt / 2;
    doc.autoTable({
      startY: y,
      margin: { left: ML, right: MR },
      head: [['HSN/SAC','Taxable Value','CGST Rate','CGST Amt','SGST Rate','SGST Amt','Total Tax']],
      body: [['-', fmtNum(taxable), `${taxRate/2}%`, fmtNum(taxCGST), `${taxRate/2}%`, fmtNum(taxSGST), `Rs. ${fmtNum(taxAmt)}`]],
      theme: 'grid',
      styles: { font:'helvetica', fontSize:7.5, cellPadding:2.5, textColor:C_TEXT, lineColor:[210,210,210], lineWidth:0.3 },
      headStyles: { fillColor:[30,30,30], textColor:C_YELLOW, fontStyle:'bold', fontSize:7 },
      columnStyles: {
        0:{halign:'center'}, 1:{halign:'right'}, 2:{halign:'center'},
        3:{halign:'right'},  4:{halign:'center'}, 5:{halign:'right'},
        6:{halign:'right', fontStyle:'bold'},
      },
    });
    y = doc.lastAutoTable.finalY + 5;
  }

  /* ── BANK DETAILS + TERMS ── */
  if (y > PH - 75) { doc.addPage(); y = 16; }

  const bColW = (CW - 4) / 3;
  const tColW2 = bColW * 2;

  rect(ML, y, bColW, 5.5, C_BLACK);
  doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(...C_YELLOW);
  text('Bank Details', ML + 3, y + 4);

  rect(ML + bColW + 4, y, tColW2, 5.5, C_BLACK);
  text('Terms & Conditions', ML + bColW + 7, y + 4);

  y += 5.5;
  const secBoxH = 46;

  rect(ML, y, bColW, secBoxH, [250, 250, 248]);
  rect(ML + bColW + 4, y, tColW2, secBoxH, [250, 250, 248]);
  doc.setDrawColor(...C_MGRAY); doc.setLineWidth(0.3);
  doc.rect(ML, y, bColW, secBoxH);
  doc.rect(ML + bColW + 4, y, tColW2, secBoxH);

  const bankRows = [
    { label:'Bank:',   value: data.bank.bank    },
    { label:'Branch:', value: data.bank.branch  },
    { label:'Name:',   value: data.bank.name    },
    { label:'A/C No:', value: data.bank.account },
    { label:'IFSC:',   value: data.bank.ifsc    },
    { label:'UPI:',    value: data.bank.upi     },
  ].filter(b => b.value);

  let by = y + 6;
  bankRows.forEach(b => {
    doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...C_GRAY);
    text(b.label, ML + 3, by);
    doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(...C_TEXT);
    const wrapped = doc.splitTextToSize(b.value, bColW - 22);
    wrapped.forEach((l, li) => text(l, ML + 20, by + li*4));
    by += Math.max(wrapped.length,1)*4 + 2;
  });

  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(...C_TEXT);
  const termsLines = data.terms.split('\n').filter(l => l.trim());
  let ty = y + 6;
  termsLines.forEach(line => {
    const wrapped = doc.splitTextToSize(line, tColW2 - 8);
    wrapped.forEach(l => { text(l, ML + bColW + 7, ty); ty += 4.2; });
    if (ty > y + secBoxH - 4) return;
  });

  y += secBoxH + 6;

  /* ── AUTHORISED SIGNATORY — Text only, no image ── */
  if (y > PH - 35) { doc.addPage(); y = 16; }

  const sigW = 72;
  const sigX = PW - MR - sigW;

  // Blank space for signature
  y += 16;

  doc.setDrawColor(...C_MGRAY); doc.setLineWidth(0.5);
  doc.line(sigX, y, sigX + sigW, y);

  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(...C_GRAY);
  text('Authorised Signatory For', sigX + sigW/2, y + 4.5, { align:'center' });

  // "Naveen Kumar K" in bold
  doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(...C_TEXT);
  text('Naveen Kumar K', sigX + sigW/2, y + 11, { align:'center' });

  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(...C_GRAY);
  text(data.company.name, sigX + sigW/2, y + 16.5, { align:'center' });

  /* ── PAGE FOOTER ── */
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    rect(0, PH - 8.5, PW, 8.5, C_BLACK);
    rect(0, PH - 9.5, PW, 1, C_YELLOW);
    doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(160,160,160);
    text(data.company.name, ML, PH - 3.5);
    if (data.company.phone) text(data.company.phone, PW/2, PH-3.5, { align:'center' });
    text(`Page ${p} of ${totalPages}`, PW - MR, PH - 3.5, { align:'right' });
  }

  /* ── SAVE ── */
  const filename = `Quote_${data.quote.number || 'Draft'}_${(data.quote.date||'').replace(/\//g,'-') || 'Shivam'}.pdf`;
  doc.save(filename);
}
