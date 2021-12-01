const fs = require("fs");
const {PDFDocument} = require("pdf-lib");

module.exports = async (req, res, next) => {
  try {
    const existingPdfBytes = fs.readFileSync('booking_ticket_template.pdf');
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pngImageBytes = fs.readFileSync('booking_qr_code.png');
    const pngImage = await pdfDoc.embedPng(pngImageBytes)
    const pngDims = pngImage.scale(0.5)
    const pages = pdfDoc.getPages()

    pages[0].drawImage(pngImage, {
      x: pages[0].getWidth() - pngDims.width -50,
      y: pages[0].getHeight() - pngDims.height - 50,
      width: pngDims.width,
      height: pngDims.height,
    })

    const pdfBytes = await pdfDoc.save();
    let writer = fs.createWriteStream('booking_ticket.pdf');
    writer.write(pdfBytes);
    next();
  } catch (err) {
    console.error(err);
    next();
  }
};
