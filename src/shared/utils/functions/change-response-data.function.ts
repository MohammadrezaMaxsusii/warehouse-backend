const primaryTypes = ["string", "number", "boolean", "undefined"];

export function responseDataModifier(data: any) {
  if (primaryTypes.includes(typeof data)) {
    return data;
  }

  if (Array.isArray(data)) {
    data = data.map((item) => responseDataModifier(item));
  } else {
    for (let key in data) {
      // FOR PRIMARY TYPES
      if (primaryTypes.includes(typeof data[key])) {
        if (key === "_id") {
          data = renameId(data);
        } else if (key === "password") {
          data = removePassword(data);
        }
      }
      // FOR ARRAY TYPES
      else if (Array.isArray(data[key])) {
        data[key] = responseDataModifier(data[key]);
      }
      // FOR OBJECT TYPES
      else if (typeof data[key] === "object") {
        data[key] = responseDataModifier(data[key]);
      }
    }
  }

  return data;
}

function renameId(data: any) {
  data.id = data._id;
  delete data._id;
  return data;
}
function removePassword(data: any) {
  delete data.password;
  return data;
}
