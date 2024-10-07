
import fs from "fs"
import path from "path"
import { packedNBytesToString, toCircomBigIntBytes,bigIntToChunkedBytes,packBytesIntoNBytes,stringToBytes,bytesToBigInt, int64toBytes, } from "@zk-email/helpers";

function createDirectoryIfNotExists(directoryPath: string): void {
    const dirPath = path.join(__dirname, directoryPath);
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

const hyleOutput = {
    version: 1,
    initial_state_len: 4,
    initial_state: [0, 0, 0, 1],
    next_state_len: 4,
    //you can define here the next state you want , value will be decoded in hex in hyle, 60->3c
    next_state: [0, 0, 0, 60],
    identity_len: 0,
    identity: "",
    tx_hash_len: 43,
    tx_hash: [
        77, 68, 69, 121, 77, 122, 81, 49, 78, 106, 99, 52, 79, 87, 70, 105, 89, 50, 82, 108, 90, 106, 65, 120, 77, 106, 77, 48, 78, 84, 89, 51, 79, 68, 108, 104, 89, 109, 78, 107, 90, 87, 89
    ],
    payloads: [48],
    success: true
};

console.log('Generating proof... ⌛');
const proofJsonPath = './proof.json';
const inputJsonPath = './public.json';

// Reading proof.json
const proofData = fs.readFileSync(proofJsonPath, 'utf-8');
const proofJson = JSON.parse(proofData);

// Reading input.json
const inputData = fs.readFileSync(inputJsonPath, 'utf-8');
const inputJson = JSON.parse(inputData);

let packedDatas = int64toBytes("292741246868230508994216287414221376");

//const unpackedValue = bigIntToChunkedBytes(packedDatas,4,50);
const unpackedValue = stringToBytes("Next move from @zkchess is Ba8");

console.log("username: ", packedDatas);

// Merge JSON objects
// Create the final merged object

// const hyleJson = {
//     proof: proofJson,
//     publicInput: inputJson,
//     hyleOutput: hyleOutput
// }

// Write the merged content to a new JSON file
const outputJsonPath = './hyleOutput.json';
// fs.writeFileSync(outputJsonPath, JSON.stringify(hyleJson, null, 2), 'utf-8');

console.log('Merged JSON has been written to hyleOutput.json');



