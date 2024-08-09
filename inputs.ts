import { bytesToBigInt, fromHex } from "@zk-email/helpers";
import { generateEmailVerifierInputs } from "@zk-email/helpers";
import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim"
import fs from "fs"
import path from "path"
 
export const STRING_PRESELECTOR = "Next move from @";
export const MAX_HEADER_PADDED_BYTES = 1024;
export const MAX_BODY_PADDED_BYTES = 1536;
 
export async function generateChessMoveVerifierCircuitInputs() {
    const rawEmail = fs.readFileSync(
        path.join(__dirname, "./emls/mail-good.eml")      );
    const dkimResult = await verifyDKIMSignature(rawEmail);
    const emailVerifierInputs = await generateEmailVerifierInputs(rawEmail,{
        shaPrecomputeSelector: STRING_PRESELECTOR
    });
 
    const bodyRemaining = emailVerifierInputs.emailBody!.map(c => Number(c));
    const selectorBuffer = Buffer.from(STRING_PRESELECTOR);
    const moveIndex = Buffer.from(bodyRemaining).indexOf(selectorBuffer) + selectorBuffer.length;
    // console.log("bodyRemaining : ", bodyRemaining);
    // console.log("selectorBuffer : ", selectorBuffer);
    // console.log("moveIndex : ", moveIndex);
    // console.log("emailVerifierInputs : ", emailVerifierInputs);
 
    //const address = bytesToBigInt(fromHex("0x71C7656EC7ab88b098defB751B7401B5f6d897")).toString();
 
    const inputJson = {
        ...emailVerifierInputs,
        moveIndex: moveIndex.toString()
    };
    console.log("inputJson : ", inputJson);
    fs.writeFileSync("./input.json", JSON.stringify(inputJson))
}
 
(async () => {
    await generateChessMoveVerifierCircuitInputs();
}) ();
 