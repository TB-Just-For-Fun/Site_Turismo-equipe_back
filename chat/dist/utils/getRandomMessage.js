export const getRandomMessage = (messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
};
