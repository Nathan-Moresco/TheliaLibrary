import axios from "axios";

const API_URL = "/open_api/library/image";

// API
export async function getAllImages(params: Record<string, any>) {
  return axios.get(API_URL, {
    params: {
      ...params,
    },
  });
}
export function createImage(data: FormData) {
  return axios.post(API_URL, data, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
}
export function updateImage(id: number, data: FormData) {
  return axios.post(API_URL + "/" + id, data, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
}
export function deleteImage(id: number) {
  return axios.delete(API_URL + "/" + id);
}
export async function getImageById(id: number) {
  const response = await axios.get(API_URL, {
    params: {
      limit: 1,
      id,
    },
  });

  if (
    response.data &&
    Array.isArray(response.data) &&
    response.data.length === 1
  ) {
    response.data = response.data[0];
  }

  return response;
}

