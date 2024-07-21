const getRandomChars = (str, num) => {
    let result = '';
    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * str.length);
        result += str[randomIndex];
    }
    return result;
};

export default getRandomChars;
