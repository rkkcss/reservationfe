

/**
 * Returns the initials of a full name.
 * 
 * @example getInitials('John Doe') // 'JD'
 * @param {string} fullName The full name to get the initials from.
 * @returns {string} The initials of the full name.
 */
export const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);

    return parts
        .slice(0, 2)
        .map(p => p[0].toUpperCase())
        .join('');
}