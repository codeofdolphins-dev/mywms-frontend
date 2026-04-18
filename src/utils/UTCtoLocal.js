export const utcToLocal = (date) => {
    if (!date) return "-";
    const newDate = new Date(date);

    // Check if invalid
    if (isNaN(newDate.getTime())) {
        return null;
    }

    return newDate.toLocaleString("en-Us", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatCreatedAt(createdAt) {
    const now = new Date();
    const created = new Date(createdAt);

    const diffMs = now - created; // difference in milliseconds
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
        // Show the time (e.g., 14:35)
        return created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        // Show how many days ago
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
}