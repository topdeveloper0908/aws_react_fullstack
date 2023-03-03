export const containsUnreadMessages = (thread, userID) => {
  let hasUnreadMessages = false;
  for (let i = 0; i < thread.messages.length; i++) {
    const message = thread.messages[i];
    if (message.read === false && message.senderID !== userID) {
      hasUnreadMessages = true;
      break;
    }
  }
  return hasUnreadMessages;
};

export const sortAndFilter = (messageThreads, user) => {
  const filteredThreads = messageThreads.filter((t) => {
    const otherPartyID = t.participants.find((p) => {
      return p._id !== user._id;
    })._id;
    if (
      user.blockedUsers.includes(otherPartyID) ||
      user.blockedByUsers.includes(otherPartyID)
    ) {
      return false;
    } else return true;
  });
  let unreadThreads = [];
  let readThreads = [];
  filteredThreads.forEach((t) => {
    if (containsUnreadMessages(t, user._id)) {
      unreadThreads.push(t);
    } else readThreads.push(t);
  });
  //sort each separately, then concat the arrays
  unreadThreads = unreadThreads.sort((a, b) => {
    const lastSentMessageA = a.messages[a.messages.length - 1];
    const lastSentMessageB = b.messages[b.messages.length - 1];
    const sentAtA = new Date(lastSentMessageA.sentAt);
    const sentAtB = new Date(lastSentMessageB.sentAt);
    //order them with greater dates first
    if (sentAtA < sentAtB) return 1;
    else if (sentAtA > sentAtB) return -1;
    else return 0;
  });
  readThreads = readThreads.sort((a, b) => {
    const lastSentMessageA = a.messages[a.messages.length - 1];
    const lastSentMessageB = b.messages[b.messages.length - 1];
    const sentAtA = new Date(lastSentMessageA.sentAt);
    const sentAtB = new Date(lastSentMessageB.sentAt);
    //order them with greater dates first
    if (sentAtA < sentAtB) return 1;
    else if (sentAtA > sentAtB) return -1;
    else return 0;
  });
  const sortedAndFilteredThreads = unreadThreads.concat(readThreads);

  return sortedAndFilteredThreads;

  //pagination may be added later
  // const arrayLength = sortedThreads.length;
  // const pages = [];

  // for (let i = 0; i < arrayLength; i += 10) {
  //   const page = sortedThreads.slice(i, i + 10);
  //   pages.push(page);
  // }

  // return pages;
};
