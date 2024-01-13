import makeApiRequest from "./apiCaller";

export const login = async (email_id, password) => {
  try {
    const body = new URLSearchParams();
    body.append("email_id", email_id);
    body.append("password", password);

    const result = await makeApiRequest("login", "POST", body);
    console.log(result);
    return result;
  } catch (error) {
    // Handle errors
    console.log(error);
  }
};
