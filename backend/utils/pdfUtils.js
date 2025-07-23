function extractDatesFromPDF(text) {
  const dates = [];
  const lines = text.split('\n');

  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g,
    /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/gi,
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g
  ];

  for (const line of lines) {
    for (const pattern of datePatterns) {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const date = new Date(match);
          if (!isNaN(date.getTime())) {
            dates.push(date);
          }
        });
      }
    }
  }

  return dates;
}

export default extractDatesFromPDF;