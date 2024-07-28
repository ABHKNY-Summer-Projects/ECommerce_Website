document.getElementById('checkout-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      paymentMethod: formData.get('paymentMethod'),
      items: [
        { name: 'LCD Monitor', price: 650 },
        { name: 'H1 Gamepad', price: 1100 }
      ]
    };
  
    try {
      const response = await fetch('/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        alert('Order placed successfully');
      } else {
        alert('Error placing order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error placing order');
    }
  });
  