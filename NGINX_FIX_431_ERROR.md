# Nginx Configuration Fix for 431 Error

## Problem
- 431 Request Header Fields Too Large error occurring during file uploads
- This happens when request headers exceed nginx's default buffer size limits
- Common with authentication cookies, large form data, or session tokens

## Changes Made

### 1. Global nginx.conf Settings
**File**: `/etc/nginx/nginx.conf`

Added to the `http` block:
```nginx
##
# Buffer Size Settings (Fix 431 errors)
##

large_client_header_buffers 4 32k;   # Allows up to 4 buffers of 32KB each for large headers
client_header_buffer_size 8k;        # Initial buffer size for reading headers
client_max_body_size 10M;            # Maximum file upload size (10MB)
```

### 2. Site-Specific Configuration
**File**: `/etc/nginx/sites-available/raiseds25.com`

Added to the HTTPS server block:
```nginx
# Increase buffer sizes to handle large headers and cookies
large_client_header_buffers 4 32k;
client_header_buffer_size 8k;

# Increase max body size for file uploads (10MB)
client_max_body_size 10M;

# Increase timeouts for large file uploads
client_body_timeout 300s;
client_header_timeout 300s;

# Inside location / block:
# Increase proxy buffer sizes
proxy_buffer_size 16k;
proxy_buffers 4 16k;
proxy_busy_buffers_size 32k;

# Increase proxy timeouts for large uploads
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;
```

## What Each Setting Does

1. **large_client_header_buffers 4 32k**
   - Allocates 4 buffers of 32KB each for reading large client request headers
   - Default is usually 4 8k, which can be too small for apps with large cookies/tokens

2. **client_header_buffer_size 8k**
   - Sets the initial buffer size for reading client request headers
   - Default is 1k, increased to 8k to handle auth tokens better

3. **client_max_body_size 10M**
   - Maximum allowed size of the client request body (file uploads)
   - Set to 10MB to match application's file upload limit

4. **client_body_timeout / client_header_timeout 300s**
   - Extends timeout for slow connections or large file uploads
   - Default is 60s, increased to 300s (5 minutes)

5. **proxy_buffer_size / proxy_buffers**
   - Controls how much response data nginx buffers from the backend
   - Helps with large responses from your Node.js application

6. **proxy timeouts 300s**
   - Prevents timeout errors for slow uploads to backend server

## Backup Files Created
- `/etc/nginx/nginx.conf.backup-YYYYMMDD-HHMMSS`
- `/etc/nginx/sites-available/raiseds25.com.backup-YYYYMMDD-HHMMSS`

## Testing
After applying these changes:
1. Nginx configuration was tested: `sudo nginx -t` ✅
2. Nginx was reloaded: `sudo systemctl reload nginx` ✅
3. Service is running properly

## Expected Results
- ✅ No more 431 errors during file uploads
- ✅ Can handle larger authentication tokens/cookies
- ✅ File uploads up to 10MB work smoothly
- ✅ Better handling of slow network connections

## If Issues Persist
If you still see 431 errors:
1. Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Increase buffer sizes further if needed
3. Check if cookies/session data is too large
4. Consider using JWT tokens instead of large session cookies

## Rollback (if needed)
To revert changes:
```bash
# Restore nginx.conf
sudo cp /etc/nginx/nginx.conf.backup-YYYYMMDD-HHMMSS /etc/nginx/nginx.conf

# Restore site config
sudo cp /etc/nginx/sites-available/raiseds25.com.backup-YYYYMMDD-HHMMSS /etc/nginx/sites-available/raiseds25.com

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
```
