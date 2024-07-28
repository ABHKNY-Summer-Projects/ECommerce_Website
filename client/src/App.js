import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddress: '',
    couponCode: '',
    bank: '',
    total: 0,
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (

    <div className="billing-details-container">
      <div className="billing">
      <h1>Billing Details</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          placeholder="Last Name"
          onChange={handleChange}
        />
         
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="emailAddress"
          value={formData.emailAddress}
          placeholder="Email Address"
          onChange={handleChange}
          required
        />
        <select name="bank" value={formData.bank} onChange={handleChange}>
          <option value="">Select Bank</option>
          <option value="VISA">Chapa</option>
        </select>
        </form>
        </div>

        <div className="left-side">

        <form onSubmit={handleFormSubmit}>
          <div className="products-container">
          <div className="product">
        {/*from database*/ }
          <span>LCD Monitor</span> 
          <span>$650</span>
        {/*{products.map((product, index) => (
              <div className="product" key={index}>
                <span>{product.name}</span>
                <span>${product.price}</span>
              </div> */}
        </div>
        
          <span>H1 Gamepad</span>
          <span>$1100</span>


          
          
        <input
          type="text"
          name="couponCode"
          value={formData.couponCode}
          placeholder="Enter Coupon Code"
          onChange={handleChange}
        />

      <div className="total-container">
        <div>Subtotal: $1750</div>
        <div>Shipping: $1750</div>
        <div>Total:</div>
      </div>

        <div className="buttons">
        <button type="submit">Apply Coupon</button>
        <button type="submit">Place Order</button>
        </div>


          </div>




        
      
     
     
      
      </form>
      </div>
    </div>
  );
};

export default App;