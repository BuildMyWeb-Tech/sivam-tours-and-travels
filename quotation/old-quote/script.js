/* ═══════════════════════════════════════════════════════════
   Sri Sarguru Tours & Travels — script.js
   Features:
     • Dynamic item rows (add / remove / quick-add)
     • Live calculation: qty × rate → amount → totals
     • Tax: None / GST (CGST+SGST) / IGST / Custom
     • Discount support
     • Number → Indian words
     • Logo + Signature image upload & embed in PDF
     • PDF generation via jsPDF + AutoTable
═══════════════════════════════════════════════════════════ */

/* ── STATE ──────────────────────────────────────────────── */
let rowCount  = 0;
let rowData   = [];          // [{ id, desc, qty, unit, rate, amount }]
let logoDataUrl = null;      // base64 logo
let sigDataUrl  = null;      // base64 signature

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

/* ── IMAGE UPLOAD HANDLERS ──────────────────────────────── */
function handleLogoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    logoDataUrl = ev.target.result;
    // Show in topbar
    const img = document.getElementById('logoPreview');
    const placeholder = document.getElementById('logoPlaceholder');
    img.src = logoDataUrl;
    img.style.display = 'block';
    placeholder.style.display = 'none';
    // Update upload box
    const box = document.getElementById('logoUploadBox');
    box.classList.add('has-file');
    box.querySelector('.upload-text').textContent = '✓ Logo uploaded';
  };
  reader.readAsDataURL(file);
}

function handleSigUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    sigDataUrl = ev.target.result;
    const box = document.getElementById('sigUploadBox');
    box.classList.add('has-file');
    box.querySelector('.upload-text').textContent = '✓ Signature uploaded';
  };
  reader.readAsDataURL(file);
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

  // Focus description field on new empty row
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
  // Renumber visible S.No
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

  // Subtotal
  document.getElementById('subtotalDisplay').textContent = '₹ ' + fmtNum(subtotal);

  // Discount line
  const discLine = document.getElementById('discountLine');
  if (discount > 0) {
    discLine.style.display = 'flex';
    document.getElementById('discountDisplay').textContent = `− ₹ ${fmtNum(discount)}`;
  } else {
    discLine.style.display = 'none';
  }

  // Tax line
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

  // Show/hide custom label field
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

  // ── Gather data ───────────────────────────────────────
  const data = {
    company: {
      name:    val('companyName')    || 'Sri Sarguru Tours & Travels',
      gst:     val('companyGST'),
      phone:   val('companyPhone'),
      email:   val('companyEmail'),
      pan:     val('companyPAN'),
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
      name:    val('accountName'),
      account: val('accountNo'),
      ifsc:    val('ifscCode'),
      upi:     val('upiId'),
    },
    terms: val('termsConditions'),
  };

  // ── Recalc totals ─────────────────────────────────────
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

  // ── jsPDF setup ───────────────────────────────────────
  const doc  = new jsPDF({ unit:'mm', format:'a4', orientation:'portrait' });
  const PW   = 210, PH = 297;
  const ML   = 12,  MR = 12;
  const CW   = PW - ML - MR;

  // Colors
  const C_YELLOW = [245, 197, 24];
  const C_BLACK  = [13, 13, 13];
  const C_DARK   = [26, 26, 26];
  const C_WHITE  = [255, 255, 255];
  const C_GRAY   = [80, 80, 80];
  const C_LGRAY  = [240, 240, 240];
  const C_MGRAY  = [180, 180, 180];
  const C_TEXT   = [40, 40, 40];

  // Helper functions
  const setFont  = (style, size) => { doc.setFont('helvetica', style); doc.setFontSize(size); };
  const setColor = (rgb) => doc.setTextColor(...rgb);
  const rect     = (x, y, w, h, fill) => {
    doc.setFillColor(...fill);
    doc.rect(x, y, w, h, 'F');
  };
  const text     = (str, x, y, opts = {}) => doc.text(String(str||''), x, y, opts);
  const hRule    = (y, lw = 0.4, color = C_MGRAY) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(lw);
    doc.line(ML, y, PW - MR, y);
  };
  const multiText = (str, x, y, maxW, lineH = 4.5) => {
    const lines = doc.splitTextToSize(str, maxW);
    lines.forEach((l, i) => text(l, x, y + i * lineH));
    return lines.length * lineH;
  };

  let y = 0;

  /* ══════════════════════════════════════════════════════
     HEADER — Black bar + Yellow strip
  ══════════════════════════════════════════════════════ */
  // Full black header
  rect(0, 0, PW, 38, C_BLACK);
  // Yellow accent strip at bottom of header
  rect(0, 36, PW, 2.5, C_YELLOW);

  // Logo (if uploaded)
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', ML, 3, 32, 30, undefined, 'FAST');
    } catch(e) {
      try { doc.addImage(logoDataUrl, 'JPEG', ML, 3, 32, 30, undefined, 'FAST'); } catch(e2) {}
    }
  }

  // Company name
  const nameX = logoDataUrl ? ML + 36 : ML;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...C_YELLOW);
  text(data.company.name.toUpperCase(), nameX, 13);

  // Contact line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...C_LGRAY);
  let contactLine = [];
  if (data.company.phone)   contactLine.push(data.company.phone);
  if (data.company.email)   contactLine.push(data.company.email);
  if (data.company.website) contactLine.push(data.company.website);
  if (contactLine.length) text(contactLine.join('   '), nameX, 19);

  // Address
  if (data.company.address) {
    doc.setFontSize(7.5);
    doc.setTextColor(180, 180, 180);
    const addrLines = doc.splitTextToSize(data.company.address, PW - nameX - MR - 2);
    addrLines.slice(0,2).forEach((l, i) => text(l, nameX, 24 + i*4));
  }

  // GSTIN / PAN on right
  const metaRightX = PW - MR;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C_YELLOW);
  let infoY = 10;
  if (data.company.gst) {
    text('GSTIN: ' + data.company.gst, metaRightX, infoY, { align:'right' });
    infoY += 5;
  }
  if (data.company.pan) {
    text('PAN: ' + data.company.pan, metaRightX, infoY, { align:'right' });
    infoY += 5;
  }

  y = 44;

  /* ══════════════════════════════════════════════════════
     QUOTATION TITLE + META BOX
  ══════════════════════════════════════════════════════ */
  // Title row
  rect(ML, y, CW, 9, C_YELLOW);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...C_BLACK);
  text('QUOTATION', ML + 4, y + 6.5);

  // Quote number on right
  doc.setFontSize(9);
  if (data.quote.number) text(`#${data.quote.number}`, PW - MR - 2, y + 6.5, { align:'right' });

  y += 9;

  // Subject line
  if (data.quote.subject) {
    rect(ML, y, CW, 7, [30, 30, 30]);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(...C_LGRAY);
    text(data.quote.subject, ML + 4, y + 4.8);
    y += 7;
  }

  // Meta info row
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

  /* ══════════════════════════════════════════════════════
     TRIP DETAILS (if any)
  ══════════════════════════════════════════════════════ */
  const tripFields = [
    { k:'Vehicle',      v: data.trip.vehicle  },
    { k:'Vehicle No',   v: data.trip.vehicleNo},
    { k:'Pickup',       v: data.trip.pickup   },
    { k:'Drop',         v: data.trip.drop     },
    { k:'Travel Date',  v: data.trip.travelDate},
    { k:'Return Date',  v: data.trip.returnDate},
    { k:'Passengers',   v: data.trip.pax      },
    { k:'Duration/KM',  v: data.trip.duration },
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

  /* ══════════════════════════════════════════════════════
     BILL TO / SHIP TO
  ══════════════════════════════════════════════════════ */
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

  /* ══════════════════════════════════════════════════════
     ITEMS TABLE
  ══════════════════════════════════════════════════════ */
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
    head: [['S.No', 'Service / Item Description', 'Qty', 'Unit', 'Rate (₹)', 'Amount (₹)']],
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

  /* ══════════════════════════════════════════════════════
     TOTALS BLOCK
  ══════════════════════════════════════════════════════ */
  const totW = 85;
  const totX = PW - MR - totW;

  // Subtotal row
  if (discount > 0) {
    rect(totX, y, totW, 7.5, [248, 248, 245]);
    doc.setDrawColor(...C_MGRAY); doc.setLineWidth(0.3);
    doc.rect(totX, y, totW, 7.5);
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(...C_TEXT);
    text('Subtotal', totX + 3, y + 5.2);
    doc.setFont('helvetica','bold');
    text('Rs. ' + fmtNum(subtotal), totX + totW - 3, y + 5.2, { align:'right' });
    y += 7.5;

    // Discount
    rect(totX, y, totW, 7.5, [255, 245, 245]);
    doc.rect(totX, y, totW, 7.5);
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor([180,30,30]);
    text('Discount', totX + 3, y + 5.2);
    doc.setFont('helvetica','bold');
    text('− Rs. ' + fmtNum(discount), totX + totW - 3, y + 5.2, { align:'right' });
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

  // Tax row
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

  // Grand total
  rect(totX, y, totW, 10, C_YELLOW);
  doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(...C_BLACK);
  text('GRAND TOTAL', totX + 3, y + 7);
  doc.setFontSize(12);
  text('Rs. ' + fmtNum(grandTotal), totX + totW - 3, y + 7, { align:'right' });
  y += 10 + 4;

  /* ══════════════════════════════════════════════════════
     AMOUNT IN WORDS
  ══════════════════════════════════════════════════════ */
  rect(ML, y, CW, 11, [245, 243, 232]);
  doc.setDrawColor(...C_MGRAY); doc.setLineWidth(0.3);
  doc.rect(ML, y, CW, 11);

  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...C_GRAY);
  text('TOTAL AMOUNT IN WORDS:', ML + 3, y + 4.5);
  doc.setFont('helvetica','italic'); doc.setFontSize(9); doc.setTextColor(...C_TEXT);
  text(wordsTotal + ' Rupees Only', ML + 3, y + 9);

  y += 15;

  // Tax split (GST specific)
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

  /* ══════════════════════════════════════════════════════
     BANK DETAILS + TERMS & CONDITIONS
  ══════════════════════════════════════════════════════ */
  if (y > PH - 75) { doc.addPage(); y = 16; }

  const bColW = (CW - 4) / 3;
  const tColW2 = bColW * 2;

  // Headers
  rect(ML, y, bColW, 5.5, C_BLACK);
  doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(...C_YELLOW);
  text('Bank Details', ML + 3, y + 4);

  rect(ML + bColW + 4, y, tColW2, 5.5, C_BLACK);
  text('Terms & Conditions', ML + bColW + 7, y + 4);

  y += 5.5;
  const secBoxH = 42;

  rect(ML, y, bColW, secBoxH, [250, 250, 248]);
  rect(ML + bColW + 4, y, tColW2, secBoxH, [250, 250, 248]);
  doc.setDrawColor(...C_MGRAY); doc.setLineWidth(0.3);
  doc.rect(ML, y, bColW, secBoxH);
  doc.rect(ML + bColW + 4, y, tColW2, secBoxH);

  // Bank content
  const bankRows = [
    { label:'Bank:',   value: data.bank.bank    },
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

  // Terms content
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(...C_TEXT);
  const termsLines = data.terms.split('\n').filter(l => l.trim());
  let ty = y + 6;
  termsLines.forEach(line => {
    const wrapped = doc.splitTextToSize(line, tColW2 - 8);
    wrapped.forEach(l => { text(l, ML + bColW + 7, ty); ty += 4.2; });
    if (ty > y + secBoxH - 4) return;
  });

  y += secBoxH + 6;

  /* ══════════════════════════════════════════════════════
     AUTHORISED SIGNATORY
  ══════════════════════════════════════════════════════ */
  if (y > PH - 35) { doc.addPage(); y = 16; }

  const sigW = 72;
  const sigX = PW - MR - sigW;

  if (sigDataUrl) {
    try {
      doc.addImage(sigDataUrl, 'PNG', sigX, y, sigW, 18, undefined, 'FAST');
      y += 18;
    } catch(e) {
      try { doc.addImage(sigDataUrl, 'JPEG', sigX, y, sigW, 18, undefined, 'FAST'); y += 18; }
      catch(e2) { y += 20; }
    }
  } else {
    y += 20; // blank space for manual signature
  }

  doc.setDrawColor(...C_MGRAY); doc.setLineWidth(0.5);
  doc.line(sigX, y, sigX + sigW, y);

  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(...C_GRAY);
  text('Authorised Signatory For', sigX + sigW/2, y + 4.5, { align:'center' });
  doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(...C_TEXT);
  text(data.company.name, sigX + sigW/2, y + 9.5, { align:'center' });

  /* ══════════════════════════════════════════════════════
     PAGE FOOTER
  ══════════════════════════════════════════════════════ */
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

  /* ── SAVE ─────────────────────────────────────────── */
  const filename = `Quote_${data.quote.number || 'Draft'}_${(data.quote.date||'').replace(/\//g,'-') || 'SriSarguru'}.pdf`;
  doc.save(filename);
}
