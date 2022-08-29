const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

module.exports = async (req, res, next) => {
  try {
    // reading the template pdf file
    const templatePDFBytes = fs.readFileSync('booking_ticket_template.pdf');
    const pdfDoc = await PDFDocument.load(templatePDFBytes);

    // constants for styling
    const fontSize = 12;

    // reading the previously created QR code
    const pngImageBytes = fs.readFileSync('booking_qr_code.png');
    const pngImage = await pdfDoc.embedPng(pngImageBytes)
    const pngDims = pngImage.scale(0.6)

    const pages = pdfDoc.getPages()

    // putting the QR code to the PDF file
    pages[0].drawImage(pngImage, {
      x: pages[0].getWidth() - pngDims.width - 20,
      y: pages[0].getHeight() - pngDims.height - 20,
      width: pngDims.width,
      height: pngDims.height,
    })

    // writing the booking data to the PDF file
    // date
    pages[0].drawText(`${formatDateString(req.body.from)} - ${formatDateString(req.body.to)}`, {
      x: 106,
      y: 504,
      size: fontSize,
    })

    // name
    pages[0].drawText(`${req.body.lastName} ${req.body.firstName}`, {
      x: 390,
      y: 504,
      size: fontSize,
    })

    // number of adults
    pages[0].drawText(`${req.body.numOfAdults}`, {
      x: 159,
      y: 473.5,
      size: fontSize,
    })

    // number of children
    pages[0].drawText(`${req.body.numOfChildren}`, {
      x: 406,
      y: 473.5,
      size: fontSize,
    })

    // telephone
    pages[0].drawText(`${req.body.tel}`, {
      x: 138,
      y: 444,
      size: fontSize,
    })

    // email
    pages[0].drawText(`${req.body.email}`, {
      x: 377,
      y: 444,
      size: fontSize,
    })

    // payable amount
    pages[0].drawText(`${calculatePrice(req.body.from, req.body.to)} HUF`, {
      x: 255,
      y: 311,
      size: fontSize,
    })

    // saving the PDF
    const pdfBytes = await pdfDoc.save();
    let writer = fs.createWriteStream('booking_ticket.pdf');
    writer.write(pdfBytes);
    next();
  } catch (err) {
    console.error(err);
    next();
  }
};

function formatDateString(date) {
  const dateObject = new Date(date);
  const yearString = dateObject.getFullYear().toString();

  // for days and months if they are below 10 we have to put a 0 in front of them to make the text look nice
  // e.g. instead of 2022.1.2. it will be 2022.01.02.
  const month = dateObject.getMonth() + 1;
  const monthString = month > 9 ? month.toString() : '0' + month.toString();
  const day = dateObject.getDate();
  const dayString = day > 9 ? day.toString() : '0' + day.toString();

  return yearString + '.' + monthString + '.' + dayString + '.';
}

function calculatePrice(from, to) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffTime = toDate - fromDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const price = diffDays * 50000;
  return new Intl.NumberFormat('en-us').format(price);
}
