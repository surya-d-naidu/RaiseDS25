# Word Document Export Feature

## Overview
This feature allows admins to export all accepted abstracts into a single, professionally formatted Word document (.docx) for use in conference souvenirs or proceedings.

## Features
- **Single Click Export**: Admin can generate and download the document with one button click
- **Accepted Abstracts Only**: Only abstracts with "accepted" status are included
- **Complete Information**: Each abstract includes:
  - Abstract ID (reference ID)
  - Title
  - Authors with their:
    - Names
    - Email addresses
    - Affiliations/Institutions
    - Categories
  - Abstract content (full text)
  - Category
  - Keywords

## How to Use

### For Admins:
1. Navigate to the Admin Panel → Abstracts page
2. Click the **"Export Accepted (Word)"** button in the header
3. Wait for the document to be generated (progress indicator will show)
4. The Word document will automatically download to your computer
5. Filename format: `RAISE_DS_2025_Accepted_Abstracts_YYYY-MM-DD.docx`

### Document Structure:
1. **Title Page**:
   - Conference name: "RAISE DS 2025"
   - Subtitle: "45th Annual Convention of Indian Society for Probability and Statistics"
   - Document title: "Accepted Abstracts"
   - Total count of abstracts

2. **Abstract Pages** (one per abstract):
   - Abstract ID (bold, large text)
   - Title (Heading 2 style)
   - Authors section with numbered list:
     - Author name (bold)
     - Email (indented, italicized label)
     - Affiliation (indented, italicized label)
     - Category (indented, italicized label)
   - Abstract content (justified text)
   - Category
   - Keywords
   - Page break after each abstract

## Technical Details

### Backend:
- **Route**: `GET /api/admin/abstracts/export/word`
- **Authentication**: Admin only (isAdmin middleware)
- **Library**: `docx` npm package (v9.5.1)
- **File Location**: `/root/raiseds25/project/server/routes.ts` (lines 187-440)

### Frontend:
- **Component**: `/root/raiseds25/project/client/src/pages/admin/abstracts.tsx`
- **Function**: `exportAcceptedAbstractsToWord()`
- **Button Location**: Admin Abstracts page header, next to "Export CSV" button

### Performance:
- Server-side generation prevents browser crashes
- Async/await pattern ensures smooth processing
- Progress indicator keeps admin informed
- No file size limit concerns (handled by server)

### Error Handling:
- Returns 404 if no accepted abstracts found
- Catches and reports generation errors
- Toast notifications for success/failure
- Console logging for debugging

## Dependencies
```json
{
  "docx": "^9.5.1"
}
```

## Installation
The `docx` library has been added to package.json. If needed, reinstall with:
```bash
npm install docx
```

## Files Modified
1. **server/routes.ts**: Added Word document generation route
2. **client/src/pages/admin/abstracts.tsx**: Added export button and handler
3. **package.json**: Added docx dependency

## Testing
1. Ensure you have at least one abstract with "accepted" status
2. Log in as admin
3. Navigate to Admin → Abstracts
4. Click "Export Accepted (Word)"
5. Verify document downloads and opens correctly in Microsoft Word or compatible software
6. Check that all information is formatted properly

## Troubleshooting

### Issue: Button is disabled/grayed out
- Wait for any ongoing generation to complete
- Check browser console for errors

### Issue: Download doesn't start
- Verify you're logged in as admin
- Check that there are accepted abstracts in the system
- Check browser console and server logs for errors

### Issue: Document is empty or incomplete
- Verify abstracts have all required fields populated
- Check server logs for processing errors
- Ensure docx package is installed correctly

### Issue: Server crashes or times out
- Check server memory and CPU usage
- Verify database connection is stable
- Review server logs for specific error messages

## Future Enhancements (Optional)
- Add table of contents
- Include conference logo/branding
- Add footer with page numbers
- Option to filter by category before export
- Include submission dates
- Add institution index
- Support for custom formatting templates
