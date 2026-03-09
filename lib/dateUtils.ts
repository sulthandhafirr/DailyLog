export function formatDateFromISO(isoDate: string): string {
  try {
    const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
      console.error('[Date Format] Invalid ISO date:', isoDate);
      return isoDate;
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    const date = new Date(Date.UTC(year, month - 1, day));

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  } catch (error) {
    console.error('[Date Format] Error formatting date:', error);
    return isoDate;
  }
}

export function parseToISO(dateString: string): string {
  try {
    const cleaned = dateString.trim();
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
      return cleaned;
    }

    const monthMap: { [key: string]: number } = {
      'january': 1, 'jan': 1,
      'february': 2, 'feb': 2,
      'march': 3, 'mar': 3,
      'april': 4, 'apr': 4,
      'may': 5,
      'june': 6, 'jun': 6,
      'july': 7, 'jul': 7,
      'august': 8, 'aug': 8,
      'september': 9, 'sep': 9, 'sept': 9,
      'october': 10, 'oct': 10,
      'november': 11, 'nov': 11,
      'december': 12, 'dec': 12
    };

    let match = cleaned.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i);
    if (match) {
      const day = parseInt(match[1], 10);
      const monthName = match[2].toLowerCase();
      const year = parseInt(match[3], 10);
      const month = monthMap[monthName];

      if (month && day >= 1 && day <= 31) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }

    match = cleaned.match(/^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i);
    if (match) {
      const monthName = match[1].toLowerCase();
      const day = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
      const month = monthMap[monthName];

      if (month && day >= 1 && day <= 31) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }

    throw new Error(`Invalid date format: "${cleaned}"`);
  } catch (error) {
    throw error;
  }
}

export function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function isValidDate(dateString: string): boolean {
  try {
    parseToISO(dateString);
    return true;
  } catch {
    return false;
  }
}
