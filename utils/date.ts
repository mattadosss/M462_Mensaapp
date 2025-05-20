export function getNextWeekdays(startDate: Date = new Date(), count: number = 5): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    // If current date is weekend, start from next Monday
    if (currentDate.getDay() === 0) { // Sunday
        currentDate.setDate(currentDate.getDate() + 1);
    } else if (currentDate.getDay() === 6) { // Saturday
        currentDate.setDate(currentDate.getDate() + 2);
    }

    while (dates.length < count) {
        // Skip weekends
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function formatDateDisplay(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
} 