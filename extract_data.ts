interface HyleOutput {
    version: number;
    initial_state: number[];
    next_state: number[];
    identity: string;
    tx_hash: number[];
    index: number;
    payloads: number[];
    success: boolean;
}

function parseString(vector: number[]): string {
    let length = vector.length;
    let resp = "";
    for (var i = 0; i < length; i++) resp += String.fromCharCode(vector[i], 16);
    return resp;
}

function deserializePublicInputs<T>(publicInput : string[]): HyleOutput {
    const valueToExtract = parseInt(publicInput[publicInput.length - 1], 10);
    console.log("valueToExtract",valueToExtract);
    const extractedData = publicInput.slice(publicInput.length-valueToExtract-1);
    //version
    const version = parseInt(extractedData.shift() as string);
    console.log("version :", version);
    //initial_state
    const initial_state_size = parseInt(extractedData.shift() as string);
    console.log("initial_state_size :", initial_state_size);
    const initial_state: number[]=[];
    for (let i = 0; i < initial_state_size; i++) {
        initial_state.push(parseInt(extractedData.shift() as string));
    }
    console.log("initial_state :", initial_state);
    //next_state
    const next_state_size = parseInt(extractedData.shift() as string);
    console.log("next_state_size :", next_state_size);
    const next_state: number[]=[];
    for (let i = 0; i < next_state_size; i ++) {
        next_state.push(parseInt(extractedData.shift() as string));
    }
    console.log("next_state :", next_state);
    //idenity
    const identity_size = parseInt(extractedData.shift() as string);
    const identity_array : number[]=[];
    for (let i = 0; i < identity_size; i += 1) {
        identity_array.push(parseInt(extractedData.shift() as string));
    }
    const identity = parseString(identity_array);
    //tx_hash
    const tx_hash_size = parseInt(extractedData.shift()as string);
    const tx_hash : number[]=[];
    for (let i = 0; i < tx_hash_size; i += 1) {
        tx_hash.push(parseInt(extractedData.shift() as string));
    }
    //index
    const index = parseInt(extractedData.shift() as string);
    console.log("index :", index);
    //payloads
    const payloads_size = parseInt(extractedData.shift() as string);
    const payloads :number[]=[];
    for (let i = 0; i < payloads_size; i += 1) {
        payloads.push(parseInt(extractedData.shift() as string));
    }
    //success
    const success = parseInt(extractedData.shift() as string) === 1;
    console.log("success :", success);
    console.log("###########");
    // We don't parse the rest, which correspond to programOutputs
    return {
        version,
        initial_state,
        next_state,
        identity,
        tx_hash,
        index,
        payloads,
        success,
    };
}

const data =[
    "30",
    "1",
    "4",
    "0",
    "0",
    "0",
    "1",
    "4",
    "0",
    "0",
    "0",
    "30",
    "0",
    "1",
    "0",
    "0",
    "1",
    "48",
    "1",
    "18"
  ];
const hyleOutput = deserializePublicInputs(data);
console.log(hyleOutput);