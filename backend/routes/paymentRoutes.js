const express = require("express");

const router = express.Router();

router.post("/khalti/initiate", async (req, res) => {
  try {
    const {
      amount,
      purchase_order_id,
      purchase_order_name,
      customer_info,
    } = req.body;

    const response = await fetch(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: `${process.env.FRONTEND_URL}/payment/khalti/callback`,
          website_url: process.env.FRONTEND_URL,
          amount,
          purchase_order_id,
          purchase_order_name,
          customer_info,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to initiate Khalti payment",
      error: error.message,
    });
  }
});

router.post("/khalti/lookup", async (req, res) => {
  try {
    const { pidx } = req.body;

    const response = await fetch(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to verify Khalti payment",
      error: error.message,
    });
  }
});

module.exports = router;