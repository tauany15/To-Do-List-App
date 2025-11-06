module.exports = (err, req, res, next) => {
  console.error("Error:", err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  
  // Check if it's an AJAX request
  if (req.xhr || req.headers.accept.indexOf("json") > -1) {
    return res.status(statusCode).json({
      success: false,
      error: message
    });
  }
  
  // Render error page
  res.status(statusCode).render("error", {
    errorCode: statusCode,
    message: process.env.NODE_ENV === "production" 
      ? "An error occurred. Please try again." 
      : message
  });
};