import { bytesToBigInt, fromHex } from "@zk-email/helpers";
import { generateEmailVerifierInputs } from "@zk-email/helpers";
import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim"
import fs from "fs"
import path from "path"
 
export const STRING_PRESELECTOR = "Next move from @";
export const MAX_HEADER_PADDED_BYTES = 1024;
export const MAX_BODY_PADDED_BYTES = 1536;
 
export async function generateTwitterVerifierCircuitInputs() {
    const rawEmail = fs.readFileSync(
        path.join(__dirname, "./emls/mail-bad.eml")      );
    const dkimResult = await verifyDKIMSignature(rawEmail);
    const emailVerifierInputs = generateEmailVerifierInputs(rawEmail,{
        shaPrecomputeSelector: STRING_PRESELECTOR
    });
 
    const bodyRemaining = (await emailVerifierInputs).emailBody!.map(c => Number(c));
    const selectorBuffer = Buffer.from(STRING_PRESELECTOR);
    const usernameIndex = Buffer.from(bodyRemaining).indexOf(selectorBuffer) + selectorBuffer.length;
 
    // const address = bytesToBigInt(fromHex("0x71C7656EC7ab88b098defB751B7401B5f6d897")).toString();
 
    // const inputJson = {
    //     ...emailVerifierInputs,
    //     twitter_username_idx: usernameIndex.toString(),
    //     address,
    // };
    // fs.writeFileSync("./input.json", JSON.stringify(inputJson))
}
 
(async () => {
    await generateTwitterVerifierCircuitInputs();
}) ();
 