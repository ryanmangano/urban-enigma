/* North Star Bakery — Contact & Pre-Order form
   Validates the pre-order/inquiry form with inline feedback, remembers
   returning-visitor details, and pulls in any pre-order list built on
   the Products page. */

const PREORDER_KEY = 'nsbPreOrderItems';
const CONTACT_INFO_KEY = 'nsbContactInfo';

// Object: maps each field id to the check it must pass and the
// message to display when it fails.
const fieldValidators = {
  name: {
    test: function (value) {
      return /^[A-Za-z\s'-]{2,60}$/.test(value.trim());
    },
    message: "Please enter a name using letters, spaces, hyphens, or apostrophes (2-60 characters)."
  },
  email: {
    test: function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    },
    message: 'Please enter a valid email address, like you@example.com.'
  },
  'request-type': {
    test: function (value) {
      return value !== '';
    },
    message: 'Please select a request type.'
  },
  'pickup-date': {
    test: function (value) {
      if (!value) return false;
      const chosen = new Date(value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return chosen >= today;
    },
    message: 'Pickup date cannot be in the past. Please choose today or a later date.'
  },
  'item-details': {
    test: function (value) {
      return value.trim().length > 0;
    },
    message: 'Please describe the items you would like to order or your question.'
  }
};

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + '-error');
  if (field) field.classList.add('field-invalid');
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + '-error');
  if (field) field.classList.remove('field-invalid');
  if (errorEl) errorEl.textContent = '';
}

function validateForm() {
  // Array: collects the ids of any fields that fail validation this pass.
  const invalidFieldIds = [];

  Object.keys(fieldValidators).forEach(function (fieldId) {
    const field = document.getElementById(fieldId);
    const rule = fieldValidators[fieldId];

    if (!field) return;

    if (rule.test(field.value)) {
      clearFieldError(fieldId);
    } else {
      showFieldError(fieldId, rule.message);
      invalidFieldIds.push(fieldId);
    }
  });

  if (invalidFieldIds.length > 0) {
    document.getElementById(invalidFieldIds[0]).focus();
    return false;
  }

  return true;
}

function saveContactInfo() {
  const info = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim()
  };
  setStoredJSON(CONTACT_INFO_KEY, info);
}

function prefillContactInfo() {
  const info = getStoredJSON(CONTACT_INFO_KEY, null);
  if (!info) return;
  document.getElementById('name').value = info.name || '';
  document.getElementById('email').value = info.email || '';
}

function prefillItemDetailsFromOrder() {
  const items = getStoredJSON(PREORDER_KEY, []);
  if (items.length === 0) return;

  const itemDetails = document.getElementById('item-details');
  const summary = items.map(function (item) {
    return item.qty + 'x ' + item.name;
  }).join(', ');

  itemDetails.value = summary;

  const carriedNotice = document.getElementById('order-carried-notice');
  if (carriedNotice) carriedNotice.hidden = false;
}

function handleSubmit(event) {
  event.preventDefault();

  const successMessage = document.getElementById('form-success');

  if (!validateForm()) {
    if (successMessage) successMessage.hidden = true;
    return;
  }

  saveContactInfo();

  if (successMessage) {
    successMessage.hidden = false;
    successMessage.textContent = 'Thanks! Your request has been saved. We will confirm by phone or email before your pickup date.';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  prefillContactInfo();
  prefillItemDetailsFromOrder();

  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  Object.keys(fieldValidators).forEach(function (fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('blur', function () {
        if (fieldValidators[fieldId].test(field.value)) {
          clearFieldError(fieldId);
        }
      });
    }
  });
});
