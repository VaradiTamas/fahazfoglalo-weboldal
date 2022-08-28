const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

module.exports = async (req, res, next) => {
  try {
    // reading the template pdf file
    const templatePDFBytes = fs.readFileSync('booking_ticket_template.pdf');
    const pdfDoc = await PDFDocument.load(templatePDFBytes);

    // constants for styling
    const fontSize = 24;

    // reading the previously created QR code
    const pngImageBytes = fs.readFileSync('booking_qr_code.png');
    const pngImage = await pdfDoc.embedPng(pngImageBytes)
    const pngDims = pngImage.scale(0.5)

    const pages = pdfDoc.getPages()

    // putting the QR code to the PDF file
    pages[0].drawImage(pngImage, {
      x: pages[0].getWidth() - pngDims.width -50,
      y: pages[0].getHeight() - pngDims.height - 50,
      width: pngDims.width,
      height: pngDims.height,
    })

    // writing the booking data to the PDF file
    // name of the person who reserved the accomodation
    pages[0].drawText(`${req.body.from}`, {
      x: pages[0].getWidth() - 150,
      y: pages[0].getHeight() -150,
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
