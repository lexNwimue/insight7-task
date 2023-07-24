import { BASE_URL } from "./signupUtil";
const verifyUser = async () => {
  let response = await fetch(`${BASE_URL}/favourites`);
  response = await response.json();
  if (response.success) {
    return true;
  }
  return false;
};

export { verifyUser };
