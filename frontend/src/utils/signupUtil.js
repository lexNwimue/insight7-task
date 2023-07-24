export const validate = (name, password1, password2) => {
  if (name.match(/[0-9]/)) {
    //Check if name contains a number
    return { nameErr: "Name cannot contain numbers..." };
  } else if (password1 !== password2) {
    return { passwordErr: "Passwords do not match" };
  } else if (password1.length < 6 || password2.length < 6) {
    return { passwordErr: "Password must be at least six characters..." };
  }

  return { success: "Creating your account..." };
};

export const sendRequest = async (formData, endpoint, method) => {
  const response = await fetch(endpoint, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  return data;
};

export const addToFavourites = async (text) => {
  let response = await sendRequest({ text }, `${BASE_URL}/favourites`, "POST");
  return response;
};

export const viewFavourites = async () => {
  let response = await fetch(`${BASE_URL}/favourites`);
  response = await response.json();
  // if(response.failed)
  return response;
};

export const deleteWordFromFav = async (word) => {
  let response = await sendRequest(
    { word },
    `${BASE_URL}/favourites`,
    "DELETE"
  );
  return response;
};

export const logout = async () => {
  let response = await fetch(`${BASE_URL}/logout`);
  response = await response.json();
  console.log(response);
};

export const BASE_URL =
  "https://us-central1-insight7-96519.cloudfunctions.net/api";
