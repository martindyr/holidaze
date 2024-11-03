/* For creating ellipsis on text like descriptions */

const truncateDescription = (description, maxWords = 30) => {
    if (!description) return 'No description available.';

    const words = description.split(' ');
    if (words.length <= maxWords) return description;

    return `${words.slice(0, maxWords).join(' ')}...`;
};

export default truncateDescription;