const express = require("express");
const router = express.Router();

const checkAuthMW = require("../middleware/user/check-auth-middleware");
const setIsPaidStateMW = require("../middleware/booking/set-isPaid-state-middleware");
const saveVoucherMW = require('../middleware/voucher/save-voucher-middleware');
const getVouchersMW = require('../middleware/voucher/get-vouchers-middleware');
const deleteVoucherMW = require('../middleware/voucher/delete-voucher-middleware');
const editVoucherMW = require('../middleware/voucher/edit-voucher-middleware');
const getVoucherByIdMW = require('../middleware/voucher/get-voucher-by-id-middleware');

router.post('',
  setIsPaidStateMW,
  saveVoucherMW
);

router.get('',
  checkAuthMW,
  getVouchersMW
);

router.use('/delete/:id',
  checkAuthMW,
  deleteVoucherMW
);

router.put('/edit/:id',
  checkAuthMW,
  editVoucherMW
);

router.get('/:id',
  getVoucherByIdMW
);

module.exports = router;
