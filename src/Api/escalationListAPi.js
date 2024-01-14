import makeApiRequest from "./apiCaller";

export const escalationListApi = async (user_id) => {
  try {
    const body = new URLSearchParams();
    body.append("user_id", user_id);

    const result = await makeApiRequest("esclationList", "POST", body);
    const data = JSON.parse(result);
    console.log(data, "EscalationList");

    return data;
  } catch (error) {
    // Handle errors
    console.log(error);
  }
};
