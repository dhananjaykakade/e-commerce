
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
   const message = document.getElementById('messageInput').value;
    const messageContainer = document.getElementById('message');
    const form = document.getElementById('contactForm');
    const submitButton = document.getElementById('btn');
    
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
    
    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });
      
      const data = await response.json();

      if (response.ok) {
        messageContainer.className = 'message success';
        messageContainer.textContent = 'Thank you for your message. We will get back to you soon.';
        messageContainer.style.color = 'green';
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = 'send'
      } else {
        messageContainer.className = 'message error';
        messageContainer.textContent = 'An error occurred: ' + (data.message || response.status);
        messageContainer.style.color ='red';
               submitButton.disabled = false;
        submitButton.textContent = 'send again'
      }
    } catch (error) {
      console.error('Error:', error);
      messageContainer.className = 'message error';
      messageContainer.textContent = 'An error occurred while sending your message. Please try again later.';
      messageContainer.style.color ='red';
                     submitButton.disabled = false;
        submitButton.textContent = 'send again'
    }
    
    messageContainer.style.display = 'block';
  });