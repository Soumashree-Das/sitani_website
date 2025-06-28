# sitani_website

fields -
1.announcements/news
2.services
3.projects
4.acheivements
5.contact us
6.about us

image storing approach -

Implementation Checklist
◻️Set up cloud storage bucket
◻️Implement file upload API with validation
◻️Create media processing pipeline (thumbnails, optimizations)
◻️Design responsive frontend components
◻️Implement lazy loading and placeholder techniques
◻️Configure CDN and caching headers
◻️Set up monitoring for media delivery performance
◻️Implement security measures for uploads


## cloud storage 
🧭 Image Upload Flow Summary
◻️Set up Multer middleware to handle multipart/form-data (the format used for file uploads).
◻️Configure Cloudinary, a cloud storage platform for images/videos.
◻️Use multer-storage-cloudinary to connect Multer with Cloudinary.
◻️POST route is defined to handle incoming image files from the client.
◻️Optionally, store the file metadata (like URL or public ID) in a MongoDB database.
◻️If Cloudinary upload fails, use fs.unlink() to delete the local temp file.
◻️Add error handling and success confirmation.