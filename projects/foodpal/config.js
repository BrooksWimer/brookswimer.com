const config = {
    // Change this to false for production
    isDevelopment: true,
    
    // API URLs
    apiUrl: function() {
        return this.isDevelopment ? 'http://localhost:5000' : 'https://api.brookswimer.com';
    }
}; 