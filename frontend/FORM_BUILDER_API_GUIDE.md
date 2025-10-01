# 🚀 Form Builder API Integration Guide

## Overview
The Form Builder now supports direct API integration, allowing you to POST form data to any backend endpoint without writing custom code.

## Configuration in Storyblok

### New Fields Added

#### **Submit API URL** (`submit_api_url`)
- **Type**: Text
- **Required**: No
- **Description**: API endpoint URL where form data will be POSTed
- **Example**: `https://api.yoursite.com/forms/submit`

When this field is set, the form will automatically POST data to this endpoint when submitted.

#### **Submit Method** (`submit_method`)
- **Type**: Option (POST / PUT)
- **Required**: No
- **Default**: POST
- **Description**: HTTP method to use for API submission

#### **Error Message** (`error_message`)
- **Type**: Textarea
- **Required**: No
- **Default**: "Failed to submit form. Please try again."
- **Description**: Custom error message shown when API call fails

#### **Success Redirect URL** (`success_redirect_url`)
- **Type**: Text
- **Required**: No
- **Description**: URL to redirect to after successful form submission
- **Note**: Replaces the deprecated `submit_button_href`

---

## How It Works

### 1. **No API URL Set** (Development Mode)
- Form data is logged to browser console
- Perfect for testing and development
- Shows complete form data structure

### 2. **With API URL** (Production Mode)
- Form data is automatically POSTed to your API
- Files are uploaded as multipart/form-data
- Success/error messages are displayed
- Optional redirect after success

---

## Data Format Sent to API

The form builder automatically prepares data in the correct format:

### Regular Fields
```javascript
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

### Arrays (Checkboxes, Multiple Selects)
```javascript
{
  "interests[]": ["sports", "music", "reading"]
}
```

### Files
Files are sent as multipart/form-data:
```javascript
{
  "resume[]": File {name: "resume.pdf", size: 123456, ...},
  "photos[]": [File {}, File {}, ...]
}
```

---

## Backend API Example

### Node.js/Express

```javascript
const express = require('express');
const multer = require('multer');
const app = express();

// Configure file upload
const upload = multer({ dest: 'uploads/' });

// Form submission endpoint
app.post('/api/forms/submit', upload.array('files'), async (req, res) => {
  try {
    const formData = req.body;
    const uploadedFiles = req.files;
    
    // Validate
    if (!formData.email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }
    
    // Process data
    console.log('Form Data:', formData);
    console.log('Files:', uploadedFiles);
    
    // Save to database, send emails, etc.
    
    // Return success
    res.json({
      success: true,
      message: 'Form submitted successfully',
      submissionId: Date.now()
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

app.listen(3000);
```

### PHP

```php
<?php
// Enable CORS if needed
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Get form data
$formData = $_POST;
$files = $_FILES;

// Validate
if (empty($formData['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email is required']);
    exit;
}

// Process files
foreach ($files as $fieldName => $file) {
    if ($file['error'] === UPLOAD_ERR_OK) {
        $uploadPath = 'uploads/' . basename($file['name']);
        move_uploaded_file($file['tmp_name'], $uploadPath);
    }
}

// Save to database
// Send email notifications
// etc.

// Return success
echo json_encode([
    'success' => true,
    'message' => 'Form submitted successfully',
    'submissionId' => time()
]);
?>
```

---

## Example Storyblok Configuration

### Simple Contact Form
```
Form Builder:
├── Title: "Contact Us"
├── Submit Button Text: "Send Message"
├── Submit API URL: "https://api.example.com/contact"
├── Submit Method: POST
├── Success Message: "Thank you! We'll get back to you soon."
├── Success Redirect URL: "/thank-you"
├── Error Message: "Oops! Something went wrong. Please try again."
```

### Newsletter Signup
```
Form Builder:
├── Submit API URL: "https://api.example.com/newsletter/subscribe"
├── Submit Method: POST
├── Success Message: "You're subscribed! Check your email to confirm."
```

### Job Application
```
Form Builder:
├── Submit API URL: "https://api.example.com/jobs/apply"
├── Submit Method: POST
├── Success Redirect URL: "/application-received"
├── Error Message: "Failed to submit application. Please email us directly at jobs@example.com"
```

---

## Testing

### 1. **Development (No API)**
- Leave `submit_api_url` empty
- Open browser console (F12)
- Submit form
- View complete form data in console

### 2. **Testing with API**
- Set `submit_api_url` to your test endpoint
- Submit form
- Check:
  - ✅ Network tab shows POST request
  - ✅ Request payload contains all form fields
  - ✅ Files are included in FormData
  - ✅ Success/error messages display correctly

### 3. **Production**
- Set production API URL
- Test all form validations
- Test file uploads (if applicable)
- Verify redirect works
- Test error scenarios

---

## Security Best Practices

### Frontend
- ✅ Validate required fields before submission
- ✅ Use HTTPS for API URLs
- ✅ Implement rate limiting on submission button
- ✅ Sanitize user input before display

### Backend
- ✅ Validate all incoming data
- ✅ Sanitize inputs to prevent XSS
- ✅ Implement CSRF protection
- ✅ Rate limit API endpoint
- ✅ Validate file types and sizes
- ✅ Scan uploaded files for malware
- ✅ Use authentication/authorization if needed

---

## Troubleshooting

### Form submits but no API call
- Check browser console for errors
- Verify `submit_api_url` is set correctly
- Check CORS configuration on backend

### API returns 400/500 error
- Check backend logs
- Verify request payload format
- Test endpoint with Postman/curl

### Files not uploading
- Verify backend accepts `multipart/form-data`
- Check file size limits on server
- Verify `accept` attribute on file field

### Redirect not working
- Check `success_redirect_url` is set correctly
- Verify URL is accessible
- Check browser console for errors

---

## Migration from Old Approach

### Before (Custom Handler)
```typescript
<FormBuilder 
  onSubmit={async (data) => {
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }}
/>
```

### After (Storyblok Configuration)
```
Simply configure in Storyblok:
- Submit API URL: https://api.example.com/submit
- No code changes needed!
```

---

## Advanced Usage

### Custom Error Handling
The error message field supports markdown and HTML:
```html
<p>Submission failed.</p>
<p>Please contact us at <a href="mailto:support@example.com">support@example.com</a></p>
```

### Multiple Forms
Each Form Builder instance can have its own API endpoint:
```
Contact Form → https://api.example.com/contact
Job Application → https://api.example.com/jobs/apply
Newsletter → https://api.example.com/newsletter
```

---

## Support

For questions or issues with API integration:
1. Check browser console for detailed error messages
2. Test endpoint independently with Postman
3. Verify backend is returning proper JSON responses
4. Check CORS configuration if cross-origin

