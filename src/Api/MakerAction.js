import makeApiRequest from "./apiCaller";

export const makerAction = async (data) => {
  try {
    const body = new URLSearchParams();
    body.append("esclated_by_comment", data?.esclated_by_comment);
    body.append("esclated_by_category_id", data?.esclated_by_category_id);
    body.append("job_id", data?.job_id);
    body.append("user_id", data?.user_id);

    const result = await makeApiRequest("MakerAction", "POST", body);
    const resdata = JSON.parse(result);

    return resdata;
  } catch (error) {
    // Handle errors
    console.log(error);
  }
};
