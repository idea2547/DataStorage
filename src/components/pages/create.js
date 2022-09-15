import React, { 
  Component,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef, 
} from "react";
import Moralis from "moralis";
import { Loading, Modal } from 'web3uikit';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
  Center,
  Button,
  InputGroup,
  Input,
  Heading,
  Link,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import Sidebar from '../../components/sidebar';
import { Formik, Field, Form } from "formik";
import { ExternalLinkIcon } from "@chakra-ui/icons";
//import { Moralis } from "moralis";
import { useDropzone } from "react-dropzone";
import Clock from "../components/Clock";
import Footer from '../components/footer';
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { createGlobalStyle } from 'styled-components';
import { abi as charContractAbi } from "../../constants/abis/Character.json";
const { default: axios } = require("axios");

const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY; // <-- xAPIKey available here: https://deep-index.moralis.io/api-docs/#/storage/uploadFolder
const CHAR_CONTRACT = process.env.REACT_APP_CHAR_CONTRACT;

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;





let ipfsArray = []; // holds all IPFS data
let metadataList = []; // holds metadata for all NFTs (could be a session store of data)
let promiseArray = []; // array of promises so that only if finished, will next promise be initiated

const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function Uploader(_isAuthenticated) {
  const { authenticate, isAuthenticated, account, chainId, logout } = useMoralis();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMessage, setMessage] = useState(false);
  const [showErrorMessage, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [IPFSLinkImage, setIPFSLinkImage] = useState("");
  const [initialFormValues, setInitialFormValues] = useState({
    name: "",
/*     damage: "",
    power: "",
    endurance: "", */
  });

  const popUpLoading = 
                  <Modal
                    id="regular"
                    onCancel={function noRefCheck(){}}
                    onCloseButtonPressed={function noRefCheck(){}}
                    onOk={function noRefCheck(){}}
                    title="Confirm"
                  >
                    <div
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      
                      <p>
                        Proceed uploading?
                      </p>
                    </div>
                  </Modal>;
                  


  
  const onInputFileChange = (e) => {
    const acceptedFiles = e.target.value;
    console.log(acceptedFiles);
    
    
    setFiles(
      acceptedFiles
    );
  };

  const callContractF = async () => {
    const options = {
      abi: charContractAbi,
      contractAddress: CHAR_CONTRACT,
      functionName: "mintToken",
      params: {
        _mintAmount: 1,
        _tokenURI: '123',
      },
    };

    console.log("META DATA URL:", '123');

    

    await fetch({
      params: options,
      onSuccess: (response) => setInteractionData(response),
      onComplete: () => console.log("MINT COMPLETE"),
      onError: (error) => console.log("ERROR", error),
    });
  }

  const onFileUpdate = useCallback((acceptedFiles) => {
    //console.log(acceptedFiles);
    //console.log(getInputProps);
    //acceptedFiles

    
  }, []);
  /* var files = e.target.files;
    console.log(files);
    var filesArr = Array.prototype.slice.call(files);
    console.log(filesArr);
    document.getElementById("file_name").style.display = "none";
    this.setState({ files: [...this.state.files, ...filesArr] }); */
  /*
  let IPFSLinks = {
    image: "",
    metadata: "",
  };
  */

  const form = useRef();
  const maxSize = 1048576;
  let totalFiles = 0;

  // clean up file preview
  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  // authetication check; we don't want uploads if not logged-in
  useEffect(() => {
    if (!_isAuthenticated.isAuthenticated) resetAll(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_isAuthenticated]);

  // web3 interface
  const { fetch } = useWeb3ExecuteFunction();

  // track total circulation
  let _tokensAvailable = 0;

  // simple demo contract interaction
  const tokensAvailable = async () => {
    const options = {
      abi: charContractAbi,
      contractAddress: CHAR_CONTRACT,
      functionName: "getTokenCirculations",
    };

    await fetch({
      params: options,
      onSuccess: (response) => (_tokensAvailable = parseInt(response)),
      onComplete: () =>
        console.log("NEXT TOKEN:", parseInt(_tokensAvailable + 1)),
      onError: (error) => console.log("ERROR:", error),
    });
  };

  /* 
  // fetch Hastro token (NFT)
  async function fetchData(_id) {
    const options = {
      abi: charContractAbi,
      contractAddress: CHAR_CONTRACT,
      functionName: "getTokenDetails",
      params: {
        _id: _id,
      },
    };

    await fetch({
      params: options,
      onSuccess: (response) => console.log("TOKEN DATA:", response),
      onComplete: () => console.log("Fetched"),
      onError: (error) => console.log("Error", error),
    });
  }
  */

  /*
  const getURI = async (_id) => {
    const options = {
      abi: objContractAbi,
      contractAddress: objContractAddress,
      functionName: "uri",
      params: {
        _id: _id,
      },
    };

    await fetch({
      params: options,
      onSuccess: (response) => console.log("URI:", response),
      onComplete: () => console.log("URI Done"),
      onError: (error) => console.log("Error", error),
    });
  };
  */

  // after token mint
  const setInteractionData = async (_response) => {
    // confirm token was minted; that total circulation increased
    console.log("RESPONSE POST-MINT:", _response);
    resetAll(true);
  };

  const mintCharacter = async (_metaCID, _id, _formValues) => {
    // could be _mintAmount instead(?) i.e. 1 is just temp hardcoded
    let _url = "";
    let paddedHex = (
      "0000000000000000000000000000000000000000000000000000000000000000" + _id
    ).slice(-64);
    _url = `https://ipfs.moralis.io:2053/ipfs/${_metaCID}/metadata/${paddedHex}.json`;

    // set link for verifibility at end of upload -> mint process
    setIPFSLinkImage(_url);

    const options = {
      abi: charContractAbi,
      contractAddress: CHAR_CONTRACT,
      functionName: "mintToken",
      params: {
        _mintAmount: 1,
        _tokenURI: _url,
      },
    };

    console.log("META DATA URL:", _url);

    await fetch({
      params: options,
      onSuccess: (response) => setInteractionData(response),
      onComplete: () => console.log("MINT COMPLETE"),
      onError: (error) => console.log("ERROR", error),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM INPUT:");

    
    // stop interactions with buttons
    setLoading(true);
    // get how many tokens already circulate before minting next for ref
    await tokensAvailable();
    // trigger upload from files via useState
    console.log("TOKENS IN CIRCULATION:", _tokensAvailable);


  
    uploadIPFS(files, {
      name: "test",
    });
  };

  const ShowLocationMessage = (
    <section className='container'>

        <div className='row'>

        <div className="col-md-8">

        <ul className="activity-list">
          <li className="act_follow">
              <img className="lazy" src="./img/author/author-1.jpg" alt=""/>
                <div className="act_list_text">
                  <h4>IPFS upload and mint complete.</h4>
                  <Link href={IPFSLinkImage} isExternal>
                    Verify metadata here. <ExternalLinkIcon mx="2px" />
                  </Link>
                  <span className="act_list_date">
                             
                 </span>
              </div>
          </li>
        </ul>
        </div>
        </div>
      </section>
  );

  const messageMarkup = (
    <Box>
      <Alert status="success">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription display="block">
            IPFS upload and mint complete.
            <Box>
              <Link href={IPFSLinkImage} isExternal>
                Verify metadata here <ExternalLinkIcon mx="2px" />
              </Link>
            </Box>
          </AlertDescription>
        </Box>
        <CloseButton
          position="absolute"
          right="8px"
          top="8px"
          onClick={() => setMessage(false)}
        />
      </Alert>
    </Box>
  );
  const errorMarkup = (_error) => {
    return (
      <Box>
        <Alert status="error">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription display="block">{_error}.</AlertDescription>
          </Box>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setError(false)}
          />
        </Alert>
      </Box>
    );
  };

  // reset all
  // _status = should show message on reset?
  const resetAll = (_status) => {
    setFiles([]);
    setLoading(false);
    if (_status) {
      setMessage(true);
    }
    //a.resetForm(initialFormValues);

    ipfsArray = []; // holds all IPFS data
    metadataList = []; // holds metadata for all NFTs (could be a session store of data)
    promiseArray = []; // array of promises so that only if finished, will next promise be initiated
  };

  /*
  // upload ref to database
  const saveToDb = async (metaHash, imageHash, _editionSize) => {
    for (let i = 1; i < _editionSize + 1; i++) {
      let id = parseInt(_tokensAvailable + 1).toString(); //i.toString(); <-- TEMP
      let paddedHex = (
        "0000000000000000000000000000000000000000000000000000000000000000" + id
      ).slice(-64);
      let url = `https://ipfs.moralis.io:2053/ipfs/${metaHash}/metadata/${paddedHex}.json`;
      let options = { json: true };

      IPFSLinks.image = `https://ipfs.moralis.io:2053/ipfs/${imageHash}/metadata/${paddedHex}.png`;
      IPFSLinks.metadata = url;

      request(url, options, (error, res, body) => {
        if (error) {
          setLoading(false);
          setError(true);
          setErrorMessage(error);
          return console.log(error);
        }

        if (!error && res.statusCode === 200) {
          // save file reference to Moralis
          const FileDatabase = new Moralis.Object("Metadata");
          FileDatabase.set("id", body.id);
          FileDatabase.set("name", body.name);
          FileDatabase.set("image", body.image);
          FileDatabase.set("attributes", body.attributes);
          FileDatabase.set("meta_hash", metaHash);
          FileDatabase.set("image_hash", imageHash);
          FileDatabase.save();

          console.log(IPFSLinks.image);
          console.log(IPFSLinks.metadata);
          console.log("ALL DONE");
        }
      });
    }
  };
  */

  const onDrop = useCallback((acceptedFiles) => {
    //console.log(acceptedFiles);
    //console.log(getInputProps);
    //acceptedFiles

    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    disabled:
      _isAuthenticated.isAuthenticated && loading
        ? true
        : _isAuthenticated.isAuthenticated
        ? false
        : true,
    accept: "image/jpeg, image/png, image/pdf",
    minSize: 0,
    maxSize,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const isFileTooLarge =
    fileRejections?.length > 0 && fileRejections[0]?.size > maxSize;

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <img src={file.preview} alt={file.name} />
    </div>
  ));

  // once file is uploaded to IPFS we can use the CID to reference in the metadata
  const generateMetadata = (_id, _path, _values) => {
    let dateTime = Date.now();
    let tempMetadata = {
      //dna: dna.join(""),
      name: _values.name ? _values.name : `#${_id}`,
      image: _path,
      id: _id,
      date: dateTime,
      attributes: {
/*         damage: _values.damage ? _values.damage : 0,
        power: _values.power ? _values.power : 0,
        endurance: _values.endurance ? _values.endurance : 0, */
      },
    };
    return tempMetadata;
  };

  // upload metadata
  const uploadMetadata = async (
    apiUrl,
    xAPIKey,
    imageCID,
    _totalFiles,
    _formValues
  ) => {
    let fileDataArray = [];
    ipfsArray = []; // holds all IPFS data
    metadataList = []; // holds metadata for all NFTs (could be a session store of data)
    promiseArray = []; // array of promises so that only if finished, will next promise be initiated

    // iterate through total number of files uploaded
    for (let i = 1; i < _totalFiles + 1; i++) {
      let id = parseInt(_tokensAvailable + 1).toString(); //i.toString(); <-- TEMP
      let paddedHex = (
        "0000000000000000000000000000000000000000000000000000000000000000" + id
      ).slice(-64);

      // create filepath to reference image uploaded
      fileDataArray[i] = {
        filePath: `https://ipfs.moralis.io:2053/ipfs/${imageCID}/images/${paddedHex}.png`,
      };
      console.log("MEDIA FILE DATA:", fileDataArray[i].filePath);

      // assign input to metadata
      let nftMetadata = generateMetadata(
        id,
        fileDataArray[i].filePath,
        _formValues
      );
      metadataList.push(nftMetadata);

      let base64String = Buffer.from(JSON.stringify(metadataList)).toString(
        "base64"
      );

      // event.target.result contains base64 encoded image
      // reads output folder for json files and then adds to IPFS object array
      promiseArray.push(
        new Promise((res, rej) => {
          ipfsArray.push({
            path: `metadata/${paddedHex}.json`,
            content: base64String,
          });
          console.log("IPFS ARRAY:", ipfsArray);

          // once all promises back then save to IPFS and Moralis database
          Promise.all(promiseArray).then(() => {
            axios
              .post(apiUrl, ipfsArray, {
                headers: {
                  "X-API-Key": xAPIKey,
                  "content-type": "application/json",
                  accept: "application/json",
                },
              })
              .then((res) => {
                // successfully uploaded metadata to IPFS
                let metaCID = res.data[0].path.split("/")[4];
                console.log("META DATA FILE PATHS:", res.data);

                // step 3. transfer reference to metadata on-chain and to db (optional)
                // on-chain: interface with smart contract; mint uploaded asset as NFT
                mintCharacter(metaCID, id, _formValues); // <-- '+1' or 'amount' to be minted, currently minting one at a time
                // moralis db: save ref to IPFS metadata file
                //saveToDb(metaCID, imageCID, _totalFiles);
              })
              .catch((err) => {
                setLoading(false);
                setError(true);
                setErrorMessage(err);
                console.log(err);
              });
          });
        })
      );
    }
  };

  function uploadIPFS(_files, _formValues) {
    totalFiles = _files.length;

    // currently only single file upload
    for (let i = 1; i < totalFiles + 1; i++) {
      let id = parseInt(_tokensAvailable + 1).toString(); //i.toString(); <-- TEMP
      let paddedHex = (
        "0000000000000000000000000000000000000000000000000000000000000000" + id
      ).slice(-64);

      let reader = new FileReader();
      let base64String = "";
      reader.onload = function (event) {
        // event.target.result contains base64 encoded image
        base64String = event.target.result;
        // reads output folder for images and adds to IPFS object metadata array (within promise array)
        promiseArray.push(
          new Promise((res, rej) => {
            ipfsArray.push({
              path: `images/${paddedHex}.png`,
              content: base64String.toString("base64"),
            });
            console.log("IPFS ARRAY:", ipfsArray);
            // once all promises then upload IPFS object metadata array
            Promise.all(promiseArray).then(() => {
              axios
                .post(API_URL, ipfsArray, {
                  headers: {
                    "X-API-Key": API_KEY,
                    "content-type": "application/json",
                    accept: "application/json",
                  },
                })
                .then((res) => {
                  // successfully uploaded file to IPFS
                  console.log("MEDIA FILE PATHS:", res.data);
                  let imageCID = res.data[0].path.split("/")[4];
                  console.log("MEDIA CID:", imageCID);
                  // pass IPFS folder CID to compile metadata
                  uploadMetadata(
                    API_URL,
                    API_KEY,
                    imageCID,
                    totalFiles,
                    _formValues
                  );
                })
                .catch((err) => {
                  setLoading(false);
                  setError(true);
                  setErrorMessage(err);
                  console.log(err);
                });
            });
          })
        );
      };
      reader.readAsDataURL(_files[0]);
    }
  }

  return (
    
    
    /* <Box className="container text-center mt-5">
      <Heading className="h1" mb={2}>
        NFT Character Generator
      </Heading>
      <Formik
        initialValues={initialFormValues}
        validateOnMount={true}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          handleSubmit(values, { resetForm });
        }}
      >
        {(props) => (
          <Form ref={form}>
            <Box mb={2}>
              {showMessage && !files[0] ? messageMarkup : ""}
              {showErrorMessage ? errorMarkup(errorMessage) : ""}
            </Box>
            <Field name="name">
              {({ field, form }) => (
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    id="name"
                    className="first"
                    placeholder="Character Name"
                    mb={2}
                    borderRadius={1}
                    variant="outline"
                    borderColor="teal"
                    borderStyle="solid"
                    lineHeight={0.2}
                    isDisabled={files[0] ? false : true}
                    isRequired
                  />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="power">
              {({ field, form }) => (
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    type="number"
                    id="power"
                    placeholder="Power Level"
                    mb={2}
                    borderRadius={1}
                    variant="outline"
                    borderColor="teal"
                    borderStyle="solid"
                    lineHeight={0.2}
                    isDisabled={files[0] ? false : true}
                    isRequired
                  />
                  <FormErrorMessage>{form.errors.power}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="damage">
              {({ field, form }) => (
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    type="number"
                    id="damage"
                    placeholder="Damage Level"
                    mb={2}
                    borderRadius={1}
                    variant="outline"
                    borderColor="teal"
                    borderStyle="solid"
                    lineHeight={0.2}
                    isDisabled={files[0] ? false : true}
                    isRequired
                  />
                  <FormErrorMessage>{form.errors.damage}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="endurance">
              {({ field, form }) => (
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    type="number"
                    id="endurance"
                    placeholder="Endurance Level"
                    mb={2}
                    borderRadius={1}
                    variant="outline"
                    borderColor="teal"
                    borderStyle="solid"
                    lineHeight={0.2}
                    isDisabled={files[0] ? false : true}
                    isRequired
                  />
                  <FormErrorMessage>{form.errors.endurance}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Box {...getRootProps({ style })} mb={2}>
              <InputGroup size="md">
                <FormLabel htmlFor="name">Character Image</FormLabel>
                <Input {...getInputProps()} />
              </InputGroup>
              {!isDragActive && "Click here or drop a file to upload!"}
              {isDragActive && !isDragReject && "Drop it like it's hot!"}
              {isDragReject && "File type not accepted, sorry!"}
              {isFileTooLarge && (
                <Box className="text-danger mt-2">File is too large.</Box>
              )}
            </Box>
            <Center mb={2}>
              <aside>{thumbs}</aside>
            </Center>
            <Button
              id="files"
              colorScheme="teal"
              isFullWidth={true}
              isLoading={loading}
              isDisabled={files[0] ? false : true}
              data-file={files}
              type="submit"
              textAlign="center"
            >
              Upload
            </Button>
          </Form>
        )}
      </Formik>
    </Box> */
    <div>
      <Sidebar/>
      
    <GlobalStyles/>
    <div>{loading ? <Modal
  id="regular"
  isOkDisabled
  isCancelDisabled
  onCancel={function noRefCheck(){}}
  onCloseButtonPressed={function noRefCheck(){}}
  onOk={function noRefCheck(){}}
  okButtonColor="blue"
  title="Loading"
>
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}
  >
   
    <p>
      Uploading file , please wait.... Metamask will pop-up soon for minting NFTs.
    </p>
  </div>
    </Modal> : ""}</div>
    <div>
      {showMessage && !files[0] ? <Modal
  id="regular"
  onCancel={function noRefCheck(){}}
  onCloseButtonPressed={function noRefCheck(){}}
  onOk={function noRefCheck(){}}
  okButtonColor="blue"
  title="Successful Upload"
>
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}
  >
   
    <p>
      <h4>IPFS upload and mint complete.</h4>
      <Link href={IPFSLinkImage} isExternal>
                    Verify metadata here. <ExternalLinkIcon mx="2px" /> 
      </Link>
    </p>
  </div>
    </Modal> : ""}
    </div>
    
      

      <section className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${'./img/background/subheader.jpg'})`}}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row m-10-hor'>
              <div className='col-12'>
                <h1 className='text-center'>Create</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
                  
      <section className='container'>

      <div className="row">
        <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#" onSubmit={handleSubmit} >
                <Box mb={2}>
                  {showMessage && !files[0] ? ShowLocationMessage : ""}
                  {showErrorMessage ? errorMarkup(errorMessage) : ""}
                </Box>
        
                <div className="field-set">
                    <h5>Upload file</h5>
                    <Center mb={2}>
                      <aside>{thumbs}</aside>
                    </Center>
                    <Box {...getRootProps({ style })} mb={2}>
                      <InputGroup size="md">
                        <FormLabel htmlFor="name">Image</FormLabel>
                        <Input {...getInputProps()} />
                      </InputGroup>
                      {!isDragActive && "Click here or drop a file to upload!"}
                      {isDragActive && !isDragReject && "Drop it like it's hot!"}
                      {isDragReject && "File type not accepted, sorry!"}
                      {isFileTooLarge && (
                        <Box className="text-danger mt-2">File is too large.</Box>
                      )}
                    </Box>

                    {/* <div className="d-create-file">
                        <p id="file_name">PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p>
                        
                        
                        <div className='browse'>
                          <input type="button" id="get_file" className="btn-main" value="Browse"/>
                          <input id='upload_file' type="file" onChange={onInputFileChange}/>
                        </div>
                        
                    </div> */}

                    <div className="spacer-single"></div>

                    <h5>Title</h5>
                    <input type="text" name="item_title" id="item_title" className="form-control" placeholder="" />

                    <div className="spacer-10"></div>

                    <h5>Description</h5>
                    <textarea data-autoresize name="item_desc" id="item_desc" className="form-control" placeholder=""></textarea>

                    <div className="spacer-10"></div>

                    <h5>Author</h5>
                    <input type="text" name="item_price" id="item_price" className="form-control" placeholder="" />

                    <div className="spacer-10"></div>

                    <h5>Royalties</h5>
                    <input type="text" name="item_royalties" id="item_royalties" className="form-control" placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 70%" />

                    <div className="spacer-10"></div>
                    {/* <Button onClick={callContractF}/> */}
                    <input type="submit" id="files" isFullWidth={true} isLoading={loading} isDisabled={files[0] ? false : true} data-file={files} textAlign="center" className="btn-main" value="Upload"/>
                    {/* <Button
                      type="submit"
                      id="files"
                      colorScheme="teal"
                      isFullWidth={true}
                      isLoading={loading}
                      isDisabled={files[0] ? false : true}
                      data-file={files}
                            type="submit"
                      textAlign="center"
                    >
                            Upload
                    </Button>       
                     */}
              
              
              
              
                </div>
            </form>
        </div>

                                                 
    </div>

    </section>

      <Footer />
    </div>
  );
}


/* export default class Createpage extends Component {



constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = {
      files: [],
    };
  }

  onChange(e) {
    var files = e.target.files;
    console.log(files);
    var filesArr = Array.prototype.slice.call(files);
    console.log(filesArr);
    document.getElementById("file_name").style.display = "none";
    this.setState({ files: [...this.state.files, ...filesArr] });
  }


render() {
    return (
      <div>
      <GlobalStyles/>

        <section className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${'./img/background/subheader.jpg'})`}}>
          <div className='mainbreadcumb'>
            <div className='container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center'>Create</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='container'>

        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
              <form id="form-create-item" className="form-border" action="#">
                  <div className="field-set">
                      <h5>Upload file</h5>

                      <div className="d-create-file">
                          <p id="file_name">PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p>
                          {this.state.files.map(x => 
                          <p key="{index}">PNG, JPG, GIF, WEBP or MP4. Max 200mb.{x.name}</p>
                          )}
                          <div className='browse'>
                            <input type="button" id="get_file" className="btn-main" value="Browse"/>
                            <input id='upload_file' type="file" multiple onChange={this.onChange} />
                          </div>
                          
                      </div>

                      <div className="spacer-single"></div>

                      <h5>Title</h5>
                      <input type="text" name="item_title" id="item_title" className="form-control" placeholder="e.g. 'Crypto Funk" />

                      <div className="spacer-10"></div>

                      <h5>Description</h5>
                      <textarea data-autoresize name="item_desc" id="item_desc" className="form-control" placeholder="e.g. 'This is very limited item'"></textarea>

                      <div className="spacer-10"></div>

                      <h5>Price</h5>
                      <input type="text" name="item_price" id="item_price" className="form-control" placeholder="enter price for one item (ETH)" />

                      <div className="spacer-10"></div>

                      <h5>Royalties</h5>
                      <input type="text" name="item_royalties" id="item_royalties" className="form-control" placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 70%" />
 
                      <div className="spacer-10"></div>

                      <input type="button" id="submit" className="btn-main" value="Create Item"/>
                  </div>
              </form>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
                  <h5>Preview item</h5>
                  <div className="nft__item m-0">
                      <div className="de_countdown">
                        <Clock deadline="December, 30, 2021" />
                      </div>
                      <div className="author_list_pp">
                          <span>                                    
                              <img className="lazy" src="./img/author/author-1.jpg" alt=""/>
                              <i className="fa fa-check"></i>
                          </span>
                      </div>
                      <div className="nft__item_wrap">
                          <span>
                              <img src="./img/collections/coll-item-3.jpg" id="get_file_2" className="lazy nft__item_preview" alt=""/>
                          </span>
                      </div>
                      <div className="nft__item_info">
                          <span >
                              <h4>Pinky Ocean</h4>
                          </span>
                          <div className="nft__item_price">
                              0.08 ETH<span>1/20</span>
                          </div>
                          <div className="nft__item_action">
                              <span>Place a bid</span>
                          </div>
                          <div className="nft__item_like">
                              <i className="fa fa-heart"></i><span>50</span>
                          </div>                            
                      </div> 
                  </div>
              </div>                                         
      </div>

      </section>

        <Footer />
      </div>
   );
  }
} */