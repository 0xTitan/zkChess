import * as path from "path";
import fs from "fs"
// @ts-ignore
import { packedNBytesToString } from "@zk-email/helpers";
import { generateChessMoveVerifierCircuitInputsForWasm } from "./inputs";

const wasm_tester = require("circom_tester").wasm;
const externalInputs = {

}
// Either download the .eml file or click "show original" in your email client and copy the entire raw email (together with the headers)
const rawEmail = ``;

try {
    (async () => {
       
        let inputs = await generateChessMoveVerifierCircuitInputsForWasm();
        console.log(inputs);

        const cir = await wasm_tester(
            path.join(__dirname, "./circuit/zkchess.circom"),
            {
                include: path.join(__dirname, "./node_modules"),
                output: path.join(__dirname, "./build/test_github"),
                recompile: true,
                verbose: false,
            }
        );

        const witness = await cir.calculateWitness(
            inputs,
            true
        );
        console.log(witness);
        await cir.checkConstraints(witness);

        let currentIndex = 0;
        
        {
            const packedLength = 1500
            const packedValue = witness.slice(currentIndex, currentIndex + packedLength);
            const unpackedValue = packedNBytesToString(packedValue);
            console.log("username: ", unpackedValue);
            currentIndex += packedLength;
        }
        

        
    })()
} catch (e) {
    console.error("caught error: ", e);
}