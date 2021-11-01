const Voucher = require('../../models/voucher');

module.exports = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const voucherQuery = Voucher.find();
  let fetchedVouchers;

  if (pageSize && currentPage) {
    voucherQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  voucherQuery
    .then(vouchers => {
      fetchedVouchers = vouchers;
      return Voucher.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Vouchers fetched successfully!",
        vouchers: fetchedVouchers,
        maxVouchers: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching vouchers failed!"
      });
    });
}
