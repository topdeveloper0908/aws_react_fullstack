import axios from "axios";

export const sendNewMessage = (message, recipientID) => {
  console.log("sendNewMessage: message -> ", message, ", recipientID: ", recipientID);
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post("/new_message_thread", {
        message,
        recipientID,
      });
      resolve(res.data);
    } catch (e) {
      reject(e);
    }
  });
};

export const replyToThread = (newMessage, threadID, recipientID) => {
  console.log("replyToThread: newMessage -> ", newMessage, "threadID: ", threadID, ", recipientID: ", recipientID );
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.put("/respond_to_message", {
        newMessage,
        threadID,
        recipientID,
      });
      resolve(res.data);
    } catch (e) {
      reject(e);
    }
  });
};

export const setHasRead = (threadID) => {
  console.log("setHasRead: threadID ->", threadID);
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.put("/set_read_status", { threadID });
      resolve(res.data);
    } catch (e) {
      reject(e);
    }
  });
};
