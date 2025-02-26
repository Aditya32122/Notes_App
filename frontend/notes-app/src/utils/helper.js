export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);//returns true if email is valid
};

export const getInitials = (name) => {
    if (!name) return '';

    const words = name.split(' ');
    let initials = '';

    for (let i = 0; i < words.length; i++) {
        initials += words[i].charAt(0);
    }
    return initials.toUpperCase();

}