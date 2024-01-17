import makeApiRequest from "./apiCaller";

export const fetchChats = async (data) => {
  try {
    const body = new URLSearchParams();
    body.append("user_id", data?.esclation_user_id);
    body.append("esclation_id", data?.esclation_id);

    const result = await makeApiRequest("chatlog", "POST", body);
    const resdata = JSON.parse(result);
    console.log(resdata, "sdsdsd");
    return resdata;
  } catch (error) {
    // Handle errors
    console.log(error);
  }
};