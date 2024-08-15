export async function getImageUrl({admin, file}: { admin: any, file: File }) {

  let imageUrl;
  //create a new file name
  const fileName = file.name + Date.now();

  const {url, parameters} = await stagedUploadStep({
      admin,
      file,
    fileName
    }
  );

  if (url === "") {
    console.error("File not uploaded: ");
    throw "File could not be uploaded";
  }
  const {fileCreateId} = await fileCreateStep({parameters, admin, url});
  console.log("fileCreateId : ", fileCreateId);
  let retry = 10;
  do {
    await new Promise((r) => setTimeout(r, 2000));
    console.log("Trying....", retry);

    let data = await admin.graphql(FILE_SEARCH_QUERY, {
      variables: {
        query: `id:'${fileCreateId.split("/").pop()}'`,
      }
    });
    data = await data.json();
    console.dir(data.data, {depth: null});
    let edges = data.data.files.edges;
    retry--;
    if (edges.length && edges[0].node.fileStatus === "READY") {
      imageUrl = edges[0].node.image.url;
      console.log("Image URL", imageUrl);
      break;
    }
  } while (retry);
  console.log("leaving getImageUrl", imageUrl);
  return {imageUrl};
}


async function stagedUploadStep({admin, file, fileName}: { admin: any, file: File, fileName: string }) {
  const arrayBuffer = await file.arrayBuffer();
  try {
    let data = await admin.graphql(STAGED_UPLOAD_QUERY, {
      variables: {
        input: [
          {
            filename: fileName,
            mimeType: file.type,
            httpMethod: "POST",
            fileSize: file.size.toString(),
            resource: "IMAGE",
          },
        ],
      }
    });
    data = await data.json();
    console.dir(data.data, {depth: null});
    let stagedTarget = data.data.stagedUploadsCreate.stagedTargets[0]
    const {url, parameters} = stagedTarget;
    console.log("Staged upload url", url);
    const formData = new FormData();
    parameters.forEach(({name, value}: { name: string, value: string }) => {
      formData.append(name, value);
    });

    const binary = new Uint8Array(arrayBuffer);
    const abc = new File([binary], fileName, {type: file.type});
    formData.append("file", abc);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.log(response);
      throw "File could not be uploaded. l2";
    }
    return {url, parameters};
  } catch (e) {
    console.error("Error while uploading file", e);
    return {url: "", parameter: ""};
  }
}

export async function fileCreateStep({parameters, admin, url}: {
  parameters: { name: string, value: string }[],
  admin: any,
  url: string
}) {
  const key = parameters.find((p) => p.name === "key");
  if (!key) {
    console.error("Key not found in parameters");
    throw "Key not found in parameters";
  }

  const fileCreateResponse = await admin.graphql(FILE_CREATE_QUERY, {
    variables: {
      files: {
        alt: "Image",
        contentType: "IMAGE",
        originalSource: `${url}/${key.value}`,
      },
    }
  });
  const fileCreateResponseData = await fileCreateResponse.json();
  console.dir(fileCreateResponseData.data, {depth: null});
  return {fileCreateId:  fileCreateResponseData.data.fileCreate.files[0].id};
}


const STAGED_UPLOAD_QUERY = `
  #graphql
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        parameters {
          name
          value
        }
      }
    }
  }` as const;

const FILE_CREATE_QUERY = `
  #graphql
  mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        alt
        createdAt
        id
      }
    }
  }
` as const;

const FILE_SEARCH_QUERY = `
  #graphql
  query getFiles($query: String!) {
    files(first: 1, query: $query) {
      edges {
        node {
          fileStatus
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
    }
  }` as const;
