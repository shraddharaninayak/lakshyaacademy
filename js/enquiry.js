/**
 * THE LAKSHYA CAREER ACADEMY — ENQUIRY & WHATSAPP ENGINE
 * Form Validation, LocalStorage Lead Persistence & Direct WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppForms();
});

function initWhatsAppForms() {
  const whatsappForms = document.querySelectorAll('.js-whatsapp-form');
  const ACADEMY_WHATSAPP_NUMBER = '917887878001'; // Primary Lakshya WhatsApp admissions line

  whatsappForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const courseInput = form.querySelector('[name="course"]');
      const statusInput = form.querySelector('[name="status"]');
      const timeSlotInput = form.querySelector('[name="time_slot"]');
      const materialTypeInput = form.querySelector('[name="material_type"]');
      const cityInput = form.querySelector('[name="city"]');
      const messageInput = form.querySelector('[name="message"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim().replace(/\s+/g, '') : '';
      const course = courseInput ? courseInput.value : 'General Civil Services Enquiry';
      const status = statusInput ? statusInput.value : '';
      const timeSlot = timeSlotInput ? timeSlotInput.value : '';
      const materialType = materialTypeInput ? materialTypeInput.value : '';
      const city = cityInput ? cityInput.value.trim() : 'Nashik';
      const userMessage = messageInput ? messageInput.value.trim() : '';

      // Validate inputs
      if (!name || name.length < 2) {
        showFormAlert(form, 'Please provide your valid full name.', 'error');
        if (nameInput) nameInput.focus();
        return;
      }

      // Phone number validation (at least 10 digits)
      const phoneDigits = phone.replace(/[^0-9]/g, '');
      if (phoneDigits.length < 10) {
        showFormAlert(form, 'Please enter a valid 10-digit WhatsApp/mobile number.', 'error');
        if (phoneInput) phoneInput.focus();
        return;
      }

      // 1. Client-side Persistence: Record enquiry in localStorage so leads are preserved
      try {
        const existingLeads = JSON.parse(localStorage.getItem('lakshya_enquiries') || '[]');
        const newLead = {
          id: 'lead_' + Date.now(),
          timestamp: new Date().toISOString(),
          name,
          phone: phoneDigits,
          course,
          status,
          city,
          userMessage
        };
        existingLeads.unshift(newLead);
        localStorage.setItem('lakshya_enquiries', JSON.stringify(existingLeads.slice(0, 50)));
      } catch (err) {
        console.warn('LocalStorage not available for saving lead:', err);
      }

      // 2. Format WhatsApp Message
      let message = `*NEW ADMISSION & COURSE ENQUIRY*\n`;
      message += `------------------------------------\n`;
      message += `👤 *Student Name:* ${name}\n`;
      message += `📞 *Phone Number:* ${phone}\n`;
      message += `📚 *Target Program:* ${course}\n`;
      if (status) message += `🎓 *Academic Status:* ${status}\n`;
      if (materialType) message += `📖 *Requested Material:* ${materialType}\n`;
      if (timeSlot) message += `⏰ *Campus Visit Time:* ${timeSlot}\n`;
      if (city && city !== 'Nashik') message += `📍 *City / District:* ${city}\n`;
      if (userMessage) message += `💬 *Query / Notes:* ${userMessage}\n`;
      message += `------------------------------------\n`;
      message += `_Sent via The Lakshya Career Academy Official Portal_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${ACADEMY_WHATSAPP_NUMBER}&text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Visual success confirmation
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span style="color: #22C55E; font-weight: 700;">✓ Connected! Opening WhatsApp...</span>`;
        submitBtn.disabled = true;
        
        showFormAlert(form, 'Inquiry recorded! Opening WhatsApp conversation with Academic Admissions.', 'success');

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          form.reset();
        }, 3000);
      }
    });
  });
}

function showFormAlert(form, message, type) {
  let alertBox = form.querySelector('.form-feedback-alert');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.className = 'form-feedback-alert';
    form.prepend(alertBox);
  }

  const isSuccess = type === 'success';
  alertBox.style.cssText = `
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    font-size: 0.88rem;
    line-height: 1.4;
    font-weight: 500;
    background-color: ${isSuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
    color: ${isSuccess ? '#15803D' : '#B91C1C'};
    border: 1px solid ${isSuccess ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  `;
  alertBox.textContent = message;

  setTimeout(() => {
    if (alertBox && alertBox.parentNode) {
      alertBox.remove();
    }
  }, 4500);
}
