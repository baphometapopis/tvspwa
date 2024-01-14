import makeApiRequest from "./apiCaller";

export const fetchChats = async (data) => {
  try {
    const body = new URLSearchParams();
    body.append("esclation_user_id", data?.esclation_user_id);
    body.append("esclation_to_user_id", data?.esclation_to_user_id);
    body.append("esclation_id", data?.esclation_id);

    const result = await makeApiRequest("esclationChatList", "POST", body);
    const resdata = JSON.parse(result);

    return resdata;
  } catch (error) {
    // Handle errors
    console.log(error);
  }
};
