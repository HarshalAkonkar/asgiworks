// ======================================================
// QUOTATION APP
// script.js
// PART 1
// ======================================================

"use strict";

// ======================================================
// DOM ELEMENTS
// ======================================================

const tableBody = document.getElementById("tableBody");

const addRowBtn = document.getElementById("addRow");

const pdfBtn = document.getElementById("generatePDF");

const shareBtn = document.getElementById("sharePDF");

const quotationNoInput = document.getElementById("quotationNo");

const dateInput = document.getElementById("date");

const grandTotal = document.getElementById("grandTotal");

const amountWords = document.getElementById("amountWords");

// ======================================================
// APP START
// ======================================================

document.addEventListener("DOMContentLoaded", initApp);

// ======================================================
// INITIALIZE APP
// ======================================================

function initApp() {

    setCurrentDate();

    generateQuotationNumber();

    createFirstRow();

}

// ======================================================
// AUTO DATE
// ======================================================

function setCurrentDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    dateInput.value = `${year}-${month}-${day}`;

}

// ======================================================
// AUTO QUOTATION NUMBER
// ======================================================

function generateQuotationNumber() {

    let number = localStorage.getItem("quotationNumber");

    if (number === null) {

        number = 1;

    }

    quotationNoInput.value = String(number).padStart(3, "0");

}

// ======================================================
// SAVE NEXT QUOTATION NUMBER
// ======================================================

function increaseQuotationNumber() {

    let number = localStorage.getItem("quotationNumber");

    if (number === null) {

        number = 1;

    }

    number = Number(number) + 1;

    localStorage.setItem("quotationNumber", number);

}

// ======================================================
// CREATE FIRST EMPTY ROW
// ======================================================

function createFirstRow() {

    addNewRow();

}




// ======================================================
// BUTTON EVENTS
// ======================================================

if (addRowBtn) {

    addRowBtn.addEventListener("click", function () {

        addNewRow();

    });

}



if (pdfBtn) {

    pdfBtn.addEventListener("click", function () {

        generatePDF();

    });

}



if (shareBtn) {

    shareBtn.addEventListener("click", function () {

        sharePDF();

    });

}


// ======================================================
// ADD NEW ROW
// ======================================================

function addNewRow() {

    const row = document.createElement("tr");

    row.innerHTML = `

        <td class="sr text-center"></td>

        <td>

            <input
                type="text"
                class="form-control particular"
                placeholder="Item Name">

        </td>

        <td>

            <input
                type="text"
                class="form-control size"
                placeholder="Size">

        </td>

        <td>

            <input
                type="number"
                class="form-control qty"
                value="0"
                min="0">

        </td>

        <td>

            <input
                type="number"
                class="form-control rate"
                value="0"
                min="0">

        </td>

        <td>

            <input
                type="text"
                class="form-control amount"
                value="0.00"
                readonly>

        </td>

        <td class="text-center">

            <button
                class="btn btn-danger btn-sm deleteRow">

                🗑

            </button>

        </td>

    `;

    tableBody.appendChild(row);

    updateSerialNumbers();

    row.querySelector(".particular").focus();

}

// ======================================================
// UPDATE SERIAL NUMBER
// ======================================================

function updateSerialNumbers() {

    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(function (row, index) {

        row.querySelector(".sr").textContent = index + 1;

    });

}

// ======================================================
// DELETE ROW
// ======================================================

tableBody.addEventListener("click", function (e) {

    if (!e.target.classList.contains("deleteRow")) return;

    const rows = tableBody.querySelectorAll("tr");

    // Keep one row minimum
    if (rows.length === 1) {

        alert("At least one item row is required.");

        return;

    }

    if (confirm("Delete this item?")) {

        e.target.closest("tr").remove();

        updateSerialNumbers();

        calculateGrandTotal();

    }

});

// ======================================================
// CALCULATE SINGLE ROW
// ======================================================

function calculateRow(row){

    console.log("calculateRow called");

    const qty = parseFloat(row.querySelector(".qty").value) || 0;

    const rate = parseFloat(row.querySelector(".rate").value) || 0;

    console.log("Qty =", qty);

    console.log("Rate =", rate);

    const amount = qty * rate;

    console.log("Amount =", amount);

    row.querySelector(".amount").value = amount.toFixed(2);

    calculateGrandTotal();

}



// ======================================================
// LIVE CALCULATION
// ======================================================

tableBody.addEventListener("input", function(e){

    if(

        e.target.classList.contains("qty")

        ||

        e.target.classList.contains("rate")

    ){

        const row = e.target.closest("tr");

        calculateRow(row);

    }

});

// ======================================================
// GRAND TOTAL
// ======================================================

function calculateGrandTotal(){

    let total = 0;

    document.querySelectorAll(".amount").forEach(function(input){

        total += parseFloat(input.value) || 0;

    });

    grandTotal.innerHTML = "₹ " + total.toFixed(2);

    // Update Amount In Words
    amountWords.textContent = convertAmountToWords(total);

}

// ======================================================
// NUMBER TO WORDS
// ======================================================

function convertAmountToWords(amount) {

    amount = Math.floor(Number(amount));

    if (amount === 0) {
        return "Rupees Zero Only";
    }

    const ones = [

        "",

        "One",

        "Two",

        "Three",

        "Four",

        "Five",

        "Six",

        "Seven",

        "Eight",

        "Nine",

        "Ten",

        "Eleven",

        "Twelve",

        "Thirteen",

        "Fourteen",

        "Fifteen",

        "Sixteen",

        "Seventeen",

        "Eighteen",

        "Nineteen"

    ];

    const tens = [

        "",

        "",

        "Twenty",

        "Thirty",

        "Forty",

        "Fifty",

        "Sixty",

        "Seventy",

        "Eighty",

        "Ninety"

    ];

    function convert(n){

        if (n === 0) return "";

if (n < 20) {

    return ones[n];

}
        if(n < 100){

            return tens[Math.floor(n / 10)] + " " + ones[n % 10];

        }

        if(n < 1000){

            return ones[Math.floor(n / 100)] +

                " Hundred " +

                convert(n % 100);

        }

        if(n < 100000){

            return convert(Math.floor(n / 1000)) +

                " Thousand " +

                convert(n % 1000);

        }

        if(n < 10000000){

            return convert(Math.floor(n / 100000)) +

                " Lakh " +

                convert(n % 100000);

        }

        return convert(Math.floor(n / 10000000)) +

            " Crore " +

            convert(n % 10000000);

    }

    return "Rupees " + convert(amount).replace(/\s+/g," ").trim() + " Only";

}

















// ======================================================
// GENERATE PROFESSIONAL PDF
// ======================================================

function generatePDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({

        orientation:"portrait",

        unit:"mm",

        format:"a4"

    });

    doc.setDrawColor(0);

    doc.setLineWidth(0.5);

    doc.rect(

        5,

        7,

        200,

        285

    );



// Company Name

doc.setFont("helvetica", "bold");
doc.setFontSize(20);
doc.setTextColor(43, 43, 43);   // Royal Blue

doc.text(
    "ANUP STEEL & GLASS INTERIOR",
    120,
    18,
    { align: "center" }
);


// Tag Line

doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.setTextColor(0);

doc.text(
    "ALL Types Of Steel & Glass Works",
    120,
    26,
    { align: "center" }
);

doc.setFontSize(10);
doc.setFont("helvetica","bold");
doc.text("Adress: Near Trimurti Nagar, Nagpur-26, Maharashtra", 75, 34,);
doc.text("GST : 27XXXXXXXX", 100, 40);
doc.text("Email : anupmandhare@gmail.com", 90, 46);
doc.text("Mobile : 9175325948, 9834381258", 92, 52);


doc.setLineWidth(0.3);

doc.line(5,60,205,60);

doc.setFont("helvetica","bold");

doc.setFontSize(16);

doc.text("QUOTATION",105,70,{align:"center"});


// ======================================
// GET LOGO FROM HTML
// ======================================

const logoElement = document.getElementById("companyLogo");

if (logoElement) {

    const canvas = document.createElement("canvas");

    canvas.width = logoElement.naturalWidth;

    canvas.height = logoElement.naturalHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(

        logoElement,

        0,

        0

    );

    const logoData = canvas.toDataURL("image/png");

    doc.addImage(

        logoData,

        "PNG",

        14,

        13,

        45,

        45,

    );

}


// ======================================
// QUOTATION TOP TEXT
// ======================================

const quotationTitle2 =
    document.getElementById("quotationTitle2").innerText;

doc.setFont("helvetica", "bold");

doc.setFontSize(12);

doc.setTextColor(0, 0, 0);

doc.text(
    quotationTitle2,
    105,
    5,
    {
        align: "center"
    }
);

// ======================================
// CUSTOMER DETAILS
// ======================================

const customerName = document.getElementById("customerName").value || "-";

const city = document.getElementById("city").value || "-";

const state = document.getElementById("state").value || "-";

const customerGST = document.getElementById("customerGST").value || "-";

const quotationNo = document.getElementById("quotationNo").value || "001";

const date = document.getElementById("date").value || "-";

const customerMobile = document.getElementById("customerMobile").value || "-";

const place = document.getElementById("place").value || "-";

// Customer Details Box

doc.setLineWidth(0.3);

doc.rect(10, 75, 190, 35);

doc.setFont("helvetica", "bold");
doc.setFontSize(10);

doc.text("M/s :", 15, 83);
doc.text("City :", 15, 90);
doc.text("State :", 15, 97);
doc.text("GST No :", 15, 104);

doc.setFont("helvetica", "normal");

doc.text(customerName, 35, 83);
doc.text(city, 35, 90);
doc.text(state, 35, 97);
doc.text(customerGST, 35, 104);

doc.setFont("helvetica", "bold");

doc.text("Quotation No :", 110, 83);
doc.text("Date :", 110, 90);
doc.text("Mobile :", 110, 97);
doc.text("Place :", 110, 104);

doc.setFont("helvetica", "normal");

doc.text(quotationNo, 145, 83);
doc.text(date, 145, 90);
doc.text(customerMobile, 145, 97);
doc.text(place, 145, 104);

doc.line(105, 75, 105, 110);

// ======================================
// READ ITEM TABLE
// ======================================

const tableRows = [];

const rows = document.querySelectorAll("#tableBody tr");

rows.forEach((row, index) => {

    const particular = row.querySelector(".particular").value || "";

    const size = row.querySelector(".size").value || "";

    const qty = row.querySelector(".qty").value || "0";

    const rate = row.querySelector(".rate").value || "0";

    const amount = row.querySelector(".amount").value || "0.00";

    tableRows.push([

        index + 1,

        particular,

        size,

        qty,

        rate,

        amount

    ]);

});

// ======================================
// ITEM TABLE
// ======================================

doc.autoTable({

    startY: 118,

    head: [[

        "Sr",

        "Particular",

        "Size",

        "Qty",

        "Rate",

        "Amount"

    ]],

    body: tableRows,

    theme: "grid",

    styles: {

        fontSize: 10,

        cellPadding: 2,

        valign: "middle",

        halign: "center"

    },

    headStyles: {

        fillColor: [30,144,255],

        textColor: 255,

        fontStyle: "bold"

    },

    columnStyles: {

        0:{cellWidth:12},

        1:{cellWidth:72},

        2:{cellWidth:25},

        3:{cellWidth:20},

        4:{cellWidth:28},

        5:{cellWidth:33}

    }

});

const finalY = doc.lastAutoTable.finalY;

// ======================================
// SUMMARY POSITION
// ======================================

let summaryY = finalY + 10;

// If there isn't enough room on the current page,
// create a new page for the summary.

if (summaryY > 235) {

    doc.addPage();

    summaryY = 20;

}

// ======================================
// GRAND TOTAL
// ======================================

let total = 0;

document.querySelectorAll(".amount").forEach(function (input) {

    total += parseFloat(input.value) || 0;

});

const totalText = "Rs. " + total.toFixed(2);

const totalWords = convertAmountToWords(total);

// ======================================
// AMOUNT IN WORDS
// ======================================

doc.setFont("helvetica", "bold");
doc.setFontSize(10);

doc.rect(10, summaryY, 130, 18);

doc.text("Amount In Words", 13, summaryY + 6);

doc.setFont("helvetica", "normal");

doc.text(totalWords, 13, summaryY + 13);



// ======================================
// GRAND TOTAL BOX
// ======================================

doc.setFont("helvetica", "bold");

doc.rect(145, summaryY, 55, 18);

doc.text("Grand Total", 172, summaryY + 6, {

    align: "center"

});

doc.setFontSize(13);

doc.text(totalText, 172, summaryY + 14, {

    align: "center"

});

// ======================================
// TERMS
// ======================================

summaryY += 28;

doc.setFont("helvetica", "bold");

doc.rect(10, summaryY, 190, 28);

doc.text("Terms & Conditions", 13, summaryY + 6);

doc.setFont("helvetica", "normal");

doc.setFontSize(9);

doc.text("• Goods once sold will not be taken back.", 15, summaryY + 13);

doc.text("• Design or measurement changes after confirmation will be charged extra.", 15, summaryY + 19);

doc.text("• Balance payment due before or immediately after completion.", 15, summaryY + 25);

// ======================================
// SIGNATURES
// ======================================

summaryY += 45;

doc.setFont("helvetica", "bold");

doc.line(20, summaryY, 80, summaryY);

doc.text("Customer Signature", 25, summaryY + 6);

doc.line(130, summaryY, 190, summaryY);

doc.text("Authorized Signatory", 140, summaryY + 6);

doc.setFont("helvetica", "normal");

doc.text("For ANUP STEEL & GLASS INTERIOR", 132, summaryY + 14);

// ======================================
// SAVE PDF
// ======================================

doc.save(`Quotation-${quotationNo}.pdf`);

// ======================================
// FOOTER ONLY ON LAST PAGE
// ======================================

// Get last page number
const lastPage = doc.getNumberOfPages();

// Go to last page
doc.setPage(lastPage);

// Footer text
doc.setFont("helvetica", "italic");
doc.setFontSize(10);
doc.setTextColor(120);

// Center footer at bottom
doc.text(
    "Thank You For Your Business",
    105,          // Center of A4 width (210mm)
    290,          // Bottom of page
    { align: "center" }
);

// Save PDF
const quotation = quotationNoInput.value || "001";
doc.save(`Quotation-${quotation}.pdf`);

// Increase quotation number
increaseQuotationNumber();

// Reset button
pdfBtn.disabled = false;
pdfBtn.innerHTML = oldText;




    doc.save("test.pdf");

    // A4 Page Size

    const pageWidth = doc.internal.pageSize.getWidth();

    const pageHeight = doc.internal.pageSize.getHeight();

    // White Background

    doc.setFillColor(255,255,255);

    doc.rect(0,0,pageWidth,pageHeight,"F");

}