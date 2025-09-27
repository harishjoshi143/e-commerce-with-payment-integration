  import Razorpay from 'razorpay';

  export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { amount } = req.body; // amount in rupees

    try {
      const instance = new Razorpay({
        key_id: process.env.rzp_test_RMXCdZKpTrK5my,
        key_secret: process.env.KeZMGS5iHGRRuS5wnppxGHhU
      });

      const options = {
        amount: Number(amount) * 100, // paise
        currency: 'INR',
        receipt: 'rcpt_' + Date.now()
      };

      const order = await instance.orders.create(options);
      res.status(200).json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message || 'Server error' });
    }
  }
