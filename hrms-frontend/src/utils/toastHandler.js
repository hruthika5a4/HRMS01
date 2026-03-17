import toast from 'react-hot-toast';

export const handleApiError = (err) => {
  if (err.response && err.response.data) {
    const errorData = err.response.data;
    
    // If it's a specific DRF error object
    if (typeof errorData === 'object' && !Array.isArray(errorData)) {
      Object.keys(errorData).forEach(key => {
        const messages = Array.isArray(errorData[key]) ? errorData[key] : [errorData[key]];
        messages.forEach(msg => {
          let prettyMsg = msg;
          let prettyKey = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          if (key === 'non_field_errors' && msg.includes('unique set')) {
             prettyKey = 'Duplicate Entry';
             prettyMsg = 'Attendance has already been marked for this employee on this date.';
          }
          
          toast.error(`${prettyKey}: ${prettyMsg}`, { duration: 4000 });
        });
      });
    } else if (errorData.error) {
       toast.error(errorData.error);
    } else {
       toast.error("An unexpected error occurred.");
    }
  } else {
    toast.error("Network Error. Please check your connection.");
  }
};

export const showSuccess = (msg) => {
  toast.success(msg, { duration: 3000 });
};
